# Authentication Endpoints

This document describes the three authentication-related endpoints, their HTTP methods, request payloads, and response payloads.

---

## 1. Request OTP

- **URL:** `/auth/request-otp`
- **Method:** `POST`
- **Description:** Generate or reuse a one-time password (OTP) for an email address and send it via email (or log to console in development).

### Request Body

```ts
interface RequestOtpBody {
  /** Valid email address to receive the OTP */
  email: string;
}
```

#### Example

```http
POST /auth/request-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Success Response

- **Status:** `200 OK`
- \*\*Body:`

```ts
interface RequestOtpResponse {
  /** Always true on success */
  success: true;
}
```

### Error Responses

| Status | Body                                 | Condition                                |
| ------ | ------------------------------------ | ---------------------------------------- |
| 400    | `{ error: "Invalid email" }`         | `email` is missing or not a valid format |
| 500    | `{ error: "Internal server error" }` | Unexpected server error                  |

---

## 2. Verify OTP

- **URL:** `/auth/verify-otp`
- **Method:** `POST`
- **Description:** Verify the OTP code for an email. If valid, mark code used, create or fetch the user, and issue a JWT.

### Request Body

```ts
interface VerifyOtpBody {
  /** The email that requested the OTP */
  email: string;
  /** The 6-digit OTP code */
  code: string;
}
```

#### Example

```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

### Success Response

- **Status:** `200 OK`
- \*\*Body:`

```ts
interface VerifyOtpResponse {
  success: true;
  /** JWT token for subsequent authenticated requests */
  token: string;
  /** Authenticated user object */
  user: {
    id: string;
    email?: string;
    nostrPubKey?: string;
    createdAt: string;
    updatedAt: string;
  };
}
```

### Error Responses

| Status | Body                                           | Condition                                     |
| ------ | ---------------------------------------------- | --------------------------------------------- |
| 400    | `{ error: "Invalid parameters" }`              | Missing or non-string `email` or `code`       |
| 401    | `{ error: "Invalid or expired code" }`         | No matching, unused, unexpired OTP found      |
| 401    | `{ error: "Incorrect code" }`                  | Provided `code` does not match the stored OTP |
| 403    | `{ error: "Too many attempts; code blocked" }` | `attempts` ≥ 5                                |
| 500    | `{ error: "Internal server error" }`           | Unexpected server error                       |

---

## 3. Verify Nostr (NIP-98)

- **URL:** `/auth/verify-nostr`
- **Method:** `POST`
- **Description:** Verify a NIP-98 “login” event signed by a Nostr key, create or fetch the user by `nostrPubKey`, and issue a JWT.

### Request Body

```ts
import type { Event as NostrEvent } from "nostr-tools";

interface VerifyNostrBody extends NostrEvent {}
```

#### Example

```http
POST /auth/verify-nostr
Content-Type: application/json

<JSON representation of a NIP-98 event>
```

### Success Response

- **Status:** `200 OK`
- \*\*Body:`

```ts
interface VerifyNostrResponse {
  success: true;
  /** JWT token for subsequent authenticated requests */
  token: string;
  /** Authenticated user object */
  user: {
    id: string;
    email?: string;
    nostrPubKey?: string;
    createdAt: string;
    updatedAt: string;
  };
}
```

### Error Responses

| Status | Body                                 | Condition                               |
| ------ | ------------------------------------ | --------------------------------------- |
| 400    | `{ error: "Invalid NIP-98 event" }`  | Body is not a valid NIP-98 event object |
| 401    | `{ error: "Invalid signature" }`     | Signature verification failed           |
| 500    | `{ error: "Internal server error" }` | Unexpected server error                 |

```

```
