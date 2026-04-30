import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Resources.css";
import { useNavigate } from "react-router-dom";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");

  const [showAlert, setShowAlert] = useState(false);

  // 🔥 FETCH RESOURCES
  const fetchResources = () => {
    setLoading(true);

    axios
      .get("http://localhost:8080/api/resources", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  // 🔥 FETCH BOOKINGS (FIXED API)
  const fetchBookings = () => {
    axios
      .get("http://localhost:8080/api/bookings", {
        // ✅ FIXED
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        console.log("🔥 BOOKINGS:", res.data); // debug
        setBookings(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
      });
  };

  useEffect(() => {
    fetchResources();
    fetchBookings();
  }, []);

  // 🔥 TIME NORMALIZE FUNCTION (IMPORTANT)
  const normalizeDate = (dateStr) => {
    const date = new Date(dateStr);
  };

  // 🔥 CHECK AVAILABILITY (FINAL FIX)
  const isAvailable = (resourceId, userFrom, userTo) => {
    if (!userFrom || !userTo) return true;

    const from = normalizeDate(userFrom);
    const to = normalizeDate(userTo);

    return !bookings.some((b) => {
      if (String(b.resourceId) !== String(resourceId)) return false;
      if (b.status === "CANCELLED" || b.status === "REJECTED") return false;

      const bStart = new Date(b.startDateTime).getTime();
      const bEnd = new Date(b.endDateTime).getTime();

      const fromTime = new Date(userFrom).getTime();
      const toTime = new Date(userTo).getTime();

      console.log("Compare:", {
        resourceId,
        booking: b,
        userFrom: from,
        userTo: to,
      });

      return fromTime < bEnd && toTime > bStart;
    });
  };

  // 🔥 FILTERED RESOURCES
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
                    const available = isAvailable(res.id, timeFrom, timeTo);

                    return (
                      <tr key={res.id}>
                        <td className="font-bold">{res.name}</td>

                        <td>
                          <span className="badge-type">{res.type}</span>
                        </td>

                        <td>{res.capacity}</td>
                        <td>{res.location}</td>

                        <td>
                          <span
                            className={`status-pill ${
                              res.status === "ACTIVE" ? "active" : "inactive"
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-book"
                              disabled={!available}
                              onClick={() => {
                                if (res.status === "OUT_OF_SERVICE") {
                                  setShowAlert(true);
                                  return;
                                }
                                navigate(`/booking/${res.id}`);
                              }}
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

      {showAlert && (
        <div className="custom-alert-overlay">
          <div className="custom-alert-box">
            <h3>⚠️ Out of Service</h3>
            <p>This resource is currently unavailable for booking.</p>

            <button className="alert-btn" onClick={() => setShowAlert(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Resources;
