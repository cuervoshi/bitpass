# List Team Members

### Endpoint

`GET /events/{id}/team`

### Description

Retrieves all team members for the specified event. Accessible by event owner, moderators, or collaborators.

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
    "userId": "<userId>",
    "role": "OWNER",
    "createdAt": "<ISO timestamp>"
  },
  {
    "userId": "<userId>",
    "role": "COLLABORATOR",
    "createdAt": "<ISO timestamp>"
  }
]
```

#### 401 Unauthorized

```json
{
  "error": "Unauthorized"
}
```

#### 403 Forbidden

```json
{
  "error": "Forbidden"
}
```

#### 404 Not Found

```json
{
  "error": "Event not found"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```
