# List Ticket Types (Admin)

### Endpoint

`GET /events/{id}/tickets/admin`

### Description

Retrieves detailed ticket type information for an event, including orders and sold tickets. Authentication required; only owners and moderators may access.

### Parameters

| Name | In   | Type   | Required | Description       |
| ---- | ---- | ------ | -------- | ----------------- |
| id   | path | string | Yes      | UUID of the event |

### Responses

#### 200 OK

**Content-Type:** `application/json`  
**Example Response:**

```json
[
  {
    "id": "<ticketTypeId>",
    "name": "VIP",
    "price": 50.0,
    "currency": "USD",
    "quantity": 100,
    "orderItems": [
      /* ... */
    ],
    "tickets": [
      /* ... */
    ],
    "createdAt": "<ISO timestamp>",
    "updatedAt": "<ISO timestamp>"
  }
]
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
