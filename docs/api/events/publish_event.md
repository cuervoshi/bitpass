# Publish Event

### Endpoint

`PATCH /events/{id}/publish`

### Description

Publishes a draft event (sets status to `PUBLISHED`) after validating integrity. Only the owner can publish.

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
  "status": "PUBLISHED"
  // ... other event fields ...
}
```

#### 400 Bad Request

- Validation errors (no tickets, no payment methods, not draft, etc.)

**Example Response:**

```json
{
  "error": "Event must have at least one ticket type"
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
