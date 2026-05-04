export default function BillionsLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blue rounded-square background */}
      <rect width="60" height="60" rx="13" fill="#0046FF" />

      {/* Left goggle — white frame */}
      <rect x="5" y="19" width="22" height="27" rx="8" fill="white" />
      {/* Left goggle — dark lens */}
      <rect x="10" y="24" width="12" height="17" rx="5" fill="#0035CC" />

      {/* Right goggle — white frame */}
      <rect x="33" y="19" width="22" height="27" rx="8" fill="white" />
      {/* Right goggle — dark lens */}
      <rect x="38" y="24" width="12" height="17" rx="5" fill="#0035CC" />
    </svg>
  )
}
