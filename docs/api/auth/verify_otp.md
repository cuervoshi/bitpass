# Verify OTP

### Endpoint

`POST /auth/verify-otp`

### Description

Verifies the OTP code sent to the user's email and issues a JWT.

### Parameters

| Name  | In   | Type   | Required | Description                    |
| ----- | ---- | ------ | -------- | ------------------------------ |
| email | body | string | Yes      | The user's email address       |
| code  | body | string | Yes      | The OTP code received by email |

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
    "email": "<EMAIL>",
    "nostrPubKey": null,
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
  "error": "Invalid parameters"
}
```

#### 401 Unauthorized

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "error": "Invalid or expired code"
}
```

#### 403 Forbidden

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "error": "Too many attempts; code blocked"
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
