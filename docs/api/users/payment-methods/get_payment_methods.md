# List Payment Methods

### Endpoint

`GET /users/me/payment-methods`

### Description

Retrieves all payment methods configured by the authenticated user.

### Parameters

_No parameters._

### Responses

#### 200 OK

**Content-Type:** `application/json`  
**Example Response:**

```json
[
  {
    "id": "<pmId>",
    "type": "LIGHTNING",
    "lightningAddress": "user@domain.com",
    "lnurlCallback": "https://domain.com/.well-known/lnurlp/user",
    "proxyPubkey": "<pubkey>",
    "createdAt": "<ISO timestamp>",
    "updatedAt": "<ISO timestamp>"
  }
]
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
