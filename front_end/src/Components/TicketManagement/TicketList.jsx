import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TicketList.css";
import CommentSection from "./CommentSection";

function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [technician, setTechnician] = useState("");
    const [status, setStatus] = useState("");
    const [notes, setNotes] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");

    const [filter, setFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all"); // "all", "unassigned", "assigned"

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = () => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:8080/api/v1/tickets", {
                headers: { Authorization: `Bearer ${token}` }
                })
            .then((res) => {
                setTickets(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleEdit = (ticket) => {
        setSelectedTicket(ticket);
        setTechnician(ticket.assignedTechnician || "");
        setStatus(ticket.status || "");
        setNotes(ticket.resolutionNotes || "");
        setRejectionReason(ticket.rejectionReason || "");
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:8080/api/v1/tickets/${selectedTicket.id}`,
                {
                    assignedTechnician: technician,
                    status: status,
                    resolutionNotes: notes,
                    rejectionReason: rejectionReason
                }, {
                headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert("Ticket Updated!");
            setSelectedTicket(null);
            fetchTickets();

        } catch (error) {
            console.error(error);
            alert("Update failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this ticket?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://localhost:8080/api/v1/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
                });
                alert("Ticket Deleted!");
                fetchTickets();
            } catch (error) {
                console.error(error);
                alert("Delete failed");
            }
        }
    };

    const total = tickets.length;
    const open = tickets.filter(t => t.status === "OPEN").length;
    const inProgress = tickets.filter(t => t.status === "IN_PROGRESS").length;
    const closed = tickets.filter(t => t.status === "CLOSED").length;
    const resolved = tickets.filter(t => t.status === "RESOLVED").length;
    const rejected = tickets.filter(t => t.status === "REJECTED").length;

    const filteredTickets = tickets.filter(t => {
        const matchFilter = filter ? t.status === filter : true;
        const matchSearch = (t.title ? t.title.toLowerCase().includes(searchTerm.toLowerCase()) : false) || 
                           (t.ticketCode ? t.ticketCode.toLowerCase().includes(searchTerm.toLowerCase()) : false);
        
        const isAssigned = t.assignedTechnician && t.assignedTechnician.trim() !== "";
        const matchTab = activeTab === "all" ? true : 
                         activeTab === "assigned" ? isAssigned : !isAssigned;

        return matchFilter && matchSearch && matchTab;
    });

    return (
        <div className="ticket-list-container">
            <div className="dashboard-header">
                <h2>Admin Dashboard</h2>
                <p className="subtitle">Real-time overview of smart campus support tickets</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="card-info">
                        <h3>Total Tickets</h3>
                        <p className="card-desc">All time raised</p>
                    </div>
                    <p className="card-value">{total}</p>
                </div>
                <div className="stat-card open">
                    <div className="card-info">
                        <h3>Open</h3>
                        <p className="card-desc">Awaiting action</p>
                    </div>
                    <p className="card-value">{open}</p>
                </div>
                <div className="stat-card progress">
                    <div className="card-info">
                        <h3>In Progress</h3>
                        <p className="card-desc">Being handled</p>
                    </div>
                    <p className="card-value">{inProgress}</p>
                </div>
                <div className="stat-card resolved">
                    <div className="card-info">
                        <h3>Resolved</h3>
                        <p className="card-desc">Fix confirmed</p>
                    </div>
                    <p className="card-value">{resolved}</p>
                </div>
                <div className="stat-card closed">
                    <div className="card-info">
                        <h3>Closed</h3>
                        <p className="card-desc">Archived tickets</p>
                    </div>
                    <p className="card-value">{closed}</p>
                </div>
                <div className="stat-card rejected">
                    <div className="card-info">
                        <h3>Rejected</h3>
                        <p className="card-desc">Invalid issues</p>
                    </div>
                    <p className="card-value">{rejected}</p>
                </div>
            </div>

            <div className="dashboard-tabs">
                <button 
                    className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
                    onClick={() => setActiveTab("all")}
                >
                    All Tickets <span>({tickets.length})</span>
                </button>
                <button 
                    className={`tab-btn ${activeTab === "unassigned" ? "active" : ""}`}
                    onClick={() => setActiveTab("unassigned")}
                >
                    Unassigned <span>({tickets.filter(t => !t.assignedTechnician).length})</span>
                </button>
                <button 
                    className={`tab-btn ${activeTab === "assigned" ? "active" : ""}`}
                    onClick={() => setActiveTab("assigned")}
                >
                    Assigned <span>({tickets.filter(t => t.assignedTechnician).length})</span>
                </button>
            </div>

            <div className="controls">
                <input 
                    type="text" 
                    placeholder="Search by Title or Category..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Statuses</option>
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="REJECTED">REJECTED</option>
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Contact</th>
                        <th>Attachments</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredTickets.map((t) => (
                        <tr key={t.id}>
                            <td>{t.ticketCode}</td>
                            <td>{t.title}</td>
                            <td>{t.category}</td>
                            <td>{t.priority}</td>
                            <td>
                                <span className={`status-badge ${t.status}`}>
                                    {t.status}
                                </span>
                            </td>
                            <td>{t.preferredContactName}</td>
                            <td className="attachment-links">
                                {t.attachmentIds && t.attachmentIds.length > 0
                                    ? t.attachmentIds.map((aid, i) => (
                                        <a
                                            key={aid}
                                            href={`http://localhost:8080/api/v1/tickets/attachments/${aid}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="attachment-link"
                                        >
                                            📎 File {i + 1}
                                        </a>
                                    ))
                                    : <span className="no-attachment">—</span>
                                }
                            </td>
                            <td className="action-buttons">
                                <button onClick={() => handleEdit(t)} className="assign-btn">Assign</button>
                                <button onClick={() => handleDelete(t.id)} className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedTicket && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Update Ticket Status & Assignment</h3>
                        
                        <div className="popup-field">
                            <label>Assigned Technician</label>
                            <input 
                                placeholder="Enter Technician Name" 
                                value={technician} 
                                onChange={(e) => setTechnician(e.target.value)} 
                            />
                        </div>

                        <div className="popup-field">
                            <label>Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">Select Status</option>
                                <option value="OPEN">OPEN</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="RESOLVED">RESOLVED</option>
                                <option value="CLOSED">CLOSED</option>
                                <option value="REJECTED">REJECTED</option>
                            </select>
                        </div>

                        {status === "REJECTED" && (
                            <div className="popup-field">
                                <label>Rejection Reason</label>
                                <textarea
                                    placeholder="Explain why the ticket is rejected"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="popup-field">
                            <label>Resolution Notes</label>
                            <textarea
                                placeholder="Add notes about the work done or solution"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <div className="popup-actions">
                            <button className="update-btn" onClick={handleUpdate}>Update Ticket</button>
                            <button className="cancel-btn" onClick={() => setSelectedTicket(null)}>Cancel</button>
                        </div>

                        <CommentSection ticketId={selectedTicket.id} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default TicketList;