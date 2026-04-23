import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TicketList.css";

function TicketList() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/v1/tickets")
            .then((res) => {
                setTickets(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <div className="ticket-list-container">
            <h2>All Tickets (Admin)</h2>

            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Contact</th>
                    </tr>
                </thead>

                <tbody>
                    {tickets.map((t) => (
                        <tr key={t.id}>
                            <td>{t.ticketCode}</td>
                            <td>{t.title}</td>
                            <td>{t.category}</td>
                            <td>{t.priority}</td>
                            <td>{t.status}</td>
                            <td>{t.preferredContactName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TicketList;