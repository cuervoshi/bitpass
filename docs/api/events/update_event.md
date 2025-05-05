# Update Draft Event

### Endpoint

`PATCH /events/{id}`

### Description

Updates one or more fields of an existing draft event. Only the owner or moderator can update.

### Parameters

| Name          | In   | Type                   | Required | Description                     |
| ------------- | ---- | ---------------------- | -------- | ------------------------------- |
| id            | path | string                 | Yes      | UUID of the event               |
| (body fields) | body | See Create Draft Event | Optional | Any subset of Create parameters |

### Responses

#### 200 OK

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "id": "<eventId>",
  "title": "<updatedTitle>",
  "description": "<updatedDescription>",
  "location": "<updatedLocation>",
  "startsAt": "<ISO timestamp>",
  "endsAt": "<ISO timestamp>",
  "status": "DRAFT",
  "creatorId": "<userId>",
  "createdAt": "<ISO timestamp>",
  "updatedAt": "<ISO timestamp>"
}
```

#### 400 Bad Request

- Validation errors or no fields provided

**Example Response:**

```json
{
  "error": "At least one field must be provided"
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
