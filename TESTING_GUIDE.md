# UMULOPA Safe Transfer — Frontend Testing Guide

## Purpose

This guide is for testing the **frontend-only demo environment** of **UMULOPA Safe Transfer**, operated by the **Zambia National Blood Transfusion Service (ZNBTS), Copperbelt Province**.

All names, email addresses, phone numbers, patient records, donor records, hospital records and transactions in this dataset are **fictional test data**. They are not production ZNBTS records.

---

# 1. Test Credentials

All seeded demo accounts use the same password:

```text
ZNBTS@2026!
```

| Account | Email | Access role | Hospital / Scope |
|---|---|---|---|
| System Administrator | `admin@znbts.co.zm` | System Administrator | ZNBTS |
| Regional Officer | `mwansa@centre.zm` | Regional Blood Centre | ZNBTS Copperbelt Regional Centre |
| Hospital Administrator | `mary.phiri@ndola.org` | Hospital Staff | Ndola Teaching Hospital |
| Blood Bank Officer | `peter.mwansa@ndola.org` | Hospital Staff | Ndola Teaching Hospital |
| Medical Officer | `chola@ndola.org` | Hospital Staff | Ndola Teaching Hospital |
| Nurse | `ruth.chanda@ndola.org` | Hospital Staff | Ndola Teaching Hospital |
| Records Officer | `david.mulenga@ndola.org` | Hospital Staff | Ndola Teaching Hospital |
| Hospital Manager | `agnes.kunda@kitwe.org` | Hospital Staff | Kitwe Teaching Hospital |
| Blood Bank Officer | `brian.zulu@kitwe.org` | Hospital Staff | Kitwe Teaching Hospital |
| Nurse | `lydia.bwalya@mufulira.org` | Hospital Staff | Mufulira District Hospital |
| Blood Donor | `grace.phiri@test.zm` | Blood Donor | Donor portal |
| Blood Donor | `tina.chanda@test.zm` | Blood Donor | Donor portal |
| Blood Donor | `moses.kamanga@test.zm` | Blood Donor | Donor portal |
| Blood Donor | `ruth.phiri@mail.com` | Blood Donor | Donor portal |

### Admin test

```text
Email: admin@znbts.co.zm
Password: ZNBTS@2026!
Access role: System Administrator
```

### Regional test

```text
Email: mwansa@centre.zm
Password: ZNBTS@2026!
Access role: Regional Blood Centre
```

### Hospital staff test

Example:

```text
Email: peter.mwansa@ndola.org
Password: ZNBTS@2026!
Access role: Hospital Staff
```

The selected role must match the account's actual role.

### Donor test

```text
Email: grace.phiri@test.zm
Password: ZNBTS@2026!
Access role: Blood Donor
```

---

# 2. Seeded Hospitals

| ID | Hospital | District | Status |
|---:|---|---|---|
| 1 | Ndola Teaching Hospital | Ndola | Active |
| 2 | Kitwe Teaching Hospital | Kitwe | Active |
| 3 | Mufulira District Hospital | Mufulira | Active |
| 4 | Chingola District Hospital | Chingola | Active |
| 5 | Luanshya District Hospital | Luanshya | Active |
| 6 | Chililabombwe District Hospital | Chililabombwe | Active |
| 7 | Copperbelt Mission Hospital | Ndola | Active |
| 8 | Kafue Riverside Hospital | Kitwe | Pending |

The pending hospital is intentionally included so the ZNBTS administrator can test **hospital approval/rejection workflows**.

---

# 3. Seeded Patient Data

The demo contains 12 patients distributed across Copperbelt hospitals.

Examples:

| Patient | Blood group | Hospital | Scenario |
|---|---|---|---|
| Amina Mwansa | A+ | Ndola Teaching Hospital | Postpartum haemorrhage |
| Joseph Banda | O- | Ndola Teaching Hospital | Road traffic injury |
| Mary Chanda | B+ | Kitwe Teaching Hospital | Severe anaemia |
| Esther Kunda | AB+ | Kitwe Teaching Hospital | Surgical blood loss |
| Patrick Mwale | O+ | Mufulira District Hospital | Trauma |
| Nancy Phiri | A- | Chingola District Hospital | Obstetric emergency |
| Felix Mulenga | B- | Luanshya District Hospital | Gastrointestinal bleed |
| Chipo Sakala | O+ | Chililabombwe District Hospital | Severe anaemia |
| Kelvin Tembo | AB- | Ndola Teaching Hospital | Emergency surgery |
| Martha Zulu | A+ | Copperbelt Mission Hospital | Obstetric haemorrhage |

Use these records to test patient search, blood requests, history, transfusions, duplicate prevention and hospital-level data handling.

---

# 4. Seeded Blood Requests

The dataset deliberately contains multiple request states:

- Pending
- Approved
- Delivered
- In Progress
- Completed
- Rejected
- Emergency
- Critical

Important test cases include:

```text
REQ-001 → A+ → 2 units → High → Pending
REQ-002 → O- → 1 unit → Critical → Approved
REQ-003 → B+ → 3 units → Medium → Delivered
REQ-004 → AB+ → 2 units → High → In Progress
REQ-005 → O+ → 1 unit → Low → Completed
REQ-006 → A- → 2 units → Emergency → Pending
REQ-007 → B- → 1 unit → High → Rejected
REQ-008 → AB- → 1 unit → Critical → Pending
```

These records are intentionally varied so status filters, urgent workflows, analytics and donor emergency mobilisation can be tested.

---

# 5. Seeded Donors

Eight fictional donors are included.

Important blood groups include:

```text
A+
O-
B+
O+
A-
AB+
B-
```

The donor records are linked to:

```text
Donor account
    ↓
donorId
    ↓
Donor profile
    ↓
Appointments
    ↓
Donation history
    ↓
Emergency blood requests
```

There is **no reward or payment functionality**.

---

# 6. Donor Testing

Sign in as:

```text
Email: grace.phiri@test.zm
Password: ZNBTS@2026!
Role: Blood Donor
```

Test:

1. Open donor dashboard.
2. Check donor profile.
3. Open eligibility.
4. View donation history.
5. View appointments.
6. Open emergency mobilisation.
7. Respond to a matching O/A/B/AB emergency request where available.
8. Verify the donor response is recorded.
9. Sign out.

Use `tina.chanda@test.zm` to test the O- emergency path.

---

# 7. Blood Inventory Testing

The frontend contains network inventory for:

```text
ZNBTS Copperbelt Regional Centre
Ndola Teaching Hospital
Kitwe Teaching Hospital
Mufulira District Hospital
Chingola District Hospital
Luanshya District Hospital
Chililabombwe District Hospital
Copperbelt Mission Hospital
```

All eight blood groups are represented:

```text
A+  A-
B+  B-
AB+ AB-
O+  O-
```

Inventory states include:

```text
Testing
Available
Reserved
Issued
Expired
Discarded
```

---

# 8. Real-Time / Network Inventory Test

Open the **Live Blood Availability** page.

Test with the regional account:

```text
mwansa@centre.zm
ZNBTS@2026!
```

Then test with a hospital account:

```text
peter.mwansa@ndola.org
ZNBTS@2026!
```

Verify that authorized hospital users can see ZNBTS availability and that the regional/ZNBTS view can see hospital-level availability.

### Transfer test

Use the regional role to perform a supported transfer.

Example seeded transfer:

```text
ZNBTS Copperbelt Regional Centre
        ↓
5 × O-
        ↓
Ndola Teaching Hospital
```

The source quantity must decrease and the destination quantity must increase.

The transaction should also appear in the inventory transaction/audit data.

---

# 9. Blood Collection / Inventory Lifecycle

When testing a new blood collection, verify that it does not immediately become clinically available merely because it was collected.

The intended lifecycle is:

```text
Collected
   ↓
Testing
   ↓
Processed
   ↓
Available
```

Then operational movement can produce:

```text
Available → Reserved
Available → Issued
Available → Expired
Available → Discarded
```

Inventory must never become negative.

---

# 10. Hospital Administrator Testing

Use:

```text
Email: mary.phiri@ndola.org
Password: ZNBTS@2026!
Role: Hospital Staff
```

Test:

- Staff Management
- Add staff
- View staff
- Patient registration
- Blood requests
- Transfusion records
- Hospital escalation
- Live blood availability
- Reports

The administrator should only manage staff belonging to **Ndola Teaching Hospital**.

---

# 11. Blood Bank Officer Testing

Use:

```text
Email: peter.mwansa@ndola.org
Password: ZNBTS@2026!
Role: Hospital Staff
```

Test:

- Blood inventory
- Add blood pack
- Live blood availability
- Blood requests
- Donor registry
- Low-stock report
- Transfusion history
- Emergency escalation

---

# 12. Medical Officer Testing

Use:

```text
Email: chola@ndola.org
Password: ZNBTS@2026!
Role: Hospital Staff
```

Test:

- Patient management
- Patient registration
- Blood requests
- Request history
- Transfusion history
- Donor registry
- Emergency escalation

---

# 13. Nurse Testing

Use:

```text
Email: ruth.chanda@ndola.org
Password: ZNBTS@2026!
Role: Hospital Staff
```

Test:

- Patient records
- Blood requests
- Transfusion workflow
- Emergency escalation

Attempting an unauthorized administrative route should be blocked by the role/permission layer.

---

# 14. Records Officer Testing

Use:

```text
Email: david.mulenga@ndola.org
Password: ZNBTS@2026!
Role: Hospital Staff
```

Test:

- Patient registration
- Patient search
- Patient history
- Weekly reporting
- Duplicate prevention

Attempt to access inventory administration and staff management to verify restrictions.

---

# 15. Hospital Manager Testing

Use:

```text
Email: agnes.kunda@kitwe.org
Password: ZNBTS@2026!
Role: Hospital Staff
```

Test:

- Hospital operational dashboard
- Reports
- Usage statistics
- Monthly report
- Low-stock report
- Staff overview
- Patient history
- Transfusion history

---

# 16. ZNBTS Regional Testing

Use:

```text
Email: mwansa@centre.zm
Password: ZNBTS@2026!
Role: Regional Blood Centre
```

Test:

- Regional dashboard
- Copperbelt hospital list
- Live network inventory
- ZNBTS inventory
- Distribution
- Transfers
- Emergency requests
- Regional analytics
- Regional reports
- Escalations

Verify that the regional dashboard can aggregate hospital information without duplicating records.

---

# 17. System Administrator Testing

Use:

```text
Email: admin@znbts.co.zm
Password: ZNBTS@2026!
Role: System Administrator
```

Test:

- Dashboard
- User management
- Roles
- Permissions
- Hospital management
- Hospital approval
- Audit logs
- Reports
- System health
- Backup page
- Settings
- Network inventory

### Hospital approval test

Find:

```text
Kafue Riverside Hospital
Status: Pending
```

Open the application and test the approval/rejection workflow.

---

# 18. Analytics Reconciliation Tests

Do not only check whether a number is displayed. Check whether it makes mathematical sense.

Examples:

```text
Male + Female + Other/Unknown = Total Patients
```

and:

```text
ZNBTS Stock
+ Hospital Stock
= Copperbelt Network Stock
```

and request totals should reconcile with their underlying records.

If a dashboard shows an independent number that cannot be traced to the seeded data or an operation performed during testing, treat it as a defect.

---

# 19. Duplicate Record Testing

Try registering the same patient twice using the same identifying information.

Expected behaviour:

```text
Possible duplicate detected
        ↓
Do not create a second record
```

Repeat this principle for blood requests and other records where the application provides duplicate protection.

---

# 20. View All Testing

Every **View All** action should navigate to the relevant complete dataset.

Test:

- View all patients
- View all hospitals
- View all donors
- View all blood requests
- View all inventory
- View all transfers
- View all escalations
- View all reports/history where present

There should be no decorative View All buttons that do nothing.

---

# 21. Escalation Testing

Use a hospital staff account and create/open an escalation.

The destination should be explicit:

```text
Hospital
   ↓
ZNBTS Copperbelt Regional Centre
```

Verify that the escalation contains enough information to identify:

- Originating hospital
- Staff member
- Issue
- Priority
- Date/time
- Status
- Destination

---

# 22. Resetting the Demo Dataset

The application stores frontend test state in browser `localStorage`.

If you have changed the seeded records and want a clean test run:

### Option A — Browser DevTools

1. Start the application.
2. Open Chrome/Edge DevTools (`F12`).
3. Open **Application**.
4. Open **Local Storage**.
5. Select the application origin, e.g. `http://localhost:5173`.
6. Remove keys beginning with:

```text
znbts_
umulopa_
```

7. Reload the application.

The seeded demo dataset will be loaded again.

### Option B — Clear site data

Use the browser's site-data controls for the local application origin and reload.

> Do not clear unrelated production/browser data when testing a real deployed environment.

---

# 23. Where the Test Information Lives

The deterministic seed dataset is stored in:

```text
src/data/demoSeedData.js
```

The application state loader is in:

```text
src/context/AppStateProvider.jsx
```

Role definitions and route permissions are in:

```text
src/utils/roles.js
```

Inventory calculations and transaction rules are in:

```text
src/utils/networkInventory.js
```

Authentication helpers are in:

```text
src/utils/password.js
src/utils/authStorage.js
```

The main functional testing pages are under:

```text
src/pages/
```

---

# 24. Important Demo-Environment Boundary

This is a **frontend test environment**.

The seeded accounts and records are intended only to exercise the UI, state management, role permissions, workflows, navigation, analytics and integration contracts before the production backend/database is connected.

Do not use these credentials for production.

When the real backend is connected, authentication, authorization, database persistence, audit logging and real-time inventory synchronization must be enforced by the backend/database rather than trusted solely to browser state.
