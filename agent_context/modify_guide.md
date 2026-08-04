# Modify Guide

## Observed conventions

- **Domain naming**: Vietnamese nouns throughout — `docgia`=reader, `sach`=book, `nhaxuatban`=publisher, `muonsach`/`muon-sach`=borrowing, `nhanvien`=staff. Files/folders use these as-is (e.g. `docgia.controller.js`, `Sach.js`). Route URL segments use kebab-case where multi-word (`/muon-sach`), model/schema fields use camelCase Vietnamese (`tenSach`, `soQuyen`, `maNXB`, `ngayMuon`, `ngayTra`).
- **Response JSON shape**: NOT a wrapped `{success,data}` envelope. Controllers call `res.json(doc)` or `res.status(N).json(doc)` directly with the raw Mongoose document/array as the body. Errors go through a single shape: `{ message: string }` (see error.middleware.js:3). The one inconsistency: `auth.controller.js:12,15` returns `res.status(401).json()` with an **empty** body on bad login (no `message`), unlike every other error path — replicate that behavior if you want to stay backward compatible for that specific case, or fix it (verified, not previously documented as intentional).
- **Error handling pattern**: Controllers are wrapped in `asyncHandler(fn)` (server/src/utils/asyncHandler.js) which catches rejected promises and calls `next(err)`. To signal an HTTP error from inside a controller: `const e = new Error('message'); e.status = 400|404; throw e;` — the terminal `errorHandler` middleware (server/src/middleware/error.middleware.js, registered LAST in app.js:31) reads `err.status` (default 400) and `err.message` (default `'Lỗi server'`). `auth.controller.js` is NOT wrapped in asyncHandler (it's a plain async function directly passed to `router.post`) — this is an inconsistency; if it throws, it will crash the request without going through errorHandler. New controllers should follow the `asyncHandler` pattern used everywhere else.
- **Auth/token convention**: JWT, not sessions. Header `Authorization: Bearer <token>`, verified in `server/src/middleware/auth.middleware.js:requireAuth` via `jwt.verify(token, process.env.JWT_SECRET)`, decoded payload attached to `req.nhanVien`. Token issued in `auth.controller.js:17` with `{id, maNhanVien}` payload, `expiresIn:'8h'`. Client stores token in Pinia (`auth.store.js`) mirrored to `localStorage` keys `token`/`hoTen`; axios request interceptor (`client/src/api/http.js:6-10`) auto-attaches it; response interceptor auto-logs-out on 401.
- **Public vs protected routes**: mixed per-route, not per-router (except docgia which is fully protected via `router.use(requireAuth)`). Read/search of `sach` and `nhaxuatban`, and creating a `muonsach` record, are intentionally public (customer-facing borrow form doesn't require staff login). Mutations generally require `requireAuth`.
- **Soft delete**: no hard deletes anywhere. All domain models have `active: Boolean default true`; "deleting" = PATCH `.../:id/active` with `{active:false}`. Controllers commonly branch on `?all=true` query param to include inactive rows for admin views vs. only `active:true` for public views.
- **Realtime**: single Socket.IO room `"books"`; every connected socket auto-joins on connect (server.js:15-17). Only one event exists: `book:updated` with payload `{maSach, soQuyen, active}`. `getIO()`/`setIO()` (sockets/io.js) is a simple module-level singleton, not passed via DI/req.
- **Transactions**: Mongoose sessions used for the two flows that touch multiple collections/enforce invariants under concurrency: `muonsach.controller.js:muonSach` and `:traSach`. Pattern: `startSession()` → `startTransaction()` → operations with `{session}` → `commitTransaction()` in try, `abortTransaction()` in catch, `endSession()` in finally.

## If you need to...

### Add a new field to a model
1. Edit the Mongoose schema in `server/src/models/<Model>.js`.
2. If the field must be provided/validated on create, no controller change needed IF using `Model.create(req.body)` directly (docgia, nhaxuatban, sach controllers all pass `req.body` through as-is) — just add validation to schema (`required`, `min`, etc).
3. If it affects `update*` handlers using `findByIdAndUpdate(id, req.body, {returnDocument:'after', runValidators:true})` — check whether `runValidators:true` is present (only `sach.controller.js:41` has it currently; others don't) — add it if you want the new schema constraints enforced on update too.
4. Update frontend form(s) in the matching `client/src/views/admin/*Manage.vue` — add the input bound via `v-model="form.<field>"`, and add it to the `form` ref's initial shape and to `resetForm()`/`edit*()` functions.
5. Update `agent_context/func_registry.md` model table.

### Add a new API endpoint
1. Add controller function in `server/src/controllers/<domain>.controller.js`, wrapped in `asyncHandler` (import from `../utils/asyncHandler.js`).
2. Register route in `server/src/routes/<domain>.routes.js`; add `requireAuth` middleware if it should be staff-only (import from `../middleware/auth.middleware.js`).
3. Follow response convention: return raw JSON via `res.json(doc)`/`res.status(N).json(doc)`, throw `Error` with `.status` set for error cases (do not roll your own error response shape).
4. If the endpoint mutates book stock/active state, call `getIO().to('books').emit('book:updated', {...})` (import `getIO` from `../sockets/io.js`) to keep clients in sync.
5. On the client, add a call site — either a store action (`client/src/stores/*.store.js`) if state needs to be shared/reactive across components, or an inline `http.<method>()` call in the view (existing admin views call `http` directly rather than going through a store, except `sach`/`fetchAll`/`search` which go through `sach.store.js`).
6. Update `agent_context/call_index.md` and `func_registry.md`.

### Add a new admin management view
1. Create `client/src/views/admin/<Entity>Manage.vue` following the existing pattern (see `NhaXuatBanManage.vue` or `SachManage.vue` for the create+edit+list+toggle-active template): a `list` ref populated by `fetchAll()` in `onMounted`, a `form` ref, `editingId` ref, `submit()` that branches POST vs PUT, `resetForm()`, `toggleActive()`.
2. Add route entry in `client/src/router/index.js` with `meta: { requiresAuth: true }` if staff-only, and import the component.
3. Add a `<RouterLink>` nav entry in `client/src/App.vue` inside the `v-if="auth.token"` block (lines ~19-24).
4. Ensure the backing API routes exist and are protected as needed (see "Add a new API endpoint" above).

### Change auth/permissions
- To change token lifetime: `auth.controller.js:17` `expiresIn:'8h'`.
- To change what's public vs protected: edit route registration in `server/src/routes/<domain>.routes.js` (add/remove `requireAuth` per route, or `router.use(requireAuth)` for the whole router as docgia.routes.js does).
- To add role-based checks (currently `chucVu` field exists on NhanVien but is NOT enforced anywhere — `requireAuth` only checks token validity, no role/permission check exists): you'd extend `auth.middleware.js:requireAuth` (or add a new middleware) to inspect `req.nhanVien` (decoded JWT payload currently only contains `{id, maNhanVien}` — you'd need to add `chucVu` to the JWT payload in `auth.controller.js:17` first since it's not in the token today).
- Client-side route guard is `client/src/router/index.js:22-25` — cosmetic only, real enforcement is server-side.

### Add a new socket event
1. Server: in the relevant controller, after the mutation, call `getIO().to('books').emit('<event-name>', {...payload})` (import `getIO` from `../sockets/io.js`). To join a different room, adjust `server.js:15-17` `io.on('connection', ...)` — currently everyone auto-joins `"books"` unconditionally, there's no per-client room targeting logic.
2. Client: in `useSocket()` consumer (or add a new composable following `client/src/composables/useSocket.js`'s singleton pattern), call `socket.on('<event-name>', handler)`. Existing precedent is `sach.store.js:initSocket(socket)` — guard against duplicate registration with a boolean flag like `socketInited` since `initSocket`/`onMounted` can fire more than once across component remounts.
3. Wire the socket into the app once at a high level — currently only `App.vue:10` calls `sachStore.initSocket(useSocket())` on mount; a new domain's realtime feature would need a similar single call site to avoid duplicate listeners.

## Server startup / infra notes
- Entry point: `server/src/server.js`. Loads env via `dotenv/config`, connects Mongo (`config/db.js`), runs a throwaway transaction-support self-test (`testTransactionSuport`, note the typo — this only works against a Mongo replica set, not a standalone instance), creates one shared `http.Server` for both Express and Socket.IO, listens on `process.env.PORT || 5000`.
- Env vars used: `MONGO_URI`, `JWT_SECRET`, `PORT`, `MAX_BOOKS_TO_BORROW` (max concurrent borrows per reader, compared as string vs number in `muonsach.controller.js:29` — no `Number()` cast, relies on JS coercion in `>=`).
- Static file serving: `app.js:26-29` serves `client/dist` and falls back to its `index.html` for any unmatched GET — this means `server` expects the client to be built into `client/dist` for production; there's no dev-proxy config visible in the files read (check `client/vite.config.js`, not in the required reading list, if adding local dev proxy behavior).
- Seeding: `server/src/scripts/seed.js` (full reseed of all 5 collections, destructive) and `seedNhanVien.js` (adds one staff login only) — run manually with node, not wired into `server.js` startup.
