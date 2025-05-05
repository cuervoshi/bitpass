# Fetch Ticket Information

### Endpoint

`GET /checkin/{ticketId}`

### Description

Retrieves information about a specific ticket, verifying the user's permission on the event.

### Parameters

| Name     | In   | Type   | Required | Description                 |
| -------- | ---- | ------ | -------- | --------------------------- |
| ticketId | path | string | Yes      | UUID of the ticket to fetch |

### Responses

#### 200 OK

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "id": "<ticketId>",
  "eventId": "<eventId>",
  "ticketType": {
    "name": "VIP",
    "price": 50.0,
    "currency": "USD"
  },
  "ownerId": "<ownerUserId>",
  "isCheckedIn": false
}
```

#### 401 Unauthorized

```json
{ "error": "Unauthorized" }
```

#### 403 Forbidden

```json
{ "error": "Forbidden" }
```

#### 404 Not Found

```json
{ "error": "Ticket not found" }
```

#### 500 Internal Server Error

```json
{ "error": "Internal server error" }
```
