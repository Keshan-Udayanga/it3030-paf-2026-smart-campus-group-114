package smart_campus.back_end.tickets.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smart_campus.back_end.auth.model.User;
import smart_campus.back_end.auth.service.UserService;
import smart_campus.back_end.notification.service.NotificationService;
import smart_campus.back_end.tickets.dto.TicketRequestDTO;
import smart_campus.back_end.tickets.dto.TicketResponseDTO;
import smart_campus.back_end.tickets.entity.Ticket;
import smart_campus.back_end.tickets.repository.TicketRepository;
import smart_campus.back_end.tickets.service.TicketService;

import java.util.Optional;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TicketRepository ticketRepository;

    @Override
    public TicketResponseDTO createTicket(TicketRequestDTO ticketRequestDTO, String userId) {
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
        ticket.setCreatedBy(userId);

        Ticket saved = ticketRepository.save(ticket);

        //Notification Implementations
        List<User> managers = userService.getUsersByRole("ROLE_RESOURCE_MANAGER");
        List<User> admins = userService.getUsersByRole("ROLE_ADMIN");

        String message = "New ticket was raised. TicketCode: " + saved.getTicketCode();

        managers.forEach(u ->
                notificationService.createNotification(u.getId(), message, "TICKET")
        );

        admins.forEach(u ->
                notificationService.createNotification(u.getId(), message, "TICKET")
        );

        return mapToResponseDTO(saved);
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

        //Notification purposes
        String oldTechnician = ticket.getAssignedTechnician();
        String oldStatus = ticket.getStatus();

        String technicianID = updatedTicketDTO.getAssignedTechnician();
        User tech = userService.findById(technicianID);
        ticket.setAssignedTechnician(tech.getName());
        
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

        //Notification Implementation
        // 1. Technician assigned
        if (technicianID != null && !technicianID.equals(oldTechnician)) {
            String messageToTech = "You are assigned to TicketCode:" + ticket.getTicketCode();
            notificationService.createNotification(technicianID, messageToTech, "TICKET");

            String messageToUser = "Technician is assigned to TicketCode: " + ticket.getTicketCode();
            notificationService.createNotification(ticket.getCreatedBy(), messageToUser, "TICKET");
        }

        // 2. Status changed
        if (updatedTicketDTO.getStatus() != null &&
                !updatedTicketDTO.getStatus().equals(oldStatus)) {

            String messageToUser = "Status of ticket " + ticket.getTicketCode() + " changed to " + ticket.getStatus();
            notificationService.createNotification(ticket.getCreatedBy(), messageToUser, "TICKET");
        }

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
                ticket.getUpdatedAt(),
                ticket.getCreatedBy()
        );
    }

    @Override
    public List<TicketResponseDTO> getTicketsByUserId(String userId) {
        return ticketRepository.findByCreatedBy(userId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }
}