# nnamdi-obi — Community Platform

A community platform with courses and memberships.

## Stack

- **Framework**: Next.js 14 App Router (TypeScript strict mode)
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Payments**: Paystack
- **Icons**: Phosphor Icons only (`phosphor-react`) — no other icon libraries

## Conventions

- **Exports**: Named exports only — no default exports
- **Components**: Max 150 lines per component file — split if longer
- **TypeScript**: Strict mode always — no `any`, no `@ts-ignore`
- **Env vars**: Public vars use `NEXT_PUBLIC_` prefix; never expose service role key to client

## Supabase

- Browser client: `src/lib/supabase/client.ts`
- Server client: `src/lib/supabase/server.ts`
- Service role (server only): `src/lib/supabase/admin.ts`

## Key Domain Models

- **Users** — auth + profiles
- **Communities** — top-level group with members
- **Courses** — content with lessons
- **Memberships** — subscription plans tied to communities
- **Payments** — Paystack transactions
