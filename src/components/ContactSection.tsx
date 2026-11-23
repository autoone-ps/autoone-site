import { useLang } from '../lib/i18n'
import { ContactForm } from './ContactForm'
import { SectionHead } from './Reveal'

export function ContactSection() {
  const { t } = useLang()
  return (
    <section id="contact" className="relative overflow-hidden bg-midnight py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-electric/15 to-transparent" />
      <div className="container-x relative">
        <SectionHead eyebrow={t.contact.eyebrow} title={t.contact.title} sub={t.contact.sub} />
        <div className="mt-14"><ContactForm /></div>
      </div>
    </section>
  )
}
