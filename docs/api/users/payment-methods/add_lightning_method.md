# Add Lightning Payment Method

### Endpoint

`POST /users/me/payment-methods/lightning`

### Description

Configures a new Lightning payment method for the authenticated user.

### Parameters

| Name             | In   | Type   | Required | Description               |
| ---------------- | ---- | ------ | -------- | ------------------------- |
| lightningAddress | body | string | Yes      | Lightning address (LUD16) |

### Responses

#### 201 Created

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "id": "<pmId>",
  "type": "LIGHTNING",
  "lightningAddress": "user@domain.com",
  "lnurlCallback": "https://domain.com/.well-known/lnurlp/user",
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

_or_

```json
{
  "error": "Lightning method already configured"
}
```

#### 401 Unauthorized

**Example Response:**

```json
{
  "error": "Unauthorized"
}
```

#### 500 Internal Server Error

**Example Response:**

```json
{
  "error": "Internal server error"
}
```
