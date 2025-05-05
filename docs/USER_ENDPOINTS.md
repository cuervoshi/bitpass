# User Endpoints

This document describes the user-related endpoints, their HTTP methods, request payloads, and response payloads.

---

## 1. Get User Profile

- **URL:** `/users/me`
- **Method:** `GET`
- **Authentication:** Required
- **Description:** Retrieves the authenticated user's profile information.

### Request

- **Headers:**

  - `Authorization: Bearer <token>`

- **Body:** None

### Success Response

- **Status:** `200 OK`
- **Body:**
  ```ts
  interface UserProfile {
    id: string;
    email?: string;
    nostrPubKey?: string;
    createdAt: string;
    updatedAt: string;
  }
  ```

### Error Responses

| Status | Body                                 | Condition               |
| ------ | ------------------------------------ | ----------------------- |
| 401    | `{ error: "Unauthorized" }`          | Missing or invalid JWT  |
| 500    | `{ error: "Internal server error" }` | Unexpected server error |

---

## 2. List Payment Methods

- **URL:** `/users/me/payment-methods`
- **Method:** `GET`
- **Authentication:** Required
- **Description:** Lists all payment methods associated with the authenticated user.

### Request

- **Headers:**

  - `Authorization: Bearer <token>`

- **Body:** None

### Success Response

- **Status:** `200 OK`
- **Body:**

  ```ts
  interface PaymentMethod {
    id: string;
    type: "LIGHTNING" | "MERCADOPAGO";
    lightningAddress?: string;
    lnurlCallback?: string;
    proxyPubkey?: string;
    createdAt: string;
    updatedAt: string;
  }

  type ListPaymentMethodsResponse = PaymentMethod[];
  ```

### Error Responses

| Status | Body                                 | Condition               |
| ------ | ------------------------------------ | ----------------------- |
| 401    | `{ error: "Unauthorized" }`          | Missing or invalid JWT  |
| 500    | `{ error: "Internal server error" }` | Unexpected server error |

---

## 3. Add Lightning Payment Method

- **URL:** `/users/me/payment-methods/lightning`
- **Method:** `POST`
- **Authentication:** Required
- **Description:** Adds a new Lightning payment method by validating the LNURL-pay address and creating a proxy account.

### Request

- **Headers:**

  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

- **Body:**
  ```ts
  interface CreateLightningInput {
    /** Lightning Address in user@domain format */
    lightningAddress: string;
  }
  ```

#### Example

```http
POST /users/me/payment-methods/lightning
Content-Type: application/json
Authorization: Bearer <token>

{
  "lightningAddress": "alice@example.com"
}
```

### Success Response

- **Status:** `201 Created`
- **Body:**
  ```ts
  interface PaymentMethod {
    id: string;
    type: "LIGHTNING";
    lightningAddress: string;
    lnurlCallback: string;
    proxyPubkey: string;
    createdAt: string;
    updatedAt: string;
  }
  ```

### Error Responses

| Status | Body                                               | Condition                                        |
| ------ | -------------------------------------------------- | ------------------------------------------------ |
| 400    | `{ error: "Invalid Lightning address format" }`    | Malformed address or LNURL-pay validation failed |
| 400    | `{ error: "Lightning method already configured" }` | User already has a Lightning method              |
| 401    | `{ error: "Unauthorized" }`                        | Missing or invalid JWT                           |
| 500    | `{ error: "Internal server error" }`               | Unexpected server error                          |

---

## 4. Update Lightning Payment Method

- **URL:** `/users/me/payment-methods/:pmId/lightning`
- **Method:** `PATCH`
- **Authentication:** Required
- **Description:** Updates the Lightning address of an existing payment method.

### Request

- **Headers:**

  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

- **Path Parameters:**

  - `pmId: string` — The ID of the payment method to update

- **Body:**
  ```ts
  type CreateLightningInput = {
    lightningAddress: string;
  };
  ```

#### Example

```http
PATCH /users/me/payment-methods/abc123/lightning
Content-Type: application/json
Authorization: Bearer <token>

{
  "lightningAddress": "bob@example.com"
}
```

### Success Response

- **Status:** `200 OK`
- **Body:**
  ```ts
  interface PaymentMethod {
    id: string;
    type: "LIGHTNING";
    lightningAddress: string;
    lnurlCallback: string;
    proxyPubkey: string;
    createdAt: string;
    updatedAt: string;
  }
  ```

### Error Responses

| Status | Body                                            | Condition                                        |
| ------ | ----------------------------------------------- | ------------------------------------------------ |
| 400    | `{ error: "Invalid Lightning address format" }` | Malformed address or LNURL-pay validation failed |
| 403    | `{ error: "Forbidden" }`                        | User does not own this payment method            |
| 404    | `{ error: "Payment method not found" }`         | No payment method with the given ID              |
| 401    | `{ error: "Unauthorized" }`                     | Missing or invalid JWT                           |
| 500    | `{ error: "Internal server error" }`            | Unexpected server error                          |

---

## 5. Delete Payment Method

- **URL:** `/users/me/payment-methods/:pmId`
- **Method:** `DELETE`
- **Authentication:** Required
- **Description:** Deletes an existing payment method.

### Request

- **Headers:**

  - `Authorization: Bearer <token>`

- **Path Parameters:**
  - `pmId: string` — The ID of the payment method to delete

### Success Response

- **Status:** `204 No Content`
- **Body:** None

### Error Responses

| Status | Body                                    | Condition                             |
| ------ | --------------------------------------- | ------------------------------------- |
| 403    | `{ error: "Forbidden" }`                | User does not own this payment method |
| 404    | `{ error: "Payment method not found" }` | No payment method with the given ID   |
| 401    | `{ error: "Unauthorized" }`             | Missing or invalid JWT                |
| 500    | `{ error: "Internal server error" }`    | Unexpected server error               |
