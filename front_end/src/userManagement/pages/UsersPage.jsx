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
    .then(res => setUsers(res.data))
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
          u.id === id ? { ...u, roles: [newRole] } : u
        )
      );
    })
    .catch(err => console.error(err));
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
                <select
                  value={user.roles[0]}
                  onChange={(e) => updateRole(user.id, e.target.value)}
                >
                  <option value="ROLE_USER">User</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default UsersPage;