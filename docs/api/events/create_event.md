# Create Draft Event

### Endpoint

`POST /events`

### Description

Creates a new event in draft mode with the provided basic data.

### Parameters

| Name        | In   | Type   | Required | Description                    |
| ----------- | ---- | ------ | -------- | ------------------------------ |
| title       | body | string | Yes      | Event title (min 3 characters) |
| description | body | string | No       | Event description (max 1000)   |
| location    | body | string | Yes      | Event location                 |
| startDate   | body | string | Yes      | Start date in `YYYY-MM-DD`     |
| startTime   | body | string | Yes      | Start time in `HH:mm`          |
| endDate     | body | string | Yes      | End date in `YYYY-MM-DD`       |
| endTime     | body | string | Yes      | End time in `HH:mm`            |

### Responses

#### 201 Created

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
  "createdAt": "<ISO timestamp>",
  "updatedAt": "<ISO timestamp>"
}
```

#### 400 Bad Request

- Validation errors (missing or invalid fields)

**Example Response:**

```json
{
  "error": "Title must be at least 3 characters"
}
```

#### 401 Unauthorized

**Example Response:**

```json
{
  "error": "Unauthorized"
}
```

#### 500 Internal Server Error

**Example Response:**

```json
{
  "error": "Internal server error"
}
```
