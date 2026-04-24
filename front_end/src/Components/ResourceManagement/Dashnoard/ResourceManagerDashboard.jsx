import { useEffect, useState } from "react";
import axios from "axios";
import "./ResourceManagerDashboard.css";
import { useNavigate } from "react-router-dom";

function ResourceDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    // ======================
    // USER INFO
    // ======================
    axios
      .get("http://localhost:8080/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("userName", res.data.name);
        window.dispatchEvent(new Event("authChanged"));
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });

    // ======================
    // RESOURCE STATS (FIXED)
    // ======================
    axios
      .get("http://localhost:8080/api/resources", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("RESOURCES:", res.data);

        // FIX: handle both array & wrapped response
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        const total = data.length;

        const active = data.filter(
          (r) => r.status === "ACTIVE"
        ).length;

        const inactive = data.filter(
          (r) => r.status !== "ACTIVE"
        ).length;

        setStats({
          total,
          active,
          inactive,
        });
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-main">

        {/* TOPBAR */}
        <div className="admin-topbar">
          <h2>Resource Manager Dashboard</h2>

          {user && (
            <span className="welcome-text">
              Welcome, {user.name}
            </span>
          )}
        </div>

        <hr className="hr" />

        {/* BUTTON */}
        <div className="action-bar">
          <button
            className="add-btn"
            onClick={() => navigate("/admin/add-resource")}
          >
            + Add New Resource
          </button>
        </div>

        {/* CARDS */}
        <div className="admin-cards">

          <div
            className="admin-card total clickable"
            onClick={() => navigate("/admin/resources-list")}
          >
            <h4>Total Resources</h4>
            <p>{stats.total}</p>
          </div>

          <div className="admin-card active">
            <h4>Active Resources</h4>
            <p>{stats.active}</p>
          </div>

          <div className="admin-card inactive">
            <h4>Inactive Resources</h4>
            <p>{stats.inactive}</p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ResourceDashboard;