# 🐟 ZenKoi - Smart Koi Farm Breeding and Sales Management System

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/quanhuy180423/Smart-Koi-Farm-Breeding-and-Sales-Management-System)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)

Hệ thống quản lý trang trại nuôi cá Koi thông minh với giao diện web hiện đại, tích hợp các tính năng quản lý bán hàng, kho hàng, và chăm sóc khách hàng.

## ✨ Tính năng chính

### 🛒 **Quản lý bán hàng**

- Danh mục sản phẩm cá Koi chi tiết
- Giỏ hàng thông minh với Zustand
- Hệ thống thanh toán đa dạng
- Theo dõi đơn hàng real-time

### 👥 **Quản lý khách hàng**

- Hệ thống tài khoản người dùng
- Lịch sử giao dịch
- Đánh giá và phản hồi
- Chương trình khuyến mãi

### 🔐 **Bảo mật và phân quyền**

- Xác thực người dùng (JWT)
- Phân quyền theo vai trò (Admin/Customer/Sale Staff)
- Middleware bảo vệ route
- Bảo mật dữ liệu

### 🎨 **Giao diện hiện đại**

- UI/UX responsive với Tailwind CSS
- Animation cá Koi bơi tự nhiên
- Dark/Light mode
- Thiết kế mobile-first

## 🚀 Công nghệ sử dụng

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 📋 Yêu cầu hệ thống

- Node.js 20.x trở lên
- npm hoặc yarn hoặc pnpm
- Git

## 🛠️ Cài đặt và chạy

### 1. Clone repository

```bash
git clone https://github.com/quanhuy180423/Smart-Koi-Farm-Breeding-and-Sales-Management-System.git
cd Smart-Koi-Farm-Breeding-and-Sales-Management-System
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### 3. Cấu hình environment variables

```bash
cp .env.example .env.local
# Chỉnh sửa các biến môi trường trong .env.local
```

### 4. Chạy development server

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📁 Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (customer)/        # Customer pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── lib/                   # Utility functions
└── store/                 # Zustand stores
```

## 🔧 Scripts có sẵn

```bash
# Development
npm run dev              # Chạy development server
npm run build            # Build production
npm run start            # Chạy production server
npm run lint             # Kiểm tra linting
npm run type-check       # Kiểm tra TypeScript

# Deployment
npm run vercel:setup     # Thiết lập Vercel
npm run vercel:deploy    # Deploy lên Vercel production
```

## 🚀 Triển khai lên Vercel

### Tự động (CI/CD)

1. Push code lên GitHub
2. Vercel sẽ tự động deploy
3. Xem kết quả tại URL được cung cấp

### Thủ công

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Đăng nhập
vercel login

# Deploy
npm run vercel:deploy
```

📖 **Chi tiết**: Xem [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 🔐 Biến môi trường

Tạo file `.env.local` và thêm các biến sau:

```env
# Bắt buộc
NODE_ENV=production

# Tùy chọn
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret
API_BASE_URL=your_api_url
```

## 🧪 Testing

```bash
# Chạy unit tests
npm run test

# Chạy E2E tests
npm run test:e2e

# Kiểm tra coverage
npm run test:coverage
```

## 📱 API Documentation

### Health Check

```
GET /api/health
```

Kiểm tra trạng thái của ứng dụng.

### Authentication

```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
```

### Products

```
GET /api/products
GET /api/products/:id
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

**ZenKoi Team**

- Email: support@zenkoi.com
- Website: [zenkoi.com](https://zenkoi.com)
- GitHub: [@quanhuy180423](https://github.com/quanhuy180423)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components

---

<div align="center">
  Made with ❤️ by ZenKoi Team
</div>
