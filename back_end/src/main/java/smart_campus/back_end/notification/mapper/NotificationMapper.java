package smart_campus.back_end.notification.mapper;

import smart_campus.back_end.notification.dto.NotificationResponse;
import smart_campus.back_end.notification.model.Notification;

public class NotificationMapper {
    public static NotificationResponse toResponse(Notification n){
        return new NotificationResponse(
                n.getId(),
                n.getMessage(),
                n.getType(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}
