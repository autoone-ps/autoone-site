import { ArrowUp, Instagram, Linkedin, Mail, MessageCircle } from 'lucide-react'
import { site } from '../data/site'
import { services } from '../data/services'
import { useLang } from '../lib/i18n'
import { Logo } from './Logo'

export function Footer() {
  const { t } = useLang()
  const f = t.footer
  const social = [
    { url: site.instagram, Icon: Instagram, label: t.info.instagram },
    { url: site.linkedin, Icon: Linkedin, label: t.info.linkedin },
    { url: site.whatsapp ? `https://wa.me/${site.whatsapp}` : '', Icon: MessageCircle, label: t.info.whatsapp },
  ].filter((s) => s.url)
  const linkCls = 'text-[15px] text-mist/65 transition hover:text-white'

  return (
    <footer className="border-t border-mist/10 bg-midnight">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-mist/65">{f.desc}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={`mailto:${site.email}`} aria-label={`${t.info.email}: ${site.email}`} className="flex h-11 w-11 items-center justify-center rounded-full border border-mist/20 text-mist/80 transition hover:border-electric hover:bg-electric hover:text-white"><Mail size={18} aria-hidden="true" /></a>
              {social.map(({ url, Icon, label }) => (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-11 w-11 items-center justify-center rounded-full border border-mist/20 text-mist/80 transition hover:border-electric hover:bg-electric hover:text-white"><Icon size={18} aria-hidden="true" /></a>
              ))}
            </div>
            <p className="mt-4 select-all text-[15px] text-mist/70" dir="ltr">{site.email}</p>
          </div>

          <nav aria-label={f.explore}>
            <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-mist/45">{f.explore}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {[['services', t.nav.services], ['how', t.nav.how], ['why', t.nav.why], ['who', t.nav.who], ['team', t.nav.team], ['tech', t.nav.tech], ['faq', t.nav.faq]].map(([id, label]) => (
                <li key={id}><a href={`#${id}`} className={linkCls}>{label}</a></li>
              ))}
            </ul>
          </nav>

          <nav aria-label={f.services}>
            <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-mist/45">{f.services}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {services.map((s) => <li key={s.id}><a href="#services" className={linkCls}>{t.services.items[s.id].title}</a></li>)}
            </ul>
          </nav>

          <nav aria-label={f.support}>
            <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-mist/45">{f.support}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              <li><a href="#support" className={linkCls}>{t.nav.support}</a></li>
              <li><a href="#contact" className={linkCls}>{f.contact}</a></li>
              <li><a href="#info" className={linkCls}>{t.info.title}</a></li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-mist/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-mist/50">© {new Date().getFullYear()} Autoone. {f.rights}</p>
          <a href="#home" className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-mist/20 px-5 text-sm text-mist/80 transition hover:border-mist/50">
            <ArrowUp size={16} aria-hidden="true" /> {f.toTop}
          </a>
        </div>
      </div>
    </footer>
  )
}
