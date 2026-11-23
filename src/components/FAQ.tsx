import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { Bubble, Mascot, type MascotPose } from './Mascot'
import { Reveal, SectionHead } from './Reveal'

// one full-body pose per question, so the guide visibly reacts as the visitor opens different answers
const POSES: MascotPose[] = ['wave', 'think', 'point', 'main', 'celebrate', 'think', 'point', 'wave']

export function FAQ() {
  const { t, dir } = useLang()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<number | null>(0)
  const hintIndex = open ?? 0

  return (
    <section id="faq" className="bg-midnight py-24 sm:py-32">
      <div className="container-x">
        <SectionHead eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
          {/* the guide sits on the opposite side of the answers and points toward them */}
          <div className="order-first lg:relative lg:order-last">
            <div className="flex flex-col items-center gap-3 lg:sticky lg:top-28">
              <Bubble live tail="bottom" className="w-full max-w-[260px] text-center">
                <motion.span key={hintIndex} className="block" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>{t.faq.hints[hintIndex]}</motion.span>
              </Bubble>
              <div className="relative flex justify-center">
                <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/25 blur-[70px]" />
                <Mascot pose={POSES[open ?? 0]} flip={dir === 'ltr'} className="h-56 sm:h-64 lg:h-80" />
              </div>
              <div aria-hidden="true" className="-mt-2 h-3 w-36 rounded-full bg-black/50 blur-md" />
            </div>
          </div>

          <Reveal>
            <ul className="divide-y divide-mist/10 border-y border-mist/10">
              {t.faq.items.map((it, i) => {
                const isOpen = open === i
                return (
                  <li key={it.q}>
                    <h3>
                      <button type="button" id={`faq-q-${i}`} aria-expanded={isOpen} aria-controls={`faq-a-${i}`} onClick={() => setOpen(isOpen ? null : i)}
                        className="flex min-h-[64px] w-full items-center justify-between gap-6 py-5 text-start text-lg font-medium text-ice transition hover:text-white sm:text-xl">
                        <span>{it.q}</span>
                        <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition duration-300 ${isOpen ? 'rotate-45 border-electric bg-electric text-white' : 'border-mist/25 text-mist/70'}`}>
                          <Plus size={18} />
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reduce ? undefined : { height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                          <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-mist/70">{it.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
