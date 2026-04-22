import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

    useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
        if (!res.data.roles.includes("ROLE_ADMIN")) {
        window.location.href = "/";
        } else {
        setUser(res.data);
        }
    })
    .catch(() => {
        window.location.href = "/";
    });
    }, []);

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <h3>Admin Panel</h3>

        <ul>
          <li className={location.pathname === "/admin/dashboard" ? "active" : ""} onClick={() => navigate("/admin/dashboard")}>
            Dashboard
          </li>

          <li className={location.pathname === "/admin/users" ? "active" : ""}onClick={() => navigate("/admin/users")}>
            Users
          </li>
        </ul>
      </div>

      {/* CONTENT AREA */}
      <div className="admin-content">
        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;