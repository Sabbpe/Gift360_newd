## Sabbpe Gift Voucher – System Overview

This document explains the project in **simple language**, so that anyone (tech or non‑tech) can understand:

- **What each main module does**
- **How OTP based login / registration works with MSG91**
- **Where the database work actually happens**

---

## 1. Tech Stack (What This App Uses)

- **Frontend framework**: React (latest, function components + hooks)
- **Language**: TypeScript
- **Build tool / dev server**: Vite
- **Routing**: `wouter` (simple React router)
- **Data fetching & caching**: TanStack React Query
- **HTTP client**: Axios
- **Styling**:
  - Tailwind CSS
  - DaisyUI / Radix UI components (for modals, dialogs, etc.)
- **State management**:
  - React Context (`AuthContext`, `ConfigContext`, etc.)
  - React Query cache for server data
- **Storage**:
  - `localStorage` for auth token + user session
- **3rd‑party services**:
  - **MSG91** – sending and verifying OTPs for mobile
  - Payment gateways (e.g. Easebuzz / Atom) via backend APIs

This tech stack is important because:

- It explains **where to plug in** new flows (e.g. new auth endpoints → `authApi` + hooks + pages).
- It shows **where OTP and DB logic should NOT live** (they should be in the backend, not directly in React components).

---

## 2. How to Run This Project

> The actual React app lives in the inner folder `sabbpe-gift-voucher/sabbpe-gift-voucher`.  
> Run all Node commands **inside that inner folder**, not the outer one.

- **1. Go to the app folder**

  From `H:\sabbpe-gift-voucher`:

  ```bash
  cd sabbpe-gift-voucher
  ```

- **2. Install dependencies**

  ```bash
  npm install
  ```

- **3. Set environment variables**

  Create or edit the `.env` file in this folder and define the backend URLs, for example:

  ```bash
  VITE_AUTH_API_URL=https://your-auth-backend.example.com
  VITE_BRAND_API_URL=https://your-brand-backend.example.com
  VITE_GIFTCARD_API_URL=https://your-giftcard-backend.example.com
  VITE_PAYMENT_API_URL=https://your-payment-backend.example.com
  VITE_MAIL_URL=https://your-mail-backend.example.com
  ```

  - These values should point to your **backend services** (dev / staging / prod).
  - MSG91 keys / widget IDs are currently **hardcoded in the code**; long‑term, you should move them into env variables as well.

- **4. Start the dev server**

  ```bash
  npm run dev
  ```

  Then open the printed URL in the browser (usually `http://localhost:5173`).

- **5. Build for production (optional)**

  ```bash
  npm run build
  npm run preview   # to test the built app locally
  ```

---

## 3. How to Run the ValueDesign Backend (Spring Boot)

The **ValueDesign** backend is a separate Java/Spring Boot project located at `ValueDesign/` (alongside this frontend folder) and built with **Maven** (`pom.xml`).

**ValueDesign backend tech stack (high level):**

- **Language / Runtime**: Java 17  
- **Framework**: Spring Boot 4 (Spring Web + Spring WebFlux + Spring Data JPA)  
- **Build tool**: Maven (`pom.xml`)  
- **Application packaging**: WAR (`valuedesign-0.0.1-SNAPSHOT.war`)  
- **Database driver**: MariaDB JDBC client  
- **ORM / persistence**: JPA/Hibernate via Spring Data JPA  
- **Security / JWT & crypto helpers**: Uses BouncyCastle (`bcprov`, `bcpkix`) and Jackson for JSON  
- **PDF generation**: iText 7 (kernel, layout, io) for generating voucher PDFs  
- **Other**: Lombok for boilerplate reduction, Spring Boot test starter for tests

High‑level steps:

1. **Open a terminal in the backend folder**

   ```bash
   cd ValueDesign
   ```

2. **Configure backend environment**

   - Create/update `application.properties` or `application.yml` under  
     `src/main/resources/` with:
     - **Database** connection (e.g. MariaDB / PostgreSQL JDBC URL, username, password).
     - **MSG91** credentials (auth key, sender ID, template ID, etc.).
     - Any other app‑specific settings (JWT secret, mail, payment, etc.).
   - Example (properties style, adjust to your real values):

   ```properties
   spring.datasource.url=jdbc:mariadb://localhost:3306/valuedesign
   spring.datasource.username=your_db_user
   spring.datasource.password=your_db_password

   # MSG91
   msg91.auth-key=YOUR_MSG91_AUTH_KEY
   msg91.sender-id=YOUR_SENDER_ID
   msg91.template-id=YOUR_TEMPLATE_ID

   # Server port (so it matches VITE_AUTH_API_URL)
   server.port=8080
   server.servlet.context-path=/auth
   ```

3. **Build and run with Maven**

   - Dev run (auto‑downloads dependencies and starts the server):

   ```bash
   mvn spring-boot:run
   ```

   - Or build a WAR/JAR and run:

   ```bash
   mvn clean package
   java -jar target/valuedesign-0.0.1-SNAPSHOT.war
   ```

4. **Connect frontend to this backend**

   - In the frontend `.env` (inside `sabbpe-gift-voucher/sabbpe-gift-voucher`), set:

   ```bash
   VITE_AUTH_API_URL=http://localhost:8080/auth
   ```

   - Restart `npm run dev` so Vite picks up the updated env.

Once ValueDesign is running, the frontend will call:

- `POST {VITE_AUTH_API_URL}/signup` – user registration  
- `POST {VITE_AUTH_API_URL}/login` – password login  
- `POST {VITE_AUTH_API_URL}/otp/send` – send OTP via MSG91  
- `POST {VITE_AUTH_API_URL}/otp/verify` – verify OTP  
- `POST {VITE_AUTH_API_URL}/otp/login` – OTP‑based login returning JWT

---

## 4. Big Picture

- **This repository is a FRONTEND app only.**
  - Built with **React + TypeScript + Vite**.
  - Runs in the browser.
  - It does **not** talk to the database directly.
- All data (users, orders, vouchers, etc.) comes from **backend REST APIs**.
  - The main backend for this system is the **ValueDesign** service (separate repo), which exposes the `/auth`, `/api`, and other endpoints you configure via `VITE_*` URLs.
  - That backend talks to the **database** and third‑party providers (MSG91, payment gateways).
  - It also owns the final **OTP validation**, **user creation**, and **JWT token generation**.

Think of it as:

- **Frontend (this repo)** → calls → **Backend APIs** → talk to → **Database + MSG91**

---

## 5. Folder / Module Overview

High‑level modules you will see in `src/`:

- **`src/pages/`**: Full pages mapped to routes  
  - Examples: login page, register page, cart page, orders page.
- **`src/components/`**: Re‑usable UI pieces  
  - Headers, buttons, dialogs, brand cards, etc.
- **`src/contexts/`**: Global state using React Context  
  - **AuthContext** – who is logged in, auth token, logout.  
  - **ConfigContext** – feature flags / configuration.
- **`src/hooks/`**: Custom React hooks  
  - Wrap API calls, handle loading/error state, business rules.
- **`src/api/`**: Functions that call backend or MSG91  
  - `authApi.ts` – login / signup / OTP login via backend.  
  - `otpApi.ts` – send & verify OTP via **MSG91** directly.  
  - `cartApi.ts`, `orderApi.ts`, `paymentApi.ts`, etc.
- **`src/types/`**: TypeScript interfaces  
  - Shapes of data: `AuthUser`, `Order`, `CartItem`, `OtpRequest`, etc.
- **`src/utils/` / `src/lib/`**: Helper utilities and shared clients  
  - Axios instances, token handling, formatting helpers, etc.

You can read this as:

- **Pages** use **hooks** and **APIs**  
- **Hooks** call **API modules**  
- **API modules** call **backend URLs or MSG91**

---

## 6. OTP Based Flow (Contact / Email Instead of Password)

Your desired idea (in words) is:

> User enters **contact number / email** → OTP is sent → **GV Auth Module** checks OTP with **MSG91** → returns **Success / Failure** → on success, **new user is created in DB**.

### 6.1 How it actually works end‑to‑end (frontend + backend)

There are **two separate OTP uses**:

1. **Registration OTP (mobile/email verification)**  
   - Frontend uses `useSendOtp` and `useVerifyOtp` hooks.  
   - These call `otpApi.ts`, which in turn calls **backend** endpoints:
     - `POST {VITE_AUTH_API_URL}/otp/send`
     - `POST {VITE_AUTH_API_URL}/otp/verify`
   - The **backend** talks to MSG91, handles provider details and secrets, and returns a clean JSON response.

2. **OTP Login (passwordless sign‑in)**  
   - Frontend uses `useLoginWithOtp` and the **“Login with OTP”** flow in `Login.tsx`.  
   - This calls `authApi.loginWithOtp` → `POST {VITE_AUTH_API_URL}/otp/login`.  
   - The **backend** validates the OTP via MSG91, checks/creates the user in the database, generates a **JWT**, and returns `{ token, userInfo, message }`.

> Important: The **real database write (new user)** happens in the **backend** when `/signup` or `/otp/login` APIs are called.  
> This frontend only **triggers** those APIs.

---

### 6.2 Registration OTP – Step by Step (Current, Working Flow)

**Frontend files involved (simplified):**

- Page: `src/pages/Register.tsx`
- Hooks: `useSendOtp`, `useVerifyOtp`, `useSignup` (in `src/hooks/`)
- OTP API: `src/api/otpApi.ts` (calls backend `/otp/send` and `/otp/verify`)
- Auth API: `src/api/authApi.ts`

**Backend (GV Auth service) – typical modules (Node.js + Express + TypeScript + PostgreSQL + Prisma + JWT):**

- **Routes** (e.g. `/auth/otp/send`, `/auth/otp/verify`, `/auth/otp/login`)
- **OTP service** – wraps MSG91 send/verify and rate‑limits requests per identifier.
- **User service** – reads/creates users in Postgres via Prisma (by mobile/email).
- **JWT utility** – signs tokens using a secret key from env vars.

**Flow:**

1. **User enters details**  
   - Name, email, mobile number, password on the Register page.

2. **User clicks “Send OTP”**  
   - Register page calls **`sendOtp(mobile)`** (hook → `otpApi.sendOtp`).  
   - `otpApi.sendOtp` sends a `POST` request to **`{VITE_AUTH_API_URL}/otp/send`** with `{ mobileNumber }`.  
   - The **backend**:
     - Validates rate limits,
     - Calls MSG91 using server‑side API keys from env vars,
     - Returns a **request ID (`reqId`)** and a status (`type: "success" | "error"`).

3. **User receives SMS OTP and types it into the form**  
   - User enters the OTP and clicks **“Verify OTP”**.

4. **User clicks “Verify OTP”**  
   - Register page calls **`verifyOtp(reqId, otp)`** (hook → `otpApi.verifyOtp`).  
   - `otpApi.verifyOtp` sends `POST {VITE_AUTH_API_URL}/otp/verify` with `{ reqId, otp }`.  
   - The **backend** forwards to MSG91, interprets the result, and returns:
     - `type: "success" | "error"`
     - A human‑readable message.  
   - On success, the UI marks mobile as **“OTP verified”** (e.g. sets a flag).

5. **User clicks “Create Account” (Sign up)**  
   - Register page calls **`signup({ name, email, mobile, password })`**.  
   - `authApi.signup` sends `POST /signup` to the **Auth backend**.

6. **Backend work (not in this repo)**  
   - Backend **validates data**, talks to the **database**, and:
     - **Creates a new user record in DB**, or  
     - Returns an error.

7. **Frontend reacts to backend response**  
   - On success, it can redirect the user to the **Login** page.  
   - On failure, it shows an error message.

> Note: In the current implementation, the frontend does **not strictly block** signup if OTP was never verified. That logic (if needed) should be enforced either:
> - In the frontend form validation, **and/or**
> - In the backend `/signup` API (recommended).

---

### 6.3 OTP Login – Frontend + Backend

**High‑level behavior:**

1. User enters **contact number / email** instead of password.  
2. System sends OTP to that contact.  
3. User enters OTP.  
4. **GV Auth Module** checks OTP with **MSG91**.  
5. On **success**, user is logged in (or new user is created in DB).  
6. On **failure**, user sees an error and is not logged in.

**Frontend wiring:**

- Hook: `useLoginWithOtp` (in `src/hooks/`)  
- API: `authApi.loginWithOtp` → `POST {VITE_AUTH_API_URL}/otp/login`
- UI: `src/pages/Login.tsx`
  - Toggle between **Password Login** and **Login with OTP**.
  - For OTP mode:
    - Input for mobile/email
    - **Send OTP** button (via `useSendOtp`)
    - OTP input
    - **Verify & Login** button (via `useLoginWithOtp`)

**Backend responsibilities:**

- Receive `{ reqId, otp }` (and optionally identifier).  
- Check rate limits for this identifier.  
- Validate OTP via MSG91.  
- If validation succeeds:
  - **Find or create user** in Postgres (using Prisma).  
  - Generate a **JWT token**.  
  - Return `{ token, user, message }`.

**What the frontend does on success:**

- Stores `user + token` in `AuthContext` and `localStorage`.  
- Redirects to the main dashboard (`/`).

---

## 7. Where Database Access Really Happens

### 7.1 No direct DB access in this repo

- This project **does not**:
  - Open DB connections.  
  - Define SQL queries.  
  - Use an ORM (like Prisma, Sequelize, etc.).  
  - Run migrations.
- All of that lives in the **backend services** (separate codebase, typically Node.js + Express + TypeScript + PostgreSQL + Prisma + JWT).

### 7.2 Frontend → Backend → DB

This app talks to the **ValueDesign backend** using environment‑based URLs like:

- **`VITE_AUTH_API_URL`** – ValueDesign auth service (signup, login, OTP, etc.).  
- **`VITE_BRAND_API_URL`** – ValueDesign brand & catalog APIs (brands, cart, orders).  
- **`VITE_GIFTCARD_API_URL`** – ValueDesign gift card APIs (orders, coupons).  
- **`VITE_PAYMENT_API_URL`** – ValueDesign payment gateway integration.  
- **`VITE_MAIL_URL`** – ValueDesign mail / notifications service.

Typical pattern:

1. **Page / component** asks a **hook** to perform an action.  
2. The **hook** calls an **API module** (like `authApi`, `orderApi`).  
3. The **API module** sends an HTTP request (via axios or fetch) to the backend.  
4. The **backend**:
   - Validates input.  
   - Reads / writes to the **database**.  
   - Returns JSON back to the frontend.
5. The frontend updates the **UI state** based on that JSON.

So when we say **“New user registered on DB”**, in this architecture it really means:

- **Frontend:** calls `/signup` or `/otp/login`.  
- **Backend:** creates / updates the record in the **database**.  
- **Frontend:** only sees the **API response**, not the DB itself.

---

## 8. Quick Reference – Main Auth & OTP Pieces

- **Auth state & storage**
  - `AuthContext` – keeps the current user and token in React.  
  - `localStorage` – persists auth between page reloads.
- **Login / Signup**
  - `authApi.login` – email/phone + password login.  
  - `authApi.signup` – create new user via backend.  
  - `authApi.loginWithOtp` – backend‑driven OTP login (wired to the Login page UI).
- **OTP (frontend‑side)**
  - `otpApi.sendOtp` – sends OTP via **backend** `/otp/send`.  
  - `otpApi.verifyOtp` – verifies OTP via **backend** `/otp/verify`.  
  - Used on the **Register** page to verify mobile/email.
- **Database**
  - **Not** present in this repo.  
  - All DB access is **inside backend services** that this frontend calls.

---

## 9. How to Explain This to a New Team Member

You can summarize the system like this:

- **“This repo is the React frontend for the gift voucher platform.”**  
- **“All real data and database actions are done by backend APIs.”**  
- **“For OTP, we currently use MSG91 directly to verify mobile at registration, and we have a backend `/otp/login` endpoint prepared for full OTP‑based login.”**  
- **“When someone says ‘user is created in the DB’, that is always done in the backend after this app calls `/signup` or `/otp/login`.”**

---

## 10. Frontend tech stack (detailed)

The following list is derived from the frontend app’s `package.json` (folder: `sabbpe-gift-voucher/sabbpe-gift-voucher`). It is the single source of truth for libraries and versions.

| Category | Technology | Purpose |
|----------|------------|--------|
| **Core** | React 19.x | UI library (function components, hooks) |
| | React DOM 19.x | Browser rendering |
| | TypeScript ~5.9 | Typed JavaScript |
| | Vite 7.x | Build tool and dev server |
| **Routing** | wouter 3.x | Client-side routing |
| **Data & API** | TanStack React Query 5.x | Server state, caching, mutations |
| | Axios 1.x | HTTP client for backend calls |
| **Styling** | Tailwind CSS 3.x | Utility-first CSS |
| | tailwindcss-animate | Animations |
| | DaisyUI 5.x | Component themes / utilities |
| | class-variance-authority (cva), clsx, tailwind-merge | Conditional and merged class names |
| **UI components** | Radix UI (accordion, alert-dialog, avatar, checkbox, dialog, dropdown, label, popover, select, tabs, toast, tooltip, etc.) | Accessible primitives |
| | input-otp 1.x | OTP input (digit slots) – used where a dedicated OTP box is needed |
| | react-hook-form 7.x | Form state and validation |
| | zod 4.x | Schema validation |
| **Icons & visuals** | lucide-react | Icons (e.g. Mail, Lock, Smartphone, AlertCircle) |
| | react-icons | Additional icons |
| | framer-motion | Animations |
| **Other** | next-themes | Theme (e.g. dark mode) |
| | crypto-js | Client-side encryption (e.g. for payment/order data) |
| | date-fns | Date formatting |
| | recharts, leaflet, three / react-three-fiber | Charts, maps, 3D if used |

All user input (including OTP) is collected through React state and the components listed above; no separate “input framework” is used beyond these.

---

## 11. How the frontend is designed to take user input (OTP and auth)

This section describes **how the app collects input from the user** for OTP and auth: which screens, which components, and how validation and feedback work.

### 11.1 Where OTP and auth input appear

- **Login page** (`src/pages/Login.tsx`): Email/mobile, password, and (in “Login with OTP” mode) OTP.
- **Register page** (`src/pages/Register.tsx`): Name, email, mobile, password, and OTP for mobile verification.

No other pages are responsible for OTP or auth input.

### 11.2 Tech used for input and state

- **State**: React `useState` for every field (e.g. `emailOrMobile`, `password`, `otp`, `otpReqId`, `otpVerified`).
- **Components**:
  - **`Input`** (`src/components/ui/input.tsx`): Standard text input for email/mobile, password, and OTP. Styled with Tailwind; used for single-line OTP on Login and for 4-digit OTP on Register.
  - **`Button`** (`src/components/ui/button.tsx`): Actions such as “Send OTP”, “Verify OTP”, “Verify & Login”, “Sign In”.
- **Styling**: Tailwind CSS (e.g. `h-12`, `pl-10`, `rounded-lg`, `border`, `dark:` variants). Icons (e.g. Mail, Lock, Smartphone) from **lucide-react** inside inputs where needed.
- **Validation**: Inline checks in the page (e.g. email regex, 10-digit mobile, non-empty OTP, 4-digit OTP on Register). Errors are shown as text below the field or in a shared error banner.
- **Loading and errors**: TanStack React Query mutation state (`isPending`) drives button labels (“Sending...”, “Verifying...”) and disables buttons. API errors are mapped to messages and shown in the same error area.

There is an optional **OTP-specific UI** in `src/components/ui/input-otp.tsx` (built on the **input-otp** package) that provides digit-by-digit slots; it is available for use but **Login and Register currently use a single `Input`** for the OTP string.

### 11.3 Login page – OTP input design

- **Mode switch**: User chooses “Password Login” or “Login with OTP” via a toggle (two buttons in a pill-style container).
- **Email/mobile**: One `Input` with placeholder “Enter your email or mobile number”; icon (Mail/Smartphone) and validation (email or 10-digit mobile) as the user types.
- **OTP path (when “Login with OTP” is selected)**:
  1. **Send OTP**: Same email/mobile field; next to it, a “Send OTP” button. On success, a short success message is shown (e.g. “OTP sent successfully”) and the backend `reqId` is stored in state.
  2. **OTP field**: A single **`Input`** with `placeholder="Enter OTP"`, `value={otp}`, `onChange` updating `otp` and clearing the general error. No fixed digit count in the UI; any length is accepted and sent to the backend.
  3. **Verify & Login**: A full-width **`Button`** “Verify & Login” that calls `useLoginWithOtp` with `reqId` and `otp`. While the request is in progress, the button shows “Verifying...” and is disabled.
- **Errors**: One shared error area at the top of the form (e.g. “Please request an OTP first.”, “Please enter the OTP.”, or the message from the backend).

So on Login, **OTP is taken in a single text input** (not the multi-slot OTP component), and the flow is: enter email/mobile → Send OTP → enter OTP in that input → Verify & Login.

### 11.4 Register page – OTP input design

- **Mobile**: Dedicated mobile **`Input`**; “Send OTP” / “Resend” **`Button`** next to it. After a successful send, a success line is shown (“OTP sent successfully”) and an OTP block is revealed.
- **OTP block (shown only after OTP is sent)**:
  - Label: “Enter OTP”.
  - **`Input`** with `type="text"`, `placeholder="Enter 4-digit OTP"`, `maxLength={4}`, and `onChange` that allows only digits (`/^[0-9]*$/`). When verified, the input is disabled and styled (e.g. green border) to show success.
  - **`Button`** “Verify OTP” (or “Verifying...” / “Verified”), disabled until `otp.length === 4` and not pending.
- **State**: `otpSent`, `otp`, `otpVerified`, and `reqId` (from send response) drive visibility and enable/disable logic. After “Verify OTP” succeeds, “OTP verified successfully” is shown and the user can submit the full signup form.

So on Register, **OTP is a 4-digit-only, single `Input`** (again not the slot-based `input-otp` component), with strict length and numeric validation before verify is allowed.

### 11.5 Summary table

| Screen    | What user enters        | Component(s)        | Validation / constraints              |
|-----------|--------------------------|--------------------|----------------------------------------|
| Login     | Email or mobile          | `Input`            | Email format or 10-digit mobile        |
| Login     | Password                 | `Input` (type password) | Non-empty, min length              |
| Login     | OTP (OTP mode)           | `Input`            | Non-empty when clicking Verify & Login |
| Register  | Mobile                   | `Input`            | 10-digit mobile                        |
| Register  | OTP                      | `Input` (maxLength=4) | Digits only, length 4              |

All of this is implemented with **React (TypeScript), Tailwind, shared `Input`/`Button` components, and React Query for API calls**; no extra “form engine” or separate OTP SDK is used for collecting the values.

---

## 12. Backend OTP flow analysis (ValueDesign Spring Boot)

This section traces **exactly** how OTP is sent when the frontend calls `POST /auth/otp/send`: from controller → service → MSG91 Flow API → response. It also confirms there is no mock, no local OTP generation, and no environment-based bypass.

---

### 12.1 Request → Controller

**Frontend** sends (from `sabbpe-gift-voucher/src/api/otpApi.ts`):

- **URL:** `POST ${VITE_AUTH_API_URL}/otp/send` (e.g. `POST http://localhost:8080/auth/otp/send`)
- **Body:** `{ "mobileNumber": "9876543210" }` (frontend uses key `mobileNumber`)

**Backend** DTO (`ValueDesign/.../dto/OtpSendRequest.java`):

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OtpSendRequest {
    private String identifier; // mobile or email
}
```

**Note:** The backend expects the JSON key **`identifier`**. If the frontend sends **`mobileNumber`**, Spring will bind nothing to `identifier` (it will be null). Ensure the frontend sends `{ "identifier": "9876543210" }` or the backend adds a field `mobileNumber` / `@JsonProperty("mobileNumber")` so the value is received.

**Controller method** (`ValueDesign/.../controller/OtpController.java`):

```java
@PostMapping("/send")
public ResponseEntity<OtpSendResponse> sendOtp(@RequestBody OtpSendRequest request) {
    log.info("OTP send request received for identifier: {}", request.getIdentifier());
    OtpSendResponse response = otpService.sendOtp(request.getIdentifier());
    return ResponseEntity.ok(response);
}
```

- **Exact method:** `sendOtp(@RequestBody OtpSendRequest request)`
- **Service called:** `otpService.sendOtp(request.getIdentifier())`
- **Return:** `ResponseEntity.ok(response)` with `OtpSendResponse` (success, reqId, message).

---

### 12.2 Controller → OtpService.sendOtp()

**Full method** (`ValueDesign/.../service/OtpService.java`):

```java
public OtpSendResponse sendOtp(String identifier) {
    // Validate identifier format
    validateIdentifier(identifier);

    // Check rate limit
    checkRateLimit(identifier);

    try {
        // Normalize identifier (add country code for mobile if needed)
        String normalizedIdentifier = normalizeIdentifier(identifier);

        // Call MSG91 Flow API (flow_id, mobile, variables)
        String reqId = msg91FlowApiService.sendFlow(normalizedIdentifier);

        // Update rate limit
        updateRateLimit(identifier);

        log.info("OTP sent successfully for identifier: {}", identifier);

        return OtpSendResponse.builder()
                .success(true)
                .reqId(reqId)
                .message("OTP sent successfully")
                .build();

    } catch (Exception e) {
        log.error("Failed to send OTP for identifier: {}", identifier, e);
        throw new OtpException("Failed to send OTP: " + e.getMessage(), e);
    }
}
```

**What this does:**

- **Does not** call the old MSG91 OTP send API (no `/otp/send` to MSG91).
- **Does not** generate OTP locally (no `Random`, no fixed digits).
- **Does not** mock OTP: no dummy reqId, no “if dev return success”.
- **Does** call **`msg91FlowApiService.sendFlow(normalizedIdentifier)`** — i.e. the **MSG91 Flow API** only.
- **Success path:** Only if `sendFlow()` returns a value (reqId or fallback); otherwise it throws and the catch rethrows `OtpException`. There is **no** try-catch that returns success on API failure.

**Normalization:** 10-digit numbers get country code `"91"`; email is lowercased. Example: `"9876543210"` → `"919876543210"`.

---

### 12.3 OtpService → Msg91FlowApiService.sendFlow()

**Class** (`ValueDesign/.../service/Msg91FlowApiService.java`): uses `RestTemplate`, `@Value` for `msg91.auth-key`, `msg91.flow-id`, `msg91.sender-id`, `msg91.flow-url`.

**URL called:**

- From property **`msg91.flow-url`** (default: `https://control.msg91.com/api/v5/flow`).
- No environment-based URL switch; same URL in all environments.

**Headers:**

```java
HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_JSON);
headers.set("authkey", authKey);  // from msg91.auth-key
```

- **authkey** is passed in the **header** `authkey` (value from `application.properties`: `msg91.auth-key`).
- **Content-Type:** `application/json`.

**Body sent:**

```java
// Single recipient
Map<String, Object> recipient = new HashMap<>();
recipient.put("mobiles", mobile);   // e.g. "919876543210"
if (variables != null && !variables.isEmpty()) {
    recipient.putAll(variables);
}
List<Map<String, Object>> recipients = new ArrayList<>();
recipients.add(recipient);

Map<String, Object> body = new HashMap<>();
body.put("flow_id", flowId);        // from msg91.flow-id
body.put("sender", senderId);       // from msg91.sender-id
body.put("recipients", recipients);
```

Example JSON:

```json
{
  "flow_id": "6932ee390867ed6e661b52f4",
  "sender": "SABBPE",
  "recipients": [
    { "mobiles": "919876543210" }
  ]
}
```

**HTTP call:**

```java
ResponseEntity<Map> response = restTemplate.exchange(
        flowUrl,
        HttpMethod.POST,
        request,
        Map.class
);
```

So the backend **does** call the real MSG91 Flow API over the network; it does not skip the call in dev or when a property is missing (missing auth-key would cause startup or runtime failure when the bean is used).

---

### 12.4 How success and reqId are determined (Msg91FlowApiService)

**Response handling (exact logic):**

1. If **`responseBody` is null** → throw `OtpException("MSG91 Flow API returned empty response")`.
2. If **`responseBody` contains `request_id`** → return `responseBody.get("request_id").toString()`.
3. Else if **`responseBody` contains `requestId`** (camelCase) → return that.
4. Else if **`responseBody.get("data")`** is a map with **`request_id`** or **`requestId`** → return that.
5. Else if **`responseBody.get("type")`** is **`"success"`** (ignore case) → return **`mobile`** (the normalized number) as the “reqId” (fallback for flows that don’t return request_id).
6. Otherwise → throw **`OtpException("MSG91 Flow API did not return request_id. Response: " + message)`**.

**Success is not assumed:** If the Flow API returns an error (e.g. 4xx/5xx or JSON with `type != "success"` and no request_id), `sendFlow()` either throws (e.g. RestTemplate error or the explicit `OtpException`). There is **no** code path that returns success or a fake reqId when the API fails.

**Catch block:** Any other exception (e.g. network, parse) is logged and wrapped in `OtpException`; it is **not** swallowed or turned into success.

---

### 12.5 Conditional logic, dev bypass, and mocks

**Searches performed across ValueDesign:**

- **Environment-based skip:** No `if (env == "dev")` or similar that skips the MSG91 call in `OtpController`, `OtpService`, or `Msg91FlowApiService`.
- **Missing property → dummy OTP:** No logic that says “if msg91.auth-key is missing, return a dummy reqId or success”. Missing `msg91.auth-key` or `msg91.flow-id` would cause injection to fail or NPE when building the request.
- **Try-catch returning success on failure:** In `OtpService.sendOtp()` the only catch rethrows; it does **not** return `OtpSendResponse.builder().success(true)...`. In `Msg91FlowApiService.sendFlow()` exceptions are rethrown, not converted to success.
- **Random OTP generation:** No `Random` or “generate 6-digit OTP” in the OTP flow. (Other parts of the project use `UUID.randomUUID()` for invoice/order IDs, not for OTP.)
- **Hardcoded OTP:** No literal like `"1234"` or `"000000"` used as OTP or reqId in the send/verify flow.
- **Mock / dummy implementation:** No class named Mock/Dummy/Fake for OTP or MSG91 in this flow.
- **@Profile("dev")** (or similar): No `@Profile("dev")` bean that replaces `Msg91FlowApiService` or `OtpService` with a no-op or mock.

**Conclusion:** OTP send is **not** mocked or bypassed by environment or missing config. Success is only returned when the real Flow API is called and the response is interpreted as success (and reqId is taken from response or mobile fallback).

---

### 12.6 application.properties and environment config

**Relevant properties** (from `ValueDesign/src/main/resources/application.properties`):

```properties
# MSG91 Flow API
msg91.auth-key=441109AdIRodg4B6932ec90P1
msg91.flow-id=6932ee390867ed6e661b52f4
msg91.sender-id=SABBPE
msg91.flow-url=https://control.msg91.com/api/v5/flow
```

- **application-dev.properties:** Does **not** exist in the project. Only `application.properties` was found.
- **Environment-based config:** No separate file or profile that changes MSG91 URL or disables the API call. The same `msg91.*` values are used for all runs unless overridden by system/env properties.

---

### 12.7 End-to-end flow summary

| Step | Component | What happens |
|------|-----------|--------------|
| 1 | Frontend | `POST /auth/otp/send` with body `{ "mobileNumber": "..." }` (or `identifier` if aligned). |
| 2 | OtpController | `sendOtp(request)` → `otpService.sendOtp(request.getIdentifier())`. |
| 3 | OtpService | Validates identifier, checks rate limit, normalizes (e.g. 91 + 10 digits), calls `msg91FlowApiService.sendFlow(normalizedIdentifier)`. |
| 4 | Msg91FlowApiService | Builds JSON with `flow_id`, `sender`, `recipients:[ { mobiles } ]`; sets header `authkey`; `RestTemplate.post(flowUrl, body)`. |
| 5 | MSG91 | Receives request at `https://control.msg91.com/api/v5/flow`; sends flow (e.g. OTP) to the given mobile. |
| 6 | Msg91FlowApiService | Reads response; extracts `request_id` (or `requestId` or `data.request_id`) or, if `type==success` only, uses `mobile` as reqId; else throws. |
| 7 | OtpService | Gets reqId from `sendFlow()`; updates rate limit; returns `OtpSendResponse(success=true, reqId=..., message="OTP sent successfully")`. |
| 8 | OtpController | Returns `ResponseEntity.ok(response)`. |

**Is OTP really sent to MSG91?** Yes. The backend calls the live MSG91 Flow API; it does not log success without calling the API. If the API returns an error or the request fails (e.g. network, 4xx/5xx), the backend throws and the client receives an error response; it does not get a fake success.

**Note on verification:** OTP **verify** uses a different endpoint: `https://control.msg91.com/api/v5/otp/verify` (in `OtpService.callMsg91VerifyOtp()`), with body `{ "request_id", "otp" }` and the same `authkey` header. So send uses **Flow API**; verify uses **OTP verify API**. If the Flow API returns only `type: "success"` and no request_id, the backend uses the **mobile number** as the reqId when returning to the client; whether MSG91 verify accepts that depends on MSG91’s behavior for that flow.

