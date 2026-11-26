/**
 * CENTRAL SITE SETTINGS
 * Edit this file to change contact details everywhere on the site.
 * Leave a value empty ('') until you have the official detail: the site then shows
 * "Coming soon" for it instead of a broken link. Nothing here is invented.
 */
export interface SiteSettings {
  name: string
  email: string
  whatsapp: string
  phone: string
  instagram: string
  linkedin: string
  location: { en: string; ar: string }
  api: { contact: string; support: string }
  maxAttachmentBytes: number
}

export const site: SiteSettings = {
  name: 'Autoone',

  /** Official company email shown on the site. */
  email: 'autoone.ps@gmail.com',

  /** WhatsApp number, digits only with country code (e.g. '970599123456'). Empty = hidden link. */
  whatsapp: '970594079502',
  /** Phone number in international format (e.g. '+970 59 912 3456'). */
  phone: '',
  /** Full URLs, e.g. 'https://instagram.com/yourhandle'. */
  instagram: 'https://instagram.com/auto_.one',
  linkedin: '',
  /** Physical location, per language. */
  location: { en: '', ar: '' },

  /** Serverless endpoints (see /api). Change only if you host the API elsewhere. */
  api: {
    contact: '/api/contact',
    support: '/api/support',
  },

  /** Max support attachment size in bytes (the hosting body limit is ~4.5MB). */
  maxAttachmentBytes: 3 * 1024 * 1024,
}
