# Create Ticket Type

### Endpoint

`POST /events/{id}/tickets`

### Description

Creates a new ticket type under a draft event. Only owners and moderators may access.

### Parameters

| Name     | In   | Type   | Required | Description                 |
| -------- | ---- | ------ | -------- | --------------------------- |
| id       | path | string | Yes      | UUID of the draft event     |
| name     | body | string | Yes      | Name of the ticket type     |
| price    | body | number | Yes      | Price of the ticket type    |
| currency | body | string | Yes      | Currency code (e.g., "USD") |
| quantity | body | number | Yes      | Quantity available (>=1)    |

### Responses

#### 201 Created

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "id": "<ticketTypeId>",
  "eventId": "<eventId>",
  "name": "VIP",
  "price": 50.0,
  "currency": "USD",
  "quantity": 100,
  "createdAt": "<ISO timestamp>",
  "updatedAt": "<ISO timestamp>"
}
```

#### 400 Bad Request

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "error": "Name must be at least 1 character"
}
```

#### 401 Unauthorized

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "error": "Unauthorized"
}
```

#### 403 Forbidden

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "error": "Forbidden"
}
```

#### 404 Not Found

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "error": "Event not found"
}
```

#### 500 Internal Server Error

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "error": "Internal server error"
}
```
