# Verify Nostr (NIP-98)

### Endpoint

`POST /auth/verify-nostr`

### Description

Verifies a Nostr NIP-98 event for authentication and issues a JWT.

### Parameters

| Name | In   | Type   | Required | Description           |
| ---- | ---- | ------ | -------- | --------------------- |
| body | body | object | Yes      | The NIP-98 event JSON |

### Responses

#### 200 OK

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "success": true,
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "<USER_ID>",
    "email": null,
    "nostrPubKey": "<PUBLIC_KEY>",
    "createdAt": "<ISO_TIMESTAMP>",
    "updatedAt": "<ISO_TIMESTAMP>"
  }
}
```

#### 400 Bad Request

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "error": "Invalid NIP-98 event"
}
```

#### 401 Unauthorized

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "error": "Invalid signature"
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
