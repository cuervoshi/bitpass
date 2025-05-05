# Add Lightning Payment Method

### Endpoint

`POST /users/me/payment-methods/lightning`

### Description

Configures a new Lightning payment method for the authenticated user.

### Body Parameters

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
  "proxyPubkey": "<proxyPubkey>",
  "createdAt": "<ISO timestamp>",
  "updatedAt": "<ISO timestamp>"
}
```

#### 400 Bad Request

```json
{ "error": "Invalid Lightning address format" }
```

_or_

```json
{ "error": "Lightning method already configured" }
```

#### 401 Unauthorized

```json
{ "error": "Unauthorized" }
```

#### 500 Internal Server Error

```json
{ "error": "Internal server error" }
```
