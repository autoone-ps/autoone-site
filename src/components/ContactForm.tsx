import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { site } from '../data/site'
import { useLang } from '../lib/i18n'
import { isEmail, isPhone, useSubmit } from '../lib/forms'
import { PREFILL_EVENT } from '../lib/hooks'
import { Bubble, Mascot, type MascotPose } from './Mascot'
import { Choice, describe, ErrorBanner, Field, SubmitButton } from './FormKit'
import { Reveal } from './Reveal'

type Key = 'name' | 'company' | 'email' | 'phone' | 'industry' | 'service' | 'method' | 'budget' | 'message'
type Values = Record<Key, string> & { website: string }
const EMPTY: Values = { name: '', company: '', email: '', phone: '', industry: '', service: '', method: 'email', budget: '', message: '', website: '' }
const SERVICE_KEYS = ['call', 'assistant', 'booking', 'chatbot', 'systems', 'automation', 'unsure'] as const

export function ContactForm() {
  const { t, lang, dir } = useLang()
  const f = t.contact
  const [v, setV] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({})
  const [focus, setFocus] = useState<Key | null>(null)
  const { status, error, send, reset } = useSubmit(site.api.contact)
  const formRef = useRef<HTMLFormElement>(null)

  // "Ask about this service" buttons elsewhere preselect the service here.
  useEffect(() => {
    const on = (e: Event) => {
      const s = (e as CustomEvent<{ service: string }>).detail?.service
      if (s) setV((p) => ({ ...p, service: s }))
    }
    window.addEventListener(PREFILL_EVENT, on)
    return () => window.removeEventListener(PREFILL_EVENT, on)
  }, [])

  const set = (k: Key) => (e: { target: { value: string } }) => {
    setV((p) => ({ ...p, [k]: e.target.value }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }))
  }

  const validate = () => {
    const er: Partial<Record<Key, string>> = {}
    const m = t.forms.errors
    if (!v.name.trim()) er.name = m.required
    if (!v.email.trim()) er.email = m.required
    else if (!isEmail(v.email)) er.email = m.email
    if (v.phone.trim() && !isPhone(v.phone)) er.phone = m.phone
    if (!v.service) er.service = m.required
    if (!v.message.trim()) er.message = m.required
    else if (v.message.trim().length < 20) er.message = m.min
    setErrors(er)
    return er
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'loading') return
    const er = validate()
    const first = (Object.keys(er) as Key[])[0]
    if (first) { formRef.current?.querySelector<HTMLElement>(`#c-${first}`)?.focus(); return }
    await send({
      ...v,
      // industry/budget are stored as option indexes so a language switch never breaks the selection
      industry: v.industry ? f.industries[Number(v.industry)] : '',
      budget: v.budget ? f.budgets[Number(v.budget)] : '',
      formType: 'contact',
      lang,
    })
  }

  const pose: MascotPose = status === 'success' ? 'celebrate' : status === 'loading' ? 'main' : focus === 'message' ? 'point' : focus ? 'wave' : 'think'
  const guideText = status === 'success' ? f.guide.success : status === 'loading' ? f.guide.loading : status === 'error' ? f.guide.error : focus ? f.guide[focus] : f.guide.idle

  return (
    <div id="contact-form" className="grid gap-10 lg:grid-cols-[1fr_300px] lg:gap-14">
      <div className="order-first lg:relative lg:order-last">
        <div className="sticky top-24 flex items-end gap-4 lg:flex-col lg:items-start">
          <Bubble live tail="bottom" className="max-w-[260px]">
            <motion.span key={guideText} className="block" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>{guideText}</motion.span>
          </Bubble>
          <Mascot pose={pose} flip={dir === 'ltr'} className="h-36 sm:h-44 lg:h-60" />
        </div>
      </div>

      <Reveal>
        <div className="rounded-[2rem] border border-mist/10 bg-navy/50 p-6 sm:p-10">
          {status === 'success' ? (
            <div role="status" className="flex flex-col items-start gap-4 py-8">
              <CheckCircle2 size={44} className="text-electric" aria-hidden="true" />
              <h3 className="text-3xl font-semibold tracking-tight text-ice">{f.successTitle}</h3>
              <p className="max-w-md text-lg text-mist/70">{f.successText}</p>
              <button type="button" className="btn btn-ghost mt-2" onClick={() => { setV(EMPTY); setErrors({}); reset() }}>{f.another}</button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
              {/* honeypot: real visitors never see or fill this */}
              <div aria-hidden="true" className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
                <label>Website<input tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website' as Key)} name="website" /></label>
              </div>

              <Field id="c-name" label={f.fields.name} required error={errors.name}>
                <input id="c-name" className="field" autoComplete="name" value={v.name} onChange={set('name')} onFocus={() => setFocus('name')} onBlur={() => setFocus(null)} aria-invalid={!!errors.name} aria-describedby={describe('c-name', errors.name)} />
              </Field>
              <Field id="c-company" label={f.fields.company} optional>
                <input id="c-company" className="field" autoComplete="organization" value={v.company} onChange={set('company')} onFocus={() => setFocus('company')} onBlur={() => setFocus(null)} />
              </Field>
              <Field id="c-email" label={f.fields.email} required error={errors.email}>
                <input id="c-email" type="email" inputMode="email" dir="ltr" className="field text-start" autoComplete="email" value={v.email} onChange={set('email')} onFocus={() => setFocus('email')} onBlur={() => setFocus(null)} aria-invalid={!!errors.email} aria-describedby={describe('c-email', errors.email)} />
              </Field>
              <Field id="c-phone" label={f.fields.phone} optional error={errors.phone}>
                <input id="c-phone" type="tel" inputMode="tel" dir="ltr" className="field text-start" autoComplete="tel" value={v.phone} onChange={set('phone')} onFocus={() => setFocus('phone')} onBlur={() => setFocus(null)} aria-invalid={!!errors.phone} aria-describedby={describe('c-phone', errors.phone)} />
              </Field>
              <Field id="c-industry" label={f.fields.industry} optional>
                <select id="c-industry" className="field" value={v.industry} onChange={set('industry')} onFocus={() => setFocus('industry')} onBlur={() => setFocus(null)}>
                  <option value="">{f.select}</option>
                  {f.industries.map((o, i) => <option key={o} value={String(i)}>{o}</option>)}
                </select>
              </Field>
              <Field id="c-service" label={f.fields.service} required error={errors.service}>
                <select id="c-service" className="field" value={v.service} onChange={set('service')} onFocus={() => setFocus('service')} onBlur={() => setFocus(null)} aria-invalid={!!errors.service} aria-describedby={describe('c-service', errors.service)}>
                  <option value="">{f.select}</option>
                  {SERVICE_KEYS.map((k) => <option key={k} value={k}>{f.services[k]}</option>)}
                </select>
              </Field>

              <div className="sm:col-span-2">
                <Choice name="method" legend={f.fields.method} value={v.method} onChange={(m) => setV((p) => ({ ...p, method: m }))} onFocus={() => setFocus('method')}
                  options={[{ value: 'email', label: f.methods.email }, { value: 'phone', label: f.methods.phone }, { value: 'whatsapp', label: f.methods.whatsapp }]} />
              </div>

              <Field id="c-budget" label={f.fields.budget} optional className="sm:col-span-2">
                <select id="c-budget" className="field" value={v.budget} onChange={set('budget')} onFocus={() => setFocus('budget')} onBlur={() => setFocus(null)}>
                  <option value="">{f.select}</option>
                  {f.budgets.map((o, i) => <option key={o} value={String(i)}>{o}</option>)}
                </select>
              </Field>

              <Field id="c-message" label={f.fields.message} required error={errors.message} className="sm:col-span-2">
                <textarea id="c-message" rows={7} className="field min-h-[180px] resize-y leading-relaxed" placeholder={f.placeholder} value={v.message} onChange={set('message')} onFocus={() => setFocus('message')} onBlur={() => setFocus(null)} aria-invalid={!!errors.message} aria-describedby={describe('c-message', errors.message)} />
              </Field>

              {status === 'error' && error && <div className="sm:col-span-2"><ErrorBanner error={error} /></div>}

              <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <SubmitButton loading={status === 'loading'}>{status === 'error' ? t.forms.retry : f.submit}</SubmitButton>
                <p className="flex items-center gap-2 text-sm text-mist/50"><ShieldCheck size={16} aria-hidden="true" /> {f.privacy}</p>
              </div>
            </form>
          )}
        </div>
      </Reveal>
    </div>
  )
}
