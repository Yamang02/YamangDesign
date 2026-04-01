---
name: security-review
description: Use after a meaningful slice of work or before merge — performs a security-focused review of the diff against SC-01 through SC-05 rules. Pairs with request-code-review as a security-specific pass.
source: vibe_boilerplate@E26
---

# Security Review

A **security-focused** code review pass. Run this after `request-code-review` (functional correctness) or as a standalone security gate before merge. This skill checks the diff against all SC basis rules systematically.

## When

- After `request-code-review` completes — as an additional security pass
- Before merging to shared mainline when the change touches:
  - API endpoints, input handling, or authentication
  - Data persistence, logging, or error responses
  - Secrets, configuration, or dependencies
- When a `security-threat-assessment` produced requirements — verify they are implemented

## Instructions

### 1. Scope the review

Identify what changed:

```
git diff [base]...HEAD --stat
```

Categorize changed files into security-relevant areas:

| Area | File patterns | SC focus |
|------|--------------|----------|
| API layer | controllers, handlers, routes, middleware | SC-01, SC-02, SC-04 |
| Data layer | repositories, queries, migrations, models | SC-01-02, SC-03 |
| Auth | security config, auth services, token handling | SC-02 |
| Config | env files, docker, CI/CD, server config | SC-03-02, SC-04-04 |
| Dependencies | package.json, pom.xml, lock files | SC-05 |
| Logging | log statements, error handlers | SC-03-03, SC-04-03 |

If no files fall into these areas, the change is low security risk — note this and exit.

### 2. Run automated checks first

Before manual review, run available automated tools:

| Check | Tool/Command | What it catches |
|-------|-------------|-----------------|
| Hardcoded secrets | git-secrets, detect-secrets, Sonar S6418 | SC-03-02 |
| SQL injection patterns | SonarQube S2077, S3649 | SC-01-02 |
| Known CVEs | npm audit / OWASP Dependency-Check / Trivy | SC-05-01 |
| Security headers | Response header inspection | SC-04-04 |

Record results. Fix any findings before proceeding to manual review.

### 3. Manual review by SC area

Walk through each applicable area. For each finding, classify severity.

#### 3a. Input & Injection (SC-01)

- [ ] Every external input is validated at the system boundary before reaching domain logic
- [ ] All queries/commands use parameterization — no string concatenation
- [ ] Output encoding matches the rendering context (HTML, URL, JS)
- [ ] Validation uses allowlist approach where applicable
- [ ] File uploads (if any) have multi-layer validation (extension, MIME, size, magic bytes)

#### 3b. Authentication & Authorization (SC-02)

- [ ] New endpoints default to requiring authentication
- [ ] Authorization is checked server-side, not just UI-hidden
- [ ] Auth failure responses are generic — no user enumeration
- [ ] Password handling uses adaptive one-way hash
- [ ] Tokens/sessions have expiry and logout invalidation

#### 3c. Data Protection (SC-03)

- [ ] No secrets committed to source or config files
- [ ] Logs and error responses are free of passwords, tokens, PII
- [ ] Sensitive data is classified and protected per its level
- [ ] External communication uses TLS

#### 3d. API Security (SC-04)

- [ ] CORS specifies explicit origins, no wildcard with credentials
- [ ] Rate limiting is present on public and auth endpoints
- [ ] Error responses follow standard format — no stack traces or internal paths
- [ ] Security headers are configured

#### 3e. Dependencies (SC-05)

- [ ] New dependencies have no known HIGH/CRITICAL CVEs
- [ ] Lock file is updated and committed
- [ ] New dependencies are justified and actively maintained
- [ ] Security functions use established libraries, not custom implementations

### 4. Produce review report

```
## Security Review — [feature/branch name]

### Scope
[Files reviewed, areas covered]

### Automated scan results
[Tool findings — resolved / outstanding]

### Manual findings

#### Critical (blocks merge)
- [finding]: [SC rule violated] — [remediation]

#### Important (fix before merge unless waived)
- [finding]: [SC rule violated] — [remediation]

#### Observations (non-blocking)
- [finding]: [suggestion]

### Verdict: block / proceed with fixes / proceed
```

### 5. Verify threat assessment coverage

If a `security-threat-assessment` was done for this feature:

- [ ] Every security requirement from the assessment has a corresponding implementation
- [ ] No requirement was silently dropped — any scope change is documented

## Severity classification

| Severity | Criteria | Examples |
|----------|----------|---------|
| **Critical** | Exploitable vulnerability, data exposure, auth bypass | SQL injection, hardcoded secret, missing auth on endpoint |
| **Important** | Weakened security posture, missing defense layer | Missing rate limit, CORS wildcard, PII in logs |
| **Observation** | Improvement opportunity, defense-in-depth | Could add CSP nonce, consider stricter validation |

## Done when

- All security-relevant files in the diff have been reviewed.
- Automated scans have been run and findings addressed.
- Manual checklist for each applicable SC area is completed.
- Review report is produced with classified findings.
- Critical findings are resolved before merge proceeds.
- If threat assessment exists, all requirements are verified as implemented.

## Further reading (humans)

- `docs/basis/security/SC-01-input-validation-and-injection-prevention.md`
- `docs/basis/security/SC-02-authentication-and-authorization.md`
- `docs/basis/security/SC-03-data-protection.md`
- `docs/basis/security/SC-04-api-security.md`
- `docs/basis/security/SC-05-dependency-security.md`

Aligned with basis as of 2026-03 — SC-01 through SC-05 (distilled).
