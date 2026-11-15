# SmartPOS Frontend

หน้าเว็บของระบบขายหน้าร้าน SmartPOS ทำด้วย Next.js ใช้ได้ทั้งตอนขายของ ดูสต็อก ดูยอดขาย และให้ลูกค้าสมาชิกเข้าดูแต้มของตัวเอง
ส่วนหลังบ้าน (API) อยู่อีก repo: [SmartPOS_backend](https://github.com/Kaimuk-JP/SmartPOS_backend)

## ลองใช้งาน

เว็บ: https://pos.bittern-komodo.ts.net/

บัญชีทดลอง (หรือกดปุ่ม Demo Login ที่หน้าล็อกอิน):

- ชื่อผู้ใช้: `smartpos`
- รหัสผ่าน: `123456789`

## ทำอะไรได้บ้าง

- **หน้าขาย** (`/sale`): ค้นหาสินค้า สแกนบาร์โค้ด พักบิล ใช้คูปองและแต้ม พิมพ์ใบเสร็จ และมีหน้าจอแสดงราคาให้ลูกค้าดู (`/customer-display`)
- **สต็อกและสินค้า** (`/stock`, `/product`, `/stock-report`): เพิ่มแก้ไขสินค้า หมวดหมู่ ดูของใกล้หมด
- **ลูกค้าและแต้ม** (`/customer`, `/points-history`, `/reward`): สมัครสมาชิก สะสมแต้ม แลกของรางวัล
- **บิล** (`/bills`): ดูย้อนหลัง พิมพ์ซ้ำ ดูรายการค้างชำระ
- **แอดมิน** (`/admin/...`): แดชบอร์ดยอดขายและกำไร พนักงาน คูปอง โปรโมชั่น ข่าว ของรางวัล และบันทึกการใช้งานของพนักงาน
- **พอร์ทัลสมาชิก** (`/member`): ลูกค้าล็อกอินแยกเพื่อดูแต้ม ประวัติซื้อ และของรางวัล

สิทธิ์แบ่งเป็น 3 แบบ คือ แอดมิน พนักงาน และลูกค้าสมาชิก หน้าที่ต้องล็อกอินถูกกั้นไว้ใน `middleware.ts` โดยดู cookie `access_token` และ role ในนั้น

## เครื่องมือที่ใช้

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Supabase JS (ไลบรารีเรียกฐานข้อมูล PostgreSQL), Chart.js, Framer Motion, react-to-print, bwip-js (สร้างบาร์โค้ด)

## รันในเครื่อง

ต้องมี Node 20 ขึ้นไป หน้าเว็บต้องมี API และฐานข้อมูลทำงานอยู่ก่อน ให้ตั้งฝั่ง backend ตามขั้นตอนใน [SmartPOS_backend](https://github.com/Kaimuk-JP/SmartPOS_backend#รันในเครื่อง) (สั่ง 3 ขั้น ใช้ Docker รันฐานข้อมูล) ขั้นแรกของเขาจะพิมพ์ค่าสำหรับไฟล์ `.env.local` ของที่นี่ให้

```bash
npm install
npm run dev
```

เปิด http://localhost:3000 แล้วล็อกอินด้วย `smartpos` / `123456789` หรือกดปุ่ม Demo Login

ไฟล์ `.env.local` ในโฟลเดอร์หลัก:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000   # ที่อยู่ REST ของฐานข้อมูล PostgreSQL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...                # ได้จากสคริปต์ local/make-env.js ฝั่ง backend
```

ตัวแปรที่ขึ้นต้นด้วย `NEXT_PUBLIC_` ถูกฝังลงในไฟล์ตอน build ถ้าเปลี่ยนค่าต้อง build ใหม่

## รันจริงบนคอม

ตั้งค่าบนเครื่องคอมเดียวกับที่รัน backend ใส่ค่าใน `.env.local` ให้ถูกก่อน แล้ว build (ค่า `NEXT_PUBLIC_*` ถูกฝังตอน build):

```bash
npm ci
npm run build
npm run start
```

หน้าเว็บทำงานที่ http://localhost:3000 ให้รันค้างด้วย pm2:

```bash
npm i -g pm2
pm2 start npm --name smartpos-web -- run start
pm2 save
```

ถ้าให้เครื่องอื่นเข้าถึง ให้เปลี่ยน `NEXT_PUBLIC_API_URL` และ `NEXT_PUBLIC_SUPABASE_URL` จาก `localhost` เป็นที่อยู่ของเครื่องนี้ แล้ว build ใหม่ และอย่าลืมใส่ที่อยู่หน้าเว็บใน `CORS_ORIGINS` ของ backend

มี `Dockerfile` สำหรับรันเป็น container (build แบบ standalone พอร์ต 3000)

## โครงสร้างโฟลเดอร์

```
app/          หน้าเว็บทั้งหมด (routing ตามชื่อโฟลเดอร์)
components/   ส่วนประกอบของแต่ละหน้า แยกเป็น sale, stock, admin ฯลฯ
lib/api/      ฟังก์ชันเรียก backend แยกไฟล์ตามเรื่อง (products, sales, customers ...)
lib/          supabase client และ type กลาง
utils/        จัดการ token และกล่องยืนยัน
hooks/        hook เล็กๆ เช่น useDebounce
public/       รูปและไฟล์ static
```
