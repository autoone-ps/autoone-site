import { createElement, useRef, type HTMLAttributes, type PointerEvent, type ReactNode } from 'react'

interface Props extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'article'
  children: ReactNode
}

/**
 * A card with a soft, glassy glow that follows the mouse while it is over the card.
 * The glow lives in a clipped layer behind the content, so nothing inside the card is cut off.
 * It only reacts to a real mouse (not touch) and the position is written straight to CSS variables (no re-renders).
 */
export function SpotlightCard({ as = 'div', className = '', children, onPointerMove, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null)

  const move = (e: PointerEvent<HTMLElement>) => {
    onPointerMove?.(e)
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--sx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--sy', `${e.clientY - r.top}px`)
  }

  const pos = { left: 'var(--sx, 50%)', top: 'var(--sy, 50%)' }
  const follow = 'absolute -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-[left,top,opacity] duration-200 ease-out group-hover/spot:opacity-100 motion-reduce:transition-none'

  return createElement(
    as,
    { ref, onPointerMove: move, className: `group/spot relative isolate ${className}`, ...rest },
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
      <span className={`${follow} h-48 w-48 bg-electric/45 blur-3xl`} style={pos} />
      <span className={`${follow} h-20 w-20 bg-white/20 blur-xl`} style={pos} />
    </span>,
    children,
  )
}
