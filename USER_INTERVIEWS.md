# USER_INTERVIEWS.md

## Interview 1 — Swayam, CS Student, Personal Projects

**Date:** May 9, 2026
**Duration:** ~15 minutes (WhatsApp chat)
**Role:** CS Student exploring AI tools for personal and academic use

**Responses:**
> "Yes, I use some AI tools like ChatGPT (free version mostly).
  I'm still exploring others."

> "Right now, ₹0–₹500 per month (since mostly I use free versions
  or trials)."

> "Not fully. Sometimes I feel I'm not using all features properly,
  so value could be better."

> "Yes, that would be very useful. It can help me avoid wasting money
  on subscriptions I don't fully use."

> "Clear data transparency, accurate tracking, privacy protection,
  and simple easy-to-understand reports. If it genuinely saves money,
  I would share it with others."

**Most surprising thing:** Even a user spending ₹0–₹500/month felt
they weren't getting full value. The pain isn't just about how much
you spend — it's about whether you feel the spend is justified.

**What it changed:** Added the "You're spending well" state for
low-spend audits instead of manufacturing fake savings. Users who
are already optimal need honest confirmation, not pressure to switch.

---

## Interview 2 — Shivam, CS Student, Uses Cursor + ChatGPT Plus

**Date:** May 9, 2026
**Duration:** ~15 minutes (WhatsApp chat)
**Role:** CS Student, active user of multiple AI coding tools

**Responses:**
> "Yes I do use ChatGPT Plus and Cursor."

> "Nothing cause I use student discount."

> "Yes I am getting full value of AI."

> "The tool I mostly use is Antigravity AI and Cursor."

> "Claude and Antigravity AI is from reliable source like from
  Anthropic and Google so it's same to tell others to use it too."

**Most surprising thing:** He mentioned Antigravity AI as a primary
tool — not on our supported list. Users are already using tools we
haven't tracked. This signals the tool needs an "other tools" input
field to stay relevant as the AI tool landscape evolves rapidly.

**What it changed:** Added a note in ARCHITECTURE.md about Phase 2
including an "other tools" freeform input with manual spend tracking.
Also reinforced that trust signals (backed by known companies) matter
more than feature lists when users decide to share a tool.

---

## Interview 3 — Yash, CS Student, Uses Cursor + ChatGPT Plus + Claude

**Date:** May 10, 2026
**Duration:** ~15 minutes (WhatsApp chat)
**Role:** CS Student, actively pays for multiple AI tools simultaneously

**Background:** Yash is a CS student using 3 paid AI tools at once —
ChatGPT Plus, Cursor, and Claude. Unusually high tool count for a
student, which made this conversation particularly interesting.

**Responses:**

> "Yes I do use ChatGPT Plus, Cursor, and Claude."

> "Nothing right now because I use student discounts wherever
  available."

> "Yes, I feel I'm getting full value — I use each tool for
  different things. ChatGPT for general queries, Cursor for coding,
  Claude for writing and research."

> "The tools I use most are Antigravity AI, Cursor, and Stitch AI
  for my projects."

> "Claude and Antigravity AI come from reliable sources like
  Anthropic and Google — that's why I'd recommend them to others.
  I trust the backing company more than the tool itself."

**Most surprising thing:** Yash uses 3 paid tools but pays near
zero because of student discounts. When discounts expire after
graduation, he will suddenly face full pricing with no benchmark
for what's reasonable. This is a sleeper segment — students who
will become paying customers within 12 months and have no spending
intuition yet. StackAudit is the right tool to reach them before
that transition.

**What it changed about the design:**

Two things. First, the audit engine now needs to factor in whether
a user is on a discounted plan vs full price — a student on Cursor
Pro at $0 is not "optimal," they're on a time-limited discount.
Added a Phase 2 note to surface expiry warnings for known student
plans.

Second, Yash mentioned Antigravity AI and Stitch AI — neither is
on our supported tool list. This confirms the AI tool landscape is
moving faster than any static list can track. Phase 2 should include
a freeform "other tools" input with manual spend entry so users
aren't blocked if their tool isn't listed.