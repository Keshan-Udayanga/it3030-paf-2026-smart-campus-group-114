import { Outlet, useNavigate } from "react-router-dom";
import "../styles/AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <h3>Admin Panel</h3>

        <ul>
          <li onClick={() => navigate("/admin/dashboard")}>
            Dashboard
          </li>

          <li onClick={() => navigate("/admin/users")}>
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