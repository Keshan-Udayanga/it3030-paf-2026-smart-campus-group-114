package smart_campus.back_end.tickets.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private String id;

    @NotBlank(message = "Ticket ID is required")
    private String ticketId;

    @NotBlank(message = "Author name is required")
    private String authorName;

    @NotBlank(message = "Author email is required")
    @Email(message = "Invalid email format")
    private String authorEmail;

    @NotBlank(message = "Comment content is required")
    private String content;

    private LocalDateTime createdAt;
}
