# ARCHITECTURE.md

## System Diagram

```mermaid
graph TD
    A[User — Browser] -->|fills form| B[/ Landing Page]
    B -->|POST /api/audit| C[Audit API Route]
    C -->|runAudit| D[Audit Engine\npure TypeScript]
    D -->|AuditSummary| C
    C -->|INSERT| E[(Supabase\naudits table)]
    C -->|returns auditId| B
    B -->|redirect| F[/audit/id Results Page]
    F -->|GET /api/audit/id| E
    F -->|POST /api/summary| G[Summary API Route]
    G -->|generateSummary| H[Gemini API]
    H -->|100-word paragraph| G
    G -->|UPDATE ai_summary| E
    F -->|POST /api/leads| I[Leads API Route]
    I -->|checkRateLimit| E
    I -->|INSERT| J[(Supabase\nleads table)]
    I -->|sendAuditEmail| K[Resend]
    K -->|transactional email| L[User Inbox]
```

## Data Flow

1. User fills the spend input form on /
   Form state saved to localStorage on every keystroke.

2. User clicks "Run My Audit"
   SpendForm.tsx POSTs { tools[], teamSize, useCase } to
   POST /api/audit.

3. API route validates input with Zod schema.
   Runs runAudit() — pure TypeScript, no external calls.
   Inserts result into Supabase audits table.
   Returns { auditId, results, totalMonthlySavings, ... }.

4. Browser redirects to /audit/[auditId].

5. Results page (server component) fetches audit from
   GET /api/audit/[id] — Supabase public read.
   Renders AuditHero, ToolCards, conditional CTAs.

6. AISummary client component mounts, POSTs to
   POST /api/summary with audit data.
   Gemini API generates ~100-word paragraph.
   Summary saved back to Supabase (UPDATE audits SET ai_summary).
   If Gemini fails: templated fallback shown silently.

7. User submits email via LeadCaptureForm.
   POST /api/leads validates input, checks honeypot,
   hashes IP, checks rate limit (3/IP/hour).
   Inserts into leads table (PII isolated from audits table).
   Resend sends transactional email to user.

8. User copies shareable URL.
   Public /audit/[id] URL strips email and company name.
   Open Graph tags enable clean link previews on Twitter/LinkedIn.

## Why This Stack

**Next.js 15 App Router** — Gives server components for fast
initial page load on results page, API routes in the same repo
(no separate backend service), and Vercel deployment with zero
config. App Router's fetch deduplication means generateMetadata
and the page component share one Supabase round-trip.

**TypeScript strict mode** — The audit engine handles money.
Types catch calculation errors at compile time, not in production.

**Tailwind v4** — Utility-first CSS keeps component files
self-contained. No context switching between CSS files and
component logic during rapid development.

**Supabase** — Postgres with RLS in one hosted service. The
leads/audits separation is enforced at the database layer —
not just in application code — which is the right place for
a PII boundary.

**Gemini Flash** — Fast, cheap, free tier sufficient for MVP.
Used only for the non-critical summary paragraph. Fault-tolerant
by design (fallback template).

**Resend** — Transactional email with a developer-friendly API.
Free tier covers MVP volume. One function call in lib/resend.ts.

## What I Would Change at 10,000 Audits/Day

1. **Cache audit results at the CDN layer.**
   /audit/[id] pages are currently server-rendered on every
   request. At scale, completed audits never change — they
   should be statically cached at Vercel's edge after first
   render. Add revalidate: false to the fetch call.

2. **Move Gemini summary generation to a background job.**
   Currently the summary is generated synchronously on page
   load. At 10k audits/day, Gemini API rate limits become a
   bottleneck. Queue summary jobs in Supabase and poll from
   the client instead of blocking page render.

3. **Add a read replica for Supabase.**
   Audit results are read-heavy (every share = one read).
   A Supabase read replica in a closer region reduces p99
   latency for shared audit URLs.

4. **Replace IP hashing with a proper rate limiting service.**
   Current rate limiting queries the leads table directly.
   At scale this is a slow, expensive query on every lead
   submission. Replace with Upstash Redis (already in the
   Eva Bloom stack) for O(1) rate limit checks.