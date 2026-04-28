import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyBookings.css";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ---------------- LOAD RESOURCES ----------------
  const loadResources = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/resources", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : [];

      // 🔥 IMPORTANT: unwrap EntityModel
      const clean = data.map((r) => r.content || r);

      setResources(clean);
    } catch (err) {
      console.error("RESOURCE ERROR:", err);
    }
  };

  // ---------------- LOAD BOOKINGS ----------------
  const loadBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/bookings/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings");
    }
  };

  useEffect(() => {
    loadResources();
    loadBookings();
  }, []);

  // ---------------- MAP RESOURCE NAME ----------------
  const getResourceName = (id) => {
    const found = resources.find((r) => r.id === id);
    return found ? found.name : id; // fallback = ID
  };

  // ---------------- STATS ----------------
  const getStatus = (status) => (status || "").toUpperCase();

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => getStatus(b.status) === "PENDING").length,
      approved: bookings.filter(b => getStatus(b.status) === "APPROVED").length,
      rejected: bookings.filter(b => getStatus(b.status) === "REJECTED").length,
    };
  }, [bookings]);

  // ---------------- FILL ----------------
  const getFill = (value) => {
    const total = stats.total || 1;
    return (value / total) * 100;
  };

  const formatDateTime = (dt) => {
    if (!dt) return "-";
    return new Date(dt).toLocaleString();
  };

  return (
    <div className="my-bookings-page-v2">
      <div className="my-bookings-wrapper">

        {/* HEADER */}
        <div className="my-bookings-top">
          <div>
            <h1>My Bookings</h1>
            <p>View and manage all your resource bookings</p>
          </div>

          <button
            onClick={() => navigate("/resources")}
            className="new-booking-btn"
          >
            + New Booking
          </button>
        </div>

        {/* STATS */}
        <div className="stats-grid">

          <div className="stat-card">
            <div className="circle" style={{
              background: `conic-gradient(#0f172a ${getFill(stats.total)}%, #e5e7eb 0)`
            }}>
              <span>{stats.total}</span>
            </div>
            <p>Total</p>
          </div>

          <div className="stat-card">
            <div className="circle" style={{
              background: `conic-gradient(#f59e0b ${getFill(stats.pending)}%, #e5e7eb 0)`
            }}>
              <span>{stats.pending}</span>
            </div>
            <p>Pending</p>
          </div>

          <div className="stat-card">
            <div className="circle" style={{
              background: `conic-gradient(#10b981 ${getFill(stats.approved)}%, #e5e7eb 0)`
            }}>
              <span>{stats.approved}</span>
            </div>
            <p>Approved</p>
          </div>

          <div className="stat-card">
            <div className="circle" style={{
              background: `conic-gradient(#ef4444 ${getFill(stats.rejected)}%, #e5e7eb 0)`
            }}>
              <span>{stats.rejected}</span>
            </div>
            <p>Rejected</p>
          </div>

        </div>

        {/* TABLE */}
        <div className="booking-table-card">
          <table className="booking-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>RESOURCE</th>
                <th>DATE</th>
                <th>START</th>
                <th>END</th>
                <th>PURPOSE</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((b, i) => (
                  <tr key={b.id}>
                    <td>#{i + 1}</td>

                    {/* 🔥 FIXED HERE */}
                    <td>{getResourceName(b.resourceId)}</td>

                    <td>{formatDateTime(b.bookingDate)}</td>
                    <td>{formatDateTime(b.startDateTime)}</td>
                    <td>{formatDateTime(b.endDateTime)}</td>
                    <td>{b.purpose}</td>

                    <td>
                      <span className={`table-status status-${getStatus(b.status).toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}

export default MyBookings;