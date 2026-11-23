import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { useActiveSection } from '../lib/hooks'
import { SECTION_IDS } from '../data/sections'
import { Face, type FaceName } from './Mascot'

const FACE: Partial<Record<string, FaceName>> = { services: 'happy', how: 'talk', why: 'excited', who: 'normal', team: 'happy', tech: 'think' }
const SHOWN = Object.keys(FACE)

/** A small helper that follows the visitor and offers a one-line tip for the section on screen. Dismissible. */
export function GuideDock() {
  const { t } = useLang()
  const active = useActiveSection([...SECTION_IDS])
  const [hidden, setHidden] = useState(false)
  const [tipOpen, setTipOpen] = useState(true)
  const visible = !hidden && SHOWN.includes(active)

  // show the tip for a few seconds whenever the section changes
  useEffect(() => {
    setTipOpen(true)
    const id = window.setTimeout(() => setTipOpen(false), 5200)
    return () => window.clearTimeout(id)
  }, [active])

  const tip = (t.guide.tips as Record<string, string>)[active]

  return (
    <div className="pointer-events-none fixed bottom-4 end-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:end-6" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AnimatePresence>
        {visible && tipOpen && tip && (
          <motion.div key={active} role="status" initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.25 }}
            className="pointer-events-auto relative max-w-[230px] rounded-2xl bg-ice px-4 py-3 text-sm leading-snug text-midnight shadow-xl shadow-black/40">
            {tip}
            <span aria-hidden="true" className="absolute -bottom-1.5 end-8 h-3 w-3 rotate-45 rounded-[3px] bg-ice" />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {visible && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="pointer-events-auto relative">
            <button type="button" onClick={() => setTipOpen((o) => !o)} aria-label={t.guide.open} aria-expanded={tipOpen}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-electric/50 bg-navy shadow-glow transition hover:scale-105 sm:h-[72px] sm:w-[72px]">
              <Face name={FACE[active] ?? 'normal'} className="h-10 sm:h-12" />
            </button>
            <button type="button" onClick={() => setHidden(true)} aria-label={t.guide.close} className="absolute -start-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-mist/25 bg-midnight text-mist/80 hover:text-white">
              <X size={14} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
