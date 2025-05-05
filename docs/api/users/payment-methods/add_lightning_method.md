# POST /users/me/payment-methods/lightning

**Description:** Add a new Lightning payment method.

**Authentication:** Requires `requireAuth`.  
**Validation:** Request body validated with `CreateLightningSchema`.

---

## Request Body

```json
{
  "lightningAddress": "user@domain.com"
}
```

---

## Response

**Status:** 201 Created

```json
{
  "id": "uuid-def456",
  "type": "LIGHTNING",
  "lightningAddress": "user@domain.com",
  "createdAt": "2025-05-05T15:10:00.000Z",
  "updatedAt": "2025-05-05T15:10:00.000Z"
}
```

| Field              | Type     | Description                  |
| ------------------ | -------- | ---------------------------- |
| `id`               | `string` | UUID of the payment method   |
| `type`             | `string` | Method type (`LIGHTNING`)    |
| `lightningAddress` | `string` | LN address (lud16)           |
| `createdAt`        | `string` | ISO timestamp of creation    |
| `updatedAt`        | `string` | ISO timestamp of last update |

> **Note:** Sensitive fields are omitted.
