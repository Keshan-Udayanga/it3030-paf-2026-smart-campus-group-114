import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UsersPage.css";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  
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
    .then(() => {
      // refresh users after update
      window.location.reload();
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="users-container">
      <h2>User Management</h2>

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
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.roles.join(", ")}</td>
              <td>
                <button
                  onClick={() => updateRole(user.id, "ROLE_ADMIN")}
                  className="btn-role"
                >
                  Make Admin
                </button>

                <button
                  onClick={() => updateRole(user.id, "ROLE_USER")}
                  className="btn-role-secondary"
                >
                  Make User
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default UsersPage;