import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { Bubble, Mascot, type MascotPose } from './Mascot'
import { ParticleField } from './ParticleField'

export function Hero() {
  const { t, dir } = useLang()
  const reduce = useReducedMotion()
  const [pose, setPose] = useState<MascotPose>('wave')
  const flip = dir === 'ltr' // the character's hand points right; mirror it so it aims at the text in LTR
  const item = (i: number) => reduce ? {} : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const } }

  return (
    <section id="home" className="relative overflow-hidden bg-midnight pt-[72px]">
      {/* ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 end-[-10%] h-[620px] w-[620px] rounded-full bg-electric/30 blur-[140px]" />
        <div className="absolute bottom-[-30%] start-[-10%] h-[460px] w-[460px] rounded-full bg-navy blur-[120px]" />
      </div>
      <ParticleField className="opacity-70" />

      <div className="container-x relative grid items-center gap-6 pb-20 pt-10 lg:min-h-[calc(100svh-72px)] lg:grid-cols-[1.15fr_.85fr] lg:gap-10 lg:pb-24">
        <div>
          <motion.p {...item(0)} className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/10 px-4 py-1.5 text-sm text-mist">
            <span className="h-1.5 w-1.5 rounded-full bg-electric" aria-hidden="true" /> {t.hero.badge}
          </motion.p>
          <motion.h1 {...item(1)} className="mt-6 text-[2.9rem] font-semibold leading-[1.02] tracking-tight text-ice sm:text-7xl lg:text-[5.4rem] rtl:leading-[1.2] rtl:tracking-normal">
            {t.hero.l1}<br /><span className="text-electric">{t.hero.l2}</span>
          </motion.h1>
          <motion.p {...item(2)} className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-mist/75 sm:text-xl">{t.hero.sub}</motion.p>
          <motion.div {...item(3)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#services" className="btn btn-primary" onMouseEnter={() => setPose('wave')} onMouseLeave={() => setPose('wave')} onFocus={() => setPose('wave')} onBlur={() => setPose('wave')}>
              {t.hero.cta1} <ArrowRight size={18} className="rtl:-scale-x-100" aria-hidden="true" />
            </a>
            <a href="#contact" className="btn btn-ghost" onMouseEnter={() => setPose('wave')} onMouseLeave={() => setPose('wave')} onFocus={() => setPose('wave')} onBlur={() => setPose('wave')}>
              {t.hero.cta2}
            </a>
          </motion.div>
          <motion.ul {...item(4)} className="mt-10 flex flex-wrap gap-2" aria-label="Services">
            {t.hero.chips.map((c) => <li key={c} className="rounded-full border border-mist/15 px-3.5 py-1.5 text-sm text-mist/70">{c}</li>)}
          </motion.ul>
        </div>

        <motion.div {...item(2)} className="relative flex flex-col items-center justify-center lg:items-end rtl:lg:items-start">
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/25 blur-[90px] sm:h-[420px] sm:w-[420px]" />
          <div className="relative flex w-full max-w-[460px] flex-col items-center">
            <Bubble className="relative z-10 mb-4 max-w-[300px] self-center text-center" live>{t.hero.bubble}</Bubble>
            <Mascot pose={pose} flip={flip} className="h-[320px] sm:h-[420px] lg:h-[500px]" alt="Autoone star mascot" />
            <div aria-hidden="true" className="mt-1 h-3 w-40 rounded-full bg-black/50 blur-md" />
          </div>
        </motion.div>
      </div>

      <a href="#services" aria-label={t.hero.cta1} className="absolute bottom-5 start-1/2 hidden -translate-x-1/2 text-mist/40 transition hover:text-mist lg:block rtl:translate-x-1/2">
        <ChevronDown size={26} className={reduce ? '' : 'animate-bounce'} />
      </a>
    </section>
  )
}
