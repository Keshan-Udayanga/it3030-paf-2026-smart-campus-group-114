import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentSection from "./CommentSection";
import "./TicketDetails.css";

function TicketDetails() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [duration, setDuration] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchTicket();
    }, [id]);

    useEffect(() => {
        if (!ticket) return;

        const calculateDuration = () => {
            const start = new Date(ticket.createdAt);
            const end = ticket.resolvedAt ? new Date(ticket.resolvedAt) : new Date();
            const diffMs = end - start;

            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

            let durationStr = "";
            if (days > 0) durationStr += `${days}d `;
            durationStr += `${hours}h ${minutes}m ${seconds}s`;
            setDuration(durationStr);
        };

        calculateDuration();
        
        let interval;
        if (!ticket.resolvedAt && ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" && ticket.status !== "REJECTED") {
            interval = setInterval(calculateDuration, 1000);
        }

        return () => clearInterval(interval);
    }, [ticket]);

    const fetchTicket = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/tickets/${id}`);
            setTicket(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching ticket:", err);
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-screen">Loading incident details...</div>;
    if (!ticket) return <div className="error-screen">Ticket not found.</div>;

    const getSLAClass = () => {
        if (ticket.resolvedAt || ticket.status === "RESOLVED") return "sla-resolved";
        const start = new Date(ticket.createdAt);
        const diffHours = (new Date() - start) / (1000 * 60 * 60);
        if (diffHours > 5) return "sla-danger";
        if (diffHours > 2) return "sla-warning";
        return "sla-normal";
    };

    return (
        <div className="ticket-details-container">
            <div className="header-wrapper">
                <h1>Incident Ticket Details</h1>
                <div className="header-actions">
                    <button className="back-btn-pill" onClick={() => navigate("/tickets")}>
                        ← Back To My Tickets
                    </button>
                    <button className="create-btn-pill" onClick={() => navigate("/tickets/create")}>
                        + Create Another
                    </button>
                </div>
            </div>

            <div className="details-card-main">
                {/* SLA Timer Top Bar */}
                <div className={`sla-top-bar ${getSLAClass()}`}>
                    <div className="sla-info">
                        <span className="sla-icon">⏱️</span>
                        <span className="sla-label">SLA TIMER:</span>
                        <span className="sla-time">{duration}</span>
                    </div>
                    <div className="sla-status-badge">
                        {ticket.resolvedAt ? "TICKET RESOLVED" : "LIVE TRACKING"}
                    </div>
                </div>

                <div className="card-header-row">
                    <div className="id-section">
                        <span className="id-label">TICKET ID</span>
                        <h2 className="ticket-id-text">{ticket.ticketCode}</h2>
                    </div>
                    <div className="badge-row">
                        <span className={`status-pill-solid ${ticket.status}`}>
                            {ticket.status}
                        </span>
                        <span className={`priority-pill-solid ${ticket.priority}`}>
                            {ticket.priority}
                        </span>
                    </div>
                </div>

                <div className="info-grid">
                    <div className="info-box">
                        <label>CATEGORY</label>
                        <p>{ticket.category}</p>
                    </div>
                    <div className="info-box">
                        <label>LOCATION</label>
                        <p>{ticket.location}</p>
                    </div>
                    <div className="info-box">
                        <label>RESOURCE</label>
                        <p>{ticket.resourceName || "N/A"}</p>
                    </div>
                    <div className="info-box">
                        <label>CREATED AT</label>
                        <p>{new Date(ticket.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="info-box">
                        <label>PREFERRED CONTACT</label>
                        <div className="contact-details">
                            <p className="contact-name">{ticket.preferredContactName}</p>
                            <p className="sub-text">{ticket.preferredContactEmail}</p>
                            <p className="sub-text">{ticket.preferredContactPhone}</p>
                        </div>
                    </div>
                    <div className="info-box">
                        <label>ASSIGNED TECHNICIAN</label>
                        <p className={ticket.assignedTechnician ? "tech-name" : "no-tech"}>
                            {ticket.assignedTechnician || "Not assigned yet"}
                        </p>
                    </div>
                    <div className="info-box full-width">
                        <label>DESCRIPTION</label>
                        <p className="desc-content">{ticket.description}</p>
                    </div>

                    {ticket.resolutionNotes && (
                        <div className="info-box full-width resolution-notes">
                            <label>RESOLUTION NOTES</label>
                            <p>{ticket.resolutionNotes}</p>
                        </div>
                    )}

                    {ticket.status === "REJECTED" && (
                        <div className="info-box full-width rejected-reason">
                            <label>REJECTION REASON</label>
                            <p>{ticket.rejectionReason}</p>
                        </div>
                    )}
                </div>

                {ticket.attachmentIds && ticket.attachmentIds.length > 0 && (
                    <div className="attachments-footer">
                        <label>ATTACHMENTS</label>
                        <div className="attachment-chips">
                            {ticket.attachmentIds.map((aid, i) => (
                                <a 
                                    key={aid} 
                                    href={`http://localhost:8080/api/v1/tickets/attachments/${aid}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="attachment-chip"
                                >
                                    📎 View Attachment {i + 1}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="comments-section-wrapper">
                <CommentSection ticketId={id} />
            </div>
        </div>
    );
}

export default TicketDetails;
