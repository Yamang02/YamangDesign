---
name: local-sonarqube-agent-workflow
description: Use when running or interpreting SonarQube analysis against a local server for React/TypeScript and/or Java Spring modules, triaging findings, re-analyzing after fixes, or structuring Sonar-informed code review.
source: vibe_boilerplate@E26
---

# Local SonarQube Agent Workflow

**Default server:** `http://localhost:9000` unless the repo documents another `sonar.host.url`.

**Basis (humans):** `docs/basis/quality/SQ-01-local-sonarqube-workflow.md`

## Preconditions

1. **SonarQube** is running and reachable (browser or `curl` to base URL).
2. **Auth:** If the server requires a token, use `SONAR_TOKEN` (or project-documented env name) — never commit secrets.
3. **Module layout:** Separate `sonar-project.properties` (or Maven `pom.xml` Sonar config) per **frontend** and **backend** tree when the repo is split that way.

## Instructions

### 1. Scope the run

- Identify which module(s) changed: **frontend** (React/TS), **backend** (Spring), or both.
- Read that module’s `sonar-project.properties` (and `pom.xml` for Maven) for `sonar.host.url`, sources, exclusions, coverage paths.

### 2. Produce coverage / build inputs (before Sonar)

| Stack | Typical steps (use the repo’s exact scripts) |
|-------|-----------------------------------------------|
| React / TS | Run unit tests with **coverage** so `lcov.info` (or configured report) exists where `sonar.javascript.lcov.reportPaths` points. |
| Java / Spring | Compile + tests so **JaCoCo XML** (if configured) and `target/classes` exist for `sonar.java.binaries`. |

### 3. Run analysis

- **Frontend:** From the frontend root, run the project’s Sonar scanner (often `sonar-scanner` CLI or `npx` with the same `sonar.host.url` as properties).
- **Backend:** From the backend module, `mvn sonar:sonar` (or documented wrapper) with the same host; pass `-Dsonar.host.url=...` if overriding locally.

Capture **exit code and relevant log lines** as evidence.

### 4. Triage issues

- In Sonar UI or **Web API** (`/api/issues/search`), list open issues for the project/component.
- **First pass:** `BUG` with severity `BLOCKER`, `CRITICAL`, `MAJOR` (per SQ-01-05).
- Record **one-line root cause** per issue (or per cluster of identical issues) **before** editing code (SQ-01-06).

### 5. Fix and re-run

- Apply **minimal diffs**; stack rules: `react-stack` / `typescript-stack` / `spring-boot-stack` / `java-stack` as applicable.
- Re-run step 2–3 until targeted issues are resolved or explicitly accepted (with documented reason).

### 6. Completion and review

- Do not claim “done” without **`evidence-before-completion`**: show fresh test output and Sonar re-analysis evidence.
- For meaningful slices, run **`request-code-review`** including: what Sonar rules were addressed, what remains, and any suppressed warnings (with justification).

### 7. If analysis cannot run

- State **blocked** (server down, token missing, wrong JDK, etc.), list **exact** next step; do not claim quality closure.

## Done when

- Analysis was run (or blockers are stated with evidence), priorities were applied, fixes are verified by **tests + Sonar re-run**, and review guidance was followed for the agreed scope — or the user explicitly stopped at a documented checkpoint.

## Further reading (humans)

- `docs/basis/quality/SQ-01-local-sonarqube-workflow.md`

Aligned with basis as of 2026-03 — SQ-01 local SonarQube workflow (distilled).
