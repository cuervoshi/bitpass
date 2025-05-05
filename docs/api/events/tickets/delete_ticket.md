# Delete Ticket Type

### Endpoint

`DELETE /events/{id}/tickets/{ticketId}`

### Description

Deletes an existing ticket type. Only owners and moderators may access.

### Parameters

| Name     | In   | Type   | Required | Description             |
| -------- | ---- | ------ | -------- | ----------------------- |
| id       | path | string | Yes      | UUID of the draft event |
| ticketId | path | string | Yes      | UUID of the ticket type |

### Responses

#### 204 No Content

**No response body**

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
