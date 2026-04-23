package smart_campus.back_end.booking.dto;

import lombok.Builder;
import lombok.Data;
import smart_campus.back_end.booking.model.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class BookingResponse {

    private String id;
    private String resourceId;
    private String userId;

    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private String purpose;
    private Integer expectedAttendees;

    private BookingStatus status;
    private String adminReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}