package smart_campus.back_end.tickets.service;

import smart_campus.back_end.tickets.dto.TicketRequestDTO;
import smart_campus.back_end.tickets.entity.Ticket;
import java.util.List;

public interface TicketService {

    Ticket createTicket(TicketRequestDTO ticketRequestDTO);

    List<Ticket> getAllTickets();

    Ticket updateTicket(String id, Ticket updatedTicket);

    void deleteTicket(String id);
}

