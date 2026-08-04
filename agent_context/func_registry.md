# Function Registry

## server/src/controllers/auth.controller.js
| Export | Purpose | Response shape |
|---|---|---|
| `login(req,res)` (line 5) | Verify `maNhanVien`+`password` against `NhanVien`, issue JWT | 400 `{message}` if missing fields; 401 empty json if not found/bad password; 200 `{ token, hoTen, chucVu, maNhanVien }` |

## server/src/controllers/docgia.controller.js
| Export | Purpose | Response shape |
|---|---|---|
| `getAllDocGia` (4) | List all readers | 200: array of DocGia docs |
| `createDocGia` (8) | Create reader, reject dup phone | 201: DocGia doc; throws 400 if `dienThoai` exists |
| `updateDocGia` (14) | Update reader by id | 200: updated DocGia; throws 404 if missing |
| `setActiveDocGia` (20) | Toggle `active` flag | 200: updated DocGia; throws 404 if missing; body `{active}` |

## server/src/controllers/muonsach.controller.js
| Export | Purpose | Response shape |
|---|---|---|
| `getAllMuonSach` (8) | List all borrow records, populated `maDocGia`(hoTen,dienThoai) and `maSach`(tenSach,maSach), sorted by `ngayMuon` desc | 200: array |
| `muonSach` (16) | Borrow flow (transactional): find-or-create DocGia by phone, enforce max borrow limit (`process.env.MAX_BOOKS_TO_BORROW`), atomically decrement `Sach.soQuyen` (only if >0 and active), create TheoDoiMuonSach record, emit `book:updated` socket event | body `{docgiaInfo, maSach}`; 201: created record; on failure aborts txn, throws with `err.status=400` |
| `traSach` (54) | Return flow (transactional): set `ngayTra=now` on the open borrow record, increment `Sach.soQuyen`, emit `book:updated` | param `:id`; 200: updated record; 400 if record missing/already returned |

## server/src/controllers/nhaxuatban.controller.js
| Export | Purpose | Response shape |
|---|---|---|
| `getAllNXB` (4) | List publishers; `?all=true` returns all, else only `active:true` | 200: array |
| `createNXB` (9) | Create publisher | 201: doc |
| `updateNXB` (13) | Update by id | 200: doc; 404 if missing |
| `setActiveNXB` (19) | Toggle active | 200: doc; 404 if missing; body `{active}` |

## server/src/controllers/sach.controller.js
| Export | Purpose | Response shape |
|---|---|---|
| `getAllSach` (6) | List books; `?all=true` bypasses active filter; populates `maNXB.tenNhaXuatBan` | 200: array |
| `getOneSach` (12) | Get one book by id, populated NXB name | 200: doc; 404 if missing |
| `searchSach` (18) | Case-insensitive regex search across `tenSach`, `tacGia`, `nxb.tenNhaXuatBan` via aggregate `$lookup` on `nhaxuatbans` collection, only `active:true` | body/query `?q=`; 200: array |
| `createSach` (33) | Create book, validates `maNXB` exists first | 201: doc; 400 if NXB not found |
| `updateSach` (40) | Update book, `runValidators:true`; emits `book:updated` | 200: doc; 404 if missing |
| `setActiveSach` (47) | Toggle active; emits `book:updated` | body `{active}`; 200: doc; 404 if missing |

## server/src/middleware/auth.middleware.js
| Export | Purpose |
|---|---|
| `requireAuth(req,res,next)` (3) | Reads `Authorization: Bearer <token>` header, verifies JWT with `process.env.JWT_SECRET`, sets `req.nhanVien = decoded`. 401 `{message:'Thiếu token'}` if no header; 401 `{message:'Token không hợp lệ'}` if verify fails |

## server/src/middleware/error.middleware.js
| Export | Purpose |
|---|---|
| `errorHandler(err,req,res,next)` (1) | Terminal Express error middleware. `res.status(err.status||400).json({message: err.message||'Lỗi server'})` |

## server/src/models
| File | Schema fields |
|---|---|
| DocGia.js | `maDocGia` String required unique, `hoTen` String required, `ngaySinh` Date, `phai` String, `diaChi` String, `dienThoai` String required unique, `active` Boolean default true |
| NhanVien.js | `maNhanVien` String required unique, `hoTen` String required, `password` String required (bcrypt hash), `chucVu` String, `diaChi` String, `soDienThoai` String, `active` Boolean default true |
| NhaXuatBan.js | `maNhaXuatBan` String required unique, `tenNhaXuatBan` String required, `diaChi` String, `active` Boolean default true |
| Sach.js | `maSach` String required unique, `tenSach` String required, `donGia` Number required min 0, `soQuyen` Number required min 0, `namXuatBan` Number, `tacGia` String, `maNXB` ObjectId ref NhaXuatBan required, `active` Boolean default true |
| TheoDoiMuonSach.js | `maDocGia` ObjectId ref DocGia required, `maSach` ObjectId ref Sach required, `ngayMuon` Date required default Date.now, `ngayTra` Date default null |

## server/src/utils/asyncHandler.js
| Export | Purpose |
|---|---|
| `asyncHandler(fn)` (1) | Wraps async route handler `(req,res,next)`, catches rejected promise and forwards to `next(err)` → errorHandler |

## server/src/sockets/io.js
| Export | Purpose |
|---|---|
| `setIO(io)` (2) | Stores the Socket.IO server instance in module-level var, called once from server.js:13 |
| `getIO()` (3) | Returns stored io instance; used by controllers to `.to('books').emit(...)` |

## server/src/config/db.js
| Export | Purpose |
|---|---|
| `connectDB()` default export (3) | `mongoose.connect(process.env.MONGO_URI)`; exits process(1) on failure |

## server/src/scripts
| File | Purpose |
|---|---|
| seed.js | Wipes all 5 collections and reseeds NhanVien(2), NhaXuatBan(3), Sach(5, incl. one with soQuyen=0 and one with soQuyen=1 for race-condition testing), DocGia(2), TheoDoiMuonSach(2: one open, one returned). NhanVien password hashed via bcrypt (`123456`). Run standalone (`process.exit(0)`), not imported. |
| seedNhanVien.js | Minimal script: creates single NhanVien `NV001`/`123456` if DB needs just an admin login seed |

## client/src/api/http.js
| Export | Purpose |
|---|---|
| default `http` | Axios instance, baseURL `/api`. Request interceptor attaches `Authorization: Bearer <token>` from `useAuthStore()`. Response interceptor calls `useAuthStore().logout()` on any 401. |

## client/src/composables/useSocket.js
| Export | Purpose |
|---|---|
| `useSocket()` (4) | Lazily creates and memoizes a single `socket.io-client` connection to `/` (same origin), returns it |

## client/src/stores/auth.store.js (Pinia store id `auth`)
| Export | State/Action | Detail |
|---|---|---|
| state | `token` (from localStorage `token`), `hoTen` (from localStorage `hoTen`) | |
| `login(maNhanVien, password)` | POST `/auth/login`, stores `token`+`hoTen` in state and localStorage | |
| `logout()` | Clears state + localStorage, `router.push('/login')` | |

## client/src/stores/sach.store.js (Pinia store id `sach`)
| Export | State/Action | Detail |
|---|---|---|
| state | `danhSachSach` (array), `socketInited` (bool guard) | |
| `fetchAll(all=false)` | GET `/sach` with `?all=true` if requested | |
| `search(query)` | GET `/sach/search?q=` | |
| `initSocket(socket)` | One-time listener registration (guarded by `socketInited`); on `book:updated` finds book by `maSach` in `danhSachSach` and patches `soQuyen`/`active` in place | |
