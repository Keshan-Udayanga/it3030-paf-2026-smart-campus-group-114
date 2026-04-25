package smart_campus.back_end.booking.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewBookingRequest {
        private String decision;
        private String adminReason;
    }
