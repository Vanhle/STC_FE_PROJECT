# STC Building Management - Frontend

Hệ thống quản lý tòa nhà STC với interface đăng nhập, đăng ký và xác thực OTP hiện đại sử dụng font **Inter** cho typography sắc nét.

## 🌟 Tính năng

- **Đăng nhập** - Giao diện đăng nhập với validation form
- **Đăng ký** - Form đăng ký tài khoản mới với validation đầy đủ
- **Xác thực OTP** - Nhập mã OTP 6 số với auto-focus và paste support
- **Responsive Design** - Tương thích với mọi thiết bị
- **Component tái sử dụng** - Cấu trúc code module và clean
- **Sharp Typography** - Sử dụng font **Inter** tối ưu cho độ sắc nét và hiện đại

## 🛠️ Công nghệ sử dụng

- **React 19** - Frontend framework
- **Bootstrap 5** - UI framework
- **React Router** - Navigation
- **Bootstrap Icons** - Icon library
- **Inter Font** - Google Fonts typography cho độ sắc nét tối ưu
- **Vite** - Build tool

## 📁 Cấu trúc thư mục

```
src/
├── components/
│   ├── Common/          # Components tái sử dụng
│   │   ├── Button.jsx   # Component Button với Bootstrap
│   │   ├── Input.jsx    # Component Input với validation
│   │   ├── Logo.jsx     # Component Logo STC
│   │   └── index.js     # Export file
│   ├── Layout/          # Layout components
│   │   ├── AuthLayout.jsx  # Layout cho auth pages
│   │   └── index.js
│   ├── Auth/            # Authentication components
│   │   ├── Login.jsx    # Trang đăng nhập
│   │   ├── Register.jsx # Trang đăng ký
│   │   ├── OTPVerification.jsx # Xác thực OTP
│   │   └── index.js
│   └── index.js         # Main export file
├── App.jsx              # Main App với routing
├── App.css              # Custom styles
├── index.css            # Global styles & variables
└── main.jsx             # Entry point
```

## 🚀 Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build for production
npm run build
```

## 📱 Các trang được hỗ trợ

### 1. Đăng nhập (`/login`)

- Form đăng nhập với email/username và password
- Validation real-time
- Link đến trang đăng ký và quên mật khẩu

### 2. Đăng ký (`/register`)

- Form đăng ký với đầy đủ thông tin
- Validation email, số điện thoại, mật khẩu
- Xác nhận mật khẩu

### 3. Xác thực OTP (`/verify-otp`)

- 6 ô input cho mã OTP
- Auto-focus chuyển ô
- Hỗ trợ paste mã
- Đếm ngược thời gian gửi lại

## 🎨 Thiết kế

- **Font chữ**: [Inter](https://fonts.google.com/specimen/Inter) - Font sans-serif hiện đại, sắc nét
- **Màu chủ đạo**: Blue gradient (#2563eb → #1d4ed8)
- **Typography**: Font weights 300-800 với letter-spacing tối ưu
- **Layout**: Split screen với gradient background
- **Responsive**: Mobile-first design
- **Animations**: Smooth transitions và fade effects

### 🔤 **Tại sao chọn Inter?**

- **Sắc nét trên màn hình** - Được thiết kế đặc biệt cho digital interfaces
- **Legibility cao** - Dễ đọc ở mọi kích thước
- **Modern appearance** - Thiết kế hiện đại, professional
- **Optimization features** - Hỗ trợ OpenType features
- **Performance** - Font file nhẹ, tải nhanh

## 🔧 Components tái sử dụng

### Button Component

```jsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click me
</Button>
```

### Input Component

```jsx
<Input
  type="email"
  placeholder="Enter email"
  icon="bi bi-envelope"
  error={errors.email}
  value={email}
  onChange={handleChange}
/>
```

### Logo Component

```jsx
<Logo size="large" className="mb-4" />
```

## 📝 Customization

### Font Family

Dự án sử dụng **Inter** từ Google Fonts với fallback:

```css
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
  Arial, sans-serif;
```

### CSS Variables

Các biến CSS có thể tùy chỉnh trong `src/index.css`:

```css
:root {
  --primary-color: #2563eb;
  --primary-dark: #1d4ed8;
  --font-family: "Inter", sans-serif;
  --border-radius-md: 8px;
  /* ... other variables */
}
```

### Typography Optimization

```css
/* Tối ưu hóa cho Inter font */
body {
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-optical-sizing: auto;
}
```

### OpenType Features

- **cv02**: Alternative style for 'a'
- **cv03**: Alternative style for 'g'
- **cv04**: Alternative style for 'l'
- **cv11**: Simplified 'Q'

## 🌐 Font Loading

Font **Inter** được tải từ Google Fonts với:

- Font weights 300, 400, 500, 600, 700, 800
- Display swap cho performance tối ưu
- Preconnect để tăng tốc loading
- OpenType features enabled
