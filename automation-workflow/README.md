# Automation Workflow: Case-Study Summary Pipeline

## Purpose

This workflow turns rough project notes into a credible, recruiter-facing portfolio case-study summary without inventing facts. It is designed as a transparent, reusable Claude Project-style process that can be run on a brand-new project input and then reviewed by a human before publishing.

## How to run it on a new input

1. Prepare a new input using the template below.
2. Run the prompts in order from the prompts folder:
   - gather
   - synthesize
   - draft
   - critique
   - revise-format
3. Keep the handoff structure intact between stages so each step builds from the previous one.
4. Review the final output and the factual-confidence checklist before publishing.

## Exact input template

```md
Project name:
Source notes:
Verified facts already available:
Links or references:
Audience:
Constraints:
Missing information:
```

## Expected output structure

```md
# Case-Study Summary
## Project
## Problem
## Contribution
## Technical decisions
## Challenge
## Outcome
## Factual confidence checklist
```

## Guardrails

- Use only supplied facts and clearly marked repository evidence.
- If evidence is weak or missing, write "Needs confirmation" instead of guessing.
- Do not invent metrics, achievements, dates, results, or client outcomes.
- Keep language direct, recruiter-facing, and concise.
