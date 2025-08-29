# Frontend Checklist (Android Kotlin)

Last Updated: 2025-08-30  
Version: 0.1.0

- [ ] Project scaffold (Gradle, Kotlin, Compose, Hilt)
- [ ] Module structure (app, core, data, domain, feature)
- [ ] Design tokens + theme (Material 3)
- [ ] Onboarding flow
  - [ ] City selection screen (manual search)
  - [ ] IP suggestion prompt (user confirm before save)
  - [ ] Base currency selection
  - [ ] Budget dates and total funds
- [ ] Budget dashboard (daily allowance, status colors)
- [ ] Transactions
  - [ ] Add expense/income screen (uses current city string)
  - [ ] List & filters
  - [ ] Local cache (Room) + Firestore sync
- [ ] Recurring transactions (MVP)
- [ ] Health reminders (MVP fields only)
- [ ] Timezone list (string-based)
- [ ] Analytics and error handling
- [ ] Settings (change city manually)

City Capture UX
- No GPS prompt by default. Always allow manual city entry.
- Use IP lookup as suggestion only; never auto-save.
