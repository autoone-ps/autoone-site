import { useState } from 'react'
import { Check, Copy, Instagram, Mail, MessageCircle, type LucideIcon } from 'lucide-react'
import { site } from '../data/site'
import { useLang } from '../lib/i18n'
import { Reveal, SectionHead } from './Reveal'

interface Row { key: string; label: string; icon: LucideIcon; value: string; href?: string; copy?: boolean; ltr?: boolean }

export function ContactInfo() {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)
  const i = t.info

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(site.email); setCopied(true); window.setTimeout(() => setCopied(false), 1800) } catch { /* selectable text remains as fallback */ }
  }

  const rows: Row[] = [
    { key: 'email', label: i.email, icon: Mail, value: site.email, href: `mailto:${site.email}`, copy: true, ltr: true },
    { key: 'whatsapp', label: i.whatsapp, icon: MessageCircle, value: site.whatsapp ? `+${site.whatsapp}` : '', href: site.whatsapp ? `https://wa.me/${site.whatsapp}` : undefined, ltr: true },
    { key: 'instagram', label: i.instagram, icon: Instagram, value: site.instagram.replace(/^https?:\/\/(www\.)?/, ''), href: site.instagram || undefined, ltr: true },
  ]

  return (
    <section id="info" className="band-bottom py-24 sm:py-28">
      <div className="container-x">
        <SectionHead eyebrow={i.eyebrow} title={i.title} />
        <Reveal>
          <dl className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-mist/10 bg-mist/10 sm:grid-cols-3">
            {rows.map((r) => {
              const Icon = r.icon
              return (
                <div key={r.key} className="flex items-start gap-4 bg-navy p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-electric/15 text-electric"><Icon size={20} aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1">
                    <dt className="text-sm text-mist/55">{r.label}</dt>
                    <dd className="mt-1 break-words text-[16px] text-ice">
                      {r.value ? (
                        r.href ? <a href={r.href} {...(r.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} dir={r.ltr ? 'ltr' : undefined} className="underline decoration-electric/50 underline-offset-4 transition hover:decoration-electric">{r.value}</a>
                          : <span dir={r.ltr ? 'ltr' : undefined} className="select-all">{r.value}</span>
                      ) : <span className="text-mist/40">{i.soon}</span>}
                    </dd>
                    {r.copy && (
                      <button type="button" onClick={copyEmail} className="mt-2 inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-mist/15 px-3 text-sm text-mist/70 transition hover:border-mist/40">
                        {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />} {copied ? i.copied : i.copy}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
