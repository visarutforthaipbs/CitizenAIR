# CitizenAIR - แผนที่คุณภาพอากาศประเทศไทย

![CitizenAIR Logo](frontend/public/image/logo.svg)

CitizenAIR เป็นแอปพลิเคชันเว็บสำหรับตรวจสอบคุณภาพอากาศในประเทศไทย โดยมุ่งเน้นการแสดงข้อมูล PM2.5 และรวบรวมวิธีแก้ปัญหาจากประชาชน พร้อมด้วยแผนที่โต้ตอบและการแสดงผลข้อมูลแบบ real-time

## 🌟 Features

- **แผนที่โต้ตอบ**: แสดงข้อมูล PM2.5 ในระดับอำเภอทั่วประเทศไทย
- **สัญลักษณ์กราฟิก**: ใช้ไอคอน SVG แบบ hand-drawn สำหรับแต่ละระดับคุณภาพอากาศ
- **ข้อมูลประชาชน**: รวบรวมวิธีแก้ปัญหาและความคิดเห็นจากประชาชน
- **Responsive Design**: รองรับการใช้งานบนมือถือและแท็บเล็ต
- **Thai Language**: ใช้ภาษาไทยในทุกส่วนของ UI

## 🏗️ Architecture

```
CitizenAIR/
├── frontend/          # React frontend (Vite + React Router)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── utils/        # Utility functions
│   │   └── data/         # Data files and constants
│   └── public/
│       ├── image/        # SVG icons and images
│       └── data/         # CSV data files
├── backend/           # Express.js API server
│   ├── server.js         # Main server file
│   └── routes/           # API routes
└── package.json       # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Notion integration token and database ID (for backend)

### Installation & Setup

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Configure environment variables:

**Backend** (create `backend/.env`):
```env
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here
PORT=5000
```

**Frontend** (create `frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### Development

Start backend server:
```bash
cd backend
npm run dev
```

Start frontend (in another terminal):
```bash
cd frontend
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

## Project Structure

### Frontend (`/frontend`)
- React application with interactive Thailand map
- Citizen solutions showcase page
- Real-time connection to backend API

### Backend (`/backend`)
- Express.js server with Notion API integration
- RESTful endpoints for solutions data
- CORS-enabled for frontend communication

## Features

- 🗺️ Interactive Thailand PM2.5 map
- 🏠 Citizen-contributed air quality solutions
- 🔗 Real-time Notion database integration
- 🇹🇭 Full Thai language support
- 📱 Responsive designากชาวบ้าน

## ✨ คุณสมบัติหลัก

### 📍 หน้าแผนที่ (`/`)

- **แผนที่แบบโต้ตอบ**: แสดงข้อมูล PM2.5 ของแต่ละอำเภอในประเทศไทยด้วยสีที่แตกต่างกันตามระดับมลพิษ
- **ข้อมูลแบบเรียลไทม์**: ดูค่า PM2.5 ปัจจุบันของพื้นที่ที่เลือก
- **กราฟแนวโน้ม**: ติดตามการเปลี่ยนแปลงของ PM2.5 ย้อนหลัง 5 ปี
- **Word Cloud**: รวบรวมไอเดียการแก้ปัญหาจากผู้ใช้

### 🔧 หน้าวิธีแก้ปัญหา (`/solutions`)

- **คลังข้อมูลโซลูชัน**: รวบรวมวิธีแก้ปัญหาฝุ่น PM2.5 จากประสบการณ์ชาวบ้าน
- **ระบบค้นหาและกรอง**: ค้นหาตามหมวดหมู่ ความยาก ค่าใช้จ่าย
- **รายละเอียดครบถ้วน**: ข้อมูลต้นทุน เวลาที่ใช้ ประสิทธิภาพ และคำแนะนำ

## 🛠 เทคโนโลยีที่ใช้

- **Frontend**: React 19 + Vite
- **UI Framework**: Chakra UI
- **แผนที่**: React Leaflet + OpenStreetMap
- **กราฟ**: Recharts
- **Word Cloud**: react-wordcloud
- **Routing**: React Router DOM
- **ภาษา**: TypeScript/JavaScript
- **Styling**: CSS + Chakra UI

## 📦 การติดตั้ง

### ข้อกำหนดเบื้องต้น

- Node.js 18+
- npm หรือ yarn

### วิธีการติดตั้ง

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd CitizenAIR
   ```

2. **ติดตั้ง dependencies**

   ```bash
   npm install
   ```

3. **รันแอปพลิเคชัน**

   ```bash
   npm run dev
   ```

4. **เปิดเบราว์เซอร์**
   ```
   http://localhost:5173
   ```

## 📁 โครงสร้างโปรเจค

```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # Main app component
├── pages/
│   ├── MapPage.jsx          # หน้าแผนที่หลัก
│   └── SolutionPage.jsx     # หน้าแสดงวิธีแก้ปัญหา
├── components/
│   ├── Sidebar.jsx          # แถบด้านข้างแผนที่
│   ├── PM25Now.jsx          # แสดงค่า PM2.5 ปัจจุบัน
│   ├── PM25TrendChart.jsx   # กราฟแนวโน้ม PM2.5
│   ├── WordCloudInput.jsx   # ส่วนป้อนข้อมูล Word Cloud
│   └── SolutionCard.jsx     # การ์ดแสดงวิธีแก้ปัญหา
├── api/
│   ├── pm25Api.js           # API สำหรับข้อมูล PM2.5
│   └── notionApi.js         # API สำหรับข้อมูลโซลูชัน
├── data/
│   ├── thailand-districts.geojson  # ข้อมูลแผนที่อำเภอ
│   └── pm25-5yr.json       # ข้อมูล PM2.5 ย้อนหลัง 5 ปี
└── styles/
    └── custom.css           # CSS เสริม
```

## 🎨 การใช้งาน

### หน้าแผนที่

1. **คลิกที่อำเภอ** บนแผนที่เพื่อดูข้อมูลรายละเอียด
2. **ดูข้อมูลปัจจุบัน** ในส่วน "ฝุ่นตอนนี้"
3. **ศึกษาแนวโน้ม** ในส่วน "ฝุ่นช่วงไหน"
4. **แบ่งปันไอเดีย** ในส่วน "ถ้าแก้ปัญหาในบ้านคุณ..."

### หน้าวิธีแก้ปัญหา

1. **ค้นหาโซลูชัน** ตามคำหาหรือหมวดหมู่
2. **กรองตามเกณฑ์** เช่น ระดับความยาก ค่าใช้จ่าย
3. **คลิกการ์ด** เพื่อดูรายละเอียดครบถ้วน

## 🌈 การปรับแต่งสี PM2.5

แอปพลิเคชันใช้มาตรฐานสีตามระดับ PM2.5:

- 🟢 **สีเขียว** (≤25): ดีมาก
- 🟢 **สีเขียวอ่อน** (26-37): ดี
- 🟡 **สีเหลือง** (38-50): ปานกลาง
- 🟠 **สีส้ม** (51-90): เริ่มมีผลกระทบต่อสุขภาพ
- 🔴 **สีแดง** (91-150): มีผลกระทบต่อสุขภาพ
- 🟣 **สีม่วง** (>150): อันตรายต่อสุขภาพ

## 🔧 การพัฒนา

### คำสั่งพัฒนา

```bash
npm run dev          # รันในโหมด development
npm run build        # สร้าง production build
npm run preview      # ดูตัวอย่าง production build
npm run lint         # ตรวจสอบโค้ด
```

### การเพิ่มข้อมูล

- **ข้อมูลแผนที่**: แก้ไข `src/data/thailand-districts.geojson`
- **ข้อมูล PM2.5**: แก้ไข `src/data/pm25-5yr.json`
- **โซลูชัน**: แก้ไข `src/api/notionApi.js`

## 📝 หมายเหตุ

- ข้อมูล PM2.5 ปัจจุบันเป็น mock data - ในการใช้งานจริงต้องเชื่อมต่อกับ API ของ GISTDA หรือ Air4Thai
- ข้อมูลโซลูชันเป็น mock data - ในการใช้งานจริงควรเชื่อมต่อกับ Notion Database
- แอปพลิเคชันรองรับการใช้งานบนมือถือ (Responsive Design)
- ใช้ภาษาไทยในส่วนติดต่อผู้ใช้ทั้งหมด

## 🤝 การมีส่วนร่วม

หากต้องการมีส่วนร่วมในการพัฒนา:

1. Fork repository
2. สร้าง feature branch
3. Commit การเปลี่ยนแปลง
4. Push ไปยัง branch
5. สร้าง Pull Request

## 📄 License

MIT License - ดูรายละเอียดในไฟล์ LICENSE

---

Made with ❤️ for better air quality in Thailand+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
