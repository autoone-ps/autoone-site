import { clean, guard, isEmail, json, NotConfigured, readBody, recipient, rowsHtml, rowsText, sendMail, type Attachment, type Env } from '../_lib/mail'

const URGENCY: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High', critical: 'CRITICAL' }
const MAX_FILE_BYTES = 3 * 1024 * 1024
const ALLOWED_EXT = /\.(png|jpe?g|webp|gif|pdf|txt|log|csv)$/i

/** POST /api/support : technical support request, optionally with one attachment (JSON, base64). */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const blocked = guard(request, env, 'support')
  if (blocked) return blocked
  const b = await readBody(request)

  if (clean(b.website, 200)) return json({ ok: true })

  const name = clean(b.name, 120)
  const email = clean(b.email, 254)
  const description = clean(b.description, 5000)
  const system = clean(b.system, 120)
  const type = clean(b.type, 120)
  const urgency = URGENCY[clean(b.urgency, 20)]
  if (!name || !isEmail(email) || !system || !type || !urgency || description.length < 20) return json({ ok: false, error: 'invalid_input' }, 400)

  let attachments: Attachment[] | undefined
  const a = b.attachment as { name?: unknown; content?: unknown } | undefined
  if (a && typeof a === 'object') {
    const filename = clean(a.name, 120).replace(/[^\w.\- ]+/g, '_')
    const content = typeof a.content === 'string' ? a.content : ''
    const bytes = Math.floor((content.length * 3) / 4)
    if (!filename || !ALLOWED_EXT.test(filename) || !/^[A-Za-z0-9+/=]+$/.test(content) || bytes > MAX_FILE_BYTES) {
      return json({ ok: false, error: 'invalid_attachment' }, 400)
    }
    attachments = [{ filename, content }]
  }

  const rows: [string, string][] = [
    ['Request', clean(b.requestKind, 80)], ['Urgency', urgency], ['Name', name], ['Company', clean(b.company, 160)], ['Email', email],
    ['System / service', system], ['Problem type', type], ['Attachment', attachments?.[0].filename ?? ''], ['Language', clean(b.lang, 5)],
  ]
  const msg: [string, string] = ['Problem description', description]

  try {
    await sendMail(env, {
      to: recipient(env, 'support'),
      subject: `[Support${urgency === 'CRITICAL' ? ' - CRITICAL' : ''}] ${type}: ${name}`,
      html: rowsHtml('Technical support request', rows, msg),
      text: rowsText(rows, msg),
      replyTo: email,
      attachments,
    })
    return json({ ok: true })
  } catch (err) {
    if (err instanceof NotConfigured) return json({ ok: false, error: 'not_configured' }, 503)
    console.error('support: send failed', err)
    return json({ ok: false, error: 'send_failed' }, 502)
  }
}

export const onRequest: PagesFunction<Env> = async () => json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'POST' })
