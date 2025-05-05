# Get Draft Event

### Endpoint

`GET /events/{id}/edit`

### Description

Retrieves the draft event data for editing. Only the event owner, moderator, or collaborator can access.

### Parameters

| Name | In   | Type   | Required | Description       |
| ---- | ---- | ------ | -------- | ----------------- |
| id   | path | string | Yes      | UUID of the event |

### Responses

#### 200 OK

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "id": "<eventId>",
  "title": "<title>",
  "description": "<description>",
  "location": "<location>",
  "startsAt": "<ISO timestamp>",
  "endsAt": "<ISO timestamp>",
  "status": "DRAFT",
  "creatorId": "<userId>",
  "ticketTypes": [...],
  "team": [...],
  "paymentMethods": [...],
  "discountCodes": [...],
  "orders": [...],
  "tickets": [...],
  "createdAt": "<ISO timestamp>",
  "updatedAt": "<ISO timestamp>"
}
```

#### 401 Unauthorized

**Example Response:**

```json
{
  "error": "Unauthorized"
}
```

#### 403 Forbidden

**Example Response:**

```json
{
  "error": "Forbidden"
}
```

#### 404 Not Found

**Example Response:**

```json
{
  "error": "Event not found"
}
```

#### 500 Internal Server Error

**Example Response:**

```json
{
  "error": "Internal server error"
}
```
