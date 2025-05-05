# List Payment Methods

### Endpoint

`GET /users/me/payment-methods`

### Description

Retrieves all payment methods configured by the authenticated user. Sensitive data such as encrypted keys are not exposed.

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
    "proxyPubkey": "<proxyPubkey>",
    "createdAt": "<ISO timestamp>",
    "updatedAt": "<ISO timestamp>"
  }
]
```

#### 401 Unauthorized

```json
{ "error": "Unauthorized" }
```

#### 500 Internal Server Error

```json
{ "error": "Internal server error" }
```
