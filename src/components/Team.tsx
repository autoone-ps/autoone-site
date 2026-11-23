import { Instagram, Linkedin, Twitter, UserRound } from 'lucide-react'
import { team } from '../data/team'
import { useLang } from '../lib/i18n'
import { Reveal, SectionHead } from './Reveal'
import { SpotlightCard } from './SpotlightCard'

export function Team() {
  const { t, lang } = useLang()
  return (
    <section id="team" className="bg-midnight py-24 sm:py-32">
      <div className="container-x">
        <SectionHead eyebrow={t.team.eyebrow} title={t.team.title} sub={t.team.sub} />
        <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => {
            const name = m.name[lang]
            const socials = [
              { url: m.linkedin, Icon: Linkedin, label: `${t.team.linkedin} ${name}` },
              { url: m.instagram, Icon: Instagram, label: `${t.team.instagram} ${name}` },
              { url: m.x, Icon: Twitter, label: `${t.team.x} ${name}` },
            ].filter((s) => s.url)
            return (
              <li key={m.id}>
                <Reveal delay={i * 0.08} className="h-full">
                  <SpotlightCard as="article" className="flex h-full flex-col rounded-3xl border border-mist/10 bg-navy/40 p-7 transition duration-300 hover:border-electric/50">
                    <div className="flex items-center gap-5">
                      <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-electric/40 bg-navy text-mist/50">
                        {m.photo ? <img src={m.photo} alt={name} loading="lazy" className="h-full w-full object-cover" /> : <UserRound size={34} aria-hidden="true" />}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold tracking-tight text-ice">{name}</h3>
                        <p className="mt-1 text-[15px] text-electric">{m.role[lang]}</p>
                      </div>
                    </div>
                    <p className="mt-6 flex-1 text-[15px] leading-relaxed text-mist/65">{m.bio[lang]}</p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {m.expertise[lang].map((e) => <li key={e} className="rounded-full border border-mist/15 px-3 py-1 text-sm text-mist/80">{e}</li>)}
                    </ul>
                    {socials.length > 0 && (
                      <div className="mt-6 flex gap-2">
                        {socials.map(({ url, Icon, label }) => (
                          <a key={url} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-11 w-11 items-center justify-center rounded-full border border-mist/20 text-mist/80 transition hover:border-electric hover:bg-electric hover:text-white">
                            <Icon size={18} aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    )}
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
