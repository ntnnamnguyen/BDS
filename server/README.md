# Hanoi Estate API

Independent NestJS REST backend for the Hanoi Estate web application and future
mobile clients. Nest is the only application that should access PostgreSQL once
the web cutover is complete. See the canonical
[`docs/architecture.md`](docs/architecture.md) for the system boundaries.

## Stack

- NestJS 11, TypeScript and ESM
- Prisma 7 with the PostgreSQL driver adapter
- PostgreSQL
- OpenAPI/Swagger
- Admin API-key authentication for the first migration phase

## Local setup

```bash
cp .env.example .env
pnpm install
pnpm prisma:generate
pnpm start:dev
```

The API listens on `http://localhost:3001/api/v1` by default. Swagger is at
`http://localhost:3001/api/v1/docs`.

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection URL.
- `ADMIN_API_KEY`: at least 32 characters. Send it as `X-Admin-Api-Key` on
  admin routes. Production rejects the `replace-*` example value.
- `CORS_ORIGINS`: comma-separated browser origins.
- `PORT`: defaults to `3001`.

`pnpm start:prod` forces `NODE_ENV=production`, so example placeholder secrets
remain fail-closed even if a copied `.env` still says `development`.

Do not expose `ADMIN_API_KEY` to browser-side JavaScript. The Next.js server
should attach it only from server-side code. Replace this temporary boundary
with user authentication and roles before exposing administration to third
parties.

## REST v1

Public routes:

```text
GET  /api/v1/health
GET  /api/v1/health/ready
GET  /api/v1/projects
GET  /api/v1/projects/:slug
POST /api/v1/leads
```

`POST /leads` has an in-memory limit of 20 requests/minute per IP observed by
Nest. For multiple API instances or deployments behind Next.js/reverse proxies,
also enforce a distributed limit at the gateway and configure the trusted proxy
chain so the source IP cannot be spoofed.

Admin routes require `X-Admin-Api-Key`:

```text
GET    /api/v1/admin/projects
POST   /api/v1/admin/projects
GET    /api/v1/admin/projects/:id
PATCH  /api/v1/admin/projects/:id
DELETE /api/v1/admin/projects/:id
PUT    /api/v1/admin/projects/:id/page
POST   /api/v1/admin/projects/:id/publish
POST   /api/v1/admin/projects/:id/archive
GET    /api/v1/admin/leads
PATCH  /api/v1/admin/leads/:id/status
```

`PUT /admin/projects/:id/page` requires `expectedVersion`. A stale version
returns HTTP 409 so concurrent editors cannot silently overwrite each other.
Permanent deletion is limited to draft projects; published projects should be
archived.

Publication state and sales state are intentionally separate:

```text
publicationStatus = DRAFT | PUBLISHED | ARCHIVED
salesStatus       = OPEN_FOR_SALE | COMING_SOON | HANDED_OVER
```

## Database ownership and migrations

`prisma/migrations` contains the four migrations already recorded in the
current database plus one new, additive migration. The earlier experimental
Nest migrations were never applied and are retained under
`prisma/legacy-migrations`; Prisma does not execute that directory.

The additive migration:

- keeps `customer` as `LegacyCustomer`;
- extends the existing project tables;
- creates `leads`;
- copies legacy customers idempotently through `legacy_customer_id`.

No migration has been applied as part of this refactor. Before deployment:

1. Back up the database and test against a staging clone.
2. Review `prisma/migrations/20260503160000_expand_projects_and_add_leads`.
3. Run `pnpm prisma:migrate:status` and then `pnpm prisma:migrate:deploy` in the
   controlled deployment environment.
4. Preview `pnpm data:legacy-projects:plan`, then run
   `pnpm data:legacy-projects:apply` once to preserve the three existing web
   catalog entries as drafts. Existing slugs are skipped and never overwritten.
5. Verify every price, legal and yield claim, then publish approved projects
   through the admin API/UI.
6. Verify legacy and new lead counts before directing the web contact form to
   Nest.
7. Keep `customer` for at least one release and run a final delta backfill before
   any later cleanup migration.

Never use `prisma migrate reset` or `prisma db push --accept-data-loss` against
this database. Follow the complete
[`docs/migration-runbook.md`](docs/migration-runbook.md) during cutover.

## Quality checks

```bash
pnpm prisma:validate
pnpm prisma:generate
pnpm prisma:migrate:status
pnpm typecheck
pnpm build
pnpm test
pnpm test:e2e
pnpm lint
```

The AI module currently defines only a provider port and module boundary. It has
no HTTP endpoint, vendor SDK, queue or access to contact PII yet.
