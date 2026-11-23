import { Briefcase, Building2, Clapperboard, GraduationCap, Share2, ShoppingBag, Stethoscope, Store, UtensilsCrossed, Wrench, type LucideIcon } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { Reveal, SectionHead } from './Reveal'
import { SpotlightCard } from './SpotlightCard'

const ICONS: LucideIcon[] = [Stethoscope, UtensilsCrossed, ShoppingBag, Wrench, Building2, Briefcase, GraduationCap, Share2, Clapperboard, Store]

export function WhoWeHelp() {
  const { t } = useLang()
  return (
    <section id="who" className="band py-24 sm:py-32">
      <div className="container-x">
        <SectionHead eyebrow={t.who.eyebrow} title={t.who.title} sub={t.who.sub} />
        <ul className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-mist/10 bg-mist/10 sm:grid-cols-2 lg:grid-cols-4">
          {t.who.items.map((it, i) => {
            const Icon = ICONS[i]
            return (
              <li key={it.t} className={`bg-navy ${i >= 8 ? 'lg:col-span-2' : ''}`}>
                <Reveal delay={(i % 4) * 0.06} className="h-full">
                  <SpotlightCard className="group h-full p-7 transition duration-300 hover:bg-midnight">
                    <Icon size={30} className="text-electric transition duration-300 group-hover:-translate-y-1" aria-hidden="true" />
                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-ice">{it.t}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-mist/65">{it.d}</p>
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
