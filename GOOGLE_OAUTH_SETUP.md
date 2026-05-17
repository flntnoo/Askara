# Google OAuth Setup

Convo uses Auth.js / NextAuth with Google OAuth and the Prisma Adapter.

## Local Setup

1. Open the Google Cloud Console.
2. Create or select a Google Cloud project.
3. Configure the OAuth consent screen.
4. Create an OAuth Client ID.
5. Select **Web application** as the application type.
6. Add this authorized JavaScript origin:

```text
http://localhost:3000
```

7. Add this authorized redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

8. Copy the Client ID and Client Secret into `.env`:

```env
AUTH_SECRET="secure-random-secret"
AUTH_GOOGLE_ID="google-client-id"
AUTH_GOOGLE_SECRET="google-client-secret"
AUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST=true
```

Generate `AUTH_SECRET` with a cryptographically secure random value.

## Production Setup

For production on a VPS behind Nginx, keep OAuth values server-side only and add your real domain:

```text
https://YOUR_DOMAIN
https://YOUR_DOMAIN/api/auth/callback/google
```

Use:

```env
AUTH_URL="https://YOUR_DOMAIN"
AUTH_TRUST_HOST=true
```

Do not prefix OAuth secrets with `NEXT_PUBLIC_`, and do not log provider tokens or secrets.
