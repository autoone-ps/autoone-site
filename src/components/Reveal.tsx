import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/** Fades and lifts its children into view once, as they scroll in. */
export function Reveal({ children, delay = 0, className = '', y = 24 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHead({ eyebrow, title, sub, className = '' }: { eyebrow: string; title: string; sub?: string; className?: string }) {
  return (
    <Reveal className={`max-w-2xl ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="h2 mt-3 text-balance">{title}</h2>
      {sub && <p className="lead mt-5">{sub}</p>}
    </Reveal>
  )
}
