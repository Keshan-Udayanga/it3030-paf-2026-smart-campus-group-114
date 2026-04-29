import { useEffect, useState } from "react";
import axios from "axios";
import "./ResourcesList.css";
import { useNavigate } from "react-router-dom";

function ResourcesList() {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ NEW STATES
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // 🔥 FETCH
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

  // 🔥 CLICK DELETE → OPEN POPUP
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // 🔥 CONFIRM DELETE
  const confirmDelete = () => {
    axios
      .delete(`http://localhost:8080/api/resources/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setResources(resources.filter((r) => r.id !== deleteId));
        setShowConfirm(false);
        setShowSuccess(true);
      })
      .catch((err) => console.error(err));
  };

  // 🔥 FILTER
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

      {/* HEADER */}
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

      {/* ✅ DELETE CONFIRM POPUP */}
      {showConfirm && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3 style={{ color: "#e74c3c" }}>⚠ Confirm Delete</h3>
            <p>Are you sure you want to delete this resource?</p>

            <div className="popup-actions">
              <button
                className="popup-btn cancel"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="popup-btn danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ SUCCESS POPUP */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>✅ Deleted</h3>
            <p>Resource deleted successfully!</p>

            <button
              className="popup-btn"
              onClick={() => setShowSuccess(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default ResourcesList;