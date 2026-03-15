import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark uddn-navbar px-3">
      <div className="container-fluid">
        <div className="navbar-brand d-flex align-items-center gap-2">
          <img src="/logo-uddn.png" alt="UDDN Logo" className="logo-sm" />
          <div>
            <div className="fw-bold">University of Davao del Norte</div>
            <small className="text-light">Academic Dashboard SY 2025–2026</small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <span className="text-white small">
            {user ? `Welcome, ${user.name}` : 'Administrator'}
          </span>
          <button className="btn btn-warning btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;