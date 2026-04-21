package smart_campus.back_end.booking.model;
import smart_campus.back_end.booking.model.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "booking")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class booking {
    @Id
    private String id;

    private String resourceId;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private String purpose;

    private int expectedAttendees;

    private BookingStatus status; // PENDING, APPROVED, REJECTED, CANCELLED

    private String adminReason; // approval/rejection reason
}
