# Call Index

Base URL: server mounts all API routes under `/api/*` (server/src/app.js:19-23). Frontend axios baseURL is `/api` (client/src/api/http.js:4). SPA fallback serves `client/dist/index.html` for all non-API GET routes (server/src/app.js:26-29).

## Auth domain

| Method | Path | Controller | Middleware |
|---|---|---|---|
| POST | /api/auth/login | `login` (server/src/controllers/auth.controller.js:5) | none | 

Route file: server/src/routes/auth.routes.js:6

## docgia domain (readers) — all routes require auth

| Method | Path | Controller | Middleware |
|---|---|---|---|
| GET | /api/docgia/ | `getAllDocGia` (docgia.controller.js:4) | `requireAuth` (router-level, docgia.routes.js:6) |
| POST | /api/docgia/ | `createDocGia` (docgia.controller.js:8) | `requireAuth` |
| PUT | /api/docgia/:id | `updateDocGia` (docgia.controller.js:14) | `requireAuth` |
| PATCH | /api/docgia/:id/active | `setActiveDocGia` (docgia.controller.js:20) | `requireAuth` |

Route file: server/src/routes/docgia.routes.js

## sach domain (books)

| Method | Path | Controller | Middleware |
|---|---|---|---|
| GET | /api/sach/ | `getAllSach` (sach.controller.js:6) | none (public) |
| GET | /api/sach/search | `searchSach` (sach.controller.js:18) | none (public) — must be registered before `/:id` |
| GET | /api/sach/:id | `getOneSach` (sach.controller.js:12) | `requireAuth` |
| POST | /api/sach/ | `createSach` (sach.controller.js:33) | `requireAuth` |
| PUT | /api/sach/:id | `updateSach` (sach.controller.js:40) | `requireAuth` |
| PATCH | /api/sach/:id/active | `setActiveSach` (sach.controller.js:47) | `requireAuth` |

Route file: server/src/routes/sach.routes.js. `updateSach` and `setActiveSach` emit socket event `book:updated` to room `books`.

## nhaxuatban domain (publishers)

| Method | Path | Controller | Middleware |
|---|---|---|---|
| GET | /api/nhaxuatban/ | `getAllNXB` (nhaxuatban.controller.js:4) | none (public — used by borrow form + admin book form dropdown) |
| POST | /api/nhaxuatban/ | `createNXB` (nhaxuatban.controller.js:9) | `requireAuth` |
| PUT | /api/nhaxuatban/:id | `updateNXB` (nhaxuatban.controller.js:13) | `requireAuth` |
| PATCH | /api/nhaxuatban/:id/active | `setActiveNXB` (nhaxuatban.controller.js:19) | `requireAuth` |

Route file: server/src/routes/nhaxuatban.routes.js

## muonsach domain (borrowing)

| Method | Path | Controller | Middleware |
|---|---|---|---|
| GET | /api/muon-sach/ | `getAllMuonSach` (muonsach.controller.js:8) | `requireAuth` |
| POST | /api/muon-sach/ | `muonSach` (muonsach.controller.js:16) | none (public — borrow registration form) |
| PATCH | /api/muon-sach/:id/tra | `traSach` (muonsach.controller.js:54) | `requireAuth` |

Route file: server/src/routes/muonsach.routes.js. `muonSach` and `traSach` emit socket event `book:updated` to room `books`.

## Frontend views/components

| File | Imports (store/api/composable) | Navigation |
|---|---|---|
| client/src/App.vue | `useSocket`, `useSachStore`, `useAuthStore` | `<RouterLink>` to `/`, `/muon-sach`, `/admin/sach`, `/admin/docgia`, `/admin/nxb`, `/admin/muon-sach`, `/login`; calls `auth.logout()` which does `router.push('/login')` |
| client/src/views/HomeView.vue | `useSachStore` (fetchAll, search) | none |
| client/src/views/BorrowView.vue | `http` (POST /muon-sach), `useSachStore` (fetchAll) | none |
| client/src/views/LoginView.vue | `useAuthStore` (login), `useRouter` | `router.push('/admin/sach')` on success |
| client/src/views/admin/SachManage.vue | `http` (GET/POST/PUT/PATCH /sach, GET /nhaxuatban) | none |
| client/src/views/admin/DocGiaManage.vue | `http` (GET/PATCH /docgia) | none |
| client/src/views/admin/NhaXuatBanManage.vue | `http` (GET/POST/PUT/PATCH /nhaxuatban) | none |
| client/src/views/admin/MuonSachManage.vue | `http` (GET /muon-sach, PATCH /muon-sach/:id/tra) | none |
| client/src/components/HelloWorld.vue | none (Vite/Vue scaffold boilerplate, unused demo component) | none |

## Router guard

client/src/router/index.js:22-25 — `router.beforeEach` redirects to `/login` if `to.meta.requiresAuth` and `!auth.token`. Routes with `meta: { requiresAuth: true }`: `/admin/sach`, `/admin/docgia`, `/admin/nxb`, `/admin/muon-sach` (router/index.js:15-18). Note: this is client-side UX only — actual authorization is enforced server-side via `requireAuth` middleware on individual endpoints.
