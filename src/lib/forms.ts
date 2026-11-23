import { useCallback, useRef, useState } from 'react'

export type Status = 'idle' | 'loading' | 'success' | 'error'
export type SubmitError = 'network' | 'server' | 'notConfigured' | 'rate'

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
export const isPhone = (v: string) => /^[+()\d\s-]{6,20}$/.test(v.trim())

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result ?? '')
      resolve(result.slice(result.indexOf(',') + 1))
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/** Sends JSON to one of the /api routes. Locks while a request is in flight to prevent duplicate submissions. */
export function useSubmit(endpoint: string) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<SubmitError | null>(null)
  const busy = useRef(false)

  const send = useCallback(
    async (payload: Record<string, unknown>) => {
      if (busy.current) return false
      busy.current = true
      setStatus('loading')
      setError(null)
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          setStatus('success')
          return true
        }
        setError(res.status === 503 ? 'notConfigured' : res.status === 429 ? 'rate' : 'server')
      } catch {
        setError('network')
      }
      busy.current = false // failed: allow a retry. After success the lock stays until reset().
      setStatus('error')
      return false
    },
    [endpoint],
  )

  const reset = useCallback(() => {
    busy.current = false
    setStatus('idle')
    setError(null)
  }, [])

  return { status, error, send, reset }
}
