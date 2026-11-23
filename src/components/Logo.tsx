const STAR = 'M0 -52 Q8 -8 52 0 Q8 8 0 52 Q-8 8 -52 0 Q-8 -8 0 -52Z'
const POS: [number, number][] = [[0, -141], [-60, -60], [60, -60], [141, 0], [60, 60], [0, 141], [-60, 60], [-141, 0]]

/** The Autoone star-lattice symbol. */
export function LogoMark({ className = 'h-8 w-8', color = '#0B5FFF' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="-200 -200 400 400" className={className} fill={color} aria-hidden="true">
      {POS.map(([x, y]) => <path key={`${x}${y}`} d={STAR} transform={`translate(${x} ${y})`} />)}
    </svg>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span dir="ltr" className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="text-[26px] font-normal leading-none tracking-tight text-ice">
        Autoone
      </span>
    </span>
  )
}
