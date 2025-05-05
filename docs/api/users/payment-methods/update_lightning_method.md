# Update Lightning Payment Method

### Endpoint

`PATCH /users/me/payment-methods/{pmId}/lightning`

### Description

Updates the Lightning address of an existing payment method.

### Parameters

| Name             | In   | Type   | Required | Description                |
| ---------------- | ---- | ------ | -------- | -------------------------- |
| pmId             | path | string | Yes      | UUID of the payment method |
| lightningAddress | body | string | Yes      | New Lightning address      |

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
  "proxyPubkey": "<pubkey>",
  "proxyPrivkeyEncrypted": "<encrypted key>",
  "createdAt": "<ISO timestamp>",
  "updatedAt": "<ISO timestamp>"
}
```

#### 400 Bad Request

**Example Response:**

```json
{
  "error": "Invalid Lightning address format"
}
```

#### 401 Unauthorized

**Example Response:**

```json
{
  "error": "Unauthorized"
}
```

#### 404 Not Found

**Example Response:**

```json
{
  "error": "Payment method not found"
}
```

#### 500 Internal Server Error

**Example Response:**

```json
{
  "error": "Internal server error"
}
```
