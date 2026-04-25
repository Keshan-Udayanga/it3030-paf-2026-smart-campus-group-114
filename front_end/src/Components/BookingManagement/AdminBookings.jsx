import React, { useEffect, useState } from "react";
import "./AdminBookings.css";
import axios from "axios";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState({});
  const [rejectReasons, setRejectReasons] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ---------------- DATE FIX ----------------
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d - offset).toISOString().split("T")[0];
  };

  const formatTimePart = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDatePart = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d - offset).toISOString().split("T")[0];
  };

  // ---------------- LOAD BOOKINGS ----------------
  const loadBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data || []);
    } catch (err) {
      console.log("Booking load error", err);
    }
  };

  // ---------------- LOAD RESOURCES ----------------
  const loadResources = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/resources", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const map = {};
      (res.data || []).forEach((item) => {
        const r = item.content || item;
        map[r.id] = r.name;
      });

      setResources(map);
    } catch (err) {
      console.log("Resource error", err);
    }
  };

  // ---------------- INIT ----------------
  useEffect(() => {
    setLoading(true);
    Promise.all([loadBookings(), loadResources()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // ---------------- APPROVE ----------------
  const handleApprove = async (id) => {
    await axios.patch(
      `http://localhost:8080/api/bookings/${id}/review`,
      { decision: "APPROVED" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadBookings();
  };

  // ---------------- REJECT ----------------
  const handleReject = async (id) => {
    await axios.patch(
      `http://localhost:8080/api/bookings/${id}/review`,
      {
        decision: "REJECTED",
        adminReason: rejectReasons[id] || "No reason provided",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    loadBookings();
  };

  const handleReasonChange = (id, value) => {
    setRejectReasons((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "APPROVED":
        return "status-approved";
      case "REJECTED":
        return "status-rejected";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="admin-bookings-page">
      <div className="admin-bookings-container">

        <h2 className="title">🛠️ Admin Booking Review</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="admin-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Resource</th>
                <th>User</th>
                <th>Booking Date</th>
                <th>Start Date</th>
                <th>Start Time</th>
                <th>End Date</th>
                <th>End Time</th>
                <th>Purpose</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b, i) => (
                <React.Fragment key={b.id || i}>

                  {/* ROW 1 */}
                  <tr className="main-row">
                    <td>{i + 1}</td>
                    <td>{resources[b.resourceId] || "Loading..."}</td>
                    <td>{b.userId}</td>
                    <td>{formatDate(b.bookingDate)}</td>
                    <td>{formatDatePart(b.startDateTime)}</td>
                    <td>{formatTimePart(b.startDateTime)}</td>
                    <td>{formatDatePart(b.endDateTime)}</td>
                    <td>{formatTimePart(b.endDateTime)}</td>
                    <td>{b.purpose}</td>
                  </tr>

                  {/* ROW 2 */}
                  <tr className="detail-row">
                    <td colSpan="9">

                      <div className="detail-box">

                        {/* STATUS */}
                        <div>
                          <strong>Status:</strong>{" "}
                          <span className={`status-badge ${getStatusClass(b.status)}`}>
                            {b.status}
                          </span>
                        </div>

                        {/* ✅ REASON (YOUR REQUIRED SNIPPET INSERTED HERE) */}
                        <div>
                          <strong>Reason:</strong>{" "}
                          {b.status === "PENDING" ? (
                            <input
                              value={rejectReasons[b.id] || ""}
                              onChange={(e) =>
                                handleReasonChange(b.id, e.target.value)
                              }
                              placeholder="Reject reason"
                            />
                          ) : (
                            b.adminReason || "-"
                          )}
                        </div>

                        {/* ACTIONS */}
                        <div>
                          <strong>Actions:</strong>{" "}
                          {b.status === "PENDING" ? (
                            <div className="admin-actions">

                              <button
                                className="approve-btn"
                                onClick={() => handleApprove(b.id)}
                              >
                                Approve
                              </button>

                              <button
                                className="reject-btn"
                                onClick={() => handleReject(b.id)}
                              >
                                Reject
                              </button>

                            </div>
                          ) : (
                            <span>Done</span>
                          )}
                        </div>

                      </div>

                    </td>
                  </tr>

                </React.Fragment>
              ))}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
}

export default AdminBookings;