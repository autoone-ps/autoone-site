import { clean, guard, isEmail, json, NotConfigured, readBody, recipient, rowsHtml, rowsText, sendMail, type Env } from '../_lib/mail'

const SERVICES: Record<string, string> = {
  call: 'AI Call Center', assistant: 'Personal Assistant', booking: 'Booking & Scheduling', chatbot: 'Chatbot',
  systems: 'Smart Systems', automation: 'Workflow Automation', unsure: 'Not sure yet',
}
const METHODS: Record<string, string> = { email: 'Email', phone: 'Phone call', whatsapp: 'WhatsApp' }

/** POST /api/contact : project request from the website form. */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const blocked = guard(request, env, 'contact')
  if (blocked) return blocked
  const b = await readBody(request)

  // Honeypot: bots fill the hidden field. Pretend success, send nothing.
  if (clean(b.website, 200)) return json({ ok: true })

  const name = clean(b.name, 120)
  const email = clean(b.email, 254)
  const message = clean(b.message, 5000)
  const service = SERVICES[clean(b.service, 40)]
  if (!name || !isEmail(email) || !service || message.length < 20) return json({ ok: false, error: 'invalid_input' }, 400)

  const company = clean(b.company, 160)
  const rows: [string, string][] = [
    ['Name', name], ['Company', company], ['Email', email], ['Phone', clean(b.phone, 40)],
    ['Industry', clean(b.industry, 120)], ['Service needed', service],
    ['Preferred contact', METHODS[clean(b.method, 20)] ?? ''], ['Budget', clean(b.budget, 60)], ['Language', clean(b.lang, 5)],
  ]
  const msg: [string, string] = ['Problem to solve', message]

  try {
    await sendMail(env, {
      to: recipient(env, 'contact'),
      subject: `New project request: ${name}${company ? ` (${company})` : ''}`,
      html: rowsHtml('New project request', rows, msg),
      text: rowsText(rows, msg),
      replyTo: email,
    })
    return json({ ok: true })
  } catch (err) {
    if (err instanceof NotConfigured) return json({ ok: false, error: 'not_configured' }, 503)
    console.error('contact: send failed', err)
    return json({ ok: false, error: 'send_failed' }, 502)
  }
}

export const onRequest: PagesFunction<Env> = async () => json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'POST' })
