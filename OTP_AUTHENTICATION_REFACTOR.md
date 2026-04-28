# OTP Authentication Refactor - Complete Documentation

**Date:** February 2025  
**Objective:** Implement separate REGISTER and LOGIN flows using mobile + OTP only (no password). Use `client_profile` table as single source of truth.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Backend Changes](#backend-changes)
3. [Frontend Changes](#frontend-changes)
4. [API Endpoints](#api-endpoints)
5. [Database Schema](#database-schema)
6. [Configuration Changes](#configuration-changes)
7. [Testing Checklist](#testing-checklist)

---

## 🎯 Overview

### Goal
- **Registration Flow:** Mobile → Send OTP → Verify OTP → Create Account → JWT
- **Login Flow:** Mobile → Send OTP → Verify OTP → JWT
- **No Password:** Remove all password-related logic from authentication
- **Single Source of Truth:** Use `client_profile` table only (no `otp_users` table)

### Key Features
- ✅ Separate register and login endpoints
- ✅ OTP-only authentication (no password)
- ✅ JWT tokens with userId, phoneNumber, email claims
- ✅ CORS configuration for frontend access
- ✅ Rate limiting for OTP requests
- ✅ MSG91 Direct OTP API integration

---

## 🔧 Backend Changes

### New Files Created

#### 1. DTOs (Data Transfer Objects)
**Location:** `ValueDesign/src/main/java/com/sabbpe/valuedesign/dto/`

- **`RegisterSendOtpRequest.java`**
  - Fields: `mobileNumber` (String)
  
- **`RegisterSendOtpResponse.java`**
  - Fields: `success` (boolean), `message` (String), `alreadyRegistered` (boolean)
  
- **`RegisterVerifyOtpRequest.java`**
  - Fields: `fullName` (String), `email` (String), `mobileNumber` (String), `otp` (String)
  
- **`RegisterVerifyOtpResponse.java`**
  - Fields: `success` (boolean), `token` (String), `message` (String)
  
- **`LoginVerifyOtpRequest.java`**
  - Fields: `mobileNumber` (String), `otp` (String)
  
- **`LoginVerifyOtpResponse.java`**
  - Fields: `success` (boolean), `token` (String), `message` (String)

#### 2. Controllers
**Location:** `ValueDesign/src/main/java/com/sabbpe/valuedesign/controller/`

- **`AuthRegisterController.java`** (NEW)
  - `POST /auth/register/send-otp` - Send OTP for registration
  - `POST /auth/register/verify-otp` - Verify OTP and create account
  
- **`AuthLoginController.java`** (UPDATED)
  - `POST /auth/login/send-otp` - Send OTP for login (existing)
  - `POST /auth/login/verify-otp` - Verify OTP for login (NEW)

#### 3. Configuration
**Location:** `ValueDesign/src/main/java/com/sabbpe/valuedesign/config/`

- **`CorsConfig.java`** (NEW)
  - CORS filter for browser-based frontend access
  - Allows: `http://localhost:5173`, `http://localhost:3000`, production domains
  - Runs at HIGHEST_PRECEDENCE to handle OPTIONS preflight requests

### Files Modified

#### 1. Services
**Location:** `ValueDesign/src/main/java/com/sabbpe/valuedesign/service/`

- **`OtpService.java`** (UPDATED)
  - Added `registerSendOtp(String mobileNumber)` - Checks if mobile exists, sends OTP if not
  - Added `registerVerifyOtp(String fullName, String email, String mobileNumber, String otp)` - Verifies OTP, creates ClientProfile
  - Added `loginVerifyOtp(String mobileNumber, String otp)` - Verifies OTP, returns JWT
  - Updated `loginSendOtp(String mobileNumber)` - Already existed, checks if mobile exists

- **`JwtService.java`** (UPDATED)
  - Updated `generateToken(String userId, String phoneNumber, String email)` - Added email claim
  - Added `extractEmail(String token)` - Extract email from JWT

#### 2. Security
**Location:** `ValueDesign/src/main/java/com/sabbpe/valuedesign/security/`

- **`JwtAuthenticationFilter.java`** (UPDATED)
  - Updated `shouldNotFilter()` method:
    - Added `/auth/register/**` to public endpoints
    - Kept `/auth/login/**` as public
    - Removed `/auth/verify-otp` (replaced by separate login/register endpoints)

#### 3. Repository
**Location:** `ValueDesign/src/main/java/com/sabbpe/valuedesign/repository/`

- **`ClientProfileRepository.java`** (ALREADY EXISTS)
  - Uses: `findByClientMobile()`, `existsByClientMobile()`, `existsByClientEmail()`
  - No changes needed - already had required methods

### Files Deleted

- **`AuthVerifyController.java`** (DELETED)
  - Replaced by separate `AuthRegisterController` and `AuthLoginController`

### Configuration Files

**Location:** `ValueDesign/src/main/resources/`

- **`application.properties`** (UPDATED)
  - Added: `cors.allowed-origins` property
  - JWT and MSG91 configuration already existed

---

## 🎨 Frontend Changes

### New Files Created

#### 1. Hooks
**Location:** `sabbpe-gift-voucher/src/hooks/`

- **`useRegisterSendOtp.ts`** (NEW)
  - Hook for calling `registerSendOtp` API
  
- **`useRegisterVerifyOtp.ts`** (NEW)
  - Hook for calling `registerVerifyOtp` API

### Files Modified

#### 1. API Layer
**Location:** `sabbpe-gift-voucher/src/api/`

- **`otpApi.ts`** (UPDATED)
  - Updated `sendOtp()` - Now calls `/auth/login/send-otp`
  - Updated `verifyOtp()` - Now calls `/auth/login/verify-otp`
  - Added `registerSendOtp()` - Calls `/auth/register/send-otp`
  - Added `registerVerifyOtp()` - Calls `/auth/register/verify-otp`

- **`authApi.ts`** (UPDATED)
  - Updated `loginWithOtp()` - Now calls `/auth/login/verify-otp`
  - Updated `decodeJwtPayload()` - Added email extraction

#### 2. Types
**Location:** `sabbpe-gift-voucher/src/types/`

- **`otp.ts`** (UPDATED)
  - Added `RegisterSendOtpResponse` interface
  - Added `RegisterVerifyOtpRequest` interface
  - Added `RegisterVerifyOtpResponse` interface

#### 3. Pages
**Location:** `sabbpe-gift-voucher/src/pages/`

- **`Register.tsx`** (MAJOR REFACTOR)
  - **Removed:**
    - Password field and state
    - Confirm password field and state
    - Password validation logic
    - Password strength indicators
    - `useSignup` hook (password-based signup)
    - Password-related UI components (eye icons, password rules)
  
  - **Added:**
    - `useRegisterSendOtp` hook
    - `useRegisterVerifyOtp` hook
    - OTP input field (shown after OTP sent)
    - Redirect to `/login` if mobile already registered
    - JWT token handling and user context update
  
  - **Flow:**
    1. User enters: Full Name, Email, Mobile Number
    2. Click "Send OTP" → Validates form → Calls `/auth/register/send-otp`
    3. If `alreadyRegistered` → Shows error, redirects to `/login`
    4. If success → Shows OTP input field
    5. User enters OTP → Click "Verify OTP" → Calls `/auth/register/verify-otp`
    6. On success → Decodes JWT, sets user context, redirects to `/`

- **`Login.tsx`** (MAJOR REFACTOR)
  - **Removed:**
    - Password login mode toggle
    - Password field and state
    - Password validation
    - `useLogin` hook (password-based login)
    - Email input (now mobile-only)
  
  - **Updated:**
    - Mobile-only input (no email option)
    - OTP flow only
    - Uses `useSendOtp` and `useLoginWithOtp` hooks
    - Updated to call `/auth/login/verify-otp` instead of `/auth/verify-otp`
  
  - **Flow:**
    1. User enters: Mobile Number only
    2. Click "Send OTP" → Validates mobile → Calls `/auth/login/send-otp`
    3. If `notRegistered` → Shows error (no OTP input shown)
    4. If success → Shows OTP input field
    5. User enters OTP → Click "Verify & Login" → Calls `/auth/login/verify-otp`
    6. On success → Decodes JWT, sets user context, redirects to `/`

#### 4. Configuration
**Location:** `sabbpe-gift-voucher/`

- **`.env`** (UPDATED)
  - Updated `VITE_AUTH_API_URL` to point to correct backend
  - Changed from `https://gvauth.sabbpe.com/auth` to `https://vdspbck.sabbpe.com/auth`
  - Local development: `http://localhost:8080/auth`

---

## 🌐 API Endpoints

### Registration Endpoints

#### 1. Send OTP for Registration
```
POST /auth/register/send-otp
Content-Type: application/json

Request Body:
{
  "mobileNumber": "9490940282"
}

Success Response (200):
{
  "success": true,
  "message": "OTP sent successfully",
  "alreadyRegistered": false
}

Error Response - Already Registered (200):
{
  "success": false,
  "alreadyRegistered": true,
  "message": "Mobile already registered"
}
```

#### 2. Verify OTP and Create Account
```
POST /auth/register/verify-otp
Content-Type: application/json

Request Body:
{
  "fullName": "Sai Vamshi",
  "email": "sai@gmail.com",
  "mobileNumber": "9490940282",
  "otp": "123456"
}

Success Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Registration successful"
}

Error Response (400/500):
{
  "error": "Invalid OTP" | "Mobile already registered" | "Email already registered"
}
```

### Login Endpoints

#### 3. Send OTP for Login
```
POST /auth/login/send-otp
Content-Type: application/json

Request Body:
{
  "mobileNumber": "9490940282"
}

Success Response (200):
{
  "success": true,
  "message": "OTP sent successfully",
  "notRegistered": false
}

Error Response - Not Registered (200):
{
  "success": false,
  "notRegistered": true,
  "message": "Mobile not registered"
}
```

#### 4. Verify OTP for Login
```
POST /auth/login/verify-otp
Content-Type: application/json

Request Body:
{
  "mobileNumber": "9490940282",
  "otp": "123456"
}

Success Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}

Error Response (400/500):
{
  "error": "Invalid OTP" | "Mobile number not registered"
}
```

---

## 🗄️ Database Schema

### Table: `client_profile`

**No schema changes required** - Uses existing table structure.

**Key Fields Used:**
- `client_id` (String UUID) - Primary key, auto-generated
- `client_name` (String) - From `fullName` during registration
- `client_email` (String) - From `email` during registration
- `client_mobile` (String) - Normalized to E.164 format (91XXXXXXXXXX)
- `client_password` (String) - Set to `"OTP_ONLY"` placeholder (required, NOT NULL)
- `client_account_type` (Enum) - Set to `ClientAccountType.customer`
- `client_account_status` (Enum) - Set to `ClientAccountStatus.active`
- `created_at` (Timestamp) - Auto-set by database
- `updated_at` (Timestamp) - Auto-set by database

**Unique Constraints:**
- `client_mobile` - Unique constraint
- `client_email` - Unique constraint

**Repository Methods Used:**
- `findByClientMobile(String mobile)` - Find by mobile
- `existsByClientMobile(String mobile)` - Check if mobile exists
- `existsByClientEmail(String email)` - Check if email exists
- `save(ClientProfile)` - Save new client

---

## ⚙️ Configuration Changes

### Backend Configuration

**File:** `ValueDesign/src/main/resources/application.properties`

```properties
# CORS Configuration
cors.allowed-origins=http://localhost:5173,http://localhost:3000,https://giftvouchersuat.sabbpe.com,https://giftvouchers.sabbpe.com

# JWT Configuration (already existed)
jwt.secret=SUPER_SECRET_KEY_CHANGE_THIS_IN_PRODUCTION_MIN_256_BITS
jwt.expiration=3600000

# MSG91 Direct OTP API (already existed)
msg91.auth-key=441109AdIRodg4B6932ec90P1
msg91.template-id=6932ee390867ed6e661b52f4
msg91.sender-id=SABBPE
msg91.base-url=https://control.msg91.com/api/v5/otp
```

### Frontend Configuration

**File:** `sabbpe-gift-voucher/.env`

```env
# Auth API Base URL - Points to backend with OTP endpoints
VITE_AUTH_API_URL=https://vdspbck.sabbpe.com/auth
# For local development:
# VITE_AUTH_API_URL=http://localhost:8080/auth
```

---

## 🔐 Security Configuration

### Public Endpoints (No JWT Required)

Configured in `JwtAuthenticationFilter.shouldNotFilter()`:

- `/auth/register/**` - All registration endpoints
- `/auth/login/**` - All login endpoints
- `/api/client/client/coupons` - Public coupon endpoint

### Protected Endpoints (JWT Required)

All other `/api/**` endpoints require valid JWT token in `Authorization: Bearer <token>` header.

### CORS Configuration

- **Filter Order:** HIGHEST_PRECEDENCE (runs before authentication filters)
- **Allowed Origins:** Configurable via `cors.allowed-origins` property
- **Allowed Methods:** GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Allowed Headers:** * (all headers)
- **Credentials:** true (allows cookies/auth headers)
- **Max Age:** 3600 seconds (1 hour)

---

## 🧪 Testing Checklist

### Registration Flow

- [ ] Enter valid mobile number (10 digits) → OTP sent successfully
- [ ] Enter already registered mobile → Shows "Mobile already registered", redirects to login
- [ ] Enter invalid mobile (non-numeric, wrong length) → Validation error
- [ ] Enter valid OTP → Account created, JWT received, redirected to home
- [ ] Enter invalid OTP → Error message shown
- [ ] Enter expired OTP → Error message shown
- [ ] Enter email that already exists → Error message shown

### Login Flow

- [ ] Enter registered mobile → OTP sent successfully
- [ ] Enter unregistered mobile → Shows "Mobile not registered"
- [ ] Enter valid OTP → JWT received, redirected to home
- [ ] Enter invalid OTP → Error message shown
- [ ] Resend OTP → New OTP sent

### JWT Token

- [ ] Token contains `userId` claim
- [ ] Token contains `phoneNumber` claim
- [ ] Token contains `email` claim
- [ ] Token expiration is 1 hour
- [ ] Token stored in localStorage
- [ ] Token sent in Authorization header for protected endpoints

### CORS

- [ ] Frontend at `http://localhost:5173` can call backend
- [ ] OPTIONS preflight requests succeed
- [ ] CORS headers present in responses

### Edge Cases

- [ ] Rate limiting works (max 3 OTP requests per 10 minutes)
- [ ] Mobile number normalization (10 digits → E.164 format)
- [ ] Email normalization (lowercase, trimmed)
- [ ] Concurrent registration attempts handled correctly

---

## 📝 Migration Notes

### Removed Features

1. **Password-based authentication** - Completely removed from Register and Login pages
2. **Password reset flow** - Still exists in codebase but not used for authentication
3. **Email login** - Login now mobile-only
4. **Single verify endpoint** - Replaced by separate register/login verify endpoints

### Breaking Changes

1. **API Endpoint Changes:**
   - Old: `POST /auth/verify-otp` (removed)
   - New: `POST /auth/register/verify-otp` and `POST /auth/login/verify-otp`

2. **Frontend API Calls:**
   - Register: Must use `registerSendOtp()` and `registerVerifyOtp()`
   - Login: Must use `sendOtp()` and `verifyOtp()` (updated to call login endpoints)

3. **Response Format:**
   - Register send OTP: Returns `alreadyRegistered` flag
   - Login send OTP: Returns `notRegistered` flag

---

## 🚀 Deployment Checklist

### Backend Deployment

1. [ ] Build Spring Boot application
2. [ ] Deploy to server (e.g., vdspbck.sabbpe.com)
3. [ ] Verify CORS configuration in `application.properties`
4. [ ] Verify MSG91 credentials are correct
5. [ ] Verify JWT secret is set (change from default)
6. [ ] Test endpoints with Postman/curl
7. [ ] Verify database connection

### Frontend Deployment

1. [ ] Update `.env` with production `VITE_AUTH_API_URL`
2. [ ] Build frontend (`npm run build`)
3. [ ] Deploy to hosting (e.g., giftvouchersuat.sabbpe.com)
4. [ ] Verify CORS allows frontend origin
5. [ ] Test registration flow
6. [ ] Test login flow

---

## 📚 Code References

### Backend Key Classes

- `AuthRegisterController` - Registration endpoints
- `AuthLoginController` - Login endpoints
- `OtpService` - OTP sending/verification logic
- `JwtService` - JWT token generation/validation
- `ClientProfileRepository` - Database access
- `CorsConfig` - CORS configuration
- `JwtAuthenticationFilter` - JWT authentication filter

### Frontend Key Files

- `Register.tsx` - Registration page
- `Login.tsx` - Login page
- `otpApi.ts` - OTP API calls
- `authApi.ts` - Auth API calls (loginWithOtp)
- `useRegisterSendOtp.ts` - Register send OTP hook
- `useRegisterVerifyOtp.ts` - Register verify OTP hook
- `AuthContext.tsx` - User authentication context

---

## 🔄 Future Enhancements

1. **OTP Resend:** Add resend OTP functionality with cooldown
2. **OTP Expiration:** Implement OTP expiration (e.g., 5 minutes)
3. **Rate Limiting UI:** Show rate limit messages to users
4. **Email Verification:** Add email verification flow (optional)
5. **Mobile Verification:** Add mobile verification status tracking
6. **Session Management:** Add refresh token support
7. **Multi-factor Auth:** Add optional 2FA for sensitive operations

---

## 📞 Support

For issues or questions:
- Check backend logs for errors
- Verify CORS configuration matches frontend origin
- Verify MSG91 credentials are correct
- Check database connection and `client_profile` table structure
- Verify JWT secret is set correctly

---

**Document Version:** 1.0  
**Last Updated:** February 2025  
**Author:** AI Assistant
