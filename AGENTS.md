# AGENTS.md

## Stack
- Single-package TypeScript Cloudflare Worker project. Use Bun commands; the repo is locked with `bun.lock` and Dependabot is configured for the `bun` ecosystem.
- Main Worker entrypoint is `src/index.ts`, configured by `wrangler.jsonc` `main`.

## Runtime Wiring
- This is an MCP server built on Cloudflare Workers Durable Objects. `BanrepcoMCP` extends `McpAgent` in `src/index.ts` and is also the Durable Object class bound as `MCP_OBJECT` in `wrangler.jsonc`.
- HTTP routing is minimal and path-sensitive: `/sse` and `/sse/message` use `BanrepcoMCP.serveSSE("/sse")`; `/mcp` uses `BanrepcoMCP.serve("/mcp")`. Preserve those paths unless the protocol surface is being changed deliberately.
- Tool registration happens in `BanrepcoMCP.init()` by instantiating tool classes and calling `start()`. Add new MCP tools under `src/tools/` and register them there.

## Environment And Generated Types
- `BAN_REP_CO_API_URL` is required at runtime. `src/index.ts` passes it into `HttpClient`, and `worker-configuration.d.ts` declares it.
- After changing Worker bindings or env vars in `wrangler.jsonc`, run `bun run cf-typegen` to regenerate `worker-configuration.d.ts`.
- `.env` is gitignored; there is no checked-in example env file.

## Commands
- Dev server: `bun run dev` or `bun run start`.
- Deploy: `bun run deploy`.
- Typecheck: `bun run type-check`.
- Regenerate Cloudflare types: `bun run cf-typegen`.
- Format: `bun run format`.
- Autofix lint: `bun run lint:fix`.

## Verification Notes
- There is no test suite or CI workflow in this repo today.
- `biome.json` only includes `src/**/*` and explicitly excludes `worker-configuration.d.ts`, so lint/format commands do not cover generated Worker types.
- `bunx biome check src` currently reports existing repo issues outside any new change, so avoid broad formatting-only churn unless the task is specifically to clean that up.

## Agent Skills

This repo uses `autoskills` to manage agent capabilities. Run `bunx autoskills --help` for usage.

### Installed Skills
- `durable-objects` - Core runtime patterns (highly relevant - this is a DO-based MCP server)
- `cloudflare` - General Cloudflare Worker guidance
- `workers-best-practices` - Best practices for Workers
- `wrangler` - Deployment CLI guidance
- `zod` - Schema validation (already used in `src/schemas/`)

### When to Load Skills
- Load `durable-objects` skill when working on `src/index.ts`, Durable Object state, or migrations.

### Install New Skills
- `bunx autoskills install <skill-name>` to add new skills from the autoskills registry.

## Code Layout
- `src/tools/*.ts` defines MCP tools.
- `src/schemas/*.ts` holds Zod input schemas shared by tool registration.
- `src/utils/http-client.ts` is the shared fetch wrapper for the upstream BanRep API.
- `src/types.ts` currently contains shared inferred response types for inflation endpoints.
