import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import type { PresaleRound, Registration } from '@/types'

const DB_PATH = path.join(process.cwd(), 'data', 'presale.db')

let _db: Database.Database | null = null

function getDb(): Database.Database {
  if (_db) return _db

  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  _db = new Database(DB_PATH)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')

  migrate(_db)
  seed(_db)

  return _db
}

function migrate(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS presale_rounds (
      id                 INTEGER PRIMARY KEY AUTOINCREMENT,
      name               TEXT    NOT NULL,
      token_price_usd    REAL    NOT NULL,
      total_tokens       INTEGER NOT NULL,
      tokens_sold        INTEGER NOT NULL DEFAULT 0,
      min_investment_usd REAL    NOT NULL DEFAULT 50,
      max_investment_usd REAL    NOT NULL DEFAULT 100000,
      status             TEXT    NOT NULL DEFAULT 'upcoming'
                                 CHECK(status IN ('upcoming','active','closed')),
      start_date         TEXT,
      end_date           TEXT,
      created_at         TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      email            TEXT NOT NULL,
      wallet_address   TEXT,
      round_id         INTEGER NOT NULL REFERENCES presale_rounds(id),
      payment_currency TEXT NOT NULL,
      payment_amount   REAL NOT NULL,
      token_amount     REAL NOT NULL,
      usd_value        REAL NOT NULL,
      created_at       TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_reg_email    ON registrations(email);
    CREATE INDEX IF NOT EXISTS idx_reg_round_id ON registrations(round_id);

    CREATE TABLE IF NOT EXISTS price_cache (
      symbol     TEXT PRIMARY KEY,
      price_usd  REAL NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)
}

function seed(db: Database.Database): void {
  const count = (db.prepare('SELECT COUNT(*) as c FROM presale_rounds').get() as { c: number }).c
  if (count > 0) return

  const now = new Date()
  const future = (days: number) => new Date(now.getTime() + days * 86_400_000).toISOString()

  const insert = db.prepare(`
    INSERT INTO presale_rounds (name, token_price_usd, total_tokens, tokens_sold,
      min_investment_usd, max_investment_usd, status, start_date, end_date)
    VALUES (@name, @token_price_usd, @total_tokens, @tokens_sold,
      @min_investment_usd, @max_investment_usd, @status, @start_date, @end_date)
  `)

  db.transaction(() => {
    insert.run({
      name: 'Seed Round',
      token_price_usd: 0.0001,
      total_tokens: 50_000_000,
      tokens_sold: 50_000_000,
      min_investment_usd: 5000,
      max_investment_usd: 500_000,
      status: 'closed',
      start_date: new Date(now.getTime() - 60 * 86_400_000).toISOString(),
      end_date: new Date(now.getTime() - 30 * 86_400_000).toISOString(),
    })
    insert.run({
      name: 'Private Sale',
      token_price_usd: 0.0002,
      total_tokens: 100_000_000,
      tokens_sold: 100_000_000,
      min_investment_usd: 1000,
      max_investment_usd: 100_000,
      status: 'closed',
      start_date: new Date(now.getTime() - 30 * 86_400_000).toISOString(),
      end_date: new Date(now.getTime() - 7 * 86_400_000).toISOString(),
    })
    insert.run({
      name: 'Pre-Sale Round 1',
      token_price_usd: 0.0004,
      total_tokens: 150_000_000,
      tokens_sold: 87_500_000,
      min_investment_usd: 100,
      max_investment_usd: 50_000,
      status: 'active',
      start_date: new Date(now.getTime() - 7 * 86_400_000).toISOString(),
      end_date: future(14),
    })
    insert.run({
      name: 'Pre-Sale Round 2',
      token_price_usd: 0.0007,
      total_tokens: 100_000_000,
      tokens_sold: 0,
      min_investment_usd: 50,
      max_investment_usd: 25_000,
      status: 'upcoming',
      start_date: future(15),
      end_date: future(30),
    })
    insert.run({
      name: 'Public Sale',
      token_price_usd: 0.001,
      total_tokens: 200_000_000,
      tokens_sold: 0,
      min_investment_usd: 10,
      max_investment_usd: 10_000,
      status: 'upcoming',
      start_date: future(31),
      end_date: future(60),
    })
  })()

  // Seed initial prices
  const upsertPrice = db.prepare(`
    INSERT OR REPLACE INTO price_cache (symbol, price_usd, updated_at)
    VALUES (@symbol, @price_usd, datetime('now'))
  `)
  db.transaction(() => {
    upsertPrice.run({ symbol: 'eth', price_usd: 3500 })
    upsertPrice.run({ symbol: 'bnb', price_usd: 580 })
    upsertPrice.run({ symbol: 'btc', price_usd: 65000 })
    upsertPrice.run({ symbol: 'usdt', price_usd: 1 })
    upsertPrice.run({ symbol: 'usdc', price_usd: 1 })
  })()
}

// ─── Round queries ────────────────────────────────────────────────────────────

export function getRounds(): PresaleRound[] {
  return getDb()
    .prepare('SELECT * FROM presale_rounds ORDER BY id')
    .all() as PresaleRound[]
}

export function getRoundById(id: number): PresaleRound | null {
  return (
    getDb()
      .prepare('SELECT * FROM presale_rounds WHERE id = ?')
      .get(id) as PresaleRound | undefined
  ) ?? null
}

export function getActiveRound(): PresaleRound | null {
  return (
    getDb()
      .prepare("SELECT * FROM presale_rounds WHERE status = 'active' LIMIT 1")
      .get() as PresaleRound | undefined
  ) ?? null
}

export function updateRound(
  id: number,
  data: Partial<Pick<PresaleRound, 'status' | 'tokens_sold' | 'token_price_usd'>>
): void {
  const sets = Object.keys(data).map(k => `${k} = @${k}`).join(', ')
  getDb()
    .prepare(`UPDATE presale_rounds SET ${sets} WHERE id = @id`)
    .run({ ...data, id })
}

// ─── Registration queries ─────────────────────────────────────────────────────

export function createRegistration(
  data: Omit<Registration, 'id' | 'created_at'>
): Registration {
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO registrations
      (email, wallet_address, round_id, payment_currency, payment_amount, token_amount, usd_value)
    VALUES
      (@email, @wallet_address, @round_id, @payment_currency, @payment_amount, @token_amount, @usd_value)
  `)
  const result = stmt.run(data)
  return db
    .prepare('SELECT * FROM registrations WHERE id = ?')
    .get(result.lastInsertRowid) as Registration
}

export function getRegistrations(limit = 100): Registration[] {
  return getDb()
    .prepare('SELECT * FROM registrations ORDER BY created_at DESC LIMIT ?')
    .all(limit) as Registration[]
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function getStats() {
  const db = getDb()
  const totals = db
    .prepare('SELECT COALESCE(SUM(usd_value),0) as raised, COUNT(*) as participants FROM registrations')
    .get() as { raised: number; participants: number }
  const tokensSold = db
    .prepare('SELECT COALESCE(SUM(tokens_sold),0) as total FROM presale_rounds')
    .get() as { total: number }
  const activeRound = getActiveRound()
  return {
    total_raised_usd: totals.raised,
    total_participants: totals.participants,
    total_tokens_sold: tokensSold.total,
    active_round: activeRound,
  }
}

// ─── Price cache ──────────────────────────────────────────────────────────────

export function getCachedPrices(): Record<string, { price_usd: number; updated_at: string }> {
  const rows = getDb()
    .prepare('SELECT symbol, price_usd, updated_at FROM price_cache')
    .all() as Array<{ symbol: string; price_usd: number; updated_at: string }>
  return Object.fromEntries(rows.map(r => [r.symbol, { price_usd: r.price_usd, updated_at: r.updated_at }]))
}

export function upsertPrice(symbol: string, price_usd: number): void {
  getDb()
    .prepare(`INSERT OR REPLACE INTO price_cache (symbol, price_usd, updated_at)
               VALUES (@symbol, @price_usd, datetime('now'))`)
    .run({ symbol, price_usd })
}
