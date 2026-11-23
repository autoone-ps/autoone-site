/**
 * Shared helpers for the Cloudflare Pages Functions that send the website's emails.
 * Secrets come ONLY from the project's environment variables (Cloudflare dashboard), never from the browser:
 *   RESEND_API_KEY (secret), MAIL_FROM, CONTACT_TO_EMAIL, SUPPORT_TO_EMAIL (optional), ALLOWED_ORIGIN (optional)
 */
export interface Env {
  RESEND_API_KEY?: string
  MAIL_FROM?: string
  CONTACT_TO_EMAIL?: string
  SUPPORT_TO_EMAIL?: string
  ALLOWED_ORIGIN?: string
}

export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } })

export const esc = (s: unknown): string =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/** Trim, drop control characters and cap the length. */
export const clean = (s: unknown, max: number): string =>
  String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max)

export const isEmail = (s: string) => /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 254

// Best-effort limiter (per running isolate). For strict limits add a Cloudflare rate-limiting rule in the dashboard.
const hits = new Map<string, number[]>()
function limited(key: string, max = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now()
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  list.push(now)
  hits.set(key, list)
  return list.length > max
}

/** Returns an error Response when the request must not continue, otherwise null. */
export function guard(request: Request, env: Env, kind: string): Response | null {
  const allowed = env.ALLOWED_ORIGIN?.trim()
  const origin = request.headers.get('origin')
  if (allowed && origin && origin !== allowed) return json({ ok: false, error: 'forbidden_origin' }, 403)
  const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (limited(`${kind}:${ip}`)) return json({ ok: false, error: 'rate_limited' }, 429)
  return null
}

export async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const b = (await request.json()) as unknown
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export interface Attachment { filename: string; content: string }
export interface Mail { to: string; subject: string; html: string; text: string; replyTo?: string; attachments?: Attachment[] }
export class NotConfigured extends Error {}

/** Sends through the Resend HTTP API. Throws NotConfigured when the variables are missing. */
export async function sendMail(env: Env, m: Mail): Promise<void> {
  const key = env.RESEND_API_KEY?.trim()
  const from = env.MAIL_FROM?.trim()
  if (!key || !from) throw new NotConfigured('RESEND_API_KEY and MAIL_FROM are required')
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from, to: [m.to], subject: m.subject, html: m.html, text: m.text,
      ...(m.replyTo ? { reply_to: m.replyTo } : {}),
      ...(m.attachments?.length ? { attachments: m.attachments } : {}),
    }),
  })
  if (!r.ok) throw new Error(`Resend responded ${r.status}: ${(await r.text()).slice(0, 300)}`)
}

export const recipient = (env: Env, kind: 'contact' | 'support'): string =>
  (kind === 'support' ? env.SUPPORT_TO_EMAIL?.trim() : '') || env.CONTACT_TO_EMAIL?.trim() || 'autoone.ps@gmail.com'

export function rowsHtml(title: string, rows: [string, string][], message: [string, string]): string {
  const tr = rows.filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#5b6b8c;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#020912">${esc(v)}</td></tr>`).join('')
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px"><h2 style="color:#0B5FFF;margin:0 0 16px">${esc(title)}</h2><table style="border-collapse:collapse;font-size:15px">${tr}</table><h3 style="margin:24px 0 8px;color:#031B46">${esc(message[0])}</h3><div style="white-space:pre-wrap;font-size:15px;line-height:1.6;background:#F4F7FF;padding:16px;border-radius:12px;color:#020912">${esc(message[1])}</div></div>`
}

export function rowsText(rows: [string, string][], message: [string, string]): string {
  return `${rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message[0]}:\n${message[1]}\n`
}
