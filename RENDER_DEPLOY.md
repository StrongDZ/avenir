# Hướng dẫn Deploy Backend lên Render

## Tổng quan

Backend đã được tích hợp init-db vào Dockerfile, sẽ tự động chạy seed và demoReset khi container start lần đầu.

## Bước 1: Tạo Web Service trên Render

1. Đăng nhập [render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect GitHub repository: `StrongDZ/avenir`
4. Chọn branch: `main`

## Bước 2: Cấu hình Build & Deploy

### Basic Settings:

-   **Name**: `avenir-backend` (hoặc tên bạn muốn)
-   **Region**: Chọn gần nhất (Singapore, US, etc.)
-   **Branch**: `main`
-   **Root Directory**: `backend`
-   **Runtime**: `Docker`
-   **Dockerfile Path**: `backend/Dockerfile` (hoặc để Render tự detect)

### Build Command:

Render sẽ tự động detect Dockerfile, không cần điền gì.

### Start Command:

Không cần điền, Dockerfile đã có ENTRYPOINT.

## Bước 3: Tạo PostgreSQL Database

1. **New +** → **PostgreSQL**
2. **Name**: `avenir-postgres`
3. **Database**: `avenir` (hoặc tên bạn muốn)
4. **User**: Render tự tạo
5. **Region**: Cùng region với backend
6. **Plan**: Free tier hoặc Starter ($7/tháng)

Sau khi tạo xong, Render sẽ hiển thị:

-   **Internal Database URL**: Dùng cho services trong cùng Render
-   **External Database URL**: Dùng cho services bên ngoài

## Bước 4: Environment Variables

Thêm các biến sau trong **Environment** tab:

### Database (PostgreSQL):

```
PG_HOST=<từ Internal Database URL>
PG_PORT=5432
PG_USER=<từ Internal Database URL>
PG_PASSWORD=<từ Internal Database URL>
PG_DATABASE=avenir
PG_SSL=true
```

**Cách lấy từ Internal Database URL:**

```
postgresql://user:password@hostname:5432/database
```

→ `PG_HOST` = hostname
→ `PG_USER` = user
→ `PG_PASSWORD` = password
→ `PG_DATABASE` = database

Hoặc đơn giản hơn, Render có thể tự inject nếu bạn dùng **Render Database**:

-   Click **Link Resource** trong Web Service
-   Chọn PostgreSQL database vừa tạo
-   Render sẽ tự động thêm env vars với prefix `DATABASE_`

### MongoDB (nếu cần):

```
ORCHAI_DB_CONNECTION_URL=mongodb+srv://...
ORCHAI_DB_USERNAME=your_username
ORCHAI_DB_PASSWORD=your_password
ORCHAI_DB_DATABASE=orchai_database
```

**Khuyến nghị**: Dùng MongoDB Atlas (free tier)

### Server Config:

```
NODE_ENV=production
HOST=0.0.0.0
PORT=10000
API_SCHEMES=https
```

⚠️ **Lưu ý**: Render tự động set PORT, thường là 10000. Kiểm tra trong Environment tab.

### Security:

```
API_KEY=your_secret_api_key_here
JWT_SECRET=your_jwt_secret_here
```

### CORS (cho frontend Vercel):

```
CORS_ORIGINS=https://your-frontend.vercel.app,https://avenir.vercel.app
IS_PRODUCTION=true
```

### Init DB Control (Optional):

```
RUN_INIT_DB=true
```

-   `true`: Tự động chạy seed + demoReset khi start (mặc định)
-   `false`: Skip init-db (nếu database đã có data)

## Bước 5: Deploy

1. Click **Create Web Service**
2. Render sẽ tự động:

    - Build Docker image
    - Deploy container
    - Chạy init-db (seed + demoReset)
    - Start server

3. Xem logs để kiểm tra:
    - `🔄 Running database initialization...`
    - `📦 Seeding database...`
    - `🔄 Running demo reset...`
    - `✅ Database initialization completed`
    - `🚀 Starting server...`

## Bước 6: Kiểm tra

1. Mở URL Render: `https://your-backend.onrender.com`
2. Test endpoint: `https://your-backend.onrender.com/ping`
    - Phải trả về: `Hello World!`
3. Test API docs: `https://your-backend.onrender.com/api-docs`

## Troubleshooting

### Init-db không chạy

-   Kiểm tra logs xem có lỗi gì không
-   Kiểm tra `RUN_INIT_DB` env var
-   Kiểm tra database connection

### Database connection failed

-   Kiểm tra Internal Database URL đúng chưa
-   Kiểm tra `PG_HOST`, `PG_USER`, `PG_PASSWORD`
-   Đảm bảo database đã được tạo và running

### Port conflict

-   Render tự động set PORT, không cần config
-   Nếu lỗi, kiểm tra env var `PORT` có đúng không

### Build failed

-   Kiểm tra Dockerfile syntax
-   Kiểm tra dependencies trong package.json
-   Xem build logs chi tiết

## Lưu ý quan trọng

1. **Free tier**: Render sẽ sleep sau 15 phút không có traffic

    - Lần đầu wake up sẽ mất ~30-60 giây
    - Nên upgrade lên Starter ($7/tháng) để không sleep

2. **Database**: PostgreSQL trên Render free tier có giới hạn

    - Nên dùng managed PostgreSQL (Render, Supabase, Neon)

3. **Init-db**: Chỉ chạy khi `RUN_INIT_DB=true` (mặc định)

    - Nếu database đã có data, set `RUN_INIT_DB=false` để skip

4. **Environment Variables**:
    - Có thể dùng Render's **Secrets** để bảo mật hơn
    - Hoặc dùng **Environment Groups** để share giữa services

## Chi phí ước tính

-   **Web Service**: Free (có sleep) hoặc $7/tháng (Starter)
-   **PostgreSQL**: Free (giới hạn) hoặc $7/tháng (Starter)
-   **Tổng**: $0 (free) hoặc $14/tháng (Starter)

## Next Steps

Sau khi backend deploy thành công:

1. Copy backend URL vào `VITE_API_URL` của frontend trên Vercel
2. Update `CORS_ORIGINS` trong backend với domain Vercel
3. Test toàn bộ flow từ frontend → backend
