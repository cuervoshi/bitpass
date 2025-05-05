# Delete Team Member

### Endpoint

`DELETE /events/{id}/team/{userId}`

### Description

Removes a member from the event team. Only the event owner may perform this action.

### Parameters

| Name   | In   | Type   | Required | Description                       |
| ------ | ---- | ------ | -------- | --------------------------------- |
| id     | path | string | Yes      | UUID of the event                 |
| userId | path | string | Yes      | UUID of the team member to remove |

### Responses

#### 204 No Content

No response body.

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

#### 400 Bad Request

```json
{
  "error": "Cannot remove last owner"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```
