# Check-In Endpoints

This document describes the ticket check-in endpoints, their HTTP methods, request payloads, and response payloads.

---

## 1. Fetch Ticket Information

- **URL:** `/tickets/:ticketId`
- **Method:** `GET`
- **Authentication:** Required
- **Description:** Retrieves information about a specific ticket, including its status and associated event details for check-in.

### Request

- **Headers:**

  - `Authorization: Bearer <token>`

- **Path Parameters:**
  - `ticketId: string` — UUID of the ticket

#### Example

```http
GET /tickets/abc123
Authorization: Bearer <token>
```

### Success Response

- **Status:** `200 OK`
- **Body:**

```ts
interface TicketInfo {
  /** Ticket UUID */
  id: string;
  /** Event UUID to which this ticket belongs */
  eventId: string;
  /** Ticket type details */
  ticketType: {
    id: string;
    name: string;
    price: number;
    currency: string;
  };
  /** User UUID who owns the ticket */
  ownerId: string;
  /** Whether the ticket has been checked in */
  isCheckedIn: boolean;
}
```

### Error Responses

| Status | Body                                 | Condition                             |
| ------ | ------------------------------------ | ------------------------------------- |
| 401    | `{ error: "Unauthorized" }`          | Missing or invalid JWT                |
| 403    | `{ error: "Forbidden" }`             | User does not have permission to view |
| 404    | `{ error: "Ticket not found" }`      | No ticket with the given ID           |
| 500    | `{ error: "Internal server error" }` | Unexpected server error               |

---

## 2. Check-In Ticket

- **URL:** `/tickets/:ticketId/checkin`
- **Method:** `PATCH`
- **Authentication:** Required
- **Description:** Marks a specific ticket as checked in, preventing further check-ins.

### Request

- **Headers:**

  - `Authorization: Bearer <token>`

- **Path Parameters:**
  - `ticketId: string` — UUID of the ticket

#### Example

```http
PATCH /tickets/abc123/checkin
Authorization: Bearer <token>
```

### Success Response

- **Status:** `200 OK`
- **Body:**

```ts
interface CheckInResponse {
  /** Ticket UUID */
  id: string;
  /** Updated check-in status */
  isCheckedIn: true;
}
```

### Error Responses

| Status | Body                                     | Condition                                    |
| ------ | ---------------------------------------- | -------------------------------------------- |
| 401    | `{ error: "Unauthorized" }`              | Missing or invalid JWT                       |
| 403    | `{ error: "Forbidden" }`                 | User does not have permission to check in    |
| 400    | `{ error: "Ticket already checked in" }` | Ticket has already been marked as checked in |
| 404    | `{ error: "Ticket not found" }`          | No ticket with the given ID                  |
| 500    | `{ error: "Internal server error" }`     | Unexpected server error                      |
