# CLAUDE.md

## Agent context (read first)

Before working on this repo, read `agent_context/` — it maps the whole codebase for agents:
- `agent_context/call_index.md` — routes/controllers/middleware and view→store→API wiring
- `agent_context/func_registry.md` — every exported function/model/store, one-line purpose
- `agent_context/chains.md` — end-to-end call chains for core flows (auth, borrowing, book search, sockets)
- `agent_context/modify_guide.md` — which files to touch, in what order, for common change types

## Keeping agent_context and CLAUDE.md in sync

Do not regenerate on every small edit. Instead, check `git log` for what's changed since `agent_context/` was last updated (compare against the last commit that touched `agent_context/`), and update it when either is true:
- A structural refactor happened (new/removed/renamed routes, controllers, models, stores, or views; changed call chains; changed auth/middleware).
- A large batch of small changes accumulated since the last sync (many commits touching server/ or client/ without a corresponding agent_context update).

When updating, only rewrite the sections of `call_index.md`, `func_registry.md`, `chains.md`, `modify_guide.md` that are actually stale — verify against current code, don't guess. Update this CLAUDE.md file itself if the sync policy or repo shape changes.
