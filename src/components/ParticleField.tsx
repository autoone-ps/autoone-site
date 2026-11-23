import { useEffect, useRef } from 'react'

/** Drifting blue nodes joined by faint lines: an abstract automation network. Paused off-screen and with reduced motion. */
export function ParticleField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0, visible = true
    type P = { x: number; y: number; vx: number; vy: number; r: number }
    let pts: P[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.min(w < 700 ? 22 : 54, Math.round((w * h) / 22000))
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22, r: 1 + Math.random() * 1.6,
      }))
      draw()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const max = w < 700 ? 90 : 130
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < max) {
            ctx.strokeStyle = `rgba(11,95,255,${(1 - d / max) * 0.28})`
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = 'rgba(120,170,255,0.75)'
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
      }
    }

    const tick = () => {
      if (visible && !document.hidden) {
        for (const p of pts) {
          p.x += p.vx; p.y += p.vy
          if (p.x < 0 || p.x > w) p.vx *= -1
          if (p.y < 0 || p.y > h) p.vy *= -1
        }
        draw()
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(canvas)
    if (!reduce) raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); io.disconnect() }
  }, [])

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />
}
