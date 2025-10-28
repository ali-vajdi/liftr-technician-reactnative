# لیفتر - نسخه تکنیسین

یک اپلیکیشن React Native برای مدیریت خدمات فنی با رابط کاربری فارسی.

## ویژگی‌ها

- **صفحه خوش‌آمدگویی**: معرفی اپلیکیشن و ویژگی‌های آن
- **ورود با شماره تلفن**: ورود امن با شماره تلفن همراه
- **تأیید کد**: سیستم تأیید ۶ رقمی با تایمر
- **داشبورد**: نمایش آمار و دسترسی سریع به عملکردها

## رنگ‌بندی

- **Federal Blue** (#03045E): متن‌های اصلی
- **Honolulu Blue** (#0077B6): رنگ اصلی و دکمه‌ها
- **Pacific Cyan** (#00B4D8): آکسان‌ها
- **Non Photo Blue** (#90E0EF): پس‌زمینه‌های روشن
- **Light Cyan** (#CAF0F8): پس‌زمینه اصلی

## ساختار پروژه

```
screens/
├── WelcomeScreen.tsx      # صفحه خوش‌آمدگویی
├── LoginScreen.tsx        # ورود با شماره تلفن
├── VerificationScreen.tsx # تأیید کد ۶ رقمی
└── DashboardScreen.tsx    # داشبورد اصلی
```

## اجرای پروژه

```bash
npm start
# یا
expo start
```

## تکنولوژی‌های استفاده شده

- React Native
- Expo
- TypeScript
- Tailwind CSS (NativeWind)
- React Native Safe Area Context
