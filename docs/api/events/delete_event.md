# Delete Draft Event

### Endpoint

`DELETE /events/{id}`

### Description

Deletes a draft event. Only the owner can delete.

### Parameters

| Name | In   | Type   | Required | Description       |
| ---- | ---- | ------ | -------- | ----------------- |
| id   | path | string | Yes      | UUID of the event |

### Responses

#### 204 No Content

**No response body**

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
