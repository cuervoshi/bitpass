# Get User Profile

### Endpoint

`GET /users/me`

### Description

Retrieves the profile of the authenticated user.

### Parameters

_No parameters._

### Responses

#### 200 OK

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "id": "<userId>",
  "email": "<email>",
  "nostrPubKey": "<pubkey>",
  "createdAt": "<ISO timestamp>",
  "updatedAt": "<ISO timestamp>"
}
```

#### 401 Unauthorized

```json
{ "error": "Unauthorized" }
```

#### 500 Internal Server Error

```json
{ "error": "Internal server error" }
```
