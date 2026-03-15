import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const http = axios.create({ baseURL: BASE })

// Attach token to every request automatically
http.interceptors.request.use(config => {
  const token = localStorage.getItem('uddn_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  login:  (email, password) => http.post('/login', { email, password }),
  me:     (token) => http.get('/me', { headers: { Authorization: `Bearer ${token}` } }),
  logout: (token) => http.post('/logout', {}, { headers: { Authorization: `Bearer ${token}` } }),
}

// ── Students ──────────────────────────────────────────────────
export const studentsApi = {
  list:   (params = {}) => http.get('/students', { params }),
  show:   (id)          => http.get(`/students/${id}`),
}

// ── Courses ───────────────────────────────────────────────────
export const coursesApi = {
  list: () => http.get('/courses'),
}

// ── Dashboard ─────────────────────────────────────────────────
export const dashboardApi = {
  stats:               () => http.get('/dashboard/stats'),
  enrollmentTrends:    () => http.get('/dashboard/enrollment-trends'),
  courseDistribution:  () => http.get('/dashboard/course-distribution'),
  attendancePatterns:  () => http.get('/dashboard/attendance-patterns'),
  demographics:        () => http.get('/dashboard/demographics'),
}

export default http
