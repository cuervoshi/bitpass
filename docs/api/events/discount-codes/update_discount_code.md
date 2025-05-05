# Update Discount Code

### Endpoint

`PATCH /events/{id}/discount-codes/{codeId}`

### Description

Updates one or more fields of an existing discount code. Only the event owner may access.

### Parameters

| Name       | In   | Type   | Required | Description                     |
| ---------- | ---- | ------ | -------- | ------------------------------- |
| id         | path | string | Yes      | UUID of the event               |
| codeId     | path | string | Yes      | UUID of the discount code       |
| code       | body | string | No       | New code (max 10 chars)         |
| percentage | body | number | No       | New discount percentage (1–100) |
| expiresAt  | body | string | No       | New expiration timestamp (ISO)  |
| maxUses    | body | number | No       | New maximum number of uses      |

### Responses

#### 200 OK

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "id": "<codeId>",
  "code": "SUMMER25",
  "percentage": 25,
  "expiresAt": "2025-09-01T00:00:00Z",
  "maxUses": 150,
  "createdAt": "<ISO timestamp>",
  "updatedAt": "<ISO timestamp>"
}
```

#### 400 Bad Request

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "error": "At least one field must be provided"
}
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
  "error": "Discount code not found"
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
