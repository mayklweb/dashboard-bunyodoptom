# Bunyod Optom admin panel — tekshiruv hisoboti

Sana: 2026-11-05. Manba: https://github.com/mayklweb/dashboard-bunyodoptom
Boshlang‘ich commit: `68c46e84133872b9b75d4a05259e66466dcffc1d`.

## Tuzatilgan kamchiliklar

1. Next.js tanimaydigan `app/middleware.ts` o‘rniga loyiha ildizidagi `proxy.ts` qo‘shildi. Login va signup yo‘llari aniq solishtiriladi.
2. Login tokeni localStorage bilan birga himoya tekshiradigan cookie’ga yoziladi; logout ikkalasini tozalaydi. HTTPS’da cookie Secure, barcha holatda SameSite=Lax.
3. Sidebar server va brauzer holatini ajratadi. Foydalanuvchi ma’lumoti yo‘q cookie login va dashboard orasida cheksiz aylanishga olib kelmaydi.
4. Buzilgan user JSON o‘qish xavfsiz qilindi; eski auth store serverda localStorage o‘qimaydi. Mavjud bo‘lmagan auth API importi tuzatildi.
5. Mahsulotlar API manzili sozlama bo‘lmaganda ham to‘g‘ri ishlaydi. Mutatsiyalar token yuboradi va `data` ichidagi mahsulot javobini ochadi. Kategoriya mutatsiyalariga ham token qo‘shildi.
6. Alohida Axios mijozida user JSON o‘rniga token Bearer shaklida yuboriladi; serverda localStorage ishlatilmaydi.
7. Mahsulot tahrirlanganda umumiy son oshib ketishi tuzatildi.
8. Kuryerning “Mening buyurtmalarim” sahifasidagi doimiy Xorazm filtri olib tashlandi. Kuryerga tegishlilikni backend token bo‘yicha tekshirishi kerak.
9. Umumiy so‘rov yordamchisi Headers obyektlarini saqlaydi, tokensiz Bearer null yubormaydi va 204 javobini JSON deb o‘qimaydi.
10. Buyurtmalardagi market, manzil va user telefon maydonlari to‘g‘ri o‘qiladi; kuryerlar oddiy massiv shaklida qaytsa ham ishlaydi.
11. Dashboard’da 20 sahifadan keyingi buyurtmalar tashlab yuborilmaydi. Noto‘g‘ri yoki 1000 dan katta sahifalar soni yashirin qisqartirish o‘rniga xato beradi.
12. Hisobot summalari va miqdorlar raqamga aylantiriladi, matn ko‘rinishidagi 0 to‘lanmagan deb olinadi. Grafik kunlari vaqt bo‘yicha tartiblanadi va turli yillar birlashtirilmaydi.
13. /couriers uchun /staff sahifasiga yo‘naltirish qo‘shildi.
14. Buyurtmalar yuklanmasa xato va qayta urinish tugmasi ko‘rinadi; Toaster ulanib, saqlash/xato xabarlari ko‘rinadigan bo‘ldi. Buyurtma ma’lumotlarini konsolga chiqarishlar olib tashlandi.
15. Next.js va eslint-config-next 16.4.5 ga yangilandi, mos dependency tuzatishlari lock faylga kiritildi.
16. Yangi regression testlari, GitHub Actions tekshiruvlari va .env.example qo‘shildi. Alohida users xizmatining manzili sozlanadigan qilindi.

## Tekshiruv natijalari

- `npm run lint`: o‘tdi, xato va ogohlantirish yo‘q.
- `npm run typecheck`: o‘tdi.
- `npm test`: 13 faylda 83 test o‘tdi.
- `npm run build`: Next.js 16.4.5 bilan o‘tdi.
- Production serverning HTTP tekshiruvi: 5/5 o‘tdi — tokensiz /login 200, / va /orders login’ga 307; cookie bilan /orders 200, /login bosh sahifaga 307.
- Playwright: 23 test ishga tushirishga tayyor, ammo mahalliy tizim Chromium jarayonini ochishga ruxsat bermadi: `bootstrap_check_in ... Permission denied (1100)`. Testlar sahifa bosqichiga yetmagan; brauzer testlarini o‘tgan deb hisoblash mumkin emas. Development serverda fayl kuzatuvchisi cheklovlari ham uchradi. `E2E_PRODUCTION=1` yig‘ilgan dastur ustida sinash imkonini beradi.

## Ochiq qolgan masalalar va tekshiruv chegarasi

- Bu tekshiruv frontend repository’ga tegishli. Haqiqiy admin/kuryer hisoblari va backend kodi berilmagani uchun jonli API bilan barcha qo‘shish, tahrirlash, o‘chirish va rollar bo‘yicha ruxsatlar tasdiqlanmadi. Jonli ma’lumotlar o‘zgartirilmadi.
- Cookie borligini tekshirish token haqiqiyligini yoki rolni tasdiqlamaydi. Backend har bir himoyalangan endpointda tokenni va amal uchun ruxsatni tekshirishi zarur; frontend menyusi ruxsat nazorati o‘rnini bosa olmaydi.
- Users bo‘limi dastlabdan alohida `mokky.dev` xizmatiga ulangan. Backend shartnomasi bo‘lmagani uchun u taxminiy ishlab turgan endpointga ko‘chirilmadi. `NEXT_PUBLIC_USERS_API_URL` bilan sozlash mumkin.
- /signup, /settings va /notifications sahifalari boshlang‘ich/placeholder holatida; forgot-password sahifasi mavjud emas. Ularni to‘liq ishlaydigan funksiyaga aylantirish uchun tegishli backend endpointlari va mahsulot talablari kerak.
- Yakuniy `npm audit` natijasi: 24 ogohlantirish (critical: 0, high: 18, moderate: 4, low: 2). Batafsil natija `dependency-audit.json` faylida. Barcha xavfsizlik muammolari bartaraf etildi degan xulosa qilinmaydi.
- Next.js yangilanishiga oid tekshirilgan xavfsizlik manbasi: https://github.com/advisories/GHSA-26hh-7cqf-hhc6
- GitHub ulanishida push huquqi yo‘q. O‘zgarishlar GitHub’ga yuborilmadi va saytga joylashtirilmadi.

## Ishga tushirish

Node.js 22 ishlating. ZIP’ni ochib loyiha papkasida:

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
E2E_PRODUCTION=1 npm run test:e2e
```

Linux CI uchun `npx playwright install --with-deps chromium` ishlatiladi. Workflow repository’ga kiritilganidan keyin push va pull requestlarda tekshiruvlar bajariladi; ushbu sessiyada GitHub Actions ishga tushirilmagan.
