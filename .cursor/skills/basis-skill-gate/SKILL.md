---
name: basis-skill-gate
description: Use at the start of every user turn when any project skill might apply — enforces loading a skill before responding or acting, skill priority, and anti-rationalization checks. Distilled from WF-01.
source: vibe_boilerplate@E26
---

# Basis Skill Gate

Apply this skill **before** any reply, tool use, or exploration when there is **any chance** (even ~1%) that another skill in this repository applies. Questions and “quick lookups” are still work; the gate still applies.

## Instructions

1. **Gate first**  
   If a relevant skill might exist for the user’s message, **invoke or load that skill** (use the host’s skill mechanism) before producing any assistant content, including clarifying questions or file reads.

2. **No response before load**  
   Do not answer, explain, ask, grep, or read files until the applicable skill path is resolved — unless you are certain **no** skill applies (see step 6).

3. **Host-specific loading**  
   Follow how your environment loads skills (e.g. Skill tool). Do not substitute reading arbitrary files for loading the skill when a skill loader exists.

4. **Priority when multiple skills apply**  
   Apply in this order:  
   - **Process skills first** (e.g. design/brainstorm, debugging, epic lifecycle) — they fix *how* to approach the task.  
   - **Implementation / stack skills second** — they fix *how* to execute in a stack.  
   If the user **explicitly names** a skill, prefer that skill’s procedure (still satisfy the gate by having loaded something).

5. **Rigid vs flexible**  
   If a skill says it is **Rigid** (e.g. TDD, debugging discipline), follow it exactly; do not soften. If **Flexible**, adapt principles to context. If unstated, treat as Rigid until verified.

6. **When no skill applies**  
   Only skip loading when you are **sure** no skill in `.cursor/skills/` could apply. If unsure, load the closest match first.

7. **User says WHAT, skill says HOW**  
   If the user only states goals/outcomes, derive procedure from the loaded skill, not ad-hoc habit.

8. **After load**  
   Optionally announce: `Using [skill-name] for [purpose]`. If the skill has a checklist, create todos for each item when appropriate, then follow the skill.

## Red flags (stop — you are rationalizing)

If you think any of these, return to step 1:

| Thought | Reality |
|--------|---------|
| This is just a simple question | Questions are tasks; skills may still apply. |
| I need context before checking skills | Gate comes before gathering context. |
| I’ll explore the repo first | Skills often define how to explore. |
| This doesn’t need a skill | If one exists, use it. |
| I remember this skill | Skills change; load current content. |
| I’ll do one small thing first | Gate before action. |

## Done when

- You have either loaded every skill that plausibly applies and followed their ordering, or you have a defensible reason that **no** skill applies.  
- You have not violated “no response before load” for cases where a skill applies.

Aligned with basis as of 2026-03 — WF-01 Agent Skill Gate Workflow (conceptual distill; no per-step doc dependency).
