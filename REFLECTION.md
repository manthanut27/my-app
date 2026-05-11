# REFLECTION.md

## 1. The Hardest Bug — Supabase Environment Variables

The hardest bug took 3 hours to diagnose and was embarrassingly
simple in the end.

After deploying to Vercel and setting up the .env.local file
locally, POST /api/audit kept returning 500 with "Missing
NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY." The
terminal showed the .env.local file existed and the server
showed "- Environments: .env.local" on startup.

My first hypothesis was that the Supabase client code was
reading the wrong environment variable names. I checked
lib/supabase/server.ts — the variable names matched exactly.

Second hypothesis: the file was being read but the values
were empty. I added a debug console.log to the API route:

  console.log('ENV CHECK:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? 'EXISTS' : 'MISSING',
  })

Output: { url: undefined, serviceKey: 'MISSING' }

This ruled out the Supabase client. The variables simply were
not reaching the process. Third hypothesis: the .env.local file
was in the wrong directory. I ran `dir /a .env.local` — the
file did not exist at my-app/.env.local. It was at
StackAudit/.env.local — the parent folder.

Moved the file into my-app/, restarted the dev server, and the
ENV CHECK immediately showed the correct values. The bug was
a directory mistake, not a code problem.

What I learned: when environment variables are undefined in
Next.js, the first thing to check is the file location relative
to the package.json. Next.js reads .env.local from the directory
where you run `npm run dev`, not from the project root.

---

## 2. A Decision I Reversed Mid-Week

I originally planned to use the Anthropic API for the AI
summary feature, as the assignment preferred it. I had
started writing lib/anthropic.ts with the claude-3-haiku
model for cost efficiency.

I reversed this on Day 2 when I realised the API key
requirement would create friction for anyone trying to run
the project locally. The assignment is evaluated by people
who will clone the repo and run it. An Anthropic API key
requires a paid account or applying for free credits — a
process that takes time.

Gemini API has a free tier with no credit card required and
a key available instantly at aistudio.google.com. Since the
summary is a non-critical cosmetic feature with a hardcoded
fallback, the quality difference between Haiku and Gemini Flash
does not justify the setup friction difference.

I documented this decision in ARCHITECTURE.md and in the
PROMPTS.md file explaining why Gemini was chosen.

The lesson: when choosing between two technically equivalent
options, optimise for the person who has to run your code cold,
not for your own development convenience.

---

## 3. What I Would Build in Week 2

The single highest-value addition for week 2 would be a
**benchmark mode**: "Your AI spend per developer is $X —
companies your size average $Y."

Here is why. The current audit tells you whether you are on
the wrong plan or could switch to a cheaper tool. That is
useful but reactive — it assumes the user already has a
reference point for what "normal" AI spending looks like.

Most small teams do not. They do not know if $40/developer/month
is high or low. Benchmark mode answers that question without
the user needing to ask it. It also creates a shareable stat —
"our team is in the top 20% for AI spend efficiency" is something
a CTO will screenshot and post on LinkedIn, which is free
distribution.

Implementation: store anonymised aggregate data in a
benchmarks table keyed by team_size bucket and use_case.
After each audit, update the running average. Surface the
percentile on the results page next to the savings hero.

Secondary addition: PDF export. The shareable URL is good
for internal sharing but a PDF is what people attach to a
Slack message or send to a CFO. One page, savings hero at
the top, tool breakdown below, Credex CTA at the bottom.

---

## 4. How I Used AI Tools

I used Claude (claude.ai) as my primary development assistant
throughout this project.

**What I used it for:**
- Generating the initial scaffold prompt for Antigravity
  (the AI coding agent I used to write the boilerplate)
- Debugging the Supabase environment variable issue
- Writing all 12 markdown documentation files
- Reviewing audit engine logic for correctness
- Drafting the Gemini prompt and iterating on it

**What I did not trust AI with:**
- The audit engine pricing data. I verified every price
  manually against the vendor pricing page before using it.
  AI tools have a knowledge cutoff and pricing changes
  frequently. Every number in PRICING_DATA.md was checked
  by hand.
- The user interview content. The conversations with Swayam,
  Shivam, and Yash happened over WhatsApp. I wrote those
  notes myself.
- The final REFLECTION.md answers. These are my own words.

**One specific time the AI was wrong:**
When asking Claude to help generate the Test 5 input for
the audit engine (the test that checks showCredexCTA when
savings > $500), the suggested input used windsurf team plan
with 15 seats expecting $300 savings. The audit engine's
Check 1 only fires when seats < 3, so at 15 seats windsurf
team was not flagged for downgrade and the actual savings
came to $435, not $735 as predicted. I caught this because
the test failed and I read the engine logic myself to
understand why. The fix was to use an overpay scenario
(cursor pro at $600/month vs $20 official) which reliably
produces $580 in savings via Check 2.

---

## 5. Self-Rating

**Discipline: 5/10**
All commits landed on a single day. The assignment checks for
commits on 5+ distinct calendar days programmatically. I built
the project intensively over a short window rather than
spreading work across the full 7 days. This is a genuine
weakness and I am documenting it honestly rather than
attempting to fake the history.

**Code quality: 7/10**
The audit engine is clean, typed, and tested. API routes
handle errors correctly. The frontend components are
reasonably well structured. Deductions for: the localStorage
setState lint issue that required a fix, and some components
that are longer than they should be and could benefit from
further decomposition.

**Design sense: 7/10**
The dark, data-forward aesthetic is intentional and executed
consistently. The #00FF88 accent on savings numbers works well.
The tool card layout is readable. Deductions for: mobile
responsiveness was not fully tested on a real device, and the
landing page hero could be more distinctive.

**Problem solving: 8/10**
I correctly identified that the audit engine should be pure
TypeScript with no AI, that PII should be isolated at the
database layer not application code, and that email capture
should come after value delivery. These are the right answers
and I arrived at them by thinking about the product, not
following a template.

**Entrepreneurial thinking: 7/10**
The GTM, ECONOMICS, and METRICS documents show genuine thought
about distribution, unit economics, and measurement. The user
interviews surfaced a real insight (spend confidence, not just
spend size, is the pain). Deductions for: not having done the
interviews earlier in the week when they could have influenced
design decisions more materially.