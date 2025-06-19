// /components/Confetti.tsx
export default function Confetti() {
  return (
    <svg
      className="absolute left-0 top-0 w-full h-full pointer-events-none z-0"
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <circle cx="12%" cy="24%" r="8" fill="#fbb1bd" fillOpacity="0.55" />
      <circle cx="90%" cy="18%" r="6" fill="#b9f6ca" fillOpacity="0.5" />
      <circle cx="27%" cy="85%" r="7" fill="#e3e0ff" fillOpacity="0.48" />
      <circle cx="70%" cy="60%" r="10" fill="#fff1b6" fillOpacity="0.6" />
      <circle cx="65%" cy="35%" r="5" fill="#5a3825" fillOpacity="0.16" />
    </svg>
  );
}
