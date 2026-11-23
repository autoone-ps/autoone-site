import { useEffect, useRef, useState } from 'react'
import { Bubble, Mascot, type MascotPose } from './Mascot'
import { Reveal, SectionHead } from './Reveal'
import { useLang } from '../lib/i18n'

const POSES: MascotPose[] = ['wave', 'think', 'point', 'main', 'celebrate']

export function HowWeWork() {
  const { t, dir } = useLang()
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])
  const hoverUntil = useRef(0)
  const steps = t.how.steps

  // Exactly one step is active: the one whose centre is closest to the middle of the viewport.
  // (A single scroll handler avoids several steps fighting over the active state.)
  useEffect(() => {
    let raf = 0
    const calc = () => {
      raf = 0
      if (Date.now() < hoverUntil.current) return // the visitor is pointing at a step: let that win over scrolling
      const mid = window.innerHeight * 0.45
      let best = 0
      let bestDist = Infinity
      refs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - mid)
        if (d < bestDist) { bestDist = d; best = i }
      })
      setActive((a) => (a === best ? a : best))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(calc) }
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    on()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])

  // pointing at (or focusing) a step number switches the guide to that step
  const choose = (i: number) => { hoverUntil.current = Date.now() + 1800; setActive(i) }

  return (
    <section id="how" className="band relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -start-40 top-20 h-[420px] w-[420px] rounded-full bg-electric/15 blur-[120px]" />
      <div className="container-x relative">
        <SectionHead eyebrow={t.how.eyebrow} title={t.how.title} sub={t.how.sub} />

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-20">
          {/* the guide follows the active step */}
          <div className="order-first lg:relative lg:order-last">
            <div className="sticky top-24 flex flex-col items-center gap-3 rounded-3xl border border-mist/10 bg-midnight/60 p-6 lg:items-start">
              <Bubble live className="w-full" tail="bottom">
                <span className="block">{steps[active].g}</span>
              </Bubble>
              <Mascot pose={POSES[active]} flip={dir === 'ltr'} className="h-48 self-center sm:h-56" alt="" />
            </div>
          </div>

          <Reveal>
            <div className="relative">
              <span aria-hidden="true" className="absolute start-6 top-6 h-[calc(100%-3rem)] w-px bg-mist/15 sm:start-7" />
              <ol className="relative flex flex-col gap-14">
                {steps.map((s, i) => {
                  const on = active === i
                  return (
                    <li key={s.t} ref={(el) => { refs.current[i] = el }} className="relative cursor-pointer ps-16 sm:ps-20" onMouseEnter={() => choose(i)} onFocus={() => choose(i)}>
                      <span aria-hidden="true" className={`absolute start-0 top-0 flex h-12 w-12 items-center justify-center rounded-2xl border text-base font-medium transition duration-500 sm:h-14 sm:w-14 sm:text-lg ${on ? 'scale-110 border-electric bg-electric text-white shadow-glow' : 'border-mist/20 bg-midnight text-mist/60'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <button type="button" onClick={() => choose(i)} className="block w-full text-start" aria-current={on ? 'step' : undefined}>
                        <h3 className={`text-2xl font-semibold tracking-tight transition-colors duration-500 sm:text-3xl ${on ? 'text-ice' : 'text-mist/55'}`}>{s.t}</h3>
                        <p className={`mt-2 max-w-md text-[16px] leading-relaxed transition-colors duration-500 ${on ? 'text-mist/80' : 'text-mist/40'}`}>{s.d}</p>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
