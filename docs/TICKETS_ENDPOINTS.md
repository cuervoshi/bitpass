# Ticket Endpoints

This document describes the ticket-related endpoints, their HTTP methods, request payloads, and response payloads.

---

## 1. Public Ticket List

- **URL:** `/events/:id/tickets`
- **Method:** `GET`
- **Authentication:** Not required
- **Description:** Fetches available ticket types for a published event, including sold and remaining quantities.

### Request

- **Path Parameters:**

  - `id: string` — Event UUID

- **Headers:** None

### Success Response

- **Status:** `200 OK`
- **Body:**

```ts
interface PublicTicketType {
  id: string;
  name: string;
  price: number;
  currency: string;
  sold: number;
  available: number;
}

type PublicTicketListResponse = PublicTicketType[];
```

### Error Responses

| Status | Body                                            | Condition                                          |
| ------ | ----------------------------------------------- | -------------------------------------------------- |
| 404    | `{ error: "Event not found or not published" }` | Event does not exist or is not in PUBLISHED status |
| 500    | `{ error: "Internal server error" }`            | Unexpected server error                            |

---

## 2. Admin Ticket List

- **URL:** `/events/:id/tickets/admin`
- **Method:** `GET`
- **Authentication:** Required
- **Description:** Fetches detailed ticket types for an event (draft or published) including associated orders and tickets. Only owner or team members may access.

### Request

- **Path Parameters:**

  - `id: string` — Event UUID

- **Headers:**
  - `Authorization: Bearer <token>`

### Success Response

- **Status:** `200 OK`
- **Body:**

```ts
interface AdminOrderInfo {
  id: string;
  buyerId: string;
  quantity: number;
  price: number;
}

interface AdminTicketInfo {
  id: string;
  ownerId: string;
  isCheckedIn: boolean;
}

interface AdminTicketType {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  orders: AdminOrderInfo[];
  tickets: AdminTicketInfo[];
}

type AdminTicketListResponse = AdminTicketType[];
```

### Error Responses

| Status | Body                                 | Condition                                     |
| ------ | ------------------------------------ | --------------------------------------------- |
| 403    | `{ error: "Forbidden" }`             | User is not owner or team member of the event |
| 404    | `{ error: "Event not found" }`       | No event with given ID                        |
| 500    | `{ error: "Internal server error" }` | Unexpected server error                       |

---

## 3. Create Ticket Type

- **URL:** `/events/:id/tickets`
- **Method:** `POST`
- **Authentication:** Required
- **Description:** Creates a new ticket type under a draft event.

### Request

- **Path Parameters:**

  - `id: string` — Event UUID

- **Headers:**

  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

- **Body:**

```ts
import type { CreateTicketInput } from "../lib/validators/ticket.schema.js";

interface CreateTicketInput {
  name: string;
  price: number;
  currency: string;
  quantity: number;
}
```

#### Example

```http
POST /events/123e4567-e89b-12d3-a456-426614174000/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "VIP",
  "price": 150.0,
  "currency": "USD",
  "quantity": 50
}
```

### Success Response

- **Status:** `201 Created`
- **Body:**

```ts
import type { TicketType } from "@prisma/client";

type CreateTicketResponse = TicketType;
```

### Error Responses

| Status | Body                                                                 | Condition                        |
| ------ | -------------------------------------------------------------------- | -------------------------------- |
| 400    | `{ error: "Cannot add tickets to a non-draft event" }`               | Event is not in DRAFT status     |
| 403    | `{ error: "Forbidden" }`                                             | User is not owner or team member |
| 400    | `{ error: "A ticket with that name already exists for this event" }` | Duplicate ticket name            |
| 404    | `{ error: "Event not found" }`                                       | No event with given ID           |
| 500    | `{ error: "Internal server error" }`                                 | Unexpected server error          |

---

## 4. Update Ticket Type

- **URL:** `/events/:id/tickets/:ticketId`
- **Method:** `PATCH`
- **Authentication:** Required
- **Description:** Updates one or more fields of an existing ticket type.

### Request

- **Path Parameters:**

  - `id: string` — Event UUID
  - `ticketId: string` — Ticket type UUID

- **Headers:**

  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

- **Body:**

```ts
import type { UpdateTicketInput } from "../lib/validators/ticket.schema.js";

interface UpdateTicketInput {
  name?: string;
  price?: number;
  currency?: string;
  quantity?: number;
}
```

#### Example

```http
PATCH /events/123e4567-e89b-12d3-a456-426614174000/tickets/abc123
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 200.0
}
```

### Success Response

- **Status:** `200 OK`
- **Body:** Updated `TicketType` object

### Error Responses

| Status | Body                                                                 | Condition                                |
| ------ | -------------------------------------------------------------------- | ---------------------------------------- |
| 400    | `{ error: "Cannot edit tickets of a non-draft event" }`              | Event is not in DRAFT status             |
| 400    | `{ error: "Ticket does not belong to this event" }`                  | `ticketId` not associated with the event |
| 403    | `{ error: "Forbidden" }`                                             | User is not owner or team member         |
| 404    | `{ error: "Ticket type not found" }`                                 | No ticket type with given `ticketId`     |
| 400    | `{ error: "A ticket with that name already exists for this event" }` | Duplicate ticket name                    |
| 500    | `{ error: "Internal server error" }`                                 | Unexpected server error                  |

---

## 5. Delete Ticket Type

- **URL:** `/events/:id/tickets/:ticketId`
- **Method:** `DELETE`
- **Authentication:** Required
- **Description:** Deletes a ticket type if no tickets have been sold from it.

### Request

- **Path Parameters:**

  - `id: string` — Event UUID
  - `ticketId: string` — Ticket type UUID

- **Headers:**
  - `Authorization: Bearer <token>`

#### Example

```http
DELETE /events/123e4567-e89b-12d3-a456-426614174000/tickets/abc123
Authorization: Bearer <token>
```

### Success Response

- **Status:** `204 No Content`
- **Body:** None

### Error Responses

| Status | Body                                                         | Condition                                |
| ------ | ------------------------------------------------------------ | ---------------------------------------- |
| 400    | `{ error: "Cannot delete a ticket type with sold tickets" }` | Tickets have already been sold           |
| 400    | `{ error: "Ticket does not belong to this event" }`          | `ticketId` not associated with the event |
| 403    | `{ error: "Forbidden" }`                                     | User is not owner or team member         |
| 404    | `{ error: "Ticket type not found" }`                         | No ticket type with given `ticketId`     |
| 500    | `{ error: "Internal server error" }`                         | Unexpected server error                  |
