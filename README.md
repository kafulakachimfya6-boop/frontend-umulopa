# UMULOPA Safe Transfer

### Zambia National Blood Transfusion Service (ZNBTS) — Copperbelt Province

**UMULOPA Safe Transfer** is a province-wide digital blood-management and safe-transfer platform designed for the **Zambia National Blood Transfusion Service (ZNBTS), Copperbelt Province**.

The platform connects **ZNBTS, hospitals, hospital staff, donors, blood inventory, blood requests, transfers, escalations, analytics, and operational reporting** through a role-based architecture designed for production backend and database integration.

> **System name:** UMULOPA Safe Transfer  
> **Operating institution:** Zambia National Blood Transfusion Service (ZNBTS)  
> **Operational scope:** Copperbelt Province, Zambia

---

## ✨ Core Capabilities

### 🏥 Hospital Management
- Hospital self-registration
- ZNBTS verification and approval workflow
- Hospital activation/suspension
- Hospital administrator accounts
- Hospital-scoped data and permissions
- Staff management

### 👥 Staff & Role-Based Access
Individual staff accounts are supported rather than shared hospital credentials.

Supported operational roles include:
- Hospital Administrator
- Blood Bank Officer
- Medical Officer
- Nurse
- Records Officer
- Hospital Manager
- ZNBTS administrative/regional roles

Each role receives access appropriate to its responsibilities.

### 🩸 Blood Inventory Management
Inventory is designed around blood units/components and transaction history rather than fabricated dashboard totals.

Blood lifecycle:

```text
Collected → Testing → Processed → Available → Reserved → Issued / Transfused
```

Other states include `Expired`, `Discarded`, and `Returned`.

### 🔄 ZNBTS ↔ Hospital Inventory Visibility
Authorized hospital users can view relevant ZNBTS availability, while ZNBTS can view hospital-level availability across Copperbelt.

Transfers reconcile both sides:

```text
ZNBTS Stock → Transfer → Hospital Stock
```

Inventory operations should be persisted as auditable transactions in the production backend.

### 🩸 Donor Management
Donors can:
- Register an account and log in
- Maintain a donor profile
- View donation history
- View eligibility information
- Book donation appointments
- Receive donation-related notifications
- Participate in emergency blood mobilisation

Donor accounts are linked to donation records using a unique donor identifier.

**Blood donation is voluntary: this system contains no payment, points, vouchers, rewards, or gamification functionality.**

### 🚨 Blood Requests & Escalations
Hospitals can submit blood requests containing the hospital, requesting staff member, blood group, quantity, priority, reason, status, and timestamps.

Escalation flow:

```text
Hospital → Authorized Hospital Staff → ZNBTS Copperbelt Regional Team → Further ZNBTS escalation where required
```

### 📊 Analytics
Analytics are intended to derive from authoritative operational records, including:
- Patients
- Blood requests
- Donations
- Blood availability
- Hospital stock
- ZNBTS stock
- Transfusions
- Expiring units
- Critical blood groups
- Hospital activity

Totals should reconcile with their source records and should never be independently fabricated.

### 🔐 Security & Data Isolation
The architecture supports:
- Role-based access control
- Facility/hospital scoping
- Individual accounts
- Password handling
- Permission-aware navigation
- Audit-friendly transactions
- Backend authorization requirements
- Cross-hospital patient-data isolation

Frontend visibility must not replace backend authorization in production.

---

## 🏗️ High-Level Architecture

```text
                         UMULOPA SAFE TRANSFER
                                  │
                         ZNBTS Copperbelt
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
     Hospitals                  Donors                 ZNBTS Staff
        │                         │                         │
        ↓                         ↓                         ↓
  Hospital Users            Donor Accounts          Regional/Admin
        │                         │                         │
        └──────────────┬──────────┴──────────────┬─────────┘
                       ↓                         ↓
                 Operational Data          Blood Operations
                       │                         │
                       └────────────┬────────────┘
                                    ↓
                           Blood Inventory
                                    │
                ┌───────────────────┼───────────────────┐
                ↓                   ↓                   ↓
           ZNBTS Stock        Hospital Stock       Transfers
                │                   │                   │
                └───────────────────┼───────────────────┘
                                    ↓
                         Requests / Escalations
                                    ↓
                         Analytics & Reporting
```

---

## 👤 User Flows

### Hospital

```text
Register Hospital → ZNBTS Verification → Approval → Hospital Activated
→ Hospital Administrator → Staff Accounts → Role-Specific Dashboards
```

### Donor

```text
Donor Registration → Donor Account → Profile → Eligibility
→ Appointment → Donation → Donation History
```

### Blood Request

```text
Hospital → Create Request → Availability Check → Authorized Review
→ Allocation / Transfer → Hospital Receives Blood → Inventory Reconciled
```

---

## 🧭 Dashboards

### ZNBTS Dashboard
Province-wide inventory, hospital availability, ZNBTS stock, blood requests, critical stock, expiry monitoring, hospital activity, escalations, and regional analytics.

### Hospital Administrator Dashboard
Hospital statistics, staff management, blood availability, requests, inventory, reports, escalations, and hospital profile.

### Blood Bank Officer Dashboard
Inventory, collections, testing status, requests, transfers, expiry monitoring, and issuing/transfusion records.

### Medical Officer Dashboard
Patients, clinical blood requests, urgent requests, transfusion-related records, and escalations.

### Nurse Dashboard
Patients, approved blood requests, transfusion workflow, observations, and adverse-event reporting.

### Records Officer Dashboard
Patient registration/search, records management, duplicate prevention, and reports.

### Hospital Manager Dashboard
Operational performance, blood utilization, activity, stock trends, and reports.

### Donor Dashboard
Profile, eligibility, donation history, appointments, donation centres, notifications, and emergency mobilisation.

---

## 🛠️ Technology

The frontend is a modern component-based web application. The repository should be treated as the source of truth for exact versions and scripts.

Typical tooling includes:
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Client-side routing
- Role-aware application state
- Automated tests
- Backend/API integration boundaries

---

## 🚀 Getting Started

### Prerequisites

Install Node.js and npm. Use the version required by the project's configuration/lockfile.

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Tests

```bash
npm run test
```

Use `package.json` as the authoritative source if script names change.

---

## 🔌 Backend Integration Contract

UMULOPA Safe Transfer is intended to connect to authoritative backend services for:

### Authentication
- Registration and login
- Password reset
- Sessions/tokens
- Account activation/deactivation
- Role assignment

### Hospital APIs
- Hospital registration
- Approval
- Profiles
- Staff management

### Donor APIs
- Registration
- Profiles
- Eligibility
- Appointments
- Donation history

### Inventory APIs
- Blood units/components
- Balances
- Transactions
- Transfers
- Reservations
- Issuing
- Expiry/disposal

### Blood Request APIs
- Create
- Review
- Approve/reject
- Allocate
- Transfer
- Complete

### Escalation APIs
- Create
- Assign
- Update status
- Resolve/close

### Analytics APIs
Analytics must be calculated from authoritative database records rather than hard-coded frontend counters.

---

## ⚡ Real-Time Integration

For production, real-time inventory changes should be delivered by an authenticated backend mechanism such as WebSockets, Server-Sent Events, Supabase Realtime, or an equivalent service.

```text
Hospital Operation
       ↓
Backend Transaction
       ↓
Database Commit
       ↓
Inventory Event
       ↓
Authorized Dashboards Update
```

The database transaction is authoritative; a frontend event alone must never be treated as proof that stock changed.

---

## 🗄️ Database Principles

The production database should enforce:
- Primary and foreign keys
- Unique/check constraints
- Transaction integrity
- Referential integrity
- Facility ownership
- Role permissions
- Audit records
- Idempotency for critical operations
- Consistent timestamps
- Inventory reconciliation

Core relationships:

```text
Hospital ── Staff
        ├─ Patients
        ├─ Blood Requests
        ├─ Inventory
        └─ Transfers

Donor ── Appointments
      ├─ Donations
      └─ Eligibility

Donation ── Blood Unit / Component ── Inventory Transactions

Blood Request ── Allocation / Transfer

Transfer ── Source Facility + Destination Facility
```

---

## 🧪 Testing & Quality

Critical testing should cover:
- Authentication and registration
- Hospital approval
- Staff management
- Donor workflows
- Patient workflows
- Blood requests
- Inventory and transfers
- Escalations
- Analytics
- Navigation
- Duplicate prevention
- Inventory reconciliation
- Negative stock prevention
- Valid state transitions
- Facility isolation
- Role restrictions
- Forms, validation, loading, error and empty states

The repository's test suite and CI environment should be used as the final authority for executable test status.

---

## 🛡️ Operational Safety Principles

1. Never fabricate operational data.
2. Never allow negative inventory.
3. Never expose donor medical information to unauthorized users.
4. Never expose one hospital's patient records to another hospital.
5. Never treat frontend state as the authoritative inventory source.
6. Every inventory movement must be traceable.
7. Critical operations must be authorized by the backend.
8. Analytics must reconcile with underlying records.
9. Collected blood is not automatically equivalent to blood cleared for clinical use.
10. Production deployment requires backend, database, authentication, authorization, audit logging, real-time synchronization, backup, and monitoring controls.

---

## 🌍 Operational Scope

UMULOPA Safe Transfer is designed for the **Copperbelt Province of Zambia** and supports multiple hospitals/facilities while maintaining facility-level data isolation and province-wide visibility for authorized ZNBTS personnel.

The architecture can be extended to additional ZNBTS regions and provinces without changing the core domain model.

---

## 🔒 Privacy & Security

This platform is intended for sensitive healthcare and blood-management information. Before production use, connected backend infrastructure must provide appropriate authentication, authorization, encryption in transit, secure password storage, session management, audit logging, backups, database access controls, secrets management, monitoring, and incident response.

**Never commit production secrets, API keys, database credentials, or private environment files to GitHub.**

---

## 🤝 Development Standards

Contributors should:
- Avoid dead code and duplicate implementations
- Keep business rules centralized
- Use typed interfaces/contracts
- Preserve role and facility boundaries
- Avoid hard-coded operational statistics
- Keep inventory transaction-based
- Add tests for critical business rules
- Maintain auditable workflows
- Keep patient and donor data appropriately isolated

---

## 📜 System Identity

**UMULOPA Safe Transfer**  
**Operated by:** Zambia National Blood Transfusion Service (ZNBTS)  
**Region:** Copperbelt Province, Zambia

**Purpose:** Digital coordination of blood donation, blood inventory, hospital blood requests, safe transfers, donor services, hospital operations, escalations, analytics, and province-wide blood availability.

---


## 🧪 Frontend Test Dataset

A deterministic fictional dataset is included for end-to-end frontend testing. It provides System Administrator, Regional Blood Centre, hospital staff and donor accounts, multiple hospitals, patients, blood requests, transfusions, donor appointments/donations, emergency requests, transfers, inventory transactions and audit records.

**Test credentials and step-by-step workflows:** see [`TESTING_GUIDE.md`](./TESTING_GUIDE.md).

The dataset is defined in `src/data/demoSeedData.js` and is intended for local/demo testing only.

## ⚠️ Deployment Status

This repository represents the frontend and operational UX architecture prepared for connection to production backend and database services. Production readiness requires the connected backend to enforce authentication, authorization, persistence, real-time synchronization, auditability, and transactional inventory controls.

---

## 📄 License

Add the organization's approved license before making the repository public.

## 📱 Responsive & Operational UX

The interface is designed for desktop, tablet, and mobile operation. Primary workspace navigation remains accessible through a scrollable mobile drawer, long tables use touch-friendly horizontal scrolling, forms collapse to single-column layouts on small screens, and modal content can scroll vertically without clipping fields or actions. Operational controls maintain touch-friendly targets and role-specific navigation remains visible rather than relying on inaccessible hidden fields.

## Latest user-test release

The latest release includes the eight real-environment fixes documented in `USER_TEST_FIXES.md`, including strict hospital data isolation, shared donor eligibility logic, ZNBTS inventory receipt/expiry controls, Kitwe/KTH organisational naming, functional newsletter administration, clickable dashboard navigation, and role-specific operational boundaries.

## Hospital Blood Bank Operations

Hospital blood banks have a dedicated operational workflow for:

- recording blood collections with collection dates and expiry dates;
- keeping collected units in **Testing** until they are cleared;
- releasing tested units into **Available** clinical stock;
- recording blood usage/issue and maintaining issued quantities;
- recording expired units and removing them from usable stock;
- viewing lot-level collection and expiry information;
- exposing authorized hospital stock to the ZNBTS network view;
- requesting available blood from configured nearby/partner hospitals during shortages;
- allowing a source hospital to fulfil a nearby request with synchronized transfer-out and transfer-in inventory transactions;
- escalating an unfulfilled nearby request to the **ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)** for coordinated ZNBTS supply.

The production backend must make transfer and inventory operations atomic and enforce facility-level authorization. Real-time events should be published only after the authoritative database transaction commits.

## 🏥 ZNBTS Blood-Service Capability Authorization

Hospital registration does **not** automatically authorize blood-service activities.

During registration, a hospital can request capabilities such as:

- Blood collection
- Blood testing/screening
- Blood storage
- Component processing
- Crossmatching
- Blood issue/release

A ZNBTS administrator must explicitly grant or revoke each capability.

This prevents a hospital without laboratory authority from marking collected blood as clinically available.

For a hospital that can collect but cannot test:

```text
Collection
   ↓
Pending ZNBTS Testing
   ↓
ZNBTS receives collection
   ↓
ZNBTS Testing
   ↓
ZNBTS Release
   ↓
Available
```

For a hospital authorized to test:

```text
Collection → Authorized Testing → Release → Available
```

ZNBTS users can see the live facility-level state, including **Available, Testing, Awaiting ZNBTS Testing, Reserved, Issued/Used, Expired and Discarded**.

## 🏥 ZNBTS Blood-Service Capability Authorization

Hospital registration does **not** automatically authorize blood-service activities. A hospital may request Blood Collection, Testing/Screening, Storage, Component Processing, Crossmatching and Blood Issue/Release. A ZNBTS administrator explicitly grants or revokes each capability.

For a hospital that can collect but cannot test:

```text
Collection → Pending ZNBTS Testing → ZNBTS receives → ZNBTS Testing → ZNBTS Release → Available
```

For an authorized testing facility:

```text
Collection → Authorized Testing → Release → Available
```

ZNBTS can see facility-level **Available, Testing, Awaiting ZNBTS Testing, Reserved, Issued/Used, Expired and Discarded** states. Inventory movements are transaction-based and timestamped.

### Seeded Copperbelt Facility

The demo dataset includes **Arthur Davison Children's Hospital** as a separate Ndola hospital tenant with its own staff, patients, blood requests, transfusion history and blood-bank inventory. It is intentionally separate from Ndola Teaching Hospital for data-isolation testing.
