import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, LifeBuoy, Paperclip, RefreshCw, Wrench, X, AlertOctagon, MessageCircle, type LucideIcon } from 'lucide-react'
import { site } from '../data/site'
import { useLang } from '../lib/i18n'
import { fileToBase64, isEmail, useSubmit } from '../lib/forms'
import { scrollToId } from '../lib/hooks'
import { Bubble, Mascot, type MascotPose } from './Mascot'
import { Choice, describe, ErrorBanner, Field, SubmitButton } from './FormKit'
import { Reveal, SectionHead } from './Reveal'

const ACTION_ICONS: Record<string, LucideIcon> = { support: LifeBuoy, problem: AlertOctagon, maintenance: Wrench, update: RefreshCw, contact: MessageCircle }
/** Index into t.support.types preselected by each quick action. */
const ACTION_TYPE: Record<string, number> = { support: 0, problem: 1, maintenance: 3, update: 2, contact: 3 }
const ACCEPT = '.png,.jpg,.jpeg,.webp,.gif,.pdf,.txt,.log,.csv'

type Key = 'name' | 'email' | 'system' | 'type' | 'description' | 'file'
interface Values { name: string; company: string; email: string; system: string; type: string; urgency: string; description: string; website: string }
const EMPTY: Values = { name: '', company: '', email: '', system: '', type: '', urgency: 'medium', description: '', website: '' }

export function Support() {
  const { t, lang, dir } = useLang()
  const s = t.support
  const [action, setAction] = useState<string>('support')
  const [v, setV] = useState<Values>({ ...EMPTY, type: '0' })
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({})
  const [focus, setFocus] = useState<Key | null>(null)
  const { status, error, send, reset } = useSubmit(site.api.support)
  const formRef = useRef<HTMLFormElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    setV((p) => ({ ...p, [k]: e.target.value }))
    if (k in errors) setErrors((p) => ({ ...p, [k]: undefined }))
  }

  const pick = (k: string) => {
    setAction(k)
    // system/type are stored as option indexes so a language switch never breaks the selection
    setV((p) => ({ ...p, type: String(ACTION_TYPE[k]) }))
    scrollToId('support-form')
  }

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null
    if (picked && picked.size > site.maxAttachmentBytes) {
      setFile(null); setErrors((p) => ({ ...p, file: t.forms.errors.file })); e.target.value = ''
      return
    }
    setErrors((p) => ({ ...p, file: undefined })); setFile(picked)
  }

  const validate = () => {
    const er: Partial<Record<Key, string>> = {}
    const m = t.forms.errors
    if (!v.name.trim()) er.name = m.required
    if (!v.email.trim()) er.email = m.required
    else if (!isEmail(v.email)) er.email = m.email
    if (!v.system) er.system = m.required
    if (!v.type) er.type = m.required
    if (!v.description.trim()) er.description = m.required
    else if (v.description.trim().length < 20) er.description = m.min
    setErrors(er)
    return er
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'loading') return
    const er = validate()
    const first = (Object.keys(er) as Key[])[0]
    if (first) { formRef.current?.querySelector<HTMLElement>(`#s-${first}`)?.focus(); return }
    const attachment = file ? { name: file.name, type: file.type, size: file.size, content: await fileToBase64(file) } : undefined
    const actionLabel = s.actions.find((a) => a.k === action)?.t ?? action
    await send({ ...v, system: s.systems[Number(v.system)], type: s.types[Number(v.type)], formType: 'support', requestKind: actionLabel, lang, attachment })
  }

  const pose: MascotPose = status === 'success' ? 'celebrate' : status === 'loading' ? 'main' : focus === 'description' ? 'think' : 'point'
  const guideText = status === 'success' ? s.guide.success : status === 'loading' ? s.guide.loading : status === 'error' ? s.guide.error : s.guide.idle

  return (
    <section id="support" className="band-top relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -end-32 top-10 h-[380px] w-[380px] rounded-full bg-electric/15 blur-[120px]" />
      <div className="container-x relative">
        <SectionHead eyebrow={s.eyebrow} title={s.title} sub={s.sub} />

        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {s.actions.map((a, i) => {
            const Icon = ACTION_ICONS[a.k]
            const on = action === a.k
            return (
              <li key={a.k}>
                <Reveal delay={i * 0.05} className="h-full">
                  <button type="button" onClick={() => pick(a.k)} aria-pressed={on}
                    className={`flex h-full w-full flex-col items-start gap-3 rounded-2xl border p-5 text-start transition duration-300 hover:-translate-y-0.5 ${on ? 'border-electric bg-electric/15' : 'border-mist/10 bg-midnight/50 hover:border-electric/50'}`}>
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${on ? 'bg-electric text-white' : 'bg-electric/15 text-electric'}`}><Icon size={22} aria-hidden="true" /></span>
                    <span className="text-[16px] font-semibold leading-snug text-ice">{a.t}</span>
                    <span className="text-sm text-mist/55">{a.d}</span>
                  </button>
                </Reveal>
              </li>
            )
          })}
        </ul>

        <div id="support-form" className="mt-14 grid scroll-mt-24 gap-10 lg:grid-cols-[1fr_300px] lg:gap-14">
          <div className="order-first lg:relative lg:order-last">
            <div className="sticky top-24 flex items-end gap-4 lg:flex-col lg:items-start">
              <Bubble live tail="bottom" className="max-w-[260px]">
                <motion.span key={guideText} className="block" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>{guideText}</motion.span>
              </Bubble>
              <Mascot pose={pose} flip={dir === 'ltr'} className="h-36 sm:h-44 lg:h-56" />
            </div>
          </div>

          <Reveal>
            <div className="rounded-[2rem] border border-mist/10 bg-midnight/60 p-6 sm:p-10">
              {status === 'success' ? (
                <div role="status" className="flex flex-col items-start gap-4 py-8">
                  <CheckCircle2 size={44} className="text-electric" aria-hidden="true" />
                  <h3 className="text-3xl font-semibold tracking-tight text-ice">{s.successTitle}</h3>
                  <p className="max-w-md text-lg text-mist/70">{s.successText}</p>
                  <button type="button" className="btn btn-ghost mt-2" onClick={() => { setV({ ...EMPTY, type: '0' }); setFile(null); setErrors({}); reset() }}>{s.another}</button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                  <div aria-hidden="true" className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
                    <label>Website<input tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} name="website" /></label>
                  </div>

                  <Field id="s-name" label={s.fields.name} required error={errors.name}>
                    <input id="s-name" className="field" autoComplete="name" value={v.name} onChange={set('name')} onFocus={() => setFocus('name')} onBlur={() => setFocus(null)} aria-invalid={!!errors.name} aria-describedby={describe('s-name', errors.name)} />
                  </Field>
                  <Field id="s-company" label={s.fields.company} optional>
                    <input id="s-company" className="field" autoComplete="organization" value={v.company} onChange={set('company')} />
                  </Field>
                  <Field id="s-email" label={s.fields.email} required error={errors.email}>
                    <input id="s-email" type="email" inputMode="email" dir="ltr" className="field text-start" autoComplete="email" value={v.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={describe('s-email', errors.email)} />
                  </Field>
                  <Field id="s-system" label={s.fields.system} required error={errors.system}>
                    <select id="s-system" className="field" value={v.system} onChange={set('system')} aria-invalid={!!errors.system} aria-describedby={describe('s-system', errors.system)}>
                      <option value="">{t.contact.select}</option>
                      {s.systems.map((o, i) => <option key={o} value={String(i)}>{o}</option>)}
                    </select>
                  </Field>
                  <Field id="s-type" label={s.fields.type} required error={errors.type} className="sm:col-span-2">
                    <select id="s-type" className="field" value={v.type} onChange={set('type')} aria-invalid={!!errors.type} aria-describedby={describe('s-type', errors.type)}>
                      {s.types.map((o, i) => <option key={o} value={String(i)}>{o}</option>)}
                    </select>
                  </Field>

                  <div className="sm:col-span-2">
                    <Choice name="urgency" legend={s.fields.urgency} value={v.urgency} onChange={(u) => setV((p) => ({ ...p, urgency: u }))}
                      options={(['low', 'medium', 'high', 'critical'] as const).map((k) => ({ value: k, label: s.urgencies[k] }))} />
                  </div>

                  <Field id="s-description" label={s.fields.description} required error={errors.description} className="sm:col-span-2">
                    <textarea id="s-description" rows={6} className="field min-h-[160px] resize-y leading-relaxed" placeholder={s.descPlaceholder} value={v.description} onChange={set('description')} onFocus={() => setFocus('description')} onBlur={() => setFocus(null)} aria-invalid={!!errors.description} aria-describedby={describe('s-description', errors.description)} />
                  </Field>

                  <div className="sm:col-span-2">
                    <p className="mb-2 text-[15px] font-medium text-ice">{s.fields.attachment} <span className="text-xs font-normal text-mist/45">{t.forms.optional}</span></p>
                    <input ref={fileRef} id="s-file" type="file" accept={ACCEPT} onChange={onFile} className="sr-only" aria-describedby="s-file-hint" />
                    <div className="flex flex-wrap items-center gap-3">
                      <button type="button" className="btn btn-ghost !min-h-[44px]" onClick={() => fileRef.current?.click()}>
                        <Paperclip size={16} aria-hidden="true" /> {s.chooseFile}
                      </button>
                      {file && (
                        <span className="inline-flex min-w-0 items-center gap-2 rounded-full bg-electric/15 py-1.5 pe-2 ps-4 text-sm text-ice">
                          <span className="truncate" dir="ltr">{file.name}</span>
                          <button type="button" aria-label={s.remove} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10" onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = '' }}><X size={14} /></button>
                        </span>
                      )}
                    </div>
                    <p id="s-file-hint" className={`mt-1.5 text-sm ${errors.file ? 'text-red-300' : 'text-mist/50'}`} role={errors.file ? 'alert' : undefined}>{errors.file ?? s.attachHint}</p>
                  </div>

                  {status === 'error' && error && <div className="sm:col-span-2"><ErrorBanner error={error} /></div>}

                  <div className="sm:col-span-2">
                    <SubmitButton loading={status === 'loading'}>{status === 'error' ? t.forms.retry : s.submit}</SubmitButton>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
