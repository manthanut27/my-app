## Prompt Used in Production (POST /api/summary)
You are a financial advisor specializing in AI tool spend
optimization for software teams.
Write a 100-word personalized audit summary for a {teamSize}-person
team whose primary use case is {useCase}.
Their audit results:
{JSON.stringify(results)}
Total monthly savings identified: ${totalMonthlySavings}
Rules:

Be specific. Use the actual tool names and dollar amounts
from the results.
Do not use bullet points. Plain paragraph only.
End with one clear, specific action they should take first.
If savings are $0, affirm that they are spending well and
suggest they bookmark the tool for when their stack changes.
Tone: direct, financial-advisor style. Not cheerful. Not
salesy. Honest.
Do not mention Credex or any specific vendor by name in a
promotional way.


## Why I Wrote It This Way

**"financial advisor specializing in AI tool spend"** — Role
prompting improves output quality. Without the role, Gemini
defaulted to marketing copy tone ("Great news! You could save...").
With the role, it produces direct, credible analysis.

**"Plain paragraph only, no bullet points"** — First version
returned a bulleted list which broke the UI layout. Explicit
format constraint fixed this.

**"End with one clear, specific action"** — Without this,
summaries ended with vague statements like "consider reviewing
your tools." The constraint forces a concrete recommendation.

**"If savings are $0, affirm..."** — Without this, Gemini
hallucinated savings that didn't exist in zero-savings audits.
Explicit handling of the edge case was necessary.

## What I Tried That Didn't Work

**Attempt 1 — No role, direct instruction:**
"Summarize this AI tool audit in 100 words."
Result: Generic, no specific numbers used, ignored the
results JSON entirely. Useless.

**Attempt 2 — Too much context:**
Included full pricing data in the prompt.
Result: Summary became a pricing comparison essay.
Token cost was 4x higher with no quality improvement.

**Attempt 3 — Asked for 3 recommendations:**
Result: Always returned bullet points regardless of the
"no bullets" instruction. Removing the "3 recommendations"
ask and replacing with "one clear action" fixed compliance.

## Fallback Template (used when Gemini API fails)
Your team of {teamSize} is currently spending on {toolCount} AI
tools for {useCase} work. Our audit identified
${totalMonthlySavings}/month in potential savings across your
stack. The biggest opportunity is {topToolName}, where adjusting
your plan could save you ${topSavings}/month. Start there —
it takes under 5 minutes to downgrade or switch, and the
savings compound annually to ${annualSavings}.

This fallback is shown silently — no error message is shown
to the user. The fallback covers the same key data points
(team size, use case, top saving, annual figure) without
requiring a live API call.

## Model Used
- Primary: gemini-1.5-flash via @google/generative-ai SDK
- Chosen for: low latency (~400ms), free tier generous enough
  for MVP, sufficient quality for 100-word summaries
- Not used: gemini-1.5-pro (slower, more expensive, overkill
  for 100-word summaries)