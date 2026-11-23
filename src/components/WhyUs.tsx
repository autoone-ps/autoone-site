import { BrainCircuit, Clock, Gauge, Link2, Repeat, SmilePlus, TrendingUp, Zap, type LucideIcon } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { Bubble, Mascot } from './Mascot'
import { Reveal, SectionHead } from './Reveal'
import { SpotlightCard } from './SpotlightCard'

const ICONS: LucideIcon[] = [Clock, Gauge, SmilePlus, Repeat, Zap, Link2, TrendingUp, BrainCircuit]

export function WhyUs() {
  const { t } = useLang()
  return (
    <section id="why" className="relative bg-midnight py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead eyebrow={t.why.eyebrow} title={t.why.title} sub={t.why.sub} />
          <Reveal className="flex items-end gap-3 self-start lg:self-auto">
            <Mascot pose="celebrate" className="h-40 sm:h-48" alt="" />
            <Bubble tail="start" className="mb-16 max-w-[170px]">{t.why.bubble}</Bubble>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.why.items.map((it, i) => {
            const Icon = ICONS[i]
            return (
              <li key={it.t}>
                <Reveal delay={(i % 4) * 0.07} className="h-full">
                  <SpotlightCard className="group h-full rounded-3xl border border-mist/10 bg-navy/40 p-7 transition duration-300 hover:border-electric/60 hover:bg-navy">
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-electric/40 text-electric transition duration-300 group-hover:bg-electric group-hover:text-white">
                      <Icon size={24} aria-hidden="true" />
                    </span>
                    <h3 className="relative mt-6 text-xl font-semibold tracking-tight text-ice">{it.t}</h3>
                    <p className="relative mt-2 text-[15px] leading-relaxed text-mist/65">{it.d}</p>
                  </SpotlightCard>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
