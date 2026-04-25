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

    const [filter, setFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = () => {
        axios.get("http://localhost:8080/api/v1/tickets")
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
    };

    const handleUpdate = async () => {
        try {
            await axios.put(
                `http://localhost:8080/api/v1/tickets/${selectedTicket.id}`,
                {
                    assignedTechnician: technician,
                    status: status,
                    resolutionNotes: notes
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
                await axios.delete(`http://localhost:8080/api/v1/tickets/${id}`);
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

    const filteredTickets = tickets.filter(t => {
        const matchFilter = filter ? t.status === filter : true;
        const titleMatch = t.title ? t.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const categoryMatch = t.category ? t.category.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const matchSearch = titleMatch || categoryMatch;
        return matchFilter && matchSearch;
    });

    return (
        <div className="ticket-list-container">
            <h2>Admin Dashboard</h2>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Total Tickets</h3>
                    <p>{total}</p>
                </div>
                <div className="stat-card open">
                    <h3>Open</h3>
                    <p>{open}</p>
                </div>
                <div className="stat-card progress">
                    <h3>In Progress</h3>
                    <p>{inProgress}</p>
                </div>
                <div className="stat-card closed">
                    <h3>Closed</h3>
                    <p>{closed}</p>
                </div>
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
                    <option value="CLOSED">CLOSED</option>
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
                            <td>{t.status}</td>
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
                        <h3>Assign Technician</h3>

                        <input
                            placeholder="Technician Name"
                            value={technician}
                            onChange={(e) => setTechnician(e.target.value)}
                        />

                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">Select Status</option>
                            <option value="OPEN">OPEN</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="CLOSED">CLOSED</option>
                        </select>

                        <textarea
                            placeholder="Resolution Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />

                        <button onClick={handleUpdate}>Update</button>
                        
                        <CommentSection ticketId={selectedTicket.id} />

                        <button className="cancel-btn" onClick={() => setSelectedTicket(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TicketList;