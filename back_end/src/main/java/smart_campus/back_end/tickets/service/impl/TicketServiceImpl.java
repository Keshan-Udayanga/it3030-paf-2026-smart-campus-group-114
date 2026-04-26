package smart_campus.back_end.tickets.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smart_campus.back_end.tickets.dto.TicketRequestDTO;
import smart_campus.back_end.tickets.dto.TicketResponseDTO;
import smart_campus.back_end.tickets.entity.Ticket;
import smart_campus.back_end.tickets.repository.TicketRepository;
import smart_campus.back_end.tickets.service.TicketService;

import java.util.UUID;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Override
    public TicketResponseDTO createTicket(TicketRequestDTO ticketRequestDTO) {
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

        return mapToResponseDTO(ticketRepository.save(ticket));
    }

    @Override
    public List<TicketResponseDTO> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtAsc()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TicketResponseDTO getTicketById(String id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        return mapToResponseDTO(ticket);
    }

    @Override
    public TicketResponseDTO updateTicket(String id, TicketResponseDTO updatedTicketDTO) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setAssignedTechnician(updatedTicketDTO.getAssignedTechnician());
        
        // SLA: Set resolvedAt if status changes to RESOLVED
        if ("RESOLVED".equals(updatedTicketDTO.getStatus()) && !"RESOLVED".equals(ticket.getStatus())) {
            ticket.setResolvedAt(LocalDateTime.now());
        } else if (!"RESOLVED".equals(updatedTicketDTO.getStatus())) {
            ticket.setResolvedAt(null); // Clear if moved back from resolved
        }

        ticket.setStatus(updatedTicketDTO.getStatus());
        ticket.setResolutionNotes(updatedTicketDTO.getResolutionNotes());
        ticket.setRejectionReason(updatedTicketDTO.getRejectionReason());
        ticket.setUpdatedAt(LocalDateTime.now());

        return mapToResponseDTO(ticketRepository.save(ticket));
    }

    @Override
    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }

    private TicketResponseDTO mapToResponseDTO(Ticket ticket) {
        return new TicketResponseDTO(
                ticket.getId(),
                ticket.getTicketCode(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getLocation(),
                ticket.getResourceName(),
                ticket.getPreferredContactName(),
                ticket.getPreferredContactEmail(),
                ticket.getPreferredContactPhone(),
                ticket.getStatus(),
                ticket.getAssignedTechnician(),
                ticket.getResolutionNotes(),
                ticket.getRejectionReason(),
                ticket.getResolvedAt(),
                ticket.getAttachmentIds(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }
}