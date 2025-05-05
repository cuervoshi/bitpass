# Update Lightning Payment Method

### Endpoint

`PATCH /users/me/payment-methods/{pmId}/lightning`

### Description

Updates the Lightning address of an existing payment method.

### Path Parameters

| Name | In   | Type   | Required | Description                |
| ---- | ---- | ------ | -------- | -------------------------- |
| pmId | path | string | Yes      | UUID of the payment method |

### Body Parameters

| Name             | In   | Type   | Required | Description           |
| ---------------- | ---- | ------ | -------- | --------------------- |
| lightningAddress | body | string | Yes      | New Lightning address |

### Responses

#### 200 OK

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "id": "<pmId>",
  "type": "LIGHTNING",
  "lightningAddress": "new@domain.com",
  "lnurlCallback": "https://domain.com/.well-known/lnurlp/new",
  "proxyPubkey": "<proxyPubkey>",
  "createdAt": "<ISO timestamp>",
  "updatedAt": "<ISO timestamp>"
}
```

#### 400 Bad Request

```json
{ "error": "Invalid Lightning address format" }
```

#### 401 Unauthorized

```json
{ "error": "Unauthorized" }
```

#### 404 Not Found

```json
{ "error": "Payment method not found" }
```

#### 500 Internal Server Error

```json
{ "error": "Internal server error" }
```
