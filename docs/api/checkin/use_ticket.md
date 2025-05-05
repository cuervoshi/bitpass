# Check In Ticket

### Endpoint

`PATCH /checkin/{ticketId}/use`

### Description

Marks a ticket as checked in. User must have permission on the event (owner, moderator, or collaborator).

### Parameters

| Name     | In   | Type   | Required | Description                    |
| -------- | ---- | ------ | -------- | ------------------------------ |
| ticketId | path | string | Yes      | UUID of the ticket to check in |

### Responses

#### 200 OK

**Content-Type:** `application/json`  
**Example Response:**

```json
{
  "id": "<ticketId>",
  "isCheckedIn": true
}
```

#### 400 Bad Request

```json
{ "error": "Ticket already checked in" }
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
