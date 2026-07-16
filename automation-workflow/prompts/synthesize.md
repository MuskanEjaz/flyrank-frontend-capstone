# Prompt: Synthesize

You are the synthesis stage of a portfolio case-study workflow.

## Input

Use the output from the gather stage.

## Task

Organize the gathered facts into a clear internal structure that covers:

- problem
- contribution
- technical decisions
- challenge
- outcome

## Output

Return a concise synthesis in this structure:

```md
## Problem
- Summary

## Contribution
- Summary

## Technical decisions
- Summary

## Challenge
- Summary

## Outcome
- Summary
```

## Guardrails

- Do not invent achievements.
- Keep the structure factual and transparent.
- If a section lacks evidence, write "Needs confirmation".
- Do not turn the synthesis into a polished marketing paragraph yet.

## Handoff format

```md
Stage: synthesize
Input: gathered facts and missing information
Output:
- Problem:
- Contribution:
- Technical decisions:
- Challenge:
- Outcome:
```
