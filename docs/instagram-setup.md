# Instagram / Meta setup

Manual steps to connect Instabot with Instagram Professional accounts.

## 1. Create a Meta app

1. Go to [Meta for Developers](https://developers.facebook.com/).
2. Create a new app (type: Business).
3. Add the **Instagram** product with **Instagram API with Instagram Login**.

## 2. Configure Instagram Login

1. In the Meta app dashboard, open Instagram → API setup with Instagram login.
2. Add OAuth redirect URI:
   - Development: `http://localhost:3001/api/instagram/callback`
   - Production: `https://app.yourdomain.com/api/instagram/callback`
3. Copy **Instagram App ID** and **Instagram App Secret** into your environment:
   - `INSTAGRAM_APP_ID`
   - `INSTAGRAM_APP_SECRET`
   - `INSTAGRAM_REDIRECT_URI`

## 3. Configure webhooks

1. In the Meta app, open Instagram → Webhooks.
2. Callback URL: `https://app.yourdomain.com/api/webhooks/instagram`
3. Verify token: set the same value as `META_WEBHOOK_VERIFY_TOKEN` in your environment.
4. Subscribe to fields required for messaging (per current Meta documentation).

## 4. Environment variables

See `apps/product/.env.example` for the full list. Required for Instagram:

| Variable                    | Description                                    |
| --------------------------- | ---------------------------------------------- |
| `INSTAGRAM_APP_ID`          | Meta app ID                                    |
| `INSTAGRAM_APP_SECRET`      | Meta app secret (server-only)                  |
| `INSTAGRAM_REDIRECT_URI`    | OAuth callback URL                             |
| `INSTAGRAM_API_BASE_URL`    | Default `https://graph.instagram.com`          |
| `INSTAGRAM_API_VERSION`     | API version (verify against Meta docs)         |
| `TOKEN_ENCRYPTION_KEY`      | 32-byte base64 key (`openssl rand -base64 32`) |
| `META_WEBHOOK_VERIFY_TOKEN` | Webhook verification token                     |

## 5. Supported accounts

Only **Instagram Professional** accounts (Business or Creator) are supported. Personal accounts are rejected during connection.

## 6. Token security

- Access tokens are exchanged server-side only.
- Tokens are encrypted with AES-256-GCM before database storage.
- Tokens are never returned in API responses or logs.
