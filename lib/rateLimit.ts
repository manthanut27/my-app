import { createServerClient } from './supabase/server'

/**
 * IP-based rate limiter using the leads table.
 * Returns false (blocked) if the hashed IP has ≥3 submissions in the last hour.
 *
 * @param ipHash - SHA-256 hash of the requester's IP (not stored raw)
 * @returns true if request is allowed, false if rate limit exceeded
 */
export async function checkRateLimit(ipHash: string): Promise<boolean> {
  try {
    const supabase = createServerClient()
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', oneHourAgo)

    if (error) {
      // On DB error, allow the request (fail open — don't block legitimate users)
      console.error('Rate limit check error:', error)
      return true
    }

    return (count ?? 0) < 3
  } catch {
    // Fail open on unexpected errors
    return true
  }
}
