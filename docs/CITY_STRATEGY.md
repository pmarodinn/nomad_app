# City Capture & Storage Strategy

Last Updated: 2025-08-30  
Version: 0.1.0

Goal: Persist only the city (and optionally region/country) as plain text in Firestore. Do not store lat/lng or GeoPoint. All numeric values must be float.

Approach
1) Manual City Entry (Primary)
- Autocomplete using a static city list or free API (client-side only)
- Fields saved: city, region, country (strings)
- User can change city anytime in Settings

2) IP-Based Suggestion (Secondary)
- On app start, call a free IP geolocation endpoint (e.g., ipapi.co/json or ip whois) to get city and country
- Show a non-blocking prompt: "Are you in {city, country}?" with Yes/No
- Only save if user confirms; otherwise keep previous city

3) Transaction Snapshot
- Each new transaction stores current city and country strings at time of creation
- Enables analytics by city without coordinates

4) Validation Rules
- Max length: 64 chars for city, 64 for region, 64 for country
- Allow common characters incl. diacritics and spaces
- Block fields: lat, lng, latitude, longitude, geohash

Firestore Rule Snippet (conceptual)
- Deny writes if request.resource.data.diff().affectedKeys().hasAny(["lat","lng","latitude","longitude","geohash"]) == true

Open Questions
- Which free city list/API to use? (GeoDB Cities free tier, or curated JSON)
- Localization of city names (use English exonyms or local endonyms?)
