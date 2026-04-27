import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UsersPage.css";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  
  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUsers(res.data)
    console.log(res.data);})
    .catch(err => console.error(err));
  }, []);
  
  const updateRole = (id, newRole) => {
    axios.put(
      `http://localhost:8080/api/v1/users/${id}/roles`,
      { roles: [newRole] },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
      setUsers(prev =>
        prev.map(u =>
          u.id === id ? res.data : u
        )
      );
    })
    .catch(err => {
      if (err.response?.status === 400) {
        alert("Invalid role update");
      } else if (err.response?.status === 404) {
        alert("User not found");
      } else {
        alert("Error updating role");
      }
    });
  };

  const toggleUserStatus = async (id, enabled) => {
    try {
      const endpoint = enabled ? "disable" : "enable";

      await axios.put(
        `http://localhost:8080/api/v1/users/${id}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(prev =>
        prev.map(u =>
          u.id === id ? { ...u, enabled: !enabled } : u
        )
      );

    } catch (err) {
      const status = err.response?.status;

      if (status === 403) {
        alert("Action not allowed");
      } else if (status === 404) {
        alert("User not found");
      } else {
        alert("Failed to update user status");
      }
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/api/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove user from UI
      setUsers(prev => prev.filter(user => user.id !== userId));
      alert("User deleted successfully");

    } catch (error) {
      if (error.response?.status === 403) {
        alert("Cannot delete admin user");
      } else if (error.response?.status === 404) {
        alert("User not found");
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="users-container">
      <h2>User Management</h2>
      <input
        type="text"
        placeholder="Search users..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.roles.map(role => (
                  <span key={role} className="role-badge">{role}</span>
                ))}
              </td>
              <td>
                <span className={`status-badge ${user.enabled ? "active" : "disabled"}`}>
                  {user.enabled ? "Active" : "Disabled"}
                </span>
              </td>
              <td>
                <div className="action-group">

                  <select
                    value={user.roles[0]}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                  >
                    <option value="ROLE_USER">User</option>
                    <option value="ROLE_RESOURCE_MANAGER">Resource_Manager</option>
                    <option value="ROLE_TECHNICIAN">Technician</option>
                    <option value="ROLE_ADMIN">Admin</option>
                  </select>
                  <button className="btn-delete" disabled={user.roles.includes("ROLE_ADMIN")} onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                  <button
                    className={`btn-status ${user.enabled ? "disable" : "enable"}`}
                    onClick={() => toggleUserStatus(user.id, user.enabled)}
                  >
                    {user.enabled ? "Disable" : "Enable"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default UsersPage;