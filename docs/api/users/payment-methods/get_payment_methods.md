# GET /users/me/payment-methods

**Description:** List all payment methods configured by the user.

**Authentication:** Requires `requireAuth`. The `userId` is obtained from the session/JWT.

---

## Response

**Status:** 200 OK

```json
[
  {
    "id": "uuid-abc123",
    "type": "LIGHTNING",
    "lightningAddress": "user@domain.com",
    "createdAt": "2025-05-05T14:22:00.000Z",
    "updatedAt": "2025-05-05T14:22:00.000Z"
  }
]
```

| Field              | Type     | Description                    |
| ------------------ | -------- | ------------------------------ |
| `id`               | `string` | UUID of the payment method     |
| `type`             | `string` | Method type (e.g. `LIGHTNING`) |
| `lightningAddress` | `string` | LN address (lud16)             |
| `createdAt`        | `string` | ISO timestamp of creation      |
| `updatedAt`        | `string` | ISO timestamp of last update   |

> **Note:** Sensitive fields are not exposed.
