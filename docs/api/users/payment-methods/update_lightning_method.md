# PATCH /users/me/payment-methods/:pmId/lightning

**Description:** Update the LN address of an existing payment method.

**Authentication:** Requires `requireAuth`.  
**Validation:** Request body validated with `CreateLightningSchema`.

---

## Path Parameters

- `pmId` — UUID of the payment method to update.

---

## Request Body

```json
{
  "lightningAddress": "newUser@domain.com"
}
```

---

## Response

**Status:** 200 OK

```json
{
  "id": "uuid-def456",
  "type": "LIGHTNING",
  "lightningAddress": "newUser@domain.com",
  "createdAt": "2025-05-05T15:10:00.000Z",
  "updatedAt": "2025-05-05T15:45:00.000Z"
}
```

| Field              | Type     | Description                        |
| ------------------ | -------- | ---------------------------------- |
| `id`               | `string` | UUID of the payment method         |
| `type`             | `string` | Method type (`LIGHTNING`)          |
| `lightningAddress` | `string` | Updated LN address                 |
| `createdAt`        | `string` | ISO timestamp of original creation |
| `updatedAt`        | `string` | ISO timestamp of last update       |

> **Note:** Sensitive fields are omitted.
