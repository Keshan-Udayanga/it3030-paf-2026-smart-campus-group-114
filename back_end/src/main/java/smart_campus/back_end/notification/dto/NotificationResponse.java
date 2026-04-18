package smart_campus.back_end.notification.dto;


import java.time.LocalDateTime;

public record NotificationResponse(String id,
                                   String message,
                                   String type,
                                   boolean isRead,
                                   LocalDateTime createdAt
) { }
