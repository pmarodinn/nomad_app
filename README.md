# 🌍 NomadWallet - Intelligent Travel Budget Management System

**Version:** 1.0.0  
**Status:** Active Development  
**License:** MIT  
**Language:** Python 3.11+  

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Architecture](#-architecture)
3. [Functional Requirements](#-functional-requirements)
4. [Non-Functional Requirements](#-non-functional-requirements)
5. [System Components](#-system-components)
6. [Data Models](#-data-models)
7. [Services Architecture](#-services-architecture)
8. [User Interface](#-user-interface)
9. [API Documentation](#-api-documentation)
10. [Installation & Setup](#-installation--setup)
11. [Usage Examples](#-usage-examples)
12. [Future Implementations](#-future-implementations)
13. [Security Considerations](#-security-considerations)
14. [Performance Optimization](#-performance-optimization)
15. [Contributing](#-contributing)

---

## 🎯 Project Overview

**NomadWallet** is an intelligent travel budget management system designed specifically for digital nomads, travelers, and long-term expatriates. The system provides comprehensive financial planning, health management, and timezone coordination tools to help users manage their finances effectively while living or traveling across different countries and time zones.

### Core Mission
Empower travelers with intelligent financial insights, automated health reminders, and seamless timezone management to enhance their nomadic lifestyle experience.

### Target Audience
- Digital nomads and remote workers
- Long-term travelers and backpackers
- Expatriates living abroad
- Frequent business travelers
- Anyone managing finances across multiple currencies and timezones

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Web Templates (Jinja2) │ Static Assets │ JavaScript/CSS   │
│  - Dashboard             │ - Styles      │ - Interactive    │
│  - Forms                 │ - Images      │   Charts         │
│  - Analytics             │ - Icons       │ - Notifications  │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│                    Flask Web Framework                      │
│  - Route Handlers        │ - Form Processing                │
│  - Request/Response      │ - Session Management             │
│  - Error Handling        │ - Template Rendering             │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                    │
├─────────────────────────────────────────────────────────────┤
│  Budget Analysis Service │ Health & Timezone Service       │
│  - Financial Insights    │ - Medicine Alerts              │
│  - Spending Analytics    │ - Timezone Comparison          │
│  - Health Monitoring     │ - Call Planning                │
│                          │                                │
│  Currency Service        │ Data Service                   │
│  - Exchange Rates        │ - User Profile Management      │
│  - Multi-Currency Support│ - Data Persistence            │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
├─────────────────────────────────────────────────────────────┤
│  JSON File Storage       │ External APIs                   │
│  - User Profiles         │ - Exchange Rate APIs            │
│  - Transaction History   │ - Timezone APIs                 │
│  - Medicine Alerts       │ - Future: Location APIs         │
│  - Timezone Locations    │                                │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Mobile Development:**
- **Platform:** Android Native (Kotlin)
- **Architecture:** MVVM with Repository pattern
- **UI Framework:** Jetpack Compose + Material Design 3
- **Local Database:** Room (SQLite)
- **Networking:** Retrofit + OkHttp
- **Dependency Injection:** Hilt/Dagger

**Backend Infrastructure:**
- **Containerization:** Docker + Docker Compose
- **Database:** PostgreSQL 15 (containerized)
- **API Framework:** Node.js/Spring Boot/Django (to be decided)
- **Database Management:** pgAdmin (containerized)
- **Caching:** Redis (future, containerized)
- **File Storage:** Local/MinIO/S3 (future)

**Development Environment:**
- **Strategy:** Hybrid containerized development
- **Backend & Database:** Fully containerized with Docker Compose
- **Android Development:** Local Android Studio installation
- **Benefits:** Consistent backend environment + optimal Android performance

**External Libraries:** 
  - `pytz` - Timezone handling
  - `requests` - HTTP client for API calls
  - `flask-cors` - Cross-origin resource sharing

**Frontend:**
- **Styling:** Custom CSS with responsive design
- **JavaScript:** Vanilla JS (Future: Chart.js for analytics)
- **Icons:** Unicode emojis and custom icons
- **Responsive:** Mobile-first design approach

**Development Tools:**
- **Containerization:** Docker + Docker Compose for backend services
- **Database Management:** pgAdmin (containerized)
- **Version Control:** Git with Docker-specific configurations
- **Package Management:** npm/gradle for respective platforms
- **Development Server:** Containerized API server with hot-reload
- **Debugging:** Integrated debugging for both Android and backend services

## 🐳 Docker Development Environment

### **Quick Start with Docker**

```bash
# 1. Install Docker and Docker Compose
sudo apt update && sudo apt install docker.io docker-compose-plugin

# 2. Clone and setup project
git clone <repository-url>
cd mobile_NomadGuide

# 3. Start development environment
./scripts/start-dev.sh

# 4. Verify services are running
docker ps
```

### **What Gets Containerized**

| Service | Container | Port | Purpose |
|---------|-----------|------|---------|
| **PostgreSQL** | `nomadguide_postgres` | 5432 | Main database |
| **pgAdmin** | `nomadguide_pgadmin` | 5050 | Database management UI |
| **Backend API** | `nomadguide_backend` | 3000 | REST/GraphQL API |
| **Redis** | `nomadguide_redis` | 6379 | Caching (future) |

### **What Stays Local**

- **Android Studio** - Better emulator performance and device debugging
- **IDE/Editor** - VS Code, IntelliJ, or preferred development environment
- **Git** - Version control remains on host system

### **Development Workflow Benefits**

✅ **One Command Setup** - `./scripts/start-dev.sh` starts entire backend  
✅ **Consistent Environment** - Same database and API setup for all developers  
✅ **Easy Reset** - `./scripts/reset-db.sh` for clean database state  
✅ **Production Parity** - Development environment mirrors production  
✅ **Isolation** - No conflicts with host system services  

For detailed Docker setup instructions, see [DOCKER_SETUP.md](DOCKER_SETUP.md).

---

## ✅ Functional Requirements

### 1. Budget Management System

#### 1.1 Initial Budget Setup
- **Requirement ID:** FR-001
- **Description:** Users can set up their initial travel budget with comprehensive parameters
- **Implementation:**
  ```python
  # Key Components:
  - Total travel funds input
  - Base currency selection (EUR, USD, GBP, etc.)
  - Travel start and end dates
  - Automatic daily allowance calculation
  ```
- **User Story:** As a traveler, I want to set up my budget so that I can track my spending against my available funds
- **Acceptance Criteria:**
  - ✅ User can input total funds in their preferred currency
  - ✅ System validates date ranges (end date > start date)
  - ✅ Daily allowance is automatically calculated
  - ✅ Budget is persisted and can be modified

#### 1.2 Transaction Management
- **Requirement ID:** FR-002
- **Description:** Complete transaction recording and management system
- **Implementation:**
  ```python
  # Transaction Types:
  - Income transactions (salary, freelance, etc.)
  - Expense transactions (food, transport, accommodation, etc.)
  - Multi-currency support with automatic conversion
  - Category-based organization
  - Tag system for detailed tracking
  ```
- **Features:**
  - Real-time balance updates
  - Currency conversion with live exchange rates
  - Category-based spending analysis
  - Historical transaction search and filtering
  - Bulk transaction operations

#### 1.3 Recurring Transactions
- **Requirement ID:** FR-003
- **Description:** Automated handling of recurring income and expenses
- **Implementation:**
  ```python
  # Recurring Transaction Features:
  - Configurable frequency (daily, weekly, monthly, custom)
  - Start and end date management
  - Automatic currency conversion
  - Future projection calculations
  - Active/inactive status control
  ```
- **Use Cases:**
  - Monthly salary or freelance income
  - Recurring expenses (rent, subscriptions, insurance)
  - Weekly transportation costs
  - Daily meal allowances

#### 1.4 Financial Analytics & Insights
- **Requirement ID:** FR-004
- **Description:** Comprehensive financial analysis and reporting system
- **Current Metrics:**
  ```python
  # Dashboard Metrics:
  1. Current Bank Account (Real balance based on actual transactions)
  2. Actual Daily Budget (Available funds ÷ remaining days)
  3. Projected Balance (Current balance + future recurring transactions)
  4. Projected Daily Budget (Projected balance ÷ remaining days)
  ```
- **Advanced Analytics:**
  - Spending by category breakdown
  - Daily spending trends and patterns
  - Budget health status monitoring
  - What-if scenario calculator
  - Monthly and weekly spending summaries

### 2. Health Management System

#### 2.1 Medicine Alert System
- **Requirement ID:** FR-005
- **Description:** Intelligent medicine reminder and tracking system
- **Implementation:**
  ```python
  # Medicine Alert Features:
  - Custom dosage and frequency settings
  - Timezone-aware scheduling
  - Start and end date management
  - Comprehensive notes and instructions
  - Upcoming alerts dashboard (48-hour preview)
  ```
- **Key Capabilities:**
  - Multiple medicine tracking
  - Flexible scheduling (every X hours)
  - Timezone adaptation when traveling
  - Historical tracking of medicine intake
  - Emergency contact information storage

#### 2.2 Health Monitoring Integration
- **Requirement ID:** FR-006
- **Description:** Integration with health monitoring and wellness tracking
- **Planned Features:**
  - Vital signs tracking
  - Sleep pattern monitoring
  - Exercise and activity logging
  - Health appointment scheduling
  - Emergency medical information storage

### 3. Timezone Management System

#### 3.1 Multi-Timezone Tracking
- **Requirement ID:** FR-007
- **Description:** Comprehensive timezone management for global travelers
- **Implementation:**
  ```python
  # Timezone Features:
  - Multiple location tracking
  - Home vs. current location designation
  - Real-time timezone comparison
  - Popular timezone database
  - Time difference calculations
  ```

#### 3.2 Call Planning System
- **Requirement ID:** FR-008
- **Description:** Intelligent call scheduling across timezones
- **Features:**
  - Best call time recommendations
  - Business hours consideration
  - Multiple participant timezone coordination
  - Meeting scheduler integration
  - Time conflict identification

### 4. Multi-Currency Support

#### 4.1 Real-Time Exchange Rates
- **Requirement ID:** FR-009
- **Description:** Live currency conversion and exchange rate management
- **Implementation:**
  ```python
  # Currency Features:
  - Live exchange rate fetching
  - Historical rate tracking
  - Automatic transaction conversion
  - Multi-currency display options
  - Exchange rate alerts and notifications
  ```

#### 4.2 Currency Analytics
- **Requirement ID:** FR-010
- **Description:** Currency-specific financial insights
- **Features:**
  - Exchange rate impact on budget
  - Currency hedging recommendations
  - Best exchange timing suggestions
  - Multi-currency portfolio overview

---

## 🔧 Non-Functional Requirements

### 1. Performance Requirements

#### 1.1 Response Time
- **Requirement ID:** NFR-001
- **Description:** System response time standards
- **Specifications:**
  - Page load time: < 2 seconds
  - API response time: < 500ms
  - Database queries: < 100ms
  - Currency conversion: < 1 second

#### 1.2 Throughput
- **Requirement ID:** NFR-002
- **Description:** System capacity requirements
- **Specifications:**
  - Concurrent users: 100+ (current architecture)
  - Transactions per second: 50+
  - Data processing: 1000+ records/minute

### 2. Scalability Requirements

#### 2.1 Horizontal Scaling
- **Requirement ID:** NFR-003
- **Description:** System expansion capabilities
- **Current State:** Single instance JSON storage
- **Future Target:** Microservices with database clustering

#### 2.2 Data Volume Handling
- **Requirement ID:** NFR-004
- **Description:** Data storage and processing capacity
- **Specifications:**
  - User profiles: 10,000+ users
  - Transactions: 1M+ records
  - Medicine alerts: 50,000+ active alerts
  - Timezone locations: Unlimited

### 3. Security Requirements

#### 3.1 Data Protection
- **Requirement ID:** NFR-005
- **Description:** User data security and privacy
- **Current Implementation:**
  - Local JSON file storage
  - Session-based authentication
  - Input validation and sanitization
- **Future Enhancements:**
  - End-to-end encryption
  - OAuth 2.0 authentication
  - GDPR compliance
  - Data anonymization

#### 3.2 Access Control
- **Requirement ID:** NFR-006
- **Description:** User access management
- **Planned Features:**
  - Role-based access control
  - Multi-factor authentication
  - Session timeout management
  - API rate limiting

### 4. Reliability Requirements

#### 4.1 Availability
- **Requirement ID:** NFR-007
- **Description:** System uptime requirements
- **Target:** 99.9% uptime
- **Implementation:**
  - Error handling and recovery
  - Graceful degradation
  - Health monitoring
  - Automated backups

#### 4.2 Data Integrity
- **Requirement ID:** NFR-008
- **Description:** Data consistency and accuracy
- **Features:**
  - Transaction atomicity
  - Data validation at multiple layers
  - Automatic backup creation
  - Data corruption detection

### 5. Usability Requirements

#### 5.1 User Experience
- **Requirement ID:** NFR-009
- **Description:** User interface and experience standards
- **Implementation:**
  - Responsive design (mobile, tablet, desktop)
  - Intuitive navigation
  - Accessibility compliance (WCAG 2.1)
  - Multi-language support (planned)

#### 5.2 Learning Curve
- **Requirement ID:** NFR-010
- **Description:** Ease of system adoption
- **Target:** New users productive within 15 minutes
- **Features:**
  - Guided setup wizard
  - In-app tutorials
  - Comprehensive help system
  - Example data and templates

---

## 🧩 System Components

### 1. Web Application Layer (`nomadwallet/web/`)

#### 1.1 Flask Application (`app.py`)
```python
# Core Flask application with 50+ routes
# Key responsibilities:
- Route handling and request processing
- Template rendering and response generation
- Session management and user state
- Error handling and logging
- API endpoint management

# Major route groups:
- Budget management routes (/setup, /transactions, /recurring_transactions)
- Analytics routes (/analytics, /what_if)
- Health routes (/medicine_alerts, /add_medicine)
- Timezone routes (/timezone_comparison, /call_planner)
- API routes (/api/budget_health, /api/spending_trend)
```

#### 1.2 Templates (`templates/`)
```html
<!-- Template Structure: -->
├── base.html              # Master template with navigation
├── dashboard.html         # Main financial dashboard
├── setup.html            # Initial budget setup wizard
├── transactions.html     # Transaction history and management
├── add_transaction.html  # Transaction creation form
├── recurring_transactions.html  # Recurring transaction management
├── add_recurring.html    # Recurring transaction form
├── medicine_alerts.html  # Medicine alert dashboard
├── add_medicine.html     # Medicine alert creation
├── timezone_comparison.html  # Timezone management
├── add_timezone.html     # Timezone location form
├── call_planner.html     # Call scheduling tool
├── analytics.html        # Financial analytics dashboard
├── what_if.html         # Scenario planning tool
├── settings.html        # User preferences
└── error.html          # Error page template
```

#### 1.3 Static Assets (`static/`)
```css
/* CSS Architecture: */
├── css/
│   └── style.css         # Main stylesheet (2000+ lines)
│       ├── Global styles and resets
│       ├── Component-specific styles
│       ├── Responsive design breakpoints
│       └── Theme and color variables

/* Key Design Features: */
- Modern gradient backgrounds
- Card-based layout system
- Responsive grid layouts
- Custom form styling
- Interactive hover effects
- Mobile-first responsive design
```

### 2. Business Logic Layer (`nomadwallet/src/`)

#### 2.1 Data Models (`models/`)
```python
# Core Data Models:

@dataclass
class Transaction:
    # Financial transaction representation
    amount: float
    currency: str
    description: str
    category: str
    transaction_type: TransactionType
    date: date
    tags: List[str]
    converted_amount: Optional[float]
    exchange_rate: Optional[float]

@dataclass
class Budget:
    # Budget configuration and state
    total_initial_funds: float
    base_currency: str
    start_date: date
    end_date: date
    daily_allowance: float
    current_balance: float

@dataclass
class RecurringTransaction:
    # Automated recurring transactions
    amount: float
    currency: str
    description: str
    category: str
    transaction_type: TransactionType
    start_date: date
    end_date: Optional[date]
    frequency_days: int
    is_active: bool

@dataclass
class MedicineAlert:
    # Medicine reminder system
    name: str
    dosage: str
    frequency_hours: int
    start_time: str
    start_date: date
    end_date: Optional[date]
    notes: str
    timezone: str
    is_active: bool

@dataclass
class TimezoneLocation:
    # Timezone and location tracking
    name: str
    timezone: str
    is_home: bool
    is_current: bool

@dataclass
class UserProfile:
    # Complete user data container
    budget: Optional[Budget]
    transactions: List[Transaction]
    recurring_transactions: List[RecurringTransaction]
    medicine_alerts: List[MedicineAlert]
    timezone_locations: List[TimezoneLocation]
    savings_goals: List[SavingsGoal]
    categories: List[str]
    quick_add_items: Dict[str, Dict]
```

#### 2.2 Services Layer (`services/`)

##### 2.2.1 Data Service (`data_service.py`)
```python
class DataService:
    """Core data persistence and management service"""
    
    # Key Responsibilities:
    - User profile loading and saving
    - Transaction management (CRUD operations)
    - Recurring transaction handling
    - Data validation and integrity
    - JSON serialization/deserialization
    - Backup and recovery operations
    
    # Key Methods:
    def load_user_profile() -> UserProfile
    def save_user_profile() -> bool
    def add_transaction(transaction: Transaction)
    def add_recurring_transaction(recurring: RecurringTransaction)
    def is_first_time_user() -> bool
    def setup_budget(funds, currency, start_date, end_date)
```

##### 2.2.2 Budget Analysis Service (`budget_analysis.py`)
```python
class BudgetAnalysisService:
    """Financial analysis and insights generation"""
    
    # Key Responsibilities:
    - Current balance calculation (real transactions only)
    - Daily allowance computation
    - Spending categorization and analysis
    - Budget health monitoring
    - Financial trend analysis
    - What-if scenario modeling
    
    # Key Methods:
    def calculate_current_balance() -> float
    def calculate_daily_allowance() -> float
    def get_spending_by_category(days: int) -> Dict[str, float]
    def get_budget_health_status() -> Dict
    def get_daily_spending_trend(days: int) -> List[Tuple]
    def calculate_what_if_scenario(amount: float) -> Dict
```

##### 2.2.3 Currency Service (`currency_service.py`)
```python
class CurrencyService:
    """Multi-currency support and exchange rate management"""
    
    # Key Responsibilities:
    - Live exchange rate fetching
    - Currency conversion calculations
    - Exchange rate caching and persistence
    - Supported currency management
    - Rate update scheduling
    
    # Key Methods:
    def get_exchange_rate(from_currency: str, to_currency: str) -> float
    def convert_amount(amount: float, from_curr: str, to_curr: str) -> float
    def update_exchange_rates() -> bool
    def get_supported_currencies() -> List[str]
```

##### 2.2.4 Health & Timezone Service (`health_timezone_service.py`)
```python
class HealthTimezoneService:
    """Health management and timezone coordination service"""
    
    # Key Responsibilities:
    - Medicine alert scheduling and management
    - Timezone conversion and comparison
    - Call time optimization
    - Health reminder generation
    - Timezone-aware datetime handling
    
    # Key Methods:
    def add_medicine_alert(alert: MedicineAlert) -> bool
    def get_upcoming_medicine_alerts(hours: int) -> List[Dict]
    def add_timezone_location(location: TimezoneLocation) -> bool
    def get_timezone_comparison() -> Dict
    def get_best_call_times(target_timezone: str) -> List[Dict]
    def get_popular_timezones() -> List[Tuple]
```

#### 2.3 Utilities (`utils/`)
```python
# Utility Functions:

def format_currency(amount: float, currency: str) -> str:
    """Format currency amounts for display"""

def get_date_range_description(start_date: date, end_date: date) -> str:
    """Generate human-readable date range descriptions"""

# Additional utility functions for:
- Date and time manipulation
- String formatting and validation
- Data type conversions
- Error handling helpers
```

---

## 📊 Data Models

### 1. Core Financial Models

#### 1.1 Transaction Model
```python
@dataclass
class Transaction:
    amount: float                    # Transaction amount in original currency
    currency: str                    # ISO currency code (EUR, USD, etc.)
    description: str                 # User description of transaction
    category: str                    # Category (Food, Transport, etc.)
    transaction_type: TransactionType # INCOME or EXPENSE
    date: date                       # Transaction date
    tags: List[str] = []            # Optional tags for filtering
    converted_amount: Optional[float] # Amount in base currency
    exchange_rate: Optional[float]   # Exchange rate used for conversion
    
    # Example:
    # Transaction(
    #     amount=25.50,
    #     currency="EUR",
    #     description="Lunch at local restaurant",
    #     category="Food",
    #     transaction_type=TransactionType.EXPENSE,
    #     date=date(2025, 8, 17),
    #     tags=["restaurant", "lunch"],
    #     converted_amount=25.50,
    #     exchange_rate=1.0
    # )
```

#### 1.2 Budget Model
```python
@dataclass
class Budget:
    total_initial_funds: float       # Total budget for entire trip
    base_currency: str               # Primary currency for calculations
    start_date: date                 # Trip/budget start date
    end_date: date                   # Trip/budget end date
    daily_allowance: float = 0.0     # Calculated daily allowance
    current_balance: float = 0.0     # Current balance (updated by transactions)
    
    def __post_init__(self):
        """Auto-calculate daily allowance and set initial balance"""
        if self.daily_allowance == 0.0:
            total_days = (self.end_date - self.start_date).days
            if total_days > 0:
                self.daily_allowance = self.total_initial_funds / total_days
        
        if self.current_balance == 0.0:
            self.current_balance = self.total_initial_funds
```

#### 1.3 Recurring Transaction Model
```python
@dataclass
class RecurringTransaction:
    amount: float                    # Recurring amount
    currency: str                    # Currency code
    description: str                 # Description (e.g., "Monthly rent")
    category: str                    # Category classification
    transaction_type: TransactionType # INCOME or EXPENSE
    start_date: date                 # When recurring starts
    end_date: Optional[date]         # When recurring ends (None = indefinite)
    frequency_days: int              # Frequency in days (30 = monthly)
    tags: List[str] = []            # Optional tags
    is_active: bool = True          # Whether currently active
    
    # Examples:
    # - Monthly salary: frequency_days=30, transaction_type=INCOME
    # - Weekly transport: frequency_days=7, transaction_type=EXPENSE
    # - Daily meal allowance: frequency_days=1, transaction_type=EXPENSE
```

### 2. Health Management Models

#### 2.1 Medicine Alert Model
```python
@dataclass
class MedicineAlert:
    name: str                        # Medicine name
    dosage: str                      # Dosage instructions (e.g., "10mg")
    frequency_hours: int             # Hours between doses (e.g., 8 for 3x daily)
    start_time: str                  # First dose time (HH:MM format)
    start_date: date                 # Start date for medication
    end_date: Optional[date] = None  # End date (None = ongoing)
    notes: str = ""                  # Additional notes/instructions
    timezone: str = "UTC"            # Timezone for scheduling
    is_active: bool = True           # Whether alert is active
    created_date: date = field(default_factory=date.today)
    
    # Example:
    # MedicineAlert(
    #     name="Vitamin D",
    #     dosage="1000 IU",
    #     frequency_hours=24,  # Once daily
    #     start_time="08:00",
    #     start_date=date(2025, 8, 17),
    #     notes="Take with breakfast",
    #     timezone="Europe/Lisbon"
    # )
```

### 3. Timezone Management Models

#### 3.1 Timezone Location Model
```python
@dataclass
class TimezoneLocation:
    name: str                        # Location name (e.g., "Home - New York")
    timezone: str                    # Timezone identifier (e.g., "America/New_York")
    is_home: bool = False           # Whether this is home location
    is_current: bool = False        # Whether currently at this location
    added_date: date = field(default_factory=date.today)
    
    # Examples:
    # TimezoneLocation("Home - New York", "America/New_York", is_home=True)
    # TimezoneLocation("Current - Lisbon", "Europe/Lisbon", is_current=True)
    # TimezoneLocation("Client - Tokyo", "Asia/Tokyo")
```

### 4. User Profile Model
```python
@dataclass
class UserProfile:
    """Complete user data container"""
    budget: Optional[Budget] = None
    transactions: List[Transaction] = field(default_factory=list)
    recurring_transactions: List[RecurringTransaction] = field(default_factory=list)
    medicine_alerts: List[MedicineAlert] = field(default_factory=list)
    timezone_locations: List[TimezoneLocation] = field(default_factory=list)
    savings_goals: List[SavingsGoal] = field(default_factory=list)
    categories: List[str] = field(default_factory=lambda: [
        "Food", "Transportation", "Accommodation", "Entertainment", 
        "Shopping", "Healthcare", "Education", "Miscellaneous"
    ])
    quick_add_items: Dict[str, Dict] = field(default_factory=dict)
    
    # Serialization methods for JSON persistence
    def to_dict(self) -> Dict
    def from_dict(cls, data: Dict) -> 'UserProfile'
```

---

## 🚀 Future Implementations

### 1. Location-Based Services

#### 1.1 Automatic Location Detection
- **Feature ID:** FI-001
- **Description:** Automatic user location identification and timezone detection
- **Implementation Plan:**
  ```python
  # Technical Implementation:
  - Browser Geolocation API integration
  - IP-based location fallback
  - GPS coordinates processing
  - Timezone automatic detection
  - Location history tracking
  
  # Components to Add:
  class LocationService:
      def get_current_location() -> Tuple[float, float]  # lat, lng
      def detect_timezone_from_location(lat: float, lng: float) -> str
      def get_location_from_ip() -> Dict
      def update_current_timezone() -> bool
  
  # Integration Points:
  - Automatic timezone updates when traveling
  - Medicine alert timezone adjustments
  - Location-based spending categories
  - Currency suggestions based on location
  ```

#### 1.2 Smart Spending Recommendations
- **Feature ID:** FI-002
- **Description:** AI-powered recommendations for restaurants, shops, and markets based on daily budget and location
- **Implementation Plan:**
  ```python
  # Recommendation Engine:
  class SpendingRecommendationService:
      def get_restaurant_recommendations(
          budget_available: float,
          location: Tuple[float, float],
          cuisine_preferences: List[str]
      ) -> List[Dict]
      
      def get_grocery_recommendations(
          budget_available: float,
          location: Tuple[float, float]
      ) -> List[Dict]
      
      def get_shopping_recommendations(
          category: str,
          budget_available: float,
          location: Tuple[float, float]
      ) -> List[Dict]
  
  # Data Sources Integration:
  - Google Places API for business information
  - Yelp API for reviews and pricing
  - Foursquare for location data
  - TripAdvisor for travel-specific recommendations
  
  # Recommendation Logic:
  def calculate_recommendation_score(
      venue_price_range: str,
      user_daily_budget: float,
      venue_rating: float,
      distance_km: float
  ) -> float:
      # Algorithm considers:
      # - Price compatibility with remaining daily budget
      # - Quality ratings and reviews
      # - Distance from current location
      # - Historical user preferences
      # - Time of day and meal/shopping patterns
  ```

#### 1.3 Budget-Aware Venue Suggestions
- **Feature ID:** FI-003
- **Description:** Dynamic venue recommendations based on current budget status
- **Features:**
  ```python
  # Budget Status Categories:
  HIGH_BUDGET = "high"      # 150%+ of daily allowance available
  NORMAL_BUDGET = "normal"  # 80-150% of daily allowance available
  LOW_BUDGET = "low"        # 50-80% of daily allowance available
  CRITICAL_BUDGET = "critical"  # <50% of daily allowance available
  
  # Recommendation Strategies:
  if budget_status == HIGH_BUDGET:
      # Recommend premium options
      - High-end restaurants and experiences
      - Quality shopping destinations
      - Premium transportation options
      
  elif budget_status == NORMAL_BUDGET:
      # Balanced recommendations
      - Mid-range dining options
      - Moderate shopping venues
      - Standard transportation
      
  elif budget_status == LOW_BUDGET:
      # Budget-friendly options
      - Local, affordable restaurants
      - Discount stores and markets
      - Public transportation
      
  elif budget_status == CRITICAL_BUDGET:
      # Survival mode recommendations
      - Grocery stores for cooking
      - Free activities and attractions
      - Walking directions
      - Emergency budget tips
  ```

### 2. Advanced Analytics & AI

#### 2.1 Predictive Budget Analytics
- **Feature ID:** FI-004
- **Description:** Machine learning-powered spending prediction and budget optimization
- **Implementation:**
  ```python
  class PredictiveAnalyticsService:
      def predict_monthly_spending(
          historical_data: List[Transaction],
          upcoming_events: List[Dict]
      ) -> Dict[str, float]
      
      def detect_spending_anomalies(
          recent_transactions: List[Transaction]
      ) -> List[Dict]
      
      def optimize_budget_allocation(
          total_budget: float,
          travel_duration: int,
          destination_factors: Dict
      ) -> Dict[str, float]
      
      def generate_saving_opportunities() -> List[Dict]
  ```

#### 2.2 Smart Health Management
- **Feature ID:** FI-005
- **Description:** AI-enhanced health monitoring and medicine management
- **Features:**
  ```python
  class SmartHealthService:
      def analyze_medicine_adherence() -> Dict
      def predict_health_risks_while_traveling() -> List[Dict]
      def recommend_local_healthcare_providers() -> List[Dict]
      def generate_health_travel_checklist() -> List[str]
      def integrate_with_wearable_devices() -> bool
  ```

### 3. Enhanced User Experience

#### 3.1 Mobile Application
- **Feature ID:** FI-006
- **Description:** Native mobile apps for iOS and Android
- **Technology Stack:**
  - React Native or Flutter for cross-platform development
  - Offline-first architecture with data synchronization
  - Push notifications for medicine alerts and budget warnings
  - Camera integration for receipt scanning
  - GPS integration for automatic location tracking

#### 3.2 Voice Interface
- **Feature ID:** FI-007
- **Description:** Voice-controlled expense logging and budget queries
- **Implementation:**
  ```python
  # Voice Commands:
  "Add expense 25 euros for lunch"
  "How much can I spend today?"
  "What's my budget status?"
  "When is my next medicine dose?"
  "What time is it in New York?"
  ```

#### 3.3 Smart Notifications
- **Feature ID:** FI-008
- **Description:** Intelligent notification system
- **Features:**
  - Proactive budget warnings
  - Smart medicine reminders with snooze options
  - Weekly spending summaries
  - Currency exchange rate alerts
  - Travel-specific notifications

### 4. Social and Collaboration Features

#### 4.1 Travel Group Budget Management
- **Feature ID:** FI-009
- **Description:** Shared budgets and expense splitting for travel groups
- **Features:**
  ```python
  class GroupBudgetService:
      def create_shared_budget(participants: List[str]) -> str
      def split_expense(amount: float, participants: List[str]) -> Dict
      def track_group_spending() -> Dict
      def settle_group_expenses() -> Dict
  ```

#### 4.2 Community Features
- **Feature ID:** FI-010
- **Description:** Social features for nomad community
- **Features:**
  - Budget templates sharing
  - Location-based tips and recommendations
  - Expense category suggestions from community
  - Anonymous spending comparisons
  - Travel cost databases

### 5. Advanced Integrations

#### 5.1 Banking Integration
- **Feature ID:** FI-011
- **Description:** Direct bank account and credit card integration
- **Implementation:**
  ```python
  class BankingIntegrationService:
      def connect_bank_account(bank_credentials: Dict) -> bool
      def sync_transactions() -> List[Transaction]
      def categorize_transactions_automatically() -> bool
      def detect_duplicate_entries() -> List[Transaction]
  ```

#### 5.2 Travel Platform Integration
- **Feature ID:** FI-012
- **Description:** Integration with booking platforms and travel services
- **Integrations:**
  - Booking.com for accommodation expenses
  - Airbnb for rental tracking
  - Uber/Lyft for transportation logging
  - Airlines for flight expense import
  - Travel insurance providers

#### 5.3 Cryptocurrency Support
- **Feature ID:** FI-013
- **Description:** Cryptocurrency transaction tracking and management
- **Features:**
  ```python
  class CryptoService:
      def track_crypto_transactions() -> List[Transaction]
      def convert_crypto_to_fiat(amount: float, crypto_type: str) -> float
      def analyze_crypto_volatility_impact() -> Dict
  ```

### 6. Business Intelligence & Reporting

#### 6.1 Advanced Reporting
- **Feature ID:** FI-014
- **Description:** Comprehensive reporting and export capabilities
- **Features:**
  - PDF report generation
  - Excel export with charts
  - Tax preparation assistance
  - Travel expense reports for employers
  - Annual financial summaries

#### 6.2 API for Third-Party Integration
- **Feature ID:** FI-015
- **Description:** RESTful API for external service integration
- **Implementation:**
  ```python
  # API Endpoints:
  GET /api/v1/budget/status
  POST /api/v1/transactions
  GET /api/v1/analytics/spending-trends
  POST /api/v1/medicine-alerts
  GET /api/v1/timezone-comparison
  ```

---

## 🔒 Security Considerations

### 1. Current Security Measures

#### 1.1 Data Protection
```python
# Current Implementation:
- Local JSON file storage (development environment)
- Input validation and sanitization
- Session-based state management
- Error handling without data exposure
- CORS configuration for web security
```

#### 1.2 Input Validation
```python
# Validation Examples:
def validate_transaction_input(form_data: Dict) -> bool:
    # Amount validation
    if not isinstance(amount := float(form_data.get('amount', 0)), float) or amount <= 0:
        raise ValueError("Invalid amount")
    
    # Currency validation
    if currency := form_data.get('currency', '').upper() not in SUPPORTED_CURRENCIES:
        raise ValueError("Unsupported currency")
    
    # Date validation
    if not isinstance(transaction_date := datetime.strptime(form_data.get('date'), '%Y-%m-%d').date(), date):
        raise ValueError("Invalid date format")
```

### 2. Planned Security Enhancements

#### 2.1 Authentication & Authorization
```python
# Future Implementation:
class SecurityService:
    def implement_oauth2_authentication() -> bool
    def setup_multi_factor_authentication() -> bool
    def create_role_based_access_control() -> bool
    def implement_jwt_token_management() -> bool
```

#### 2.2 Data Encryption
```python
# Encryption Strategy:
- End-to-end encryption for sensitive data
- Database encryption at rest
- Transport layer security (TLS/SSL)
- API key encryption and rotation
- Personal data anonymization options
```

#### 2.3 Privacy Compliance
```python
# Compliance Framework:
- GDPR compliance for EU users
- CCPA compliance for California users
- Data retention policies
- Right to deletion implementation
- Data portability features
- Privacy policy automation
```

---

## ⚡ Performance Optimization

### 1. Current Performance Characteristics

#### 1.1 Application Performance
```python
# Current Metrics:
- Page load time: < 2 seconds (local development)
- JSON file read/write: < 50ms for typical user data
- Currency conversion: < 500ms (with API call)
- Template rendering: < 100ms per page
- Memory usage: < 100MB for typical operation
```

#### 1.2 Optimization Techniques Used
```python
# Current Optimizations:
- Efficient data structures (dataclasses vs dictionaries)
- Lazy loading of external API data
- Template caching for repeated renders
- Minimal DOM manipulation
- CSS and JavaScript minification
```

### 2. Planned Performance Improvements

#### 2.1 Caching Strategy
```python
class CacheService:
    def implement_redis_caching() -> bool
    def cache_exchange_rates(duration: int = 3600) -> bool
    def cache_user_analytics(duration: int = 300) -> bool
    def implement_template_caching() -> bool
```

#### 2.2 Database Optimization
```python
# Database Strategy:
- Migration from JSON to PostgreSQL/MongoDB
- Database indexing for transaction queries
- Query optimization and monitoring
- Connection pooling
- Read replica implementation for analytics
```

#### 2.3 Frontend Optimization
```python
# Frontend Improvements:
- Progressive Web App (PWA) implementation
- Service worker for offline functionality
- Image optimization and lazy loading
- JavaScript bundling and code splitting
- CSS critical path optimization
```

---

## 📱 Installation & Setup

### 1. Prerequisites

```bash
# System Requirements:
- Python 3.11 or higher
- pip (Python package installer)
- Virtual environment support
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for exchange rates and API calls

# Operating System Support:
- Linux (Ubuntu 20.04+, CentOS 8+, etc.)
- macOS (10.15+)
- Windows (10+)
```

### 2. Installation Steps

#### 2.1 Environment Setup
```bash
# 1. Clone the repository
git clone https://github.com/your-username/nomadwallet.git
cd nomadwallet

# 2. Create virtual environment
python3 -m venv nomadwallet_env

# 3. Activate virtual environment
# On Linux/macOS:
source nomadwallet_env/bin/activate
# On Windows:
nomadwallet_env\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt
```

#### 2.2 Application Configuration
```bash
# 5. Navigate to web directory
cd nomadwallet/web

# 6. Create data directory
mkdir -p data

# 7. Set environment variables (optional)
export FLASK_ENV=development
export FLASK_DEBUG=1
```

#### 2.3 Running the Application
```bash
# 8. Start the Flask development server
python app.py

# 9. Access the application
# Open browser and navigate to: http://localhost:8080
```

### 3. Production Deployment

#### 3.1 Using Gunicorn (Recommended)
```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn --bind 0.0.0.0:8080 --workers 4 app:app
```

#### 3.2 Using Docker
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8080

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "web.app:app"]
```

#### 3.3 Environment Variables
```bash
# Production Environment Variables:
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:pass@localhost/nomadwallet
REDIS_URL=redis://localhost:6379
EXCHANGE_RATE_API_KEY=your-api-key
```

---

## 🎯 Usage Examples

### 1. Initial Setup Workflow

```python
# Step 1: Access Application
# Navigate to http://localhost:8080

# Step 2: First-Time Setup
# The application automatically detects new users and redirects to setup

# Step 3: Budget Configuration
budget_setup = {
    "total_funds": 5000.00,
    "base_currency": "EUR",
    "start_date": "2025-08-17",
    "end_date": "2025-12-31"
}
# Daily allowance automatically calculated: €36.76 per day
```

### 2. Transaction Management

```python
# Adding a Regular Transaction
transaction = {
    "type": "expense",
    "amount": 25.50,
    "currency": "EUR",
    "description": "Lunch at local restaurant",
    "category": "Food",
    "date": "2025-08-17",
    "tags": "restaurant,lunch"
}

# Adding Recurring Income
recurring_income = {
    "type": "income",
    "amount": 2000.00,
    "currency": "USD",
    "description": "Monthly freelance income",
    "category": "Freelance",
    "frequency_days": 30,
    "start_date": "2025-08-01",
    "end_date": "2025-12-31"
}

# Adding Recurring Expense
recurring_expense = {
    "type": "expense",
    "amount": 400.00,
    "currency": "EUR",
    "description": "Monthly apartment rent",
    "category": "Accommodation",
    "frequency_days": 30,
    "start_date": "2025-08-01",
    "end_date": "2025-12-31"
}
```

### 3. Medicine Alert Setup

```python
# Setting Up Daily Vitamin
vitamin_alert = {
    "name": "Vitamin D",
    "dosage": "1000 IU",
    "frequency_hours": 24,  # Once per day
    "start_time": "08:00",
    "start_date": "2025-08-17",
    "notes": "Take with breakfast for better absorption",
    "timezone": "Europe/Lisbon"
}

# Setting Up Medication with Multiple Doses
medication_alert = {
    "name": "Blood Pressure Medication",
    "dosage": "10mg",
    "frequency_hours": 12,  # Twice per day
    "start_time": "08:00",  # 8 AM and 8 PM
    "start_date": "2025-08-17",
    "end_date": "2025-09-17",  # One month course
    "notes": "Take with food, avoid grapefruit",
    "timezone": "Europe/Lisbon"
}
```

### 4. Timezone Management

```python
# Adding Home Location
home_location = {
    "name": "Home - New York",
    "timezone": "America/New_York",
    "is_home": True,
    "is_current": False
}

# Adding Current Location
current_location = {
    "name": "Current - Lisbon",
    "timezone": "Europe/Lisbon",
    "is_home": False,
    "is_current": True
}

# Adding Important Business Location
business_location = {
    "name": "Client Office - Tokyo",
    "timezone": "Asia/Tokyo",
    "is_home": False,
    "is_current": False
}
```

### 5. API Usage Examples

```python
# Getting Budget Health Status
import requests

response = requests.get('http://localhost:8080/api/budget_health')
budget_health = response.json()
# Returns: {
#     "status": "healthy",
#     "daily_allowance": 36.76,
#     "current_balance": 4500.00,
#     "days_remaining": 136,
#     "projected_end_balance": 200.00
# }

# Getting Spending Trend Data
response = requests.get('http://localhost:8080/api/spending_trend/30')
spending_trend = response.json()
# Returns: {
#     "labels": ["2025-08-01", "2025-08-02", ...],
#     "values": [45.20, 32.10, 28.50, ...]
# }
```

---

## 🤝 Contributing

### 1. Development Guidelines

#### 1.1 Code Style
```python
# Follow PEP 8 Python style guidelines
# Use type hints for all function parameters and returns
# Write comprehensive docstrings for all classes and methods

def calculate_daily_allowance(
    total_funds: float, 
    start_date: date, 
    end_date: date
) -> float:
    """
    Calculate daily allowance based on total funds and date range.
    
    Args:
        total_funds: Total available funds for the period
        start_date: Start date of the budget period
        end_date: End date of the budget period
        
    Returns:
        Daily allowance amount as a float
        
    Raises:
        ValueError: If end_date is before start_date
    """
    if end_date <= start_date:
        raise ValueError("End date must be after start date")
    
    total_days = (end_date - start_date).days
    return total_funds / total_days if total_days > 0 else 0.0
```

#### 1.2 Testing Requirements
```python
# Unit tests for all business logic
# Integration tests for API endpoints
# UI tests for critical user workflows

# Example test structure:
def test_calculate_daily_allowance():
    start_date = date(2025, 8, 1)
    end_date = date(2025, 8, 31)
    total_funds = 1000.0
    
    result = calculate_daily_allowance(total_funds, start_date, end_date)
    
    assert result == 33.33  # 1000 / 30 days
```

#### 1.3 Documentation Standards
```python
# All new features must include:
# - Comprehensive README updates
# - API documentation (if applicable)
# - User guide updates
# - Code comments for complex logic
# - Database schema changes (if applicable)
```

### 2. Contribution Process

#### 2.1 Feature Development
```bash
# 1. Fork the repository
# 2. Create feature branch
git checkout -b feature/smart-recommendations

# 3. Implement feature with tests
# 4. Update documentation
# 5. Submit pull request with detailed description
```

#### 2.2 Bug Reports
```python
# Bug Report Template:
# - Environment details (OS, Python version, browser)
# - Steps to reproduce
# - Expected behavior
# - Actual behavior
# - Screenshots or error logs
# - Suggested fix (if known)
```

### 3. Development Roadmap

#### Q4 2025
- [ ] Complete medicine alert system
- [ ] Enhance timezone management features
- [ ] Implement comprehensive testing suite
- [ ] Add data export/import functionality

#### Q1 2026
- [ ] Location-based recommendations (FI-001, FI-002)
- [ ] Mobile application development
- [ ] Advanced analytics dashboard
- [ ] Banking integration pilot

#### Q2 2026
- [ ] Predictive analytics implementation
- [ ] Social features and community platform
- [ ] Multi-language support
- [ ] Advanced security features

#### Q3 2026
- [ ] AI-powered recommendations
- [ ] Cryptocurrency support
- [ ] Enterprise features
- [ ] Performance optimization

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

- **Documentation:** This README and inline code documentation
- **Issues:** GitHub Issues tracker
- **Discussions:** GitHub Discussions for feature requests and general questions
- **Email:** [your-email@example.com]
- **Community:** Join our Slack/Discord for real-time discussion

---

## 🙏 Acknowledgments

- **Flask Community** for the excellent web framework
- **Python Community** for comprehensive libraries
- **Exchange Rate APIs** for real-time currency data
- **Timezone Database** maintainers for accurate timezone information
- **Open Source Contributors** who inspire continuous improvement

---

*Last Updated: August 17, 2025*  
*Version: 1.0.0*  
*Maintainer: NomadWallet Development Team*
# nomad_app
