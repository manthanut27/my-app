# METRICS.md

## North Star Metric

**Audits completed per week.**

Not "users signed up." Not "page views." Not "emails captured."

An audit completed means a user entered their real stack,
ran the engine, and saw their results. That is the moment
value is delivered. Everything else — email capture, Credex
CTA clicks, consultation bookings — flows from that moment.

If audits/week is growing, the product is working.
If audits/week is flat or declining, nothing else matters.

## 3 Input Metrics That Drive the North Star

**1. Landing page → audit start rate**
What % of visitors who land on / actually add at least one
tool and click "Run My Audit."
Target: ≥35%
If below 20%: the hero copy or form UX is failing.
Instrument: track "audit_started" event on form submit click.

**2. Audit start → audit completed rate**
What % of users who start filling the form actually submit.
Target: ≥70%
If below 50%: the form is too long, confusing, or slow.
Instrument: track "audit_completed" event on 201 response
from POST /api/audit.

**3. Audit completed → email captured rate**
What % of users who see their results submit their email.
Target: ≥25%
This is high because value is shown before the ask.
If below 15%: the results page isn't showing enough value,
or the email form placement is wrong.
Instrument: track "lead_captured" event on 201 response
from POST /api/leads.

## What to Instrument First

In order of priority:

1. `audit_started` — user clicks "Run My Audit"
2. `audit_completed` — POST /api/audit returns 201
3. `lead_captured` — POST /api/leads returns 201
4. `credex_cta_shown` — results page renders with >$500 savings
5. `credex_cta_clicked` — user clicks "Finance with Credex"
6. `share_copied` — user clicks "Copy Link"
7. `audit_url_visited` — someone opens a shared audit URL
   (viral coefficient measurement)

Use a simple event table in Supabase or a free PostHog instance.
Do not use Google Analytics — it's overkill for this stage and
adds Lighthouse performance overhead.

## What Number Triggers a Pivot Decision

If after 500 audits completed:
- Email capture rate < 10%: pivot the results page design —
  the value isn't landing, not a distribution problem.
- Credex CTA click rate < 2% among high-savings audits:
  the Credex proposition isn't resonating — test different
  copy or lower the $500 threshold to $200.
- Audit start rate < 15%: the landing page is broken —
  A/B test the headline immediately.
- 0 consultation bookings after 50 Credex CTA clicks:
  the Credex landing page (not StackAudit) is the bottleneck.

**The pivot number: if audit completed → Credex consultation
rate is below 1% after 1,000 audits, the lead quality
assumption is wrong and the targeting needs to shift from
individual developers to team leads and EMs only.**