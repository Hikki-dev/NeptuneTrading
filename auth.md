---
agent_auth:
  register_uri: https://neptunetrading.lk/contact.html
  identity_types_supported:
    - anonymous
  anonymous:
    credential_types_supported:
      - none
    claim_uri: https://neptunetrading.lk/contact.html
---

# auth.md — Neptune Trading Company

Neptune Trading Company does not require authentication for public discovery endpoints or agent access. All content and the contact enquiry endpoint are publicly accessible without credentials or registration.

## Public Endpoints

| Endpoint | Auth Required | Description |
|---|---|---|
| `GET /` | No | Homepage |
| `GET /.well-known/api-catalog` | No | API catalog (RFC 9727) |
| `GET /.well-known/oauth-protected-resource` | No | OAuth resource metadata |
| `GET /.well-known/oauth-authorization-server` | No | OAuth server metadata |
| `GET /.well-known/agent-skills/index.json` | No | Agent skill index |
| `GET /.well-known/mcp/server-card.json` | No | MCP server card |
| `POST /api/contact` | No | Submit a business enquiry |

## Agent Registration

No registration is required. Agents may read all public pages and submit enquiries freely.

**Identity type:** `anonymous`  
**Credential type:** `none`  
**Claim URI:** https://neptunetrading.lk/contact.html

For business enquiries or principal partnership requests, submit via the contact form at https://neptunetrading.lk/contact.html or email info@neptunetrading.lk.
