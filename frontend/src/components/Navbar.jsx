// ============================================
// components/Navbar.jsx
// ============================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout, isAdmin, isCaptain, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      {/* Brand */}
      <Link className="navbar-brand fw-bold fs-4" to="/">
        🏆 TourneyHub
      </Link>

      {/* Hamburger for mobile */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        {/* Left side links */}
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
        </ul>

        {/* Right side: auth links */}
        <ul className="navbar-nav ms-auto align-items-center gap-2">
          {!isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-light btn-sm" to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              {/* Admin Dashboard Link */}
              {isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    <i className="bi bi-speedometer2 me-1"></i>Admin Dashboard
                  </Link>
                </li>
              )}

              {/* Captain Dashboard Link */}
              {isCaptain && (
                <li className="nav-item">
                  <Link className="nav-link" to="/captain">
                    <i className="bi bi-person-badge me-1"></i>My Dashboard
                  </Link>
                </li>
              )}

              {/* User info */}
              <li className="nav-item">
                <span className="nav-link text-warning">
                  <i className="bi bi-person-circle me-1"></i>
                  {user.name} ({user.role})
                </span>
              </li>

              {/* Logout */}
              <li className="nav-item">
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
