import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/Context";
import { FaSearch } from "react-icons/fa";
import "./Navigation.css"; // Custom styles

export default function Navigation() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Debug log
  useEffect(() => {
    console.log("User role:", user?.role);
  }, [user]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar px-4 py-3 shadow-sm">
      {/* Brand Logo or Name */}
      <Link className="navbar-brand fs-3 fw-bold text-glow" to="/">
        🎧 MyMusic
      </Link>

      {/* Mobile Toggle */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      {/* Right Navigation */}
      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <div className="d-flex flex-wrap gap-3 align-items-center mt-3 mt-lg-0">
          {/* Search Icon */}
          <button
            className="btn btn-outline-light d-flex align-items-center gap-2"
            onClick={() => navigate("/search")}
            title="Search Music"
          >
            <FaSearch />
            <span className="d-none d-md-inline">Search</span>
          </button>

          {/* Show USERS button to all logged-in users */}
          {user && (
            <button
              className="btn btn-info fw-semibold px-4"
              onClick={() => navigate("/users")}
              title="View Users"
            >
              Users
            </button>
          )}

          {/* Auth Buttons */}
          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline-light fw-semibold px-4">
                Login
              </Link>
              <Link to="/signup" className="btn btn-warning text-dark fw-semibold px-4">
                Signup
              </Link>
            </>
          ) : (
            <button onClick={logout} className="btn btn-danger fw-semibold px-4">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
