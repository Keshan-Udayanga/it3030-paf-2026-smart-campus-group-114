package smart_campus.back_end.tickets.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smart_campus.back_end.tickets.dto.TicketRequestDTO;
import smart_campus.back_end.tickets.entity.Ticket;
import smart_campus.back_end.tickets.repository.TicketRepository;
import smart_campus.back_end.tickets.service.TicketService;

import java.util.UUID;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Override
    public Ticket createTicket(TicketRequestDTO ticketRequestDTO) {

        Ticket ticket = new Ticket();

        ticket.setTicketCode("TKT-" + UUID.randomUUID().toString().substring(0, 8));
        ticket.setTitle(ticketRequestDTO.getTitle());
        ticket.setDescription(ticketRequestDTO.getDescription());
        ticket.setCategory(ticketRequestDTO.getCategory());
        ticket.setPriority(ticketRequestDTO.getPriority());
        ticket.setLocation(ticketRequestDTO.getLocation());
        ticket.setResourceName(ticketRequestDTO.getResourceName());
        ticket.setPreferredContactName(ticketRequestDTO.getPreferredContactName());
        ticket.setPreferredContactEmail(ticketRequestDTO.getPreferredContactEmail());
        ticket.setPreferredContactPhone(ticketRequestDTO.getPreferredContactPhone());
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    @Override
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Override
    public Ticket updateTicket(String id, Ticket updatedTicket) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setAssignedTechnician(updatedTicket.getAssignedTechnician());
        ticket.setStatus(updatedTicket.getStatus());
        ticket.setResolutionNotes(updatedTicket.getResolutionNotes());
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    @Override
    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }
}