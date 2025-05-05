# Verify Discount Code

### Endpoint

`POST /events/{id}/discount-codes/verify`

### Description

Validates that a discount code is applicable for the event. Returns only `valid: true` if usable.

### Parameters

| Name | In   | Type   | Required | Description             |
| ---- | ---- | ------ | -------- | ----------------------- |
| id   | path | string | Yes      | UUID of the event       |
| code | body | string | Yes      | Discount code to verify |

### Responses

#### 200 OK

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "valid": true
}
```

#### 400 Bad Request

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "error": "Discount code expired"
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
  "error": "Event not published"
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
