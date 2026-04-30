import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Summary.css";

function Summary() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // 📊 CALCULATIONS
  const total = bookings.length;
  const approved = bookings.filter(b => b.status === "APPROVED").length;
  const rejected = bookings.filter(b => b.status === "REJECTED").length;
  const pending = bookings.filter(b => b.status === "PENDING").length;
  const cancelled = bookings.filter(b => b.status === "CANCELLED").length;

  const today = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter(b =>
    b.bookingDate?.startsWith(today)
  ).length;

  const futureBookings = bookings.filter(b =>
    new Date(b.startDateTime) > new Date()
  ).length;

  const pastBookings = bookings.filter(b =>
    new Date(b.endDateTime) < new Date()
  ).length;

  const uniqueUsers = new Set(bookings.map(b => b.userId)).size;
  const uniqueResources = new Set(bookings.map(b => b.resourceId)).size;

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      case 'PENDING': return 'status-pending';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const summaryData = [
    { metric: "Total Bookings", value: total, type: "number" },
    { metric: "Approved", value: approved, type: "status", status: "APPROVED" },
    { metric: "Rejected", value: rejected, type: "status", status: "REJECTED" },
    { metric: "Pending", value: pending, type: "status", status: "PENDING" },
    { metric: "Cancelled", value: cancelled, type: "status", status: "CANCELLED" },
    { metric: "Today's Bookings", value: todayBookings, type: "number" },
    { metric: "Future Bookings", value: futureBookings, type: "number" },
    { metric: "Past Bookings", value: pastBookings, type: "number" },
    { metric: "Unique Users", value: uniqueUsers, type: "number" },
    { metric: "Resources Used", value: uniqueResources, type: "number" }
  ];

  return (
    <div className="summary-page">
      <h2>📊 Booking Summary Dashboard</h2>
      
      <div className="summary-table-container">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((item, index) => (
              <tr key={index}>
                <td className="value-highlight">{item.metric}</td>
                <td>{item.value}</td>
                <td>
                  {item.type === "status" ? (
                    <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  ) : (
                    <span>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Total Records</strong></td>
              <td><strong>{total}</strong></td>
              <td><strong>Active Summary</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default Summary;