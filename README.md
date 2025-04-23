# Food Delivery Mobile App

This is a React Native mobile application for food delivery services.

## Project Structure

```
E:/UiTest/ (Thư mục gốc của dự án)
├── src/ (Chứa mã nguồn của ứng dụng)
│   ├── screens/ (Các màn hình của ứng dụng)
│   │   ├── auth/ (Các màn hình liên quan đến xác thực)
│   │   │   ├── LoginScreen.js (Màn hình đăng nhập)
│   │   │   ├── SignUpScreen.js (Màn hình đăng ký)
│   │   │   ├── ForgotPasswordScreen.js (Màn hình quên mật khẩu)
│   │   │   ├── VerificationScreen.js (Màn hình xác thực OTP)
│   │   │   └── NewPasswordScreen.js (Màn hình tạo mật khẩu mới)
│   │   ├── onboarding/ (Các màn hình giới thiệu ban đầu)
│   │   │   ├── SplashScreen.js (Màn hình chào)
│   │   │   └── OnboardingScreen.js (Màn hình giới thiệu)
│   │   └── home/ (Các màn hình chính của ứng dụng)
│   │       └── HomeScreen.js (Màn hình trang chủ)
│   ├── components/ (Các thành phần tái sử dụng)
│   │   ├── common/ (Các component dùng chung)
│   │   │   ├── Button.js (Component nút bấm)
│   │   │   └── TextInput.js (Component nhập liệu)
│   │   ├── auth/ (Các component liên quan đến xác thực)
│   │   └── home/ (Các component liên quan đến màn hình chính)
│   │       ├── Task.js (Component hiển thị task)
│   │       └── TaskInput.js (Component nhập task)
│   ├── navigation/ (Cấu hình điều hướng)
│   │   └── AppNavigator.js (Điều hướng chính của ứng dụng)
│   ├── constants/ (Các hằng số sử dụng trong ứng dụng)
│   │   ├── colors.js (Các màu sắc)
│   │   ├── sizes.js (Các kích thước)
│   │   ├── fonts.js (Các font chữ)
│   │   └── theme.js (Theme tổng hợp)
│   ├── services/ (Các dịch vụ API và xử lý dữ liệu)
│   │   └── api.js (Xử lý các cuộc gọi API)
│   ├── utils/ (Các tiện ích, helper functions)
│   │   └── validation.js (Xử lý kiểm tra dữ liệu đầu vào)
│   └── App.js (Component ứng dụng chính)
├── assets/ (Tài nguyên như hình ảnh, fonts, etc.)
├── .expo/ (Thư mục cấu hình Expo)
├── node_modules/ (Dependencies)
├── .gitignore (Cấu hình Git)
├── app.json (Cấu hình ứng dụng)
├── index.js (Entry point)
├── package.json (Cấu hình dependencies)
├── package-lock.json (Lock file của dependencies)
└── README.md (Tài liệu dự án)
```

## Các chức năng

1. **Màn hình Onboarding**: Giới thiệu người dùng với ứng dụng
2. **Xác thực người dùng**:
   - Đăng nhập
   - Đăng ký
   - Quên mật khẩu
   - Xác thực OTP
   - Đặt lại mật khẩu
3. **Màn hình chính**: Hiển thị các chức năng chính của ứng dụng

## Cài đặt

1. Clone dự án:
```bash
git clone https://github.com/xuandat7/food-delivery-FE.git
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy dự án:
```bash
npm start
```

## Công nghệ sử dụng

- React Native
- Expo
- React Hooks
- JavaScript 