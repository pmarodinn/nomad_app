# NomadGuide Mobile App - Database Architecture

## 📊 Database Architecture Overview

This document outlines the comprehensive database architecture for the **NomadGuide** mobile application, designed to support digital nomads with financial planning, health management, location intelligence, and cultural adaptation features.

### 🏗️ **Database Technology Stack**

#### **Primary Database: PostgreSQL 15 (Containerized)**
- **Deployment**: Docker container with persistent volumes
- **Rationale**: ACID compliance, JSON support, excellent performance
- **Scalability**: Horizontal scaling with read replicas
- **Development**: Isolated container environment for consistency
- **Production**: Same PostgreSQL version for environment parity

#### **Development Environment: Docker Compose**
- **Container Setup**: PostgreSQL + pgAdmin in isolated network
- **Data Persistence**: Named Docker volumes for data safety
- **Port Mapping**: Local access while maintaining isolation
- **Configuration**: Environment-specific settings via .env files
- **Migration**: Automated schema migrations on container startup

#### **Database Management: pgAdmin (Containerized)**
- **Web Interface**: Browser-based database administration
- **Container Access**: Secure connection to PostgreSQL container
- **Development**: Pre-configured server connections
- **Backup/Restore**: Integrated backup and restore tools

#### **Secondary Database: Redis (Caching) - Future Implementation**
- **Container**: Redis Alpine for minimal footprint
- **Purpose**: Session management, API response caching
- **Performance**: Sub-second response times for cached data
- **Persistence**: Optional persistence for session data

#### **Mobile Database: Room (SQLite)**
- **Local Storage**: Android Room database for offline functionality
- **Synchronization**: Two-way sync with PostgreSQL backend
- **Conflict Resolution**: Timestamp-based conflict resolution
- **Performance**: Optimized for mobile device constraints

### **🐳 Docker Architecture Benefits**

#### **Development Consistency**
- **Same Environment**: All developers use identical database setup
- **Version Control**: Database schema changes tracked in migrations
- **Easy Reset**: Quick database reset for testing scenarios
- **Isolation**: No interference with host system databases

#### **Production Parity**
- **Same Technology**: Development mirrors production PostgreSQL setup
- **Configuration Management**: Environment-specific configs via Docker
- **Scalability Testing**: Test scaling scenarios locally
- **Performance Testing**: Realistic performance testing environment

#### **Operational Advantages**
- **Quick Setup**: One command starts entire database infrastructure
- **Backup/Restore**: Integrated backup strategies
- **Monitoring**: Container health checks and logging
- **Security**: Network isolation and access controls

---

## 👥 **User Types & Authentication System**

### **1. User Authentication Collection**
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "email": "string",
  "passwordHash": "string",
  "authProvider": "email|google|apple|facebook",
  "socialId": "string", // For social logins
  "emailVerified": "boolean",
  "phoneNumber": "string",
  "phoneVerified": "boolean",
  "twoFactorEnabled": "boolean",
  "createdAt": "timestamp",
  "lastLogin": "timestamp",
  "isActive": "boolean",
  "accountStatus": "active|suspended|deleted",
  "deviceTokens": ["array"], // For push notifications
  "securityQuestions": [
    {
      "question": "string",
      "answerHash": "string"
    }
  ]
}
```

### **2. User Types & Profiles**

#### **Base User Profile Collection**
```json
{
  "_id": "ObjectId",
  "userId": "uuid", // Reference to auth
  "userType": "freemium|premium|enterprise|family",
  "profileType": "digital_nomad|remote_worker|traveler|expat|student",
  "personalInfo": {
    "firstName": "string",
    "lastName": "string",
    "dateOfBirth": "date",
    "gender": "string",
    "nationality": "string",
    "passportCountry": "string",
    "languages": [
      {
        "language": "string",
        "proficiency": "native|fluent|intermediate|basic"
      }
    ],
    "profilePicture": "string", // URL
    "bio": "string"
  },
  "preferences": {
    "primaryLanguage": "string",
    "primaryCurrency": "string",
    "timezone": "string",
    "units": "metric|imperial",
    "privacy": {
      "shareLocation": "boolean",
      "shareFinancials": "boolean",
      "shareHealth": "boolean"
    }
  },
  "subscription": {
    "plan": "string",
    "startDate": "timestamp",
    "endDate": "timestamp",
    "autoRenew": "boolean",
    "paymentMethod": "string"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### **User Type Specific Collections**

**Digital Nomad Extended Profile**
```json
{
  "userId": "uuid",
  "nomadLevel": "beginner|intermediate|expert",
  "travelStyle": "budget|mid_range|luxury|mixed",
  "workType": "freelancer|remote_employee|entrepreneur|consultant",
  "averageStayDuration": "number", // in days
  "preferredClimate": "tropical|temperate|cold|varied",
  "internetRequirements": "basic|moderate|high|critical",
  "communityPreferences": {
    "coworkingSpaces": "boolean",
    "nomadEvents": "boolean",
    "localMeetups": "boolean"
  }
}
```

**Family Account Profile**
```json
{
  "userId": "uuid", // Primary account holder
  "familyMembers": [
    {
      "memberId": "uuid",
      "relationship": "spouse|child|parent|sibling",
      "age": "number",
      "permissions": ["budget_view", "health_manage", "location_track"]
    }
  ],
  "familyBudget": {
    "sharedExpenses": "boolean",
    "allowanceSystem": "boolean",
    "spendingLimits": {
      "memberId": "uuid",
      "dailyLimit": "number",
      "categoryLimits": "object"
    }
  }
}
```

---

## 💰 **Financial Management System**

### **1. Budget Configuration Collection**
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "budgetName": "string",
  "isActive": "boolean",
  "budgetType": "monthly|weekly|trip_based|annual",
  "totalBudget": "number",
  "currency": "string",
  "startDate": "date",
  "endDate": "date",
  "categories": [
    {
      "categoryId": "string",
      "name": "string",
      "allocatedAmount": "number",
      "spentAmount": "number",
      "currency": "string",
      "priority": "high|medium|low"
    }
  ],
  "savingsGoals": [
    {
      "goalId": "uuid",
      "name": "string",
      "targetAmount": "number",
      "currentAmount": "number",
      "targetDate": "date",
      "priority": "number"
    }
  ],
  "recurringExpenses": [
    {
      "expenseId": "uuid",
      "description": "string",
      "amount": "number",
      "frequency": "daily|weekly|monthly|yearly",
      "nextDueDate": "date",
      "category": "string",
      "isActive": "boolean"
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### **2. Transactions Collection**
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "transactionId": "uuid",
  "type": "expense|income|transfer|exchange",
  "amount": "number",
  "currency": "string",
  "originalAmount": "number", // If currency conversion occurred
  "originalCurrency": "string",
  "exchangeRate": "number",
  "category": "string",
  "subcategory": "string",
  "description": "string",
  "merchant": "string",
  "location": {
    "latitude": "number",
    "longitude": "number",
    "address": "string",
    "city": "string",
    "country": "string"
  },
  "paymentMethod": "cash|card|digital_wallet|crypto|bank_transfer",
  "isRecurring": "boolean",
  "recurringId": "uuid", // If part of recurring expense
  "tags": ["array"],
  "receipt": {
    "imageUrl": "string",
    "ocrData": "object" // Extracted text and amounts
  },
  "budgetImpact": {
    "budgetId": "uuid",
    "categoryImpact": "number"
  },
  "timestamp": "timestamp",
  "createdAt": "timestamp",
  "syncStatus": "synced|pending|failed"
}
```

### **3. Bank Accounts & Financial Institutions**
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "accountId": "uuid",
  "institutionName": "string",
  "accountType": "checking|savings|credit|investment|crypto",
  "accountNumber": "string", // Encrypted
  "currency": "string",
  "currentBalance": "number",
  "availableBalance": "number",
  "lastSyncDate": "timestamp",
  "isActive": "boolean",
  "country": "string",
  "swiftCode": "string",
  "routingNumber": "string",
  "cardDetails": {
    "cardNumber": "string", // Encrypted, last 4 digits only
    "expiryDate": "string",
    "cardType": "visa|mastercard|amex|discover",
    "isInternational": "boolean",
    "foreignTransactionFee": "number"
  },
  "apiConnection": {
    "provider": "plaid|yodlee|open_banking",
    "connectionId": "string",
    "lastSuccessfulSync": "timestamp",
    "syncFrequency": "real_time|hourly|daily"
  }
}
```

### **4. Currency & Exchange Rates**
```json
{
  "_id": "ObjectId",
  "baseCurrency": "string",
  "targetCurrency": "string",
  "rate": "number",
  "timestamp": "timestamp",
  "source": "string", // API provider
  "bidRate": "number",
  "askRate": "number",
  "isActive": "boolean"
}
```

---

## 🏥 **Health Management System**

### **1. Health Profile Collection**
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "medicalInfo": {
    "bloodType": "string",
    "allergies": ["array"],
    "chronicConditions": ["array"],
    "disabilities": ["array"],
    "emergencyContact": {
      "name": "string",
      "relationship": "string",
      "phone": "string",
      "email": "string"
    },
    "doctor": {
      "name": "string",
      "specialty": "string",
      "phone": "string",
      "email": "string",
      "country": "string"
    }
  },
  "insurance": {
    "provider": "string",
    "policyNumber": "string",
    "coverage": "domestic|international|global",
    "expiryDate": "date",
    "emergencyNumber": "string"
  },
  "vaccinations": [
    {
      "vaccine": "string",
      "dateReceived": "date",
      "expiryDate": "date",
      "location": "string",
      "batchNumber": "string"
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### **2. Medicine & Alerts Collection**
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "medicineId": "uuid",
  "medicineName": "string",
  "genericName": "string",
  "dosage": "string",
  "frequency": "string",
  "instructions": "string",
  "prescribedBy": "string",
  "startDate": "date",
  "endDate": "date",
  "quantity": "number",
  "remainingQuantity": "number",
  "alerts": {
    "medicationTime": ["array"], // Times of day
    "refillAlert": "boolean",
    "refillThreshold": "number", // Days before running out
    "timezone": "string"
  },
  "sideEffects": ["array"],
  "interactions": ["array"],
  "isActive": "boolean",
  "createdAt": "timestamp"
}
```

### **3. Health Records Collection**
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "recordId": "uuid",
  "type": "consultation|test_result|prescription|vaccination|emergency",
  "date": "date",
  "location": {
    "facility": "string",
    "city": "string",
    "country": "string"
  },
  "provider": {
    "name": "string",
    "specialty": "string",
    "license": "string"
  },
  "diagnosis": "string",
  "treatment": "string",
  "documents": [
    {
      "type": "pdf|image|text",
      "url": "string",
      "description": "string"
    }
  ],
  "cost": {
    "amount": "number",
    "currency": "string",
    "insuranceCovered": "number"
  },
  "followUp": {
    "required": "boolean",
    "date": "date",
    "notes": "string"
  }
}
```

---

## 🌍 **Location Intelligence System**

### **1. User Locations Collection**
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "locationId": "uuid",
  "type": "current|past|planned|wishlist",
  "coordinates": {
    "latitude": "number",
    "longitude": "number",
    "accuracy": "number"
  },
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "postalCode": "string"
  },
  "accommodation": {
    "type": "hotel|airbnb|hostel|apartment|house|coliving",
    "name": "string",
    "checkIn": "date",
    "checkOut": "date",
    "cost": "number",
    "currency": "string",
    "rating": "number",
    "amenities": ["array"]
  },
  "stayDuration": "number", // in days
  "purpose": "work|leisure|medical|family|business",
  "transportation": {
    "arrivalMethod": "flight|train|bus|car|boat",
    "departureMethod": "string",
    "cost": "number",
    "currency": "string"
  },
  "notes": "string",
  "photos": ["array"],
  "rating": "number",
  "timestamp": "timestamp"
}
```

### **2. Location Recommendations Collection**
```json
{
  "_id": "ObjectId",
  "cityId": "uuid",
  "city": "string",
  "country": "string",
  "coordinates": {
    "latitude": "number",
    "longitude": "number"
  },
  "nomadScore": "number", // 1-10
  "costOfLiving": {
    "currency": "string",
    "accommodation": {
      "budget": "number",
      "midRange": "number",
      "luxury": "number"
    },
    "food": {
      "streetFood": "number",
      "restaurant": "number",
      "groceries": "number"
    },
    "transportation": {
      "public": "number",
      "taxi": "number",
      "carRental": "number"
    },
    "utilities": "number",
    "entertainment": "number"
  },
  "infrastructure": {
    "internetSpeed": "number", // Mbps
    "internetReliability": "number", // 1-10
    "powerReliability": "number",
    "publicTransport": "number",
    "healthcareQuality": "number"
  },
  "climate": {
    "averageTemp": "number",
    "humidity": "number",
    "rainyDays": "number",
    "sunnyDays": "number"
  },
  "safety": {
    "crimeRate": "number",
    "politicalStability": "number",
    "naturalDisasters": "array"
  },
  "visa": {
    "touristVisa": "boolean",
    "workVisa": "boolean",
    "digitalNomadVisa": "boolean",
    "maxStayDays": "number"
  },
  "community": {
    "nomadPopulation": "number",
    "coworkingSpaces": "number",
    "meetupFrequency": "number"
  },
  "language": {
    "primary": "string",
    "englishLevel": "number" // 1-10
  },
  "lastUpdated": "timestamp"
}
```

### **3. Points of Interest Collection**
```json
{
  "_id": "ObjectId",
  "poiId": "uuid",
  "name": "string",
  "type": "coworking|restaurant|hospital|attraction|transport|shopping",
  "coordinates": {
    "latitude": "number",
    "longitude": "number"
  },
  "address": "string",
  "city": "string",
  "country": "string",
  "rating": "number",
  "priceRange": "number", // 1-4 ($-$$$$)
  "features": ["array"],
  "workingHours": {
    "monday": "string",
    "tuesday": "string",
    "wednesday": "string",
    "thursday": "string",
    "friday": "string",
    "saturday": "string",
    "sunday": "string"
  },
  "amenities": ["array"],
  "contact": {
    "phone": "string",
    "email": "string",
    "website": "string"
  },
  "photos": ["array"],
  "reviews": [
    {
      "userId": "uuid",
      "rating": "number",
      "comment": "string",
      "date": "timestamp"
    }
  ],
  "nomadFriendly": "boolean",
  "internetSpeed": "number",
  "powerOutlets": "boolean",
  "quietLevel": "number" // 1-10
}
```

---

## 🕐 **Timezone & Time Management**

### **1. Timezone Tracking Collection**
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "currentTimezone": "string",
  "homeTimezone": "string",
  "workTimezone": "string",
  "trackedTimezones": [
    {
      "timezone": "string",
      "label": "string", // "Client", "Family", "Office"
      "priority": "number"
    }
  ],
  "autoDetectTimezone": "boolean",
  "schedulingPreferences": {
    "preferredWorkHours": {
      "start": "time",
      "end": "time"
    },
    "availableDays": ["array"],
    "bufferTime": "number" // minutes between meetings
  },
  "calendarIntegration": {
    "googleCalendar": "boolean",
    "outlookCalendar": "boolean",
    "appleCalendar": "boolean",
    "syncToken": "string"
  }
}
```

### **2. Schedule & Events Collection**
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "eventId": "uuid",
  "title": "string",
  "description": "string",
  "type": "meeting|flight|appointment|reminder|medication",
  "startTime": "timestamp",
  "endTime": "timestamp",
  "timezone": "string",
  "location": {
    "type": "physical|virtual",
    "address": "string",
    "coordinates": {
      "latitude": "number",
      "longitude": "number"
    },
    "meetingLink": "string"
  },
  "attendees": [
    {
      "email": "string",
      "name": "string",
      "timezone": "string",
      "status": "pending|accepted|declined"
    }
  ],
  "reminders": [
    {
      "type": "notification|email|sms",
      "minutesBefore": "number"
    }
  ],
  "recurrence": {
    "pattern": "daily|weekly|monthly|yearly",
    "interval": "number",
    "endDate": "date"
  },
  "isAllDay": "boolean",
  "priority": "high|medium|low",
  "categories": ["array"]
}
```

---

## 🌐 **Internationalization & Localization**

### **1. Translations Collection**
```json
{
  "_id": "ObjectId",
  "key": "string", // Translation key
  "translations": {
    "en": "string",
    "zh": "string",
    "es": "string",
    "ar": "string",
    "fr": "string",
    "pt": "string",
    "ja": "string",
    "ko": "string",
    "it": "string",
    "fa": "string"
  },
  "context": "string", // UI context where used
  "category": "ui|error|notification|content",
  "version": "number",
  "lastUpdated": "timestamp"
}
```

### **2. Cultural Preferences Collection**
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "culturalSettings": {
    "dateFormat": "string",
    "timeFormat": "12h|24h",
    "numberFormat": "string",
    "firstDayOfWeek": "number", // 0=Sunday, 1=Monday
    "currency": {
      "primary": "string",
      "display": "symbol|code|name",
      "position": "before|after"
    }
  },
  "communicationStyle": {
    "formality": "formal|informal|mixed",
    "directness": "direct|indirect",
    "contextLevel": "high|low"
  },
  "contentPreferences": {
    "localContent": "boolean",
    "culturalAdaptation": "boolean",
    "localBusinessHours": "boolean"
  }
}
```

---

## 📱 **Mobile App Specific Collections**

### **1. App Settings & Preferences**
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "appVersion": "string",
  "deviceInfo": {
    "platform": "ios|android",
    "deviceModel": "string",
    "osVersion": "string",
    "appVersion": "string"
  },
  "notifications": {
    "pushEnabled": "boolean",
    "emailEnabled": "boolean",
    "smsEnabled": "boolean",
    "categories": {
      "budgetAlerts": "boolean",
      "medicationReminders": "boolean",
      "locationUpdates": "boolean",
      "securityAlerts": "boolean",
      "promotions": "boolean"
    },
    "quietHours": {
      "enabled": "boolean",
      "start": "time",
      "end": "time",
      "timezone": "string"
    }
  },
  "privacy": {
    "locationTracking": "always|app_use|never",
    "dataSharing": "boolean",
    "analytics": "boolean",
    "crashReporting": "boolean"
  },
  "performance": {
    "offlineMode": "boolean",
    "syncFrequency": "real_time|hourly|daily|manual",
    "dataCompression": "boolean",
    "imageQuality": "high|medium|low"
  }
}
```

### **2. Offline Data Cache**
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "dataType": "transactions|locations|currency_rates|translations",
  "data": "object", // Cached data
  "lastSync": "timestamp",
  "expiryDate": "timestamp",
  "size": "number", // in bytes
  "priority": "high|medium|low"
}
```

### **3. App Analytics Collection**
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "sessionId": "uuid",
  "event": "string",
  "parameters": "object",
  "timestamp": "timestamp",
  "platform": "ios|android",
  "appVersion": "string",
  "location": {
    "country": "string",
    "city": "string"
  },
  "userType": "string"
}
```

---

## 🔒 **Security & Privacy**

### **1. Data Encryption Standards**
- **At Rest**: AES-256 encryption for sensitive data
- **In Transit**: TLS 1.3 for all API communications
- **Personal Data**: Field-level encryption for:
  - Financial account numbers
  - Medical information
  - Personal identification numbers
  - Location coordinates (when privacy enabled)

### **2. Data Retention Policies**
```json
{
  "dataType": "retention_period_days",
  "user_activity": 2555, // 7 years
  "financial_transactions": 2555,
  "location_history": 1095, // 3 years
  "health_records": 3650, // 10 years
  "app_analytics": 730, // 2 years
  "cached_data": 30,
  "deleted_user_data": 30 // Grace period before permanent deletion
}
```

### **3. Access Control Collection**
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "permissions": {
    "data_export": "boolean",
    "data_deletion": "boolean",
    "family_sharing": "boolean",
    "third_party_access": ["array"]
  },
  "auditLog": [
    {
      "action": "string",
      "timestamp": "timestamp",
      "ip": "string",
      "device": "string",
      "success": "boolean"
    }
  ]
}
```

---

## 📊 **Database Performance & Scaling**

### **1. Indexing Strategy**
```javascript
// Critical indexes for performance
db.users.createIndex({"email": 1}, {unique: true})
db.users.createIndex({"userId": 1}, {unique: true})
db.transactions.createIndex({"userId": 1, "timestamp": -1})
db.transactions.createIndex({"userId": 1, "category": 1, "timestamp": -1})
db.locations.createIndex({"userId": 1, "timestamp": -1})
db.locations.createIndex({"coordinates": "2dsphere"}) // Geospatial
db.medicine_alerts.createIndex({"userId": 1, "alerts.medicationTime": 1})
db.currency_rates.createIndex({"baseCurrency": 1, "targetCurrency": 1, "timestamp": -1})
```

### **2. Sharding Strategy**
- **Shard Key**: `userId` for user-specific collections
- **Geographic Sharding**: By user's primary country for location data
- **Time-based Sharding**: For analytics and historical data

### **3. Backup & Recovery**
- **Frequency**: Real-time replication + daily snapshots
- **Geographic Distribution**: Multi-region backup storage
- **Recovery Time Objective (RTO)**: 15 minutes
- **Recovery Point Objective (RPO)**: 5 minutes

---

## 🚀 **Implementation Phases**

### **Phase 1: Core User & Financial (Months 1-2) - Docker Setup**
- **Docker Environment**: PostgreSQL + pgAdmin containers
- **Database Schema**: User authentication and profiles tables
- **API Foundation**: Containerized backend with database connectivity
- **Mobile Setup**: Local Android Studio with API integration
- **Development Workflow**: Established Docker-based development process

### **Phase 2: Health & Location Intelligence (Months 3-4) - Feature Implementation**
- **Health Schema**: Medicine tracking and health profile tables
- **Location Services**: Location tracking and recommendations tables
- **Timezone Management**: Multi-timezone support with container timezone handling
- **Analytics Foundation**: Basic analytics with containerized data processing

### **Phase 3: Advanced Features (Months 5-6) - Scaling & Optimization**
- **Redis Integration**: Caching layer for performance optimization
- **Multi-currency**: Advanced currency handling with real-time data
- **Performance**: Database optimization and container resource tuning
- **Security**: Enhanced security with container networking and secrets management

### **Phase 4: AI & Optimization (Months 7-8) - Production Readiness**
- **Production Containers**: Production-ready Docker configurations
- **Monitoring**: Container and database monitoring solutions
- **Backup/Recovery**: Automated backup systems with container orchestration
- **Deployment**: CI/CD pipeline with containerized deployments

---

## 📋 **Database Monitoring & Maintenance**

### **Key Metrics to Monitor**
- Query response times (target: <100ms for 95th percentile)
- Database connection pool utilization
- Storage growth rate
- Index effectiveness
- Replication lag
- Cache hit ratios

### **Maintenance Schedule**
- **Daily**: Automated backups, log rotation
- **Weekly**: Index optimization, performance review
- **Monthly**: Capacity planning, security audit
- **Quarterly**: Schema evolution planning, disaster recovery testing

---

This comprehensive database architecture provides the foundation for a scalable, secure, and feature-rich mobile application that can grow with the NomadGuide user base while maintaining excellent performance and user experience across all supported features and regions.
