# Backend Checklist

Last Updated: 2025-08-30  
Version: 0.1.0

Core Decision: Use Firebase Firestore. Store only strings and floats. No GeoPoint or lat/lng. City stored as text.

- [ ] Firebase project created
- [ ] Firestore enabled (Native mode)
- [ ] Environments: dev, staging, prod
- [ ] Service accounts & API keys secured (.env, no commit)
- [ ] Firestore security rules drafted
  - [ ] users/{uid} scoped to auth.uid
  - [ ] Deny writes containing lat, lng, geohash keys
  - [ ] Validate enums (transaction.type)
  - [ ] Validate string lengths
- [ ] Composite indexes defined (transactions by date, type)
- [ ] Data model verified against constraints (string/float)
- [ ] City capture flow endpoints (if backend exists)
- [ ] Unit tests for rules (emulator)
- [ ] Backup/export strategy documented

Next Steps
- [ ] Choose backend language (Node or Kotlin-only mobile)
- [ ] If Node API: scaffold with Firebase Admin SDK
- [ ] Define rate limits and quotas
