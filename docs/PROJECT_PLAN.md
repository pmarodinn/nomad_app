# NomadGuide Project Plan

This document organizes the project into three tracks (Backend, Frontend, Design) and establishes a living checklist-driven workflow. We will use Firebase Firestore (not SQL/Postgres) and avoid geolocation coordinates; only city-level data will be stored using strings and floats.

Key constraints
- Storage types: string and float (no GeoPoint). City must be captured and stored as plain text, not precise coordinates.
- Location inference: determine city without storing GPS; use user input or IP-derived city name, then persist city string.
- Extreme organization: each task has a checklist; docs explain steps; checklists get updated continuously.

Overall Milestones
1) Foundation (Week 1)
- [ ] Repo hygiene, issue templates, labels
- [ ] Firebase project setup (Firestore rules, indexes, environments)
- [ ] CI checks (lint, type, format, docs)
- [ ] UX design system foundation

2) MVP (Weeks 2-4)
- [ ] Auth, profile, budget, transactions (core flows)
- [ ] City capture & storage flow (no GPS)
- [ ] Basic analytics (daily allowance)
- [ ] First visual design pass

3) Beta (Weeks 5-8)
- [ ] Recurring tx, health reminders (MVP)
- [ ] Timezone dashboard (strings only)
- [ ] Polish UI, empty states, loading
- [ ] QA + telemetry, error reporting

4) Launch (Weeks 9-10)
- [ ] Hardening, perf passes
- [ ] Marketing assets
- [ ] Store submission prep

City Capture Strategy (no geo, no paid features)
- Primary: Ask user to choose their current city via search field (client-side list or free API without storing coords). Persist string fields: city, region, country.
- Secondary (fallback): IP lookup at session start (free tier provider) to suggest a city; user confirms before saving.
- Never store lat/lng or geohash. Do not enable Firestore GeoQueries.

Data Model (Firestore, flattened, city as text)
Collections (top-level):
- users/{userId}
  - profile:
    - displayName: string
    - baseCurrency: string
    - currentCity: string  // e.g., "Lisboa"
    - currentRegion: string // optional, e.g., "Lisboa"
    - currentCountry: string // e.g., "Portugal"
    - timezone: string // e.g., "Europe/Lisbon"
  - budgets/{budgetId}
    - totalInitialFunds: float
    - startDate: string (ISO yyyy-mm-dd)
    - endDate: string (ISO)
    - dailyAllowance: float
    - currentBalance: float
  - transactions/{txId}
    - amount: float
    - currency: string
    - category: string
    - type: string  // "income" | "expense"
    - date: string (ISO)
    - description: string
    - city: string // snapshot of city at time of tx
    - country: string
  - recurring/{recId}
    - amount: float
    - currency: string
    - frequencyDays: float
    - startDate: string (ISO)
    - endDate: string (ISO | empty string)
    - active: string  // "true" | "false" to keep to string/float constraint if needed
  - medicines/{medId}
    - name: string
    - dosage: string
    - frequencyHours: float
    - startTime: string // HH:MM
    - startDate: string (ISO)
    - endDate: string (ISO | empty)
    - notes: string
    - timezone: string
    - active: string
  - timezones/{tzId}
    - label: string // e.g., "Home", "Current"
    - timezone: string
    - isHome: string // "true" | "false"
    - isCurrent: string

Note: If strict float/string only is required, booleans are stored as "true"/"false" strings.

Security & Rules (high-level)
- users/{userId} readable/writable only by auth uid == userId
- Validate string lengths and allowed enums for type fields
- Prevent writing lat/lng keys in any document with rules denylist

Checklists
- docs/checklists/backend.md
- docs/checklists/frontend.md
- docs/checklists/design.md
- docs/checklists/operations.md

Each PR must update relevant checklist boxes and link to .md docs.

Initial Tasks Backlog
Backend
- [ ] Create Firebase project, enable Firestore
- [ ] Configure service accounts/secrets (.env, not committed)
- [ ] Write Firestore security rules (users scoping, deny geo fields)
- [ ] Define indexes (transactions by date, type, currency)
- [ ] Create data access layer stubs (Kotlin/Node – TBD per app choice)

Frontend (Android Kotlin first)
- [ ] Set up project with MVVM + Hilt + Room (for offline cache)
- [ ] Implement onboarding with city selection (search input)
- [ ] Implement IP-lookup suggestion flow with confirm
- [ ] Budget setup screens
- [ ] Tx add screen (uses current city string snapshot)

Design
- [ ] Build design tokens (colors, type scale, spacing)
- [ ] Create components (buttons, inputs, cards) in Figma
- [ ] Design city selection UX (clear manual override)
- [ ] Design budget dashboard (visual budget health)

Operations
- [ ] Define CI checks (ktlint/eslint, detekt, markdownlint)
- [ ] Release process doc (versioning, changelog)
- [ ] Error reporting & analytics plan

Versioning of Docs
- All .md files carry Last Updated and Version fields.

