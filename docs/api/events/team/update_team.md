# Update Team Member Role

### Endpoint

`PATCH /events/{id}/team/{userId}`

### Description

Updates the role of an existing team member. Only the event owner may perform this action.

### Parameters

| Name   | In   | Type   | Required | Description                                       |
| ------ | ---- | ------ | -------- | ------------------------------------------------- |
| id     | path | string | Yes      | UUID of the event                                 |
| userId | path | string | Yes      | UUID of the team member to update                 |
| role   | body | string | Yes      | New role: `OWNER`, `MODERATOR`, or `COLLABORATOR` |

### Responses

#### 200 OK

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "userId": "<userId>",
  "role": "COLLABORATOR",
  "createdAt": "<ISO timestamp>"
}
```

#### 400 Bad Request

```json
{
  "error": "Cannot remove last owner"
}
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
  "error": "Member not found"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```
