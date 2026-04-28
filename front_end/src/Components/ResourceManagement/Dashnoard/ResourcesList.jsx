import { useEffect, useState } from "react";
import axios from "axios";
import "./ResourcesList.css";
import { useNavigate } from "react-router-dom";

function ResourcesList() {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ NEW
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 🔥 FETCH RESOURCES
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/resources", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setResources(data);
      })
      .catch((err) => console.error(err));
  }, [token]);

  // 🔥 DELETE
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure to delete this resource?")) return;

    axios
      .delete(`http://localhost:8080/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setResources(resources.filter((r) => r.id !== id));
        navigate("/admin/resource-management");
      })
      .catch((err) => console.error(err));
  };

  // 🔥 FILTER LOGIC (SEARCH)
  const filteredResources = resources.filter((r) => {
    const keyword = searchTerm.toLowerCase();

    return (
      r.name.toLowerCase().includes(keyword) ||
      r.type.toLowerCase().includes(keyword) ||
      r.location.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="resource-list-container">

      {/* HEADER + SEARCH */}
      <div className="header-bar">
        <h2 className="title">All Resources</h2>

        <input
          type="text"
          placeholder="Search resources..."
          className="search-input-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <table className="resource-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredResources.length > 0 ? (
            filteredResources.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.type}</td>
                <td>{r.capacity}</td>
                <td>{r.location}</td>

                <td>
                  <span
                    className={
                      r.status === "ACTIVE"
                        ? "status active"
                        : "status inactive"
                    }
                  >
                    {r.status}
                  </span>
                </td>

                <td className="actions">
                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(`/admin/update-resource/${r.id}`)
                    }
                  >
                    Update
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(r.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No resources found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ResourcesList;