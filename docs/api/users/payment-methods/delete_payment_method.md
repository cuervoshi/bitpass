# Delete Payment Method

### Endpoint

`DELETE /users/me/payment-methods/{pmId}`

### Description

Deletes a configured payment method for the authenticated user.

### Parameters

| Name | In   | Type   | Required | Description                |
| ---- | ---- | ------ | -------- | -------------------------- |
| pmId | path | string | Yes      | UUID of the payment method |

### Responses

#### 204 No Content

_No response body._

#### 401 Unauthorized

```json
{
  "error": "Unauthorized"
}
```

#### 404 Not Found

```json
{
  "error": "Payment method not found"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```
