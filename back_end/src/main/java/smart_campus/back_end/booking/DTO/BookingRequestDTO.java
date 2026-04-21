package smart_campus.back_end.booking.DTO;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class BookingRequestDTO {
    private String resourceId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private int expectedAttendees;
}
