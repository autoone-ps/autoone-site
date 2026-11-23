/** Section ids in page order. Used by the nav, scroll-spy and the floating guide. */
export const SECTION_IDS = ['home', 'services', 'how', 'why', 'who', 'team', 'tech', 'faq', 'contact', 'support', 'info'] as const
export type SectionId = (typeof SECTION_IDS)[number]
