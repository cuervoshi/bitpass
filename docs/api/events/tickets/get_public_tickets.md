# List Public Ticket Types

### Endpoint

`GET /events/{id}/tickets`

### Description

Retrieves all available ticket types for a published event. No authentication required.

### Parameters

| Name | In   | Type   | Required | Description                 |
| ---- | ---- | ------ | -------- | --------------------------- |
| id   | path | string | Yes      | UUID of the published event |

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
    "createdAt": "<ISO timestamp>",
    "updatedAt": "<ISO timestamp>"
  },
  {
    "id": "<ticketTypeId>",
    "name": "General",
    "price": 20.0,
    "currency": "USD",
    "quantity": 200,
    "createdAt": "<ISO timestamp>",
    "updatedAt": "<ISO timestamp>"
  }
]
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
