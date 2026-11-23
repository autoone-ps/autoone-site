import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Languages, Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { useLang } from '../lib/i18n'
import { useActiveSection } from '../lib/hooks'
import { SECTION_IDS } from '../data/sections'

export function Nav() {
  const { t, toggle } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection([...SECTION_IDS])

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc) }
  }, [open])

  const links = [
    { id: 'services', label: t.nav.services }, { id: 'how', label: t.nav.how }, { id: 'why', label: t.nav.why },
    { id: 'who', label: t.nav.who }, { id: 'team', label: t.nav.team }, { id: 'tech', label: t.nav.tech },
    { id: 'faq', label: t.nav.faq }, { id: 'support', label: t.nav.support },
  ]
  const desktop = links.filter((l) => !['who', 'tech'].includes(l.id))

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? 'border-b border-mist/10 bg-midnight/85 backdrop-blur-xl' : 'bg-transparent'}`}>
      <a href="#services" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-electric focus:px-4 focus:py-2">{t.skip}</a>
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <a href="#home" aria-label="Autoone" onClick={() => setOpen(false)}><Logo /></a>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {desktop.map((l) => (
            <a key={l.id} href={`#${l.id}`} aria-current={active === l.id ? 'true' : undefined}
              className={`rounded-full px-3.5 py-2 text-[15px] transition-colors ${active === l.id ? 'text-white' : 'text-mist/65 hover:text-white'}`}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" onClick={toggle} className="inline-flex h-11 items-center gap-2 rounded-full border border-mist/20 px-4 text-sm text-ice transition hover:border-mist/50" aria-label="Switch language">
            <Languages size={16} aria-hidden="true" /> {t.nav.lang}
          </button>
          <a href="#contact" className="btn btn-primary hidden !min-h-[44px] sm:inline-flex">{t.nav.cta}</a>
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-mist/20 lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? t.nav.close : t.nav.menu}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav id="mobile-menu" aria-label="Mobile" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="container-x max-h-[calc(100dvh-72px)] overflow-y-auto pb-8 pt-2 lg:hidden">
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={() => setOpen(false)} className="flex min-h-[52px] items-center border-b border-mist/10 text-lg text-ice">{l.label}</a>
                </li>
              ))}
            </ul>
            <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary mt-6 w-full">{t.nav.cta}</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
