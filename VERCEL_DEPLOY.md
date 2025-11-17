# Hướng dẫn Deploy Frontend lên Vercel

## Các trường cần điền trong Vercel

### 1. Project Settings

**Project Name:**

```
avenir
```

hoặc tên bạn muốn (ví dụ: `avenir-frontend`)

**Framework Preset:**

```
Vite
```

✅ Vercel sẽ tự detect, nhưng bạn có thể chọn Vite

**Root Directory:**

```
frontend
```

✅ Đúng rồi - thư mục chứa frontend code

**Build Command:**

```
npm run build
```

hoặc

```
npm ci && npm run build
```

⚠️ Lưu ý: Trong package.json của bạn, build command là `tsc -b && vite build`, nhưng Vercel sẽ chạy `npm run build` nên sẽ tự động chạy đúng script.

**Output Directory:**

```
dist
```

✅ Đúng rồi - Vite build ra thư mục `dist`

**Install Command:**

```
npm install
```

hoặc để Vercel tự detect (nó sẽ tự tìm package.json và chạy npm install)

---

## 2. Environment Variables (QUAN TRỌNG!)

Bạn **PHẢI** thêm environment variable này:

### Key: `VITE_API_URL`

### Value: URL của backend API

**Ví dụ:**

-   Nếu backend chạy trên Railway: `https://your-backend.railway.app`
-   Nếu backend chạy trên Render: `https://your-backend.onrender.com`
-   Nếu backend chạy local (test): `http://localhost:4000`
-   Nếu backend có domain riêng: `https://api.yourdomain.com`

**Cách thêm:**

1. Trong form Vercel, scroll xuống phần "Environment Variables"
2. Click "Add" hoặc "+"
3. Key: `VITE_API_URL`
4. Value: URL backend của bạn
5. Chọn môi trường:
    - ✅ Production
    - ✅ Preview (nếu muốn test trên preview URLs)
    - ✅ Development (nếu cần)

---

## 3. Sau khi Deploy

### Kiểm tra:

1. Vercel sẽ tự động build và deploy
2. Bạn sẽ nhận được URL như: `https://avenir.vercel.app`
3. Mở browser và test xem frontend có gọi được API không

### Nếu có lỗi CORS:

-   Backend cần thêm domain Vercel vào CORS_ORIGINS
-   Ví dụ: `CORS_ORIGINS=https://avenir.vercel.app,https://avenir-git-main-yourname.vercel.app`

---

## 4. Custom Domain (Optional)

Sau khi deploy thành công:

1. Vào Project Settings → Domains
2. Add domain của bạn (ví dụ: `avenir.com`)
3. Follow hướng dẫn để setup DNS

---

## Checklist trước khi Deploy

-   [ ] Backend đã deploy và có URL hoạt động
-   [ ] Test backend URL: mở `https://your-backend-url.com/ping` phải trả về "Hello World!"
-   [ ] Đã thêm `VITE_API_URL` vào Environment Variables
-   [ ] Backend đã config CORS để cho phép domain Vercel

---

## Troubleshooting

### Build fail với lỗi TypeScript

-   Kiểm tra `tsconfig.json` có đúng không
-   Có thể cần thêm `"skipLibCheck": true` vào tsconfig.json

### Frontend không gọi được API

-   Kiểm tra `VITE_API_URL` đã đúng chưa
-   Kiểm tra browser console có lỗi CORS không
-   Kiểm tra backend có đang chạy không

### Environment variable không hoạt động

-   Vite chỉ inject env vars có prefix `VITE_`
-   Phải rebuild sau khi thêm env var mới
-   Kiểm tra trong Vercel Dashboard → Settings → Environment Variables
