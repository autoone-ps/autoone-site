import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import meta from '../data/mascot-meta.json'

/**
 * The Autoone star character.
 * Images are the ORIGINAL character renders (src/assets/mascot). The character is never redrawn:
 * motion (float, blink via an eyelid in the fur colour, hover reaction, pose changes) is layered on top.
 */
const urls = import.meta.glob('../assets/mascot/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const src = (name: string) => urls[`../assets/mascot/${name}.webp`]

/**
 * Pre-scaled sizes: every image ships in a few sizes made with a high-quality resampler. We pick the smallest one that still
 * covers the rendered size at the screen's pixel density, so the browser never squeezes a big image down by a large factor
 * on the fly (that is what makes big source images look soft). Before the size is measured we use the middle size.
 */
function pick(name: string, m: { w: number; h: number }, cssWidth: number): string {
  const tiers = name.startsWith('f-') ? [['s', 160], ['m', 320]] : [['s', 320], ['m', 640]]
  const list: { u: string; w: number }[] = []
  for (const [suffix, h] of tiers as [string, number][]) {
    const u = urls[`../assets/mascot/${name}-${suffix}.webp`]
    if (u) list.push({ u, w: Math.round((m.w * h) / m.h) })
  }
  list.push({ u: src(name), w: m.w })
  if (!cssWidth) return (list[1] ?? list[0]).u
  const need = cssWidth * (typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2.5) : 1)
  return (list.find((c) => c.w >= need * 0.92) ?? list[list.length - 1]).u
}

/** Rendered width in CSS px, used for the `sizes` attribute. */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [w, setW] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

export type MascotPose = 'main' | 'wave' | 'point' | 'think' | 'celebrate'
export type FaceName = 'normal' | 'happy' | 'excited' | 'surprised' | 'wink' | 'think' | 'talk'

interface Eye { x: number; y: number; w: number; h: number; c: string }
interface Meta { w: number; h: number; eyes: Eye[] }
const M = meta as unknown as Record<string, Meta>

interface MascotProps {
  pose: MascotPose
  /** Size via a height class, e.g. "h-72". Width follows the image ratio. */
  className?: string
  /** Mirror horizontally (used so a pointing hand aims at the content in LTR layouts). */
  flip?: boolean
  float?: boolean
  blink?: boolean
  alt?: string
}

export function Mascot({ pose, className = 'h-72', flip = false, float = true, blink = true, alt = '' }: MascotProps) {
  const reduce = useReducedMotion()
  const m = M[pose]
  const [boxRef, boxW] = useWidth<HTMLDivElement>()
  const timing = useMemo(() => ({ duration: 4.6 + Math.random() * 2.4, delay: Math.random() * 2 }), [pose])
  const animate = !reduce

  return (
    <motion.div
      ref={boxRef}
      className={`relative inline-block ${className}`}
      style={{ aspectRatio: `${m.w} / ${m.h}` }}
      animate={animate && float ? { y: [0, -9, 0] } : undefined}
      transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={animate ? { rotate: flip ? 3 : -3, scale: 1.04 } : undefined}
      whileTap={animate ? { scaleY: 0.96, scaleX: 1.03 } : undefined}
    >
      {/* mirroring lives on a plain wrapper so it never fights framer-motion's own transforms */}
      <div className="absolute inset-0" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pose}
          className="absolute inset-0"
          initial={animate ? { opacity: 0, scale: 0.94 } : false}
          animate={{ opacity: 1, scale: 1 }}
          exit={animate ? { opacity: 0, scale: 0.96 } : undefined}
          transition={{ duration: 0.22 }}
        >
          <img src={pick(pose, m, boxW)} alt={alt} width={m.w} height={m.h} decoding="async" draggable={false} className="h-full w-full select-none object-contain" />
          {animate && blink && m.eyes.map((e, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="absolute block"
              style={{ left: `${e.x - 1.4}%`, top: `${e.y - 1.8}%`, width: `${e.w + 2.8}%`, height: `${e.h + 3.6}%`, background: e.c, borderRadius: '50%', transformOrigin: 'top' }}
              animate={{ scaleY: [0, 0, 1, 0, 0] }}
              transition={{ duration: timing.duration, delay: timing.delay, times: [0, 0.9, 0.93, 0.97, 1], repeat: Infinity }}
            />
          ))}
        </motion.div>
      </AnimatePresence>
      </div>
    </motion.div>
  )
}

/** Small expression portraits for hints, empty states and the guide dock. */
export function Face({ name, className = 'h-14', alt = '' }: { name: FaceName; className?: string; alt?: string }) {
  const reduce = useReducedMotion()
  const key = `f-${name}`
  const m = M[key]
  const [boxRef, boxW] = useWidth<HTMLSpanElement>()
  return (
    <span ref={boxRef} className={`relative inline-block ${className}`} style={{ aspectRatio: `${m.w} / ${m.h}` }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={key}
          src={pick(key, m, boxW)}
          alt={alt}
          width={m.w}
          height={m.h}
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-contain"
          initial={reduce ? false : { opacity: 0, scale: 0.85, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        />
      </AnimatePresence>
    </span>
  )
}

/** Speech bubble. `tail` says where the pointer sits. */
export function Bubble({ children, tail = 'bottom', className = '', live = false }: { children: ReactNode; tail?: 'bottom' | 'start' | 'end' | 'none'; className?: string; live?: boolean }) {
  const tailCls =
    tail === 'bottom' ? '-bottom-1.5 start-10'
    : tail === 'start' ? 'top-5 -start-1.5'
    : tail === 'end' ? 'top-5 -end-1.5' : 'hidden'
  return (
    <div
      className={`relative rounded-2xl bg-ice px-4 py-3 text-[15px] font-normal leading-snug text-midnight shadow-xl shadow-black/30 ${className}`}
      role={live ? 'status' : undefined}
      aria-live={live ? 'polite' : undefined}
    >
      {children}
      <span aria-hidden="true" className={`absolute h-3 w-3 rotate-45 rounded-[3px] bg-ice ${tailCls}`} />
    </div>
  )
}
