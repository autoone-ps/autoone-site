import type { ReactNode } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { site } from '../data/site'
import type { SubmitError } from '../lib/forms'

interface FieldProps {
  id: string
  label: string
  required?: boolean
  optional?: boolean
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}

/** Label + control + error wrapper. The control must use the same `id`. */
export function Field({ id, label, required, optional, error, hint, children, className = '' }: FieldProps) {
  const { t } = useLang()
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-[15px] font-medium text-ice">
        <span>{label}{required && <span className="ms-1 text-electric" aria-hidden="true">*</span>}</span>
        {optional && <span className="text-xs font-normal text-mist/45">{t.forms.optional}</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-sm text-mist/50">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1.5 text-sm text-red-300">{error}</p>}
    </div>
  )
}

export const describe = (id: string, error?: string, hint?: string) => (error ? `${id}-err` : hint ? `${id}-hint` : undefined)

/** Radio-style chips (accessible: real radio inputs inside a fieldset). */
export function Choice<T extends string>({ name, legend, options, value, onChange, onFocus }: { name: string; legend: string; options: { value: T; label: string }[]; value: T | ''; onChange: (v: T) => void; onFocus?: () => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-[15px] font-medium text-ice">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} onFocus={onFocus} className="peer sr-only" />
            <span className="inline-flex min-h-[44px] items-center rounded-full border border-mist/20 px-5 text-[15px] text-mist/80 transition peer-checked:border-electric peer-checked:bg-electric peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-electric peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-midnight hover:border-mist/50">
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function SubmitButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  const { t } = useLang()
  return (
    <button type="submit" disabled={loading} aria-busy={loading} className="btn btn-primary w-full sm:w-auto sm:min-w-[220px]">
      {loading ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> {t.forms.sending}</> : children}
    </button>
  )
}

export function ErrorBanner({ error }: { error: SubmitError }) {
  const { t } = useLang()
  const msg = error === 'notConfigured' ? t.forms.errors.notConfigured : t.forms.errors[error]
  return (
    <div role="alert" className="flex gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-[15px] text-red-100">
      <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p>
        {msg}
        {error === 'notConfigured' && <> <span className="select-all font-medium" dir="ltr">{site.email}</span></>}
      </p>
    </div>
  )
}
