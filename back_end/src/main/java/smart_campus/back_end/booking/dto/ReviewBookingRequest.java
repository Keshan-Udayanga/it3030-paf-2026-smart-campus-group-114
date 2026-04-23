package smart_campus.back_end.booking.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewBookingRequest {

    @NotBlank(message = "Decision is required")
    private String decision; // APPROVED or REJECTED

    private String adminReason;
}