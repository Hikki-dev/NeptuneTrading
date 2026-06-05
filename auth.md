# auth.md — Neptune Trading Company

Neptune Trading Company does not currently require authentication for public discovery endpoints or the contact API. There are no protected APIs requiring OAuth tokens at this time.

## Public Endpoints

| Endpoint | Auth Required |
|---|---|
| `GET /.well-known/api-catalog` | No |
| `GET /.well-known/oauth-protected-resource` | No |
| `GET /.well-known/agent-skills/index.json` | No |
| `GET /.well-known/mcp/server-card.json` | No |
| `POST /api/contact` | No |

## Agent Registration

No registration is required. Agents may call public endpoints freely.

For business inquiries or partnership requests, submit via `POST /api/contact` or visit https://neptunetrading.lk/contact.html
