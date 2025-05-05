# Delete Discount Code

### Endpoint

`DELETE /events/{id}/discount-codes/{codeId}`

### Description

Deletes an existing discount code. Only the event owner may access.

### Parameters

| Name   | In   | Type   | Required | Description               |
| ------ | ---- | ------ | -------- | ------------------------- |
| id     | path | string | Yes      | UUID of the event         |
| codeId | path | string | Yes      | UUID of the discount code |

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
