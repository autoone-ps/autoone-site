import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en, type Dict } from '../i18n/en'
import { ar } from '../i18n/ar'

export type Lang = 'en' | 'ar'
const dicts: Record<Lang, Dict> = { en, ar }
const KEY = 'autoone-lang'

interface LangCtx {
  lang: Lang
  t: Dict
  dir: 'ltr' | 'rtl'
  setLang: (l: Lang) => void
  toggle: () => void
}

const Ctx = createContext<LangCtx | null>(null)

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'ar' || saved === 'en') return saved
  } catch { /* storage unavailable */ }
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    document.title = dicts[lang].meta.title
    try { localStorage.setItem(KEY, lang) } catch { /* ignore */ }
  }, [lang, dir])

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const toggle = useCallback(() => setLangState((l) => (l === 'en' ? 'ar' : 'en')), [])
  const value = useMemo<LangCtx>(() => ({ lang, t: dicts[lang], dir, setLang, toggle }), [lang, dir, setLang, toggle])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLang(): LangCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('useLang must be used inside <LangProvider>')
  return v
}
