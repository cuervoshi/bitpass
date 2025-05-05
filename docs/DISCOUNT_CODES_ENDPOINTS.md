# Discount Code Endpoints

This document describes the discount code-related endpoints under `/events/:id/discount-codes`, including listing, creation, validation, update, and deletion.

---

## 1. List Discount Codes

- **URL:** `/events/:id/discount-codes`
- **Method:** `GET`
- **Authentication:** Required
- **Description:** Retrieves all discount codes for the specified event. Only the event owner or team members may access.

### Request

- **Headers:**
  - `Authorization: Bearer <token>`

- **Path Parameters:**
  - `id: string` — UUID of the event

### Success Response

- **Status:** `200 OK`
- **Body:**
  ```ts
  interface DiscountCode {
    id: string;
    code: string;
    percentage: number;
    expiresAt?: string;
    maxUses?: number;
    createdAt: string;
    updatedAt: string;
  }

  type ListDiscountCodesResponse = DiscountCode[];
  ```

### Error Responses

| Status | Body                                 | Condition                           |
| ------ | ------------------------------------ | ----------------------------------- |
| 401    | `{ error: "Unauthorized" }`          | Missing or invalid JWT              |
| 403    | `{ error: "Forbidden" }`             | User is not owner or team member    |
| 404    | `{ error: "Event not found" }`       | No event with the given ID          |
| 500    | `{ error: "Internal server error" }` | Unexpected server error             |

---

## 2. Create Discount Code

- **URL:** `/events/:id/discount-codes`
- **Method:** `POST`
- **Authentication:** Required
- **Description:** Creates a new discount code for a draft event.

### Request

- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

- **Path Parameters:**
  - `id: string` — UUID of the event

- **Body:**
  ```ts
  interface CreateDiscountInput {
    /** Unique code (1–10 characters) */
    code: string;
    /** Discount percentage (1–100) */
    percentage: number;
    /** Optional expiration in ISO format */
    expiresAt?: string;
    /** Optional maximum uses */
    maxUses?: number;
  }
  ```

### Success Response

- **Status:** `201 Created`
- **Body:**
  ```ts
  type CreateDiscountResponse = DiscountCode;
  ```

### Error Responses

| Status | Body                                              | Condition                                          |
| ------ | ------------------------------------------------- | -------------------------------------------------- |
| 400    | `{ error: "...validation message..." }`           | Schema validation or business rule violation       |
| 403    | `{ error: "Forbidden" }`                          | Event not in DRAFT or user not owner               |
| 404    | `{ error: "Event not found" }`                    | No event with the given ID                         |
| 500    | `{ error: "Internal server error" }`              | Unexpected server error                            |

---

## 3. Validate Discount Code

- **URL:** `/events/:id/discount-codes/verify`
- **Method:** `POST`
- **Authentication:** Required
- **Description:** Validates that a discount code is applicable for the event. Returns only `valid: true` if usable.

### Request

- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

- **Path Parameters:**
  - `id: string` — UUID of the event

- **Body:**
  ```ts
  interface ValidateDiscountBody {
    /** Code to validate */
    code: string;
  }
  ```

### Success Response

- **Status:** `200 OK`
- **Body:**
  ```ts
  interface ValidateDiscountResponse {
    valid: true;
  }
  ```

### Error Responses

| Status | Body                                | Condition                                     |
| ------ | ----------------------------------- | --------------------------------------------- |
| 400    | `{ error: "Discount code expired" }`         | Code has passed its expiration           |
| 400    | `{ error: "Discount code usage limit reached" }` | `maxUses` exceeded                      |
| 403    | `{ error: "Event not published" }`            | Cannot apply before event is published   |
| 404    | `{ error: "Discount code not found" }`        | Code not found for the event             |
| 401    | `{ error: "Unauthorized" }`                   | Missing or invalid JWT                        |
| 500    | `{ error: "Internal server error" }`          | Unexpected server error                       |

---

## 4. Update Discount Code

- **URL:** `/events/:id/discount-codes/:codeId`
- **Method:** `PATCH`
- **Authentication:** Required
- **Description:** Updates one or more fields of an existing discount code on a draft event.

### Request

- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

- **Path Parameters:**
  - `id: string` — UUID of the event
  - `codeId: string` — UUID of the discount code

- **Body:**
  ```ts
  interface UpdateDiscountInput {
    code?: string;       // 1–10 characters
    percentage?: number; // 1–100
    expiresAt?: string;
    maxUses?: number;
  }
  ```

### Success Response

- **Status:** `200 OK`
- **Body:**
  ```ts
  type UpdateDiscountResponse = DiscountCode;
  ```

### Error Responses

| Status | Body                                 | Condition                                                 |
| ------ | ------------------------------------ | --------------------------------------------------------- |
| 400    | `{ error: "At least one field must be provided" }` | No fields provided                                |
| 400    | `{ error: "Can only edit codes on draft events" }` | Event not in DRAFT status                           |
| 403    | `{ error: "Forbidden" }`             | User is not event owner                                    |
| 404    | `{ error: "Discount code not found" }` | No code with the given ID                                |
| 500    | `{ error: "Internal server error" }` | Unexpected server error                                   |

---

## 5. Delete Discount Code

- **URL:** `/events/:id/discount-codes/:codeId`
- **Method:** `DELETE`
- **Authentication:** Required
- **Description:** Deletes a discount code if the event is in draft.

### Request

- **Headers:**
  - `Authorization: Bearer <token>`

- **Path Parameters:**
  - `id: string` — UUID of the event
  - `codeId: string` — UUID of the discount code

### Success Response

- **Status:** `204 No Content`
- **Body:** None

### Error Responses

| Status | Body                                 | Condition                                                 |
| ------ | ------------------------------------ | --------------------------------------------------------- |
| 400    | `{ error: "Can only delete codes on draft events" }` | Event not in DRAFT                             |
| 403    | `{ error: "Forbidden" }`             | User is not event owner                                    |
| 404    | `{ error: "Discount code not found" }` | No code with the given ID                                |
| 500    | `{ error: "Internal server error" }` | Unexpected server error                                   |
