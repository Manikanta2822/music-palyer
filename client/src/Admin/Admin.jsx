import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://music-palyer.onrender.com/api/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setUsers(res.data);
      } catch (err) {
        setError("This page is only permitted for admins");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center text-primary fw-bold mb-4">👥 Non-Admin Users</h2>

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <div className="row">
          {users.map((user, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card user-card text-white shadow-lg border-0">
                <div className="card-body text-center">
                  <div className="user-icon mb-3">
                    <i className="bi bi-person-circle fs-1"></i>
                  </div>
                  <h5 className="card-title fw-bold">{user.name || "Unnamed User"}</h5>
                  <p className="card-text"><strong>Email:</strong> {user.email}</p>
                  <p className="card-text"><strong>Role:</strong> {user.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
