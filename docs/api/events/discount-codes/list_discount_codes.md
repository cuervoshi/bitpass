# List Discount Codes

### Endpoint

`GET /events/{id}/discount-codes`

### Description

Retrieves all discount codes for the specified event. Only the event owner or moderators may access.

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
    "id": "<codeId>",
    "code": "SUMMER24",
    "percentage": 20,
    "expiresAt": "2025-08-01T00:00:00Z",
    "maxUses": 100,
    "createdAt": "<ISO timestamp>",
    "updatedAt": "<ISO timestamp>"
  }
]
```

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
  "error": "Event not found"
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
