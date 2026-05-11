# TESTS.md

## Test Framework
Vitest v2.1.9

## How to Run All Tests
```bash
npm run test
```

Expected output: 3 test files, 17 tests, all passing.

---

## Test Files

### tests/audit/auditEngine.test.ts
**What it covers:** Core audit engine logic — all 5 evaluation
checks and aggregate summary computation.

| Test | What it verifies |
|------|-----------------|
| Test 1 | Plan-seat mismatch triggers downgrade. Cursor business at 2 seats → recommendedAction = 'downgrade', savings = $40 |
| Test 2 | Optimal plan returns 'optimal'. Cursor pro at 1 seat, coding → savings = $0 |
| Test 3 | Use-case mismatch triggers switch. Cursor pro for writing use case → recommendedAction = 'switch', alternativeTool not null |
| Test 4 | Aggregate savings = sum of per-tool savings. Two tools with known savings → totalMonthlySavings and totalAnnualSavings verified |
| Test 5 | showCredexCTA true when savings > $500. Cursor pro at $600/mo spend vs $20 official → Check 2 fires, savings = $580, showCredexCTA = true |
| Test 6 | showNotifyMe true when savings < $100. All optimal tools → showNotifyMe = true, totalMonthlySavings = 0 |
| Test 7 | Overpay detection. GitHub Copilot individual at $15 vs $10 official → reason contains 'above the listed price' |

### tests/audit/savingsCalc.test.ts
**What it covers:** Aggregate savings calculation correctness
and numeric precision.

| Test | What it verifies |
|------|-----------------|
| Test 1 | Annual savings = monthly * 12 |
| Test 2 | Values rounded to 2 decimal places |
| Test 3 | showCredexCTA threshold: true when > 500, false when = 500 |
| Test 4 | showNotifyMe threshold: true when < 100, false when = 100 |
| Test 5 | isOptimal true only when all results are 'optimal' |
| Test 6 | Zero savings case handled correctly |

### tests/api/leads.test.ts
**What it covers:** Lead input validation via Zod schema —
honeypot protection and email format validation.

| Test | What it verifies |
|------|-----------------|
| Test 1 | Honeypot non-empty returns validation error with message 'Honeypot triggered' |
| Test 2 | Invalid email format returns validation error |
| Test 3 | Valid input with optional fields passes schema |
| Test 4 | Missing required email field returns validation error |

---

## CI
Tests run automatically on every push to main via
.github/workflows/ci.yml.

Check CI status at:
https://github.com/manthanut27/my-app/actions