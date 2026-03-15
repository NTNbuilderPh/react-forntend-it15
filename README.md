<div align="center">

# 📊 UDDN Dashboard — Frontend

**React 18 · Vite · Tailwind CSS v4 · Recharts**

*Interactive academic dashboard for the University of Davao del Norte*
*School Year 2025–2026*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-22B5BF?style=flat-square)](https://recharts.org)

</div>

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 **Login page** | Form validation, loading states, server-error display |
| 📊 **Dashboard** | Stat cards + Bar, Pie, and Line charts from live API data |
| 🎓 **Students table** | Paginated list with course / year level / gender filters |
| 🌤️ **Weather** | Current conditions + 5-day forecast via Open-Meteo (no key needed) |
| 📍 **City search** | Geocode any city or use browser geolocation |
| 🔄 **Auto-auth** | Token validated on load; 401 auto-redirects to login |
| 📱 **Responsive** | Mobile-first layout, collapsible nav, fluid charts |
| ⚠️ **Error boundary** | Top-level React error boundary with retry |

---

## 🗂️ Project Structure

```
frontend/
├── index.html
├── vite.config.js           # Tailwind v4 plugin + /api proxy → :8000
├── package.json
├── src/
│   ├── main.jsx             # ReactDOM.createRoot entry point
│   ├── App.jsx              # AuthProvider → Navbar → page router
│   ├── index.css            # @import "tailwindcss" (v4 syntax)
│   ├── context/
│   │   └── AuthContext.jsx  # token storage, signIn / signOut, /me validation
│   ├── services/
│   │   ├── api.js           # Axios instance + all API helpers
│   │   └── weatherApi.js    # Weather fetch + WMO code interpreter
│   └── components/
│       ├── auth/
│       │   └── Login.jsx
│       ├── common/
│       │   ├── Navbar.jsx
│       │   ├── LoadingSpinner.jsx
│       │   └── ErrorBoundary.jsx
│       ├── dashboard/
│       │   ├── Dashboard.jsx          # stat cards + demographics
│       │   ├── EnrollmentChart.jsx    # Recharts BarChart
│       │   ├── CourseDistributionChart.jsx  # Recharts PieChart
│       │   └── AttendanceChart.jsx    # Recharts LineChart
│       ├── students/
│       │   └── Students.jsx           # paginated table + filters
│       └── weather/
│           ├── WeatherWidget.jsx      # search + current conditions
│           └── ForecastDisplay.jsx    # 5-day forecast grid
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- The **backend API** running at `http://127.0.0.1:8000`

### 1 · Install dependencies

```bash
cd frontend
npm install
```

### 2 · Start the development server

```bash
npm run dev
```

Open **`http://localhost:5173`** in your browser.

> The Vite dev server automatically proxies `/api/*` requests to `http://127.0.0.1:8000` — no CORS issues during development.

### 3 · Production build

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build locally
```

---

## 🔑 Login Credentials

| Field    | Value            |
|----------|------------------|
| Email    | `admin@uddn.edu` |
| Password | `password123`    |

---

## 📸 Pages

### Dashboard
- **4 stat cards** — total students, courses, school days, average attendance
- **Bar chart** — monthly enrollment trends (Recharts)
- **Pie chart** — course distribution with percentage labels (Recharts)
- **Line chart** — daily attendance patterns with average reference line (Recharts)
- **Demographics** — animated progress bars for gender, year level, top cities

### Students
- Paginated table (20 per page) with server-side filtering
- Filter by **course**, **year level**, and **gender**
- One-click filter reset

### Weather
- Defaults to **Tagum City, Davao del Norte** (UDDN's location)
- Search any city by name — powered by Open-Meteo geocoding
- Use browser **geolocation** button for current position
- **Current conditions** — temperature, feels-like, humidity, wind speed
- **5-day forecast** grid with WMO weather icons and precipitation totals

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 with Hooks |
| Bundler | Vite 6 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts 2.12 |
| HTTP | Axios 1.7 |
| Auth | Bearer token (localStorage) |
| Weather API | Open-Meteo (free, no key) |

---

## ⚙️ Environment & Proxy

All API calls use relative paths (e.g. `/api/login`). The Vite proxy in `vite.config.js` forwards them to the Laravel backend:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
    },
  },
},
```

No `.env` file is required for local development.

---

<div align="center">

*Part of the IT15/L Integrative Programming Final Project*
*University of Davao del Norte · SY 2025–2026*

</div>
