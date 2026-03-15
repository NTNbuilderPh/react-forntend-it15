import { useEffect, useState } from 'react';
import api from '../../services/api';
import Navbar from '../common/Navbar';
import LoadingSpinner from '../common/LoadingSpinner';
import EnrollmentChart from './EnrollmentChart';
import CourseDistributionChart from './CourseDistributionChart';
import AttendanceChart from './AttendanceChart';
import WeatherWidget from '../weather/WeatherWidget';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const [statsRes, enrollmentRes, courseRes, attendanceRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/enrollment-trends'),
        api.get('/dashboard/course-distribution'),
        api.get('/dashboard/attendance-patterns'),
      ]);

      setStats(statsRes.data);
      setEnrollmentData(enrollmentRes.data);
      setCourseData(courseRes.data);
      setAttendanceData(attendanceRes.data);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner text="Loading dashboard..." />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="dashboard-page py-4">
        <div className="container">
          <div className="dashboard-hero mb-4">
            <h1 className="fw-bold mb-2">University of Davao del Norte</h1>
            <h4 className="mb-1">Academic Dashboard System</h4>
            <p className="mb-0">School Year 2025–2026</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {stats && (
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card stat-card text-center">
                  <div className="card-body">
                    <h6>Total Students</h6>
                    <h2>{stats.total_students}</h2>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card stat-card text-center">
                  <div className="card-body">
                    <h6>Courses Offered</h6>
                    <h2>{stats.total_courses}</h2>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card stat-card text-center">
                  <div className="card-body">
                    <h6>Regular School Days</h6>
                    <h2>{stats.school_days}</h2>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card stat-card text-center">
                  <div className="card-body">
                    <h6>Average Attendance</h6>
                    <h2>{stats.average_attendance}</h2>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <EnrollmentChart data={enrollmentData} />
            </div>
            <div className="col-lg-6">
              <CourseDistributionChart data={courseData} />
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <AttendanceChart data={attendanceData} />
            </div>
            <div className="col-lg-4">
              <WeatherWidget />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;