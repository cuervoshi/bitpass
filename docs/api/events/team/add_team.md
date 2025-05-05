# Add Team Member

### Endpoint

`POST /events/{id}/team`

### Description

Invites a new member to the event team with a specified role. Only the event owner may perform this action.

### Parameters

| Name   | In   | Type   | Required | Description                                   |
| ------ | ---- | ------ | -------- | --------------------------------------------- |
| id     | path | string | Yes      | UUID of the event                             |
| userId | body | string | Yes      | UUID of the user to add                       |
| role   | body | string | Yes      | Role to assign: `MODERATOR` or `COLLABORATOR` |

### Responses

#### 201 Created

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "userId": "<userId>",
  "role": "MODERATOR",
  "createdAt": "<ISO timestamp>"
}
```

#### 400 Bad Request

```json
{
  "error": "Member already exists"
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
  "error": "Event not found"
}
```

#### 409 Conflict

```json
{
  "error": "Member already exists"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```
