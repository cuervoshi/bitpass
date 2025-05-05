# Update Ticket Type

### Endpoint

`PATCH /events/{id}/tickets/{ticketId}`

### Description

Updates one or more fields of an existing ticket type. Only owners and moderators may access.

### Parameters

| Name          | In   | Type                   | Required | Description                     |
| ------------- | ---- | ---------------------- | -------- | ------------------------------- |
| id            | path | string                 | Yes      | UUID of the draft event         |
| ticketId      | path | string                 | Yes      | UUID of the ticket type         |
| (body fields) | body | see Create Ticket Type | Optional | Any subset of Create parameters |

### Responses

#### 200 OK

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "id": "<ticketTypeId>",
  "eventId": "<eventId>",
  "name": "VIP Updated",
  "price": 60.0,
  "currency": "USD",
  "quantity": 90,
  "createdAt": "<ISO timestamp>",
  "updatedAt": "<ISO timestamp>"
}
```

#### 400 Bad Request

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "error": "At least one field must be provided"
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
  "error": "Ticket type not found"
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
