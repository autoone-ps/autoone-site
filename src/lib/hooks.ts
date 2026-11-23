import { useEffect, useState } from 'react'

/** Returns the id of the section currently crossing the middle of the viewport. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')
  const key = ids.join('|')
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    if (!els.length || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return active
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
}

/** Lets any component ask the contact form to preselect a service, then scrolls to it. */
export const PREFILL_EVENT = 'autoone:prefill'
export function prefillContact(service: string) {
  window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: { service } }))
  scrollToId('contact')
}
