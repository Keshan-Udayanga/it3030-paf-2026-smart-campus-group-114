import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUser(res.data);
      localStorage.setItem("userName", res.data.name);
      window.dispatchEvent(new Event("authChanged"));
    })
    .catch(() => {
      localStorage.removeItem("token");
      window.location.href = "/";
    });

    axios.get("http://localhost:8080/api/v1/users/count", {
    headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUserCount(res.data))
    .catch(err => console.error(err));

  }, []);

  return (
    <div className="admin-container">

      

      {/* MAIN CONTENT */}
      <div className="admin-main">

        {/* TOPBAR */}
        <div className="admin-topbar">
          <h3>Admin Dashboard</h3>
          {user && <span>Welcome, {user.name}</span>}
        </div>

        {/* CARDS */}
        <div className="admin-cards">

          <div className="admin-card">
            <h4>Total Users</h4>
          <p className="card-value"> {userCount}</p>
            <span>Manage system users</span>
          </div>

          <div className="admin-card">
            <h4>Resources</h4>
            <p className="card-value">45</p>
            <span>Manage campus resources</span>
          </div>

          <div className="admin-card">
            <h4>System Status</h4>
            <p className="card-value status-active">Active</p>
            <span>All systems running</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;