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
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASSWORD`
   - `MAIL_FROM`
4. Apply Better Auth migrations:
   ```bash
   npm run auth:migrate
   ```
5. Create the admin account:
   ```bash
   npm run admin:create -- --email=nook@wiki-soul4bit.ru --password=CHANGE_ME --name="Nook Admin"
   ```
6. Run the app:
   ```bash
   npm run dev
   ```
7. Open `http://localhost:3000`.

## Mail for `wiki-soul4bit.ru`

Beget mailbox and SMTP settings:
- Create the mailbox `nook@wiki-soul4bit.ru` in Beget.
- Use MX records:
  - `mx1.beget.com`
  - `mx2.beget.com`
- Use SMTP host `smtp.beget.com`.
- For a standard SSL setup use port `465` and `SMTP_SECURE=true`.

## Deploy to VPS

1. Create `.env.local` on the server.
2. Add:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL=https://your-domain`
   - `SMTP_HOST=smtp.beget.com`
   - `SMTP_PORT=465`
   - `SMTP_SECURE=true`
   - `SMTP_USER=nook@wiki-soul4bit.ru`
   - `SMTP_PASSWORD=...`
   - `MAIL_FROM="Nook <nook@wiki-soul4bit.ru>"`
3. Run migrations:
   ```bash
   npm run auth:migrate
   ```
4. Create the admin account:
   ```bash
   npm run admin:create -- --email=nook@wiki-soul4bit.ru --password=CHANGE_ME --name="Nook Admin"
   ```
5. Build and restart:
   ```bash
   npm ci
   npm run build
   sudo systemctl restart nook
   ```

## Useful commands

```bash
npm run auth:sql
npm run auth:migrate
npm run admin:create -- --email=nook@wiki-soul4bit.ru --password=CHANGE_ME --name="Nook Admin"
```

## Next implementation step

- Add page tree and sidebar data model
- Persist editor content
- Add local file uploads
- Add page history and backlinks

