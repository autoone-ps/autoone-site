import { Fragment, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, RotateCcw } from 'lucide-react'
import { services, type ServiceId, type ServiceMeta } from '../data/services'
import { useLang } from '../lib/i18n'
import { prefillContact, scrollToId } from '../lib/hooks'
import { Bubble, Face, Mascot } from './Mascot'
import { Reveal, SectionHead } from './Reveal'
import { SpotlightCard } from './SpotlightCard'

function ServiceCard({ svc, selected, onSelect, index }: { svc: ServiceMeta; selected: boolean; onSelect: () => void; index: number }) {
  const { t } = useLang()
  const text = t.services.items[svc.id]
  const Icon = svc.icon
  const [hover, setHover] = useState(false)

  return (
    <Reveal delay={(index % 3) * 0.08}>
      <SpotlightCard as="article"
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)} onBlur={() => setHover(false)}
        className={`group relative flex h-full flex-col rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 ${selected ? 'border-electric bg-navy shadow-glow' : 'border-mist/10 bg-navy/40 hover:border-electric/60 hover:bg-navy/70'}`}
      >
        <AnimatePresence>
          {hover && (
            <motion.span aria-hidden="true" className="pointer-events-none absolute -top-9 end-6" initial={{ opacity: 0, y: 12, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.85 }} transition={{ duration: 0.2 }}>
              <Face name={selected ? 'excited' : 'happy'} className="h-14" />
            </motion.span>
          )}
        </AnimatePresence>
        <span className={`flex h-14 w-14 items-center justify-center rounded-2xl transition duration-300 group-hover:rotate-[-6deg] group-hover:scale-110 ${selected ? 'bg-electric text-white' : 'bg-electric/15 text-electric'}`}>
          <Icon size={26} aria-hidden="true" />
        </span>
        <h3 className="mt-6 text-2xl font-semibold tracking-tight text-ice">{text.title}</h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-mist/65">{text.desc}</p>
        <button type="button" onClick={onSelect} aria-pressed={selected} aria-label={`${t.services.learn}: ${text.title}`}
          className="mt-7 inline-flex min-h-[44px] items-center gap-2 self-start rounded-full border border-mist/20 px-5 text-sm font-medium text-ice transition hover:border-electric hover:bg-electric">
          {t.services.learn} <ArrowRight size={16} className="rtl:-scale-x-100" aria-hidden="true" />
        </button>
      </SpotlightCard>
    </Reveal>
  )
}

function WorkflowDiagram({ svc }: { svc: ServiceMeta }) {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const steps = t.services.items[svc.id].flow
  const n = steps.length
  const [active, setActive] = useState(reduce ? n : 0)
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (reduce) { setActive(n); return }
    setActive(0)
    const id = setInterval(() => setActive((a) => (a >= n + 1 ? 0 : a + 1)), 1300)
    return () => clearInterval(id)
  }, [svc.id, run, reduce, n])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h4 className="text-sm font-medium uppercase tracking-[0.16em] text-mist/60">{t.services.flowTitle}</h4>
        <button type="button" onClick={() => setRun((r) => r + 1)} className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-mist/15 px-4 text-sm text-mist/80 transition hover:border-mist/40">
          <RotateCcw size={14} aria-hidden="true" /> {t.services.replay}
        </button>
      </div>
      <ol className="flex flex-col md:flex-row md:items-start">
        {steps.map((label, i) => {
          const Icon = svc.flowIcons[i]
          const lit = active - 1 >= i
          const current = active - 1 === i
          const linkLit = active - 1 > i
          return (
            <Fragment key={label}>
              <li className="flex min-w-0 items-center gap-4 md:flex-1 md:flex-col md:gap-3 md:text-center" aria-current={current ? 'step' : undefined}>
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition duration-500 ${lit ? 'border-electric bg-electric text-white' : 'border-mist/15 bg-midnight text-mist/45'} ${current ? 'scale-110 shadow-glow ring-4 ring-electric/25' : ''}`}>
                  <Icon size={24} aria-hidden="true" />
                </span>
                <span className={`text-[15px] leading-snug transition-colors duration-500 ${lit ? 'text-ice' : 'text-mist/50'}`}>{label}</span>
              </li>
              {i < n - 1 && (
                <li aria-hidden="true" className={`ms-7 h-6 w-0.5 shrink-0 rounded transition-colors duration-500 md:ms-0 md:mt-7 md:h-0.5 md:w-5 ${linkLit ? 'bg-electric' : 'bg-mist/15'}`} />
              )}
            </Fragment>
          )
        })}
      </ol>
    </div>
  )
}

function Explorer({ id }: { id: ServiceId }) {
  const { t, dir } = useLang()
  const svc = services.find((s) => s.id === id)!
  const text = t.services.items[id]
  const Icon = svc.icon

  const trio = [
    { k: 'problem', title: t.services.problemTitle, body: text.problem, cls: 'border-mist/10 bg-midnight/60' },
    { k: 'solution', title: t.services.solutionTitle, body: text.solution, cls: 'border-electric/50 bg-electric/10' },
    { k: 'benefit', title: t.services.benefitTitle, body: text.benefit, cls: 'border-mist/10 bg-midnight/60' },
  ]

  return (
    <motion.div key={id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
      <div className="flex items-start justify-between gap-6">
        <div className="max-w-2xl">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-electric text-white"><Icon size={24} aria-hidden="true" /></span>
          <h3 className="mt-5 text-3xl font-semibold tracking-tight text-ice sm:text-4xl">{text.title}</h3>
          <p className="mt-3 text-lg leading-relaxed text-mist/70">{text.desc}</p>
        </div>
        <div className="hidden shrink-0 sm:block" aria-hidden="true">
          <Mascot pose={svc.pose} className="h-40 lg:h-48" flip={dir === 'ltr'} />
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {trio.map((b) => (
          <div key={b.k} className={`rounded-2xl border p-6 ${b.cls}`}>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7BA3FF] rtl:text-lg">{b.title}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-mist/85">{b.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-mist/10 bg-midnight/50 p-6 sm:p-8">
        <WorkflowDiagram svc={svc} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-mist/70 rtl:text-lg">{t.services.featuresTitle}</p>
          <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {text.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[15px] text-mist/85">
                <Check size={18} className="mt-0.5 shrink-0 text-electric" aria-hidden="true" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <button type="button" onClick={() => prefillContact(id)} className="btn btn-primary">
          {t.services.cta} <ArrowRight size={18} className="rtl:-scale-x-100" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  )
}

export function Services() {
  const { t, dir } = useLang()
  const [selected, setSelected] = useState<ServiceId>('call')

  const choose = (id: ServiceId) => {
    setSelected(id)
    window.setTimeout(() => scrollToId('service-explorer'), 60)
  }

  return (
    <section id="services" className="relative bg-midnight py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead eyebrow={t.services.eyebrow} title={t.services.title} sub={t.services.sub} />
          <Reveal className="hidden items-end gap-3 lg:flex">
            <Bubble tail="end" className="mb-14 max-w-[210px]">{t.services.pick}</Bubble>
            <Mascot pose="point" className="h-44" flip={dir === 'ltr'} />
          </Reveal>
        </div>

        <div className="mt-16 grid gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => <ServiceCard key={s.id} svc={s} index={i} selected={selected === s.id} onSelect={() => choose(s.id)} />)}
        </div>

        <p className="mt-12 text-center text-sm uppercase tracking-[0.18em] text-mist/50 lg:hidden">{t.services.pick}</p>

        <div id="service-explorer" className="mt-8 scroll-mt-24 rounded-[2rem] border border-mist/10 bg-navy/50 p-6 sm:p-10 lg:mt-14">
          <p className="eyebrow mb-8">{t.services.explorerEyebrow}</p>
          <AnimatePresence mode="wait" initial={false}>
            <Explorer key={selected} id={selected} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
