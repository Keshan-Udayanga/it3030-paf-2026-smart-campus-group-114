package smart_campus.back_end.tickets.service;

import smart_campus.back_end.tickets.dto.TicketRequestDTO;
import smart_campus.back_end.tickets.dto.TicketResponseDTO;
import java.util.List;

public interface TicketService {

    TicketResponseDTO createTicket(TicketRequestDTO ticketRequestDTO, String userId);

    List<TicketResponseDTO> getAllTickets();

    TicketResponseDTO getTicketById(String id);

    TicketResponseDTO updateTicket(String id, TicketResponseDTO updatedTicketDTO);

    void deleteTicket(String id);

    List<TicketResponseDTO> getTicketsByUserId(String userId);
}

