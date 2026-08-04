# Call Chains

## 1. Login / auth flow

```
LoginView.vue:15 submit() → auth.store.js:11 login(maNhanVien,password)
  → http.js:4 axios POST /api/auth/login  (request interceptor http.js:6-10 attaches no token yet, none exists)
  → app.js:19 app.use("/api/auth", authRoutes)
  → auth.routes.js:6 router.post('/login', login)
  → auth.controller.js:5 login(req,res)
      - NhanVien.findOne({maNhanVien, active:true})  (auth.controller.js:11)
      - bcrypt.compare(password, nv.password)         (auth.controller.js:14)
      - jwt.sign({id, maNhanVien}, JWT_SECRET, {expiresIn:'8h'})  (auth.controller.js:17)
      - res.json({token, hoTen, chucVu, maNhanVien})   (auth.controller.js:18)
  ← auth.store.js:13-16 stores token+hoTen in Pinia state and localStorage
  ← LoginView.vue:16 router.push('/admin/sach')
```
On every subsequent request, `http.js:6-10` request interceptor reads `auth.token` and sets `Authorization: Bearer <token>`. On any 401 response, `http.js:15` interceptor calls `auth.store.js:logout()` which clears state and redirects to `/login` (router.push, App-level `<RouterLink>` also present at App.vue:29). Route guard `router/index.js:22-25` additionally blocks navigation to `meta.requiresAuth` routes client-side. Server-side enforcement is `auth.middleware.js:3 requireAuth` applied per-route (see call_index.md).

## 2. Borrowing a book (muon-sach create) flow

```
BorrowView.vue:14 submit() → http.js POST /muon-sach  { docgiaInfo: form, maSach }
  → app.js:23 app.use('/api/muon-sach', muonsachRoutes)
  → muonsach.routes.js:7 router.post('/', muonSach)   (no requireAuth — public form)
  → muonsach.controller.js:16 muonSach(req,res)
      - mongoose.startSession(); startTransaction()          (muonsach.controller.js:18-19)
      - DocGia.findOne({dienThoai}) or DocGia.create(...)     (:21-24)  — find-or-create reader by phone
      - TheoDoiMuonSach.countDocuments({maDocGia, ngayTra:null}) vs MAX_BOOKS_TO_BORROW  (:26-29)
      - Sach.findOneAndUpdate({_id:maSach, soQuyen:{$gt:0}, active:true}, {$inc:{soQuyen:-1}})  (:31-35)  — atomic guard against overselling
      - TheoDoiMuonSach.create([{maDocGia, maSach}], {session})  (:38-40)
      - session.commitTransaction()                            (:42)
      - getIO().to('books').emit('book:updated', {maSach, soQuyen, active})  (:43, sockets/io.js:3)
      - res.status(201).json(record)                           (:44)
      - on any thrown error: session.abortTransaction(), err.status=400, rethrown → error.middleware.js:errorHandler
  ← BorrowView.vue:18-20 shows success message, resets form
```
Return flow mirrors this: `MuonSachManage.vue:16 traSach(id)` → PATCH `/muon-sach/:id/tra` (requireAuth) → `muonsach.routes.js:8` → `muonsach.controller.js:54 traSach` — sets `ngayTra`, increments `Sach.soQuyen` in a transaction, emits `book:updated`.

## 3. Listing / searching books (sach) flow

```
HomeView.vue:8 onMounted → sachStore.fetchAll()  (sach.store.js:7-10)
  → http.js GET /api/sach  (public, no auth header required though one may be sent if logged in)
  → sach.routes.js:8 router.get('/', getAllSach)
  → sach.controller.js:6 getAllSach
      - Sach.find(filter).populate('maNXB','tenNhaXuatBan')   (filter = {} if ?all=true else {active:true})
      - res.json(list)
  ← sach.store.js:9 this.danhSachSach = data
  ← HomeView.vue:23 v-for renders sach.store.danhSachSach.filter(s=>s.active)

Search variant:
HomeView.vue:11 onSearch() → sachStore.search(query)  (sach.store.js:11-14)
  → http GET /api/sach/search?q=...
  → sach.routes.js:9 router.get('/search', searchSach)   (registered before /:id to avoid route shadowing)
  → sach.controller.js:18 searchSach
      - Sach.aggregate([$match active:true, $lookup nhaxuatbans, $unwind, $match regex on tenSach/tacGia/nxb.tenNhaXuatBan])
      - res.json(result)
  ← sach.store.js:13 this.danhSachSach = data
```

## 4. Real-time / socket.io flow (book stock updates)

```
Server bootstrap: server.js:11-13
  httpServer = createServer(app); io = new Server(httpServer,{cors:{origin:'*'}}); setIO(io)  (sockets/io.js:2)
  io.on('connection', socket => socket.join('books'))   (server.js:15-17)  — every client auto-joins room "books"

Client bootstrap: App.vue:10
  onMounted → sachStore.initSocket(useSocket())
    useSocket() (composables/useSocket.js:4-6) lazily connects socket.io-client to '/' (same-origin, proxied/served by same Express+http server)
    sach.store.js:15-22 initSocket(socket): guarded by socketInited; registers socket.on('book:updated', ({maSach,soQuyen,active}) => patch matching item in danhSachSach)

Emit sources (server → client, room "books"):
  - muonsach.controller.js:43  (after successful borrow)
  - muonsach.controller.js:70  (after successful return)
  - sach.controller.js:43      (after updateSach)
  - sach.controller.js:51      (after setActiveSach)
  All: getIO().to('books').emit('book:updated', {maSach, soQuyen, active})

Client receipt:
  socket 'book:updated' event → sach.store.js:18-21 finds book in danhSachSach by maSach, mutates soQuyen/active in place (reactive — Pinia state, so any view bound to sachStore.danhSachSach re-renders, e.g. HomeView.vue:23-31, BorrowView.vue:44-46 dropdown)
```

## 5. Docgia (reader) management flow (admin)

```
DocGiaManage.vue:6 fetchAll() → http GET /api/docgia  (requireAuth, sends Bearer token via interceptor)
  → docgia.routes.js:6 router.use(requireAuth); :7 router.get('/', getAllDocGia)
  → docgia.controller.js:4 getAllDocGia → DocGia.find() → res.json(...)
  ← DocGiaManage.vue:20-29 table render

DocGiaManage.vue:11 toggleActive(dg) → http PATCH /api/docgia/:id/active {active: !dg.active}
  → docgia.routes.js:10 → docgia.controller.js:20 setActiveDocGia → DocGia.findByIdAndUpdate(...) → res.json(dg)
  ← DocGiaManage.vue:13 fetchAll() refresh
```
Note: reader records are also created indirectly (find-or-create) via the public borrow flow (`muonsach.controller.js:21-24`), not just via this admin CRUD (`docgia.controller.js:createDocGia` exists but no dedicated admin "create reader" form was found in DocGiaManage.vue — only list + toggle-active are wired in the UI).

## 6. NhaXuatBan (publisher) CRUD flow (admin)

```
NhaXuatBanManage.vue:9 fetchAll() → GET /api/nhaxuatban?all=true (public route, but request still carries token if logged in)
  → nhaxuatban.routes.js:6 → nhaxuatban.controller.js:4 getAllNXB (filter={} since all=true) → res.json
NhaXuatBanManage.vue:14 submit() → POST /api/nhaxuatban (create, requireAuth) or PUT /api/nhaxuatban/:id (update, requireAuth)
  → nhaxuatban.routes.js:7-8 → nhaxuatban.controller.js:9 createNXB / :13 updateNXB
NhaXuatBanManage.vue:27 toggleActive(n) → PATCH /api/nhaxuatban/:id/active (requireAuth) → nhaxuatban.controller.js:19 setActiveNXB
```
Sach admin CRUD (SachManage.vue) is structurally identical against `/api/sach` and additionally re-validates `maNXB` existence server-side (sach.controller.js:34-35) and emits `book:updated` on update/setActive.
