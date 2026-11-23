import { ArrowUp, AudioLines, Bot, BrainCircuit, Cloud, Database, MessagesSquare, Plug, Users, Workflow, type LucideIcon } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { LogoMark } from './Logo'
import { Reveal, SectionHead } from './Reveal'
import { SpotlightCard } from './SpotlightCard'

const ICONS: LucideIcon[] = [BrainCircuit, Workflow, Bot, Plug, Users, Cloud, Database, MessagesSquare, AudioLines]

export function TechSystems() {
  const { t } = useLang()
  return (
    <section id="tech" className="band relative overflow-hidden py-24 sm:py-32">
      <div className="container-x">
        <SectionHead eyebrow={t.tech.eyebrow} title={t.tech.title} sub={t.tech.sub} />

        {/* hub: Autoone joins every category into one system */}
        <div className="relative mt-16">
          <Reveal className="mb-2 flex flex-col items-center">
            {/* the hub: clicking it takes the visitor back to the top of the page */}
            <a href="#home" aria-label={t.footer.toTop} title={t.footer.toTop}
              className="group relative isolate inline-flex items-center gap-4 rounded-full border border-electric/60 bg-gradient-to-b from-navy to-midnight px-8 py-4 shadow-glow transition duration-300 hover:-translate-y-1 hover:border-electric sm:gap-5 sm:px-11 sm:py-5">
              <span aria-hidden="true" className="absolute -inset-4 -z-10 rounded-full bg-electric/20 blur-2xl transition duration-300 group-hover:bg-electric/40" />
              <LogoMark className="h-10 w-10 transition duration-500 group-hover:rotate-90 sm:h-12 sm:w-12" />
              <span className="text-3xl font-medium tracking-tight text-ice sm:text-4xl" dir="ltr">Autoone</span>
              <ArrowUp size={22} className="text-electric opacity-0 transition duration-300 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden="true" />
            </a>
            <span aria-hidden="true" className="pointer-events-none hidden h-10 w-px bg-gradient-to-b from-electric to-transparent lg:block" />
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.tech.groups.map((g, i) => {
              const Icon = ICONS[i]
              return (
                <li key={g.t}>
                  <Reveal delay={(i % 3) * 0.07} className="h-full">
                    <SpotlightCard className="h-full rounded-3xl border border-mist/10 bg-midnight/60 p-6 transition duration-300 hover:border-electric/50">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/15 text-electric"><Icon size={22} aria-hidden="true" /></span>
                        <h3 className="text-lg font-semibold tracking-tight text-ice">{g.t}</h3>
                      </div>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {g.items.map((it) => <li key={it} className="rounded-full border border-mist/15 px-3 py-1 text-sm text-mist/75">{it}</li>)}
                      </ul>
                    </SpotlightCard>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </div>
        <p className="mt-10 text-center text-[15px] text-mist/55">{t.tech.note}</p>
      </div>
    </section>
  )
}
