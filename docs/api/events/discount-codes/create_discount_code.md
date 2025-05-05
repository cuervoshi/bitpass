# Create Discount Code

### Endpoint

`POST /events/{id}/discount-codes`

### Description

Creates a new discount code for a draft event. Only the event owner may access.

### Parameters

| Name       | In   | Type   | Required | Description                 |
| ---------- | ---- | ------ | -------- | --------------------------- |
| id         | path | string | Yes      | UUID of the event           |
| code       | body | string | Yes      | Unique code (max 10 chars)  |
| percentage | body | number | Yes      | Discount percentage (1–100) |
| expiresAt  | body | string | No       | Expiration timestamp (ISO)  |
| maxUses    | body | number | No       | Maximum number of uses      |

### Responses

#### 201 Created

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "id": "<codeId>",
  "code": "SUMMER24",
  "percentage": 20,
  "expiresAt": "2025-08-01T00:00:00Z",
  "maxUses": 100,
  "createdAt": "<ISO timestamp>",
  "updatedAt": "<ISO timestamp>"
}
```

#### 400 Bad Request

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "error": "Code must be at most 10 characters"
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

#### 500 Internal Server Error

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "error": "Internal server error"
}
```
