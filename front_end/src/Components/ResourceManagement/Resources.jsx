import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Resources.css";

const Resources = () => {
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");

  // 🔥 HARD CODED BOOKINGS (temporary)
  const bookings = [
    {
      resourceId: 1,
      start: "2026-04-20T10:00",
      end: "2026-04-20T12:00",
    },
    {
      resourceId: 2,
      start: "2026-04-20T14:00",
      end: "2026-04-20T16:00",
    },
    {
      resourceId: 1,
      start: "2026-04-20T15:00",
      end: "2026-04-20T17:00",
    },
  ];

  // 🔥 CHECK AVAILABILITY FUNCTION
  const isAvailable = (resourceId, userFrom, userTo) => {
    if (!userFrom || !userTo) return true;

    const from = new Date(userFrom);
    const to = new Date(userTo);

    const resourceBookings = bookings.filter(
      (b) => b.resourceId === resourceId,
    );

    for (let booking of resourceBookings) {
      const bStart = new Date(booking.start);
      const bEnd = new Date(booking.end);

      // ❌ overlap check
      const overlap = from < bEnd && to > bStart;

      if (overlap) return false;
    }

    return true;
  };

  // 🔥 FETCH RESOURCES
  const fetchResources = () => {
    setLoading(true);

    axios
      .get("http://localhost:8080/api/resources", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        setResources(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching resources:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // 🔥 FILTERED RESOURCES (search + availability)
  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.type.toLowerCase().includes(searchTerm.toLowerCase());

    const available = isAvailable(res.id, timeFrom, timeTo);

    return matchesSearch && available;
  });

  return (
    <section className="resources-page">
      <div className="container">
        <div className="header-actions">
          <h2 className="page-title">Resources Catalogue</h2>
        </div>

        {/* 🔍 SEARCH & FILTER */}
        <div className="filter-card">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search resource name or type ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="time-filters">
            <div className="input-group">
              <label>Available From:</label>
              <input
                type="datetime-local"
                value={timeFrom}
                onChange={(e) => setTimeFrom(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Available To:</label>
              <input
                type="datetime-local"
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 📊 TABLE */}
        <div className="table-container">
          {loading ? (
            <p className="loading">Loading resources...</p>
          ) : (
            <table className="resources-table">
              <thead>
                <tr>
                  <th>Resource Name</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredResources.length > 0 ? (
                  filteredResources.map((res) => {
                    const available = isAvailable(res.id);

                    return (
                      <tr key={res.id}>
                        <td className="font-bold">{res.name}</td>

                        <td>
                          <span className="badge-type">{res.type}</span>
                        </td>

                        <td>{res.capacity}</td>
                        <td>{res.location}</td>

                        <td>
                          <span className={`status-pill ${res.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                            {res.status}
                          </span>
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-book"
                              disabled={!available}
                              onClick={() => navigate(`/booking/${res.id}`)}
                            >
                              Book
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No resources available for selected time.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default Resources;