<<<<<<< HEAD
# react-forntend-it15
FINAL PROJECT FOR IT15/L - 4616
=======
# UDDN Academic Dashboard — React Frontend

University of Davao del Norte · IT15/L Integrative Programming Final Project

## Overview

React.js single-page application that consumes the Laravel REST API backend. Features a secure login, interactive data-visualization dashboard, a paginated student directory, and a real-time weather widget powered by the Open-Meteo API.

## Features

- **Authentication** — login/logout with Laravel Sanctum token stored in localStorage, protected routes, auto-redirect on token expiry
- **Dashboard** — stat cards, year-level distribution bars, monthly enrollment bar chart, course distribution pie chart, attendance line chart with quarter filter
- **Students** — filterable/paginated table (by course, year level, gender), responsive with hidden columns on mobile
- **Weather** — current conditions + 5-day forecast via Open-Meteo (free, no API key), city search, geolocation support
- **Design** — deep institutional green + parchment gold palette, DM Serif Display headings, skeleton loaders, smooth animations

## Technologies

| Library | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| React Router DOM | 6 | Client-side routing |
| Recharts | 2 | Bar / Pie / Line charts |
| Axios | 1.x | HTTP client |
| Vite | 5 | Build tool |

## Project Structure

```
src/
├── App.jsx                     — Router + layout wrapper
├── main.jsx                    — React DOM entry point
├── index.css                   — Global CSS variables, resets, utilities
│
├── context/
│   └── AuthContext.jsx         — Auth state, login/logout, token management
│
├── services/
│   ├── api.js                  — Axios instance + all backend API calls
│   └── weatherApi.js           — Open-Meteo fetch helpers + WMO code decoder
│
├── pages/
│   ├── Students.jsx            — Filterable student table with pagination
│   ├── Students.module.css
│   ├── Weather.jsx             — Weather page layout
│   └── Weather.module.css
│
└── components/
    ├── auth/
    │   ├── Login.jsx           — Split-panel login with background slideshow
    │   └── Login.module.css
    │
    ├── dashboard/
    │   ├── Dashboard.jsx       — Stat cards + year-level row + chart grid
    │   ├── Dashboard.module.css
    │   ├── EnrollmentChart.jsx — Bar chart (monthly enrollment)
    │   ├── CourseDistributionChart.jsx — Pie chart (students per course)
    │   ├── AttendanceChart.jsx — Line chart (daily attendance, quarter filter)
    │   └── Charts.module.css
    │
    ├── weather/
    │   ├── WeatherWidget.jsx   — Current conditions + stat chips
    │   ├── ForecastDisplay.jsx — 5-day forecast grid
    │   └── Weather.module.css
    │
    └── common/
        ├── Navbar.jsx          — Sticky top nav, user dropdown, mobile drawer
        ├── Navbar.module.css
        ├── ProtectedRoute.jsx  — Redirects to /login if unauthenticated
        ├── ErrorBoundary.jsx   — React error boundary with retry button
        ├── LoadingSpinner.jsx  — Animated SVG spinner (sm / md / lg, fullPage)
        └── LoadingSpinner.module.css
```

## Setup Instructions

### Prerequisites

- Node.js v18+ (v24 tested)
- Backend running at `http://127.0.0.1:8000`

### 1. Navigate to the frontend directory

```bash
cd react-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Copy environment file

```bash
cp .env.example .env
```

### 4. Configure environment variables

Edit `.env` if your backend runs on a different port or host:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api

# Open-Meteo (free, no key needed)
VITE_WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
VITE_WEATHER_LAT=7.4467
VITE_WEATHER_LON=125.8094
```

### 5. Start the development server

```bash
npm run dev
```

Frontend will be available at:

```
http://localhost:3000
```

### 6. Build for production

```bash
npm run build
```

## Pages & Routes

| Route | Component | Auth |
|---|---|---|
| `/login` | `Login.jsx` | Public |
| `/dashboard` | `Dashboard.jsx` | Protected |
| `/students` | `Students.jsx` | Protected |
| `/weather` | `Weather.jsx` | Protected |
| `/` | Redirects to `/dashboard` | — |

## API Integration

All backend calls flow through `src/services/api.js`. The Axios instance automatically attaches the Bearer token from localStorage on every request.

```js
// Example
import { studentsApi } from './services/api'

const res = await studentsApi.list({ year_level: 1, gender: 'Female' })
```

### Available service methods

```js
authApi.login(email, password)
authApi.me(token)
authApi.logout(token)

studentsApi.list(params)      // GET /students  (paginated, filterable)
studentsApi.show(id)          // GET /students/:id

coursesApi.list()             // GET /courses

dashboardApi.stats()
dashboardApi.enrollmentTrends()
dashboardApi.courseDistribution()
dashboardApi.attendancePatterns()
dashboardApi.demographics()
```

## Default Credentials

```
Email:    admin@uddn.edu
Password: password123
```

## Image Assets

The login page expects background images at these public paths:

```
public/
├── logo-uddn.png
└── backgrounds/
    ├── davao-del-norte-1.jpg
    ├── davao-del-norte-2.jpg
    └── davao-del-norte-3.jpg
```

Place any JPG images of Davao del Norte in that folder. The login page will cycle through them every 6 seconds. If images are missing, the dark green overlay still displays correctly.
>>>>>>> 8d766a4 (Initial React Frontend  commit)
