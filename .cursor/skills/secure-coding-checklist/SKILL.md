---
name: secure-coding-checklist
description: Use during implementation when writing or modifying code that handles user input, API endpoints, authentication, data persistence, secrets, or dependency additions. Enforces SC basis rules as coding-time checks.
source: vibe_boilerplate@E26
---

# Secure Coding Checklist

Apply security rules **while writing code**, not after. This skill provides concrete checks organized by what you are implementing. Pick the relevant section(s) — you do not need to run all sections every time.

## When

- Writing or modifying API endpoint handlers
- Implementing input handling or form processing
- Writing database queries or data access code
- Handling authentication, authorization, or session logic
- Adding secrets, API keys, or configuration values
- Adding a new dependency to the project
- Implementing file upload handling

## Instructions

### Section A: Input & Output (SC-01)

Apply when code **receives external input** or **renders output**.

| # | Check | Action if missing |
|---|-------|-------------------|
| A1 | Input validated at system boundary (controller/handler) before reaching domain | Add validation at entry point — type, format, length, range |
| A2 | Validation uses allowlist (accepted values/patterns), not blocklist | Rewrite to define what IS allowed, not what is blocked |
| A3 | Queries use parameterized statements, not string concatenation | Replace concatenation with prepared statement / query builder |
| A4 | Output is encoded for its context (HTML → htmlEncode, URL → urlEncode) | Add context-appropriate encoding at render point |
| A5 | Framework auto-encoding is not bypassed (no dangerouslySetInnerHTML, th:utext, v-html without sanitization) | Remove bypass or add explicit sanitizer |
| A6 | Free text input has length limits | Add maxLength constraint |

### Section B: Authentication & Authorization (SC-02)

Apply when code **controls access** to endpoints or resources.

| # | Check | Action if missing |
|---|-------|-------------------|
| B1 | Endpoint requires authentication by default; public access is explicitly listed | Add auth requirement; move to public allowlist only if intentional |
| B2 | Authorization is enforced on the server, not just hidden in UI | Add server-side permission/role check |
| B3 | Password stored with adaptive one-way hash (bcrypt, argon2, scrypt) | Replace any plaintext/reversible storage with hash function |
| B4 | Auth failure response does not distinguish "user not found" from "wrong password" | Unify to single generic failure message |
| B5 | Session/token has expiry and is invalidated on logout | Add expiry check; add logout invalidation |
| B6 | Permission check uses least-privilege — only the permissions needed for this action | Remove excessive role grants; scope to required permission |

### Section C: Data Protection (SC-03)

Apply when code **stores, logs, or transmits** data.

| # | Check | Action if missing |
|---|-------|-------------------|
| C1 | No secrets (passwords, API keys, tokens) hardcoded in source or config files | Move to environment variable; add to .gitignore |
| C2 | Logs do not contain passwords, tokens, PII, or full request bodies | Replace with non-sensitive identifiers (userId, requestId) |
| C3 | Error responses do not expose stack traces, internal paths, or DB details | Return generic message + requestId; log details server-side only |
| C4 | Data transmitted over TLS/HTTPS; no plaintext HTTP for external calls | Switch to HTTPS; enable TLS verification |
| C5 | Sensitive fields (HIGH classification) are encrypted at rest or hashed | Add encryption/hashing for HIGH fields |

### Section D: API Infrastructure (SC-04)

Apply when code **configures or exposes** API endpoints.

| # | Check | Action if missing |
|---|-------|-------------------|
| D1 | CORS allows specific origins, not wildcard `*` | List explicit allowed origins |
| D2 | Rate limiting is applied, stricter on auth endpoints | Add rate limiter middleware/filter |
| D3 | Security headers are set (CSP, X-Frame-Options, HSTS, X-Content-Type-Options) | Add headers via middleware or server config |
| D4 | API error responses follow a standard format with no internal details | Implement global error handler with standard response shape |

### Section E: Dependencies (SC-05)

Apply when **adding or updating** a dependency.

| # | Check | Action if missing |
|---|-------|-------------------|
| E1 | No known HIGH/CRITICAL CVEs in the package or its transitive deps | Run SCA scan; upgrade or find alternative |
| E2 | Package is actively maintained (release within last year) | Evaluate alternatives or plan for self-maintenance |
| E3 | Lock file is committed and CI installs from lock file | Add lock file to git; use `npm ci` / equivalent in CI |
| E4 | The dependency is actually needed — not duplicating existing capability | Remove if unnecessary; check if simpler implementation exists |
| E5 | Security functions (crypto, auth) use established libraries, not custom code | Replace custom crypto/auth with proven library |

### Section F: File Upload (SC-01-06)

Apply when code **handles file uploads**.

| # | Check | Action if missing |
|---|-------|-------------------|
| F1 | File extension validated against allowlist | Add extension allowlist check |
| F2 | MIME type validated against allowlist | Add content-type check |
| F3 | File size limited | Add size limit before processing |
| F4 | Magic bytes verified to match claimed type | Add magic byte detection |
| F5 | Stored with server-generated unique filename, not original name | Generate UUID/random name; preserve only allowed extension |

## How to use

1. **Identify which sections apply** to the code you are writing (most changes need A + C; API work adds B + D).
2. **Walk through each check** in the relevant sections.
3. **Fix immediately** if a check fails — do not defer security fixes.
4. **Note in commit** if a security requirement from `security-threat-assessment` is addressed.

## Done when

- All checks in the relevant sections pass for the code being written.
- No deferred security items unless explicitly risk-accepted with documentation.
- Secrets are not in source; queries are parameterized; auth is server-enforced.

## Further reading (humans)

- `docs/basis/security/SC-01-input-validation-and-injection-prevention.md`
- `docs/basis/security/SC-02-authentication-and-authorization.md`
- `docs/basis/security/SC-03-data-protection.md`
- `docs/basis/security/SC-04-api-security.md`
- `docs/basis/security/SC-05-dependency-security.md`

Aligned with basis as of 2026-03 — SC-01 through SC-05 (distilled).
