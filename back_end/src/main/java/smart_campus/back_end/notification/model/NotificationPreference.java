package smart_campus.back_end.notification.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "notification_preferences")
public class NotificationPreference {
    @Id
    private String id;

    private String userId;

    private boolean bookingEnabled;
    private boolean ticketEnabled;
    private boolean commentEnabled;
    private boolean roleChangedEnabled;
}
