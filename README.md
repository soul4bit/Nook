# Nook

Nook is a personal second-brain app with a card-first feel:
- Next.js + Tailwind + shadcn/ui
- Tiptap editor
- PostgreSQL + Better Auth
- Optional Dexie local cache

## Local development

1. Install Node.js LTS.
2. Copy env template:
   ```bash
   cp .env.example .env.local
   ```
3. Fill `.env.local`:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL`
4. Apply Better Auth migrations:
   ```bash
   npm run auth:migrate
   ```
5. Run the app:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000`.

## Deploy to VPS

1. Create `.env.local` on the server.
2. Add:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL=https://your-domain`
3. Run migrations:
   ```bash
   npm run auth:migrate
   ```
4. Build and restart:
   ```bash
   npm ci
   npm run build
   sudo systemctl restart nook
   ```

## Useful commands

```bash
npm run auth:sql
npm run auth:migrate
```

## Next implementation step

- Add page tree and sidebar
- Add note table structure
- Persist editor content
- Add local file uploads
