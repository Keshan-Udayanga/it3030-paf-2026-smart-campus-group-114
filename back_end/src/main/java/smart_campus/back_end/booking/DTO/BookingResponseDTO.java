package smart_campus.back_end.booking.DTO;

import smart_campus.back_end.booking.model.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponseDTO {
    private String id;
    private String resourceId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private int expectedAttendees;
    private BookingStatus status;
    private String adminReason;
}
