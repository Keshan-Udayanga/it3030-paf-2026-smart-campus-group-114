package smart_campus.back_end.tickets.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketRequestDTO {
    
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters long")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Priority is required")
    private String priority;

    @NotBlank(message = "Location is required")
    private String location;

    private String resourceName;

    @NotBlank(message = "Contact name is required")
    private String preferredContactName;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Invalid email format")
    private String preferredContactEmail;

    @NotBlank(message = "Contact phone is required")
    private String preferredContactPhone;
}
