package smart_campus.back_end.notification.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import smart_campus.back_end.notification.model.Notification;
import smart_campus.back_end.notification.model.NotificationPreference;
import smart_campus.back_end.notification.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private final NotificationRepository repository;

    @Autowired
    private NotificationPreferenceService preferenceService;

    public NotificationService(NotificationRepository repository){
        this.repository = repository;
    }

    public List<Notification> getUserNotifications(String userId){
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void createNotification(String userId, String message, String type){

        NotificationPreference pref = preferenceService.getOrCreate(userId);

        if (type.equals("BOOKING") && !pref.isBookingEnabled()) return;
        if (type.equals("TICKET") && !pref.isTicketEnabled()) return;
        if (type.equals("COMMENT") && !pref.isCommentEnabled()) return;
        if (type.equals("ROLE_UPDATE") && !pref.isRoleChangedEnabled()) return;

        Notification notification = Notification.builder()
                .userId(userId)
                .message(message)
                .type(type)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        repository.save(notification);
    }

    public void markAsRead(String id) {
        Notification notification = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Notification not found"));

        notification.setRead(true);
        repository.save(notification);
    }

    public long getUnreadCount(String userId) {
        return repository.countByUserIdAndIsReadFalse(userId);
    }
}
