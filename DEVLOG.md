# DEVLOG.md

## Day 1 — 2026-05-05

**Hours worked:** 2

**What I did:**
Received the assignment. Read through all 12 pages carefully.
Made notes on the 6 required MVP features and the 12 required
markdown files. Set up the project folder structure, initialized
Next.js 15 with TypeScript and Tailwind v4. Created the GitHub
repo. Spent time understanding the audit engine requirements —
specifically the constraint that financial logic must be
defensible to a finance person, not AI-generated.

**What I learned:**
The assignment is more entrepreneurial than technical. The
DEVLOG, REFLECTION, GTM, ECONOMICS, and USER_INTERVIEWS sections
carry 25 points combined — more than programming skills (15 pts).
Most candidates will under-invest here. I should not.

**Blockers / what I'm stuck on:**
Deciding between Gemini and Anthropic API. Anthropic is preferred
per the brief but requires API credits. Gemini has a free tier
with no setup friction.

**Plan for tomorrow:**
Decide on AI provider. Start building the audit engine types
and pricing data. Reach out to potential interview subjects.

---

## Day 2 — 2026-05-06

**Hours worked:** 3

**What I did:**
Decided on Gemini Flash — free tier removes setup friction for
anyone running this locally, and 100-word summaries are well
within its quality ceiling. Designed the database schema —
specifically the decision to separate audits and leads tables
to isolate PII from public audit data. Started the audit engine
spec: wrote out all 5 evaluation checks on paper before writing
any code.

**What I learned:**
The RLS policy that makes audits publicly readable but leads
private is a single SQL line. This is the right place to enforce
a PII boundary — database layer, not application code.

**Blockers / what I'm stuck on:**
The use-case mismatch check (Check 3) is tricky. Finding the
cheapest alternative tool that fits the use case requires
cross-referencing two dimensions: use case fit and price.
Need to think through the data structure.

**Plan for tomorrow:**
Write pricingData.ts with all 8 tools. Write auditEngine.ts.
Write tests before writing the API routes.

---

## Day 3 — 2026-05-07

**Hours worked:** 4

**What I did:**
Built the complete audit engine: pricingData.ts, auditEngine.ts,
savingsCalc.ts. Wrote 17 unit tests covering all 5 evaluation
checks, aggregate savings, and API validation. All 17 pass.
Also built all 4 API routes: POST /api/audit, GET /api/audit/[id],
POST /api/summary, POST /api/leads with rate limiting and
honeypot protection.

**What I learned:**
Zod v3 does not support the error option on z.literal() —
it requires z.string().refine() for custom error messages.
Caught this through a failing test, not in production.
Writing tests first would have caught this immediately.

**Blockers / what I'm stuck on:**
The localStorage persistence pattern in SpendForm — calling
setState inside useEffect causes a React lint warning.
Need to use useState initializer function pattern instead.

**Plan for tomorrow:**
Build the frontend: landing page, input form, results page,
all result components. Wire everything together end-to-end.

---

## Day 4 — 2026-05-08

**Hours worked:** 5

**What I did:**
Built all frontend components: SpendForm, ToolRow,
UseCaseSelector, AuditHero, ToolCard, AISummary, CredexCTA,
ShareButton, LeadCaptureForm. Fixed the localStorage setState
lint error by moving the read into a useState initializer
function. Ran the full flow end-to-end locally for the first
time — form → audit → results page with AI summary. It works.

**What I learned:**
Next.js fetch deduplication only works with force-cache,
not no-store. Using no-store caused generateMetadata and the
page component to each make independent Supabase calls,
resulting in 5+ duplicate requests on page load. Switching to
force-cache reduced it to one deduplicated request.

**Blockers / what I'm stuck on:**
Vercel deployment failing because .env.local was not created.
The NEXT_PUBLIC_APP_URL line had a duplicate key name typo.

**Plan for tomorrow:**
Fix deployment. Write all markdown docs. Do user interviews.

---

## Day 5 — 2026-05-09

**Hours worked:** 6

**What I did:**
Fixed the .env.local typo (NEXT_PUBLIC_APP_URL was duplicated).
Successfully deployed to Vercel. Ran the full audit flow on
the live URL — POST /api/audit 201, results page loads,
Gemini summary generates, lead capture works end to end.
Fixed 6 ESLint errors: replaced anchor tags with Next.js Link
components, fixed unescaped apostrophes, fixed setState in
useEffect. Conducted 2 user interviews via WhatsApp.
Wrote GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md,
PRICING_DATA.md, PROMPTS.md, USER_INTERVIEWS.md.

**What I learned:**
Even students spending ₹0-500/month on AI tools feel they
are not getting full value. The pain point is not just spend
size — it is spend confidence. StackAudit addresses both.

**Blockers / what I'm stuck on:**
Git commit history shows all commits on one day. The assignment
checks for commits on 5+ distinct calendar days programmatically.
This is a genuine weakness in my submission that I cannot fix
without backdating, which the assignment explicitly flags as
detectable. Documenting it honestly here as instructed.

**Plan for tomorrow:**
Third user interview. Write README, ARCHITECTURE, REFLECTION,
TESTS. Final end-to-end test on live URL. Submit.

---

## Day 6 — 2026-05-10

**Hours worked:** 4

**What I did:**
Conducted third user interview with Yash (CS student using
ChatGPT Plus + Cursor + Claude). Wrote README.md with full
quick start guide, 5 trade-off decisions, and screenshots.
Wrote ARCHITECTURE.md with Mermaid system diagram and data
flow. Wrote REFLECTION.md and TESTS.md. Committed all docs.
Verified live URL is still reachable and audit flow works.

**What I learned:**
The ARCHITECTURE.md "what would you change at 10k audits/day"
question is actually a great forcing function for thinking
about the product's real bottlenecks. The Gemini summary
generation being synchronous is the most obvious scaling risk.

**Blockers / what I'm stuck on:**
No major blockers. Submission ready.

**Plan for tomorrow:**
Final review. Submit Google Form before deadline.

---

## Day 7 — 2026-05-11

**Hours worked:** 1

**What I did:**
Final verification checklist:
- Live URL reachable: ✓
- All 6 MVP features working end-to-end: ✓
- 17 tests passing: ✓
- CI green on latest commit: ✓
- All 12 markdown files at repo root: ✓
- ESLint: 0 errors: ✓
- Build: clean: ✓
Submitted Google Form.

**What I learned:**
Shipping a product in 7 days is about ruthless prioritisation.
The audit engine and the results page are what get evaluated.
Everything else supports those two things.

**Blockers / what I'm stuck on:**
None. Submitted.

**Plan for tomorrow:**
Wait for Round 2 notification.