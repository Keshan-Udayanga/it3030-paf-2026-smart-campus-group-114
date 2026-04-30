package smart_campus.back_end.tickets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponseDTO {
    private String id;
    private String ticketCode;
    private String title;
    private String description;
    private String category;
    private String priority;
    private String location;
    private String resourceName;
    private String preferredContactName;
    private String preferredContactEmail;
    private String preferredContactPhone;
    private String status;
    private String assignedTechnician;
    private String resolutionNotes;
    private String rejectionReason;
    private LocalDateTime resolvedAt;
    private List<String> attachmentIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
}
