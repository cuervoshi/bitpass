# Request OTP

### Endpoint

`POST /auth/request-otp`

### Description

Requests a one-time passcode (OTP) to be sent to the user's email.

### Parameters

| Name  | In   | Type   | Required | Description              |
| ----- | ---- | ------ | -------- | ------------------------ |
| email | body | string | Yes      | The user's email address |

### Responses

#### 200 OK

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "success": true
}
```

#### 400 Bad Request

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "error": "Invalid email"
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
