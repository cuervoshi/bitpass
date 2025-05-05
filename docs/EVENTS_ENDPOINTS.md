# Event Endpoints

This document describes the event-related endpoints, their HTTP methods, request payloads, and response payloads.

---

## 1. Create Draft Event

- **URL:** `/events`
- **Method:** `POST`
- **Authentication:** Required
- **Description:** Creates a new event in draft status with basic details.

### Request

- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

- **Body:**

```ts
import type { CreateEventInput } from "../lib/validators/event.schema.js";

interface CreateEventInput {
  title: string;
  description?: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endDate: string;   // YYYY-MM-DD
  endTime: string;   // HH:mm
}
```

#### Example

```http
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Event",
  "description": "An awesome gathering",
  "location": "123 Main St",
  "startDate": "2025-07-01",
  "startTime": "10:00",
  "endDate": "2025-07-01",
  "endTime": "12:00"
}
```

### Success Response

- **Status:** `201 Created`
- **Body:**

```ts
import type { Event } from "@prisma/client";

interface Event {
  id: string;
  title: string;
  description?: string;
  location: string;
  startsAt: string;
  endsAt: string;
  status: 'DRAFT';
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Error Responses

| Status | Body                                | Condition                                    |
| ------ | ----------------------------------- | -------------------------------------------- |
| 400    | `{ error: "Validation failed", details: ValidationError[] }` | Input fails Zod schema validation            |
| 401    | `{ error: "Unauthorized" }`         | Missing or invalid JWT                       |
| 500    | `{ error: "Internal server error" }`| Unexpected server error                      |

---

## 2. Get Draft Event

- **URL:** `/events/:id/edit`
- **Method:** `GET`
- **Authentication:** Required
- **Description:** Retrieves all data for a draft event, including ticket types, discount codes, team members, and payment methods.

### Request

- **Headers:**
  - `Authorization: Bearer <token>`

- **Path Parameters:**
  - `id: string` — Event UUID

### Success Response

- **Status:** `200 OK`
- **Body:**

```ts
import type { Event } from "@prisma/client";

interface DraftEventDetail extends Event {
  ticketTypes: TicketType[];
  discountCodes: DiscountCode[];
  team: EventMember[];
  paymentMethods: PaymentMethod[];
}
```

### Error Responses

| Status | Body                                   | Condition                              |
| ------ | -------------------------------------- | -------------------------------------- |
| 400    | `{ error: "Only draft events can be fetched here" }` | Event is not in DRAFT status          |
| 403    | `{ error: "Forbidden" }`               | User is not owner or team member       |
| 404    | `{ error: "Event not found" }`         | No event with given ID                 |
| 500    | `{ error: "Internal server error" }`   | Unexpected server error                |

---

## 3. Update Draft Event

- **URL:** `/events/:id`
- **Method:** `PATCH`
- **Authentication:** Required
- **Description:** Updates one or more fields of a draft event.

### Request

- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

- **Path Parameters:**
  - `id: string` — Event UUID

- **Body:**

```ts
import type { UpdateEventInput } from "../lib/validators/event.schema.js";

interface UpdateEventInput {
  title?: string;
  description?: string;
  location?: string;
  startDate?: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endDate?: string;   // YYYY-MM-DD
  endTime?: string;   // HH:mm
}
```

### Success Response

- **Status:** `200 OK`
- **Body:** Updated `Event` object (same shape as Create response)

### Error Responses

| Status | Body                                  | Condition                                               |
| ------ | ------------------------------------- | ------------------------------------------------------- |
| 400    | `{ error: "At least one field must be provided" }` | No body fields provided                                  |
| 400    | `{ error: "Only drafts can be edited" }` | Event not in DRAFT status                                |
| 403    | `{ error: "Forbidden" }`              | User is not owner or team member                         |
| 404    | `{ error: "Event not found" }`        | No event with given ID                                    |
| 500    | `{ error: "Internal server error" }`  | Unexpected server error                                  |

---

## 4. Delete Draft Event

- **URL:** `/events/:id`
- **Method:** `DELETE`
- **Authentication:** Required
- **Description:** Deletes a draft event permanently.

### Request

- **Headers:**
  - `Authorization: Bearer <token>`

- **Path Parameters:**
  - `id: string` — Event UUID

### Success Response

- **Status:** `204 No Content`
- **Body:** None

### Error Responses

| Status | Body                                  | Condition                                      |
| ------ | ------------------------------------- | ---------------------------------------------- |
| 400    | `{ error: "Only draft events can be deleted" }` | Event not in DRAFT status                |
| 403    | `{ error: "Forbidden" }`              | User is not owner or team member               |
| 404    | `{ error: "Event not found" }`        | No event with given ID                          |
| 500    | `{ error: "Internal server error" }`  | Unexpected server error                        |

---

## 5. Nested Tickets Router

The following routes are mounted under `/events/:id/tickets`:

- `GET /` — List public or draft tickets (depending on authentication)
- `GET /admin` — Admin listing of tickets with orders and check-ins
- `POST /` — Create ticket type
- `PATCH /:ticketId` — Update ticket type
- `DELETE /:ticketId` — Delete ticket type
