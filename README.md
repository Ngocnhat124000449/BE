# API Quản lý Học vụ — Lab 1–4

Ngày: 2026-09-26
Học phần: 111099 – Lập trình Backend, Đại học Lạc Hồng.
Nguồn yêu cầu: *Thông tin học phần 111099*, Phần 2 thực hành, Bài thực hành 1–4.

RESTful API Node.js + Express 5 + TypeScript, kết nối SQL Server qua Stored Procedure, xác thực JWT, phân quyền theo vai trò, tài liệu Swagger.

## Công nghệ

| Thành phần | Phiên bản |
| --- | --- |
| Node.js | 18 trở lên |
| pnpm | 12.x |
| TypeScript | 7.x (ESM, `module: NodeNext`) |
| Express | 5.x |
| SQL Server | 2014 trở lên |
| Thư viện chính | `mssql`, `jsonwebtoken`, `bcryptjs`, `helmet`, `cors`, `dotenv`, `swagger-jsdoc`, `swagger-ui-express` |

## Cài đặt

### 1. Cơ sở dữ liệu

Chạy các file trong `database/` bằng SSMS, đúng thứ tự:

1. `AcademicManagement.sql` — tạo database và 6 bảng.
2. `lab2_seed_users.sql` — 4 tài khoản mẫu.
3. `lab2_sp_login.sql` — SP đăng nhập.
4. `lab3_sp_courses.sql` — 5 SP CRUD môn học, khoa mẫu `CNTT`.
5. `lab4_sp_enrollment.sql` — SP đăng ký học phần, lớp mẫu `IT101-2026-1`.

Mọi script chạy lại nhiều lần không lỗi. Không dùng cú pháp chỉ có từ SQL Server 2016.

SQL Server phải bật **Mixed Mode**, tài khoản `sa` đăng nhập được, giao thức **TCP/IP** bật.

### 2. Biến môi trường

Tạo file `.env` ở thư mục gốc:

```
PORT=3000
DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=123456
DB_NAME=AcademicManagement
JWT_SECRET=<chuoi-ngau-nhien-64-ky-tu-hex>
```

Sinh `JWT_SECRET`:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Cài thư viện và chạy

```
pnpm install
pnpm dev
```

Mở `http://localhost:3000/api-docs`.

| Lệnh | Tác dụng |
| --- | --- |
| `pnpm dev` | Chạy dev bằng `tsx watch`, tự khởi động lại khi sửa code |
| `pnpm build` | Biên dịch sang `dist/` |
| `pnpm start` | Chạy bản build |
| `pnpm exec tsc --noEmit` | Kiểm tra kiểu, không xuất file |

**Windows PowerShell:** nếu báo `pnpm.ps1 cannot be loaded ... not digitally signed`, thay `pnpm` bằng `pnpm.cmd` trong mọi lệnh. File `.cmd` không chịu Execution Policy.

## Tài khoản mẫu

Mật khẩu chung: `123456`.

| Username | Vai trò | RoleId |
| --- | --- | --- |
| `admin` | Admin | 1 |
| `gv01` | Teacher | 2 |
| `sv01` | Student | 3 |
| `sv02` | Student | 3 |

## Danh sách API

| Method | Endpoint | Quyền | Lab |
| --- | --- | --- | --- |
| GET | `/health` | Tự do | 1 |
| POST | `/api/auth/login` | Tự do | 2 |
| GET | `/api/courses` | Tự do | 3 |
| GET | `/api/courses/{id}` | Tự do | 3 |
| POST | `/api/courses` | Admin | 3 |
| PUT | `/api/courses/{id}` | Admin | 3 |
| DELETE | `/api/courses/{id}` | Admin | 3 |
| POST | `/api/enrollments` | Student | 4 |

Mọi response theo cấu trúc `{ success, message, data? }`, trừ `/health` giữ đúng mẫu tài liệu `{ status }`.

### Mã lỗi xác thực

| Tình huống | Mã |
| --- | --- |
| Thiếu token | `403` |
| Token sai hoặc hết hạn | `401` |
| Đúng token, sai vai trò | `403` |

## Cấu trúc thư mục

```
src/
├── config/        db.config.ts (Connection Pool), swagger.config.ts
├── controllers/   Nhận request, trả response
├── services/      Validate, nghiệp vụ, ánh xạ lỗi SQL sang mã HTTP
├── repositories/  Gọi Stored Procedure qua mssql
├── routes/        Định tuyến + comment @swagger
├── middlewares/   verifyToken, isAdmin, isStudent
├── dtos/          Kiểu dữ liệu request/response
├── utils/         apiResponse.util.ts: ok, fail, AppError, sendError
└── server.ts      Entry point
database/          Script SQL theo từng lab
```

## Điểm khác so với tài liệu

1. **Swagger dùng `components.securitySchemes`** thay cho `securityDefinitions`. `securityDefinitions` là cú pháp Swagger 2.0, không hiện nút Authorize trên OpenAPI 3. Theo [OpenAPI 3.0.3 – Security Scheme Object](https://spec.openapis.org/oas/v3.0.3#security-scheme-object).
2. **Mọi thao tác dữ liệu qua Stored Procedure**, kể cả CRUD Lab 3. Rubric CLO3 tiêu chí 3.2 chấm tích hợp Stored Procedures.
3. **Transaction Lab 4 nằm trong SP**, khóa dòng lớp bằng `UPDLOCK, HOLDLOCK`. Mức cô lập mặc định `READ COMMITTED` không chặn được 2 giao dịch đồng thời cùng vượt sĩ số. Theo [Microsoft Learn – SET TRANSACTION ISOLATION LEVEL](https://learn.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql).
4. **Lab 4 kiểm tra trùng lặp trước kiểm tra sĩ số.** Theo thứ tự tài liệu, Test Case 2 với lớp tối đa 1 người trả "Lớp đã đủ sĩ số", sai với kết quả chính tài liệu yêu cầu.
5. **Bổ sung middleware `isStudent`.** Lab 4 yêu cầu chỉ Sinh viên được gọi, tài liệu không cung cấp.
6. **Dùng `bcryptjs` thay `bcrypt`.** Cùng thuật toán, không cần build native addon.

## Kiểm thử

Kiểm thử trên Swagger UI. Nhấn **Authorize**, dán token (không gõ chữ `Bearer`).

| Lab | Test case chính | Kết quả đạt |
| --- | --- | --- |
| 1 | `GET /health` | `200`, `Connected to SQL Server` |
| 2 | Login đúng / sai mật khẩu | `200` kèm token / `401` |
| 3 | POST môn học: không token / token `sv01` / token `admin` | `403` / `403` / `201` |
| 3 | POST trùng mã / tín chỉ 11 | `409` / `400` |
| 3 | DELETE môn đang có lớp | `409` |
| 4 | `sv01` đăng ký / `sv01` lặp lại / `sv02` đăng ký | `201` / `400` đã đăng ký / `400` đủ sĩ số |
| 4 | Token `admin` đăng ký | `403` |

Chạy lại test từ đầu:

```sql
DELETE FROM Enrollments;
DELETE FROM Courses WHERE CourseCode IN ('IT202', 'IT303');
```

## Liên hệ

Nguyễn Ngọc Nhật — NguyenNgocNhat.124000449.lhu@gmail.com
