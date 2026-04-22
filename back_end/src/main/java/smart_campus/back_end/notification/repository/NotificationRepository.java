package smart_campus.back_end.notification.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import smart_campus.back_end.notification.model.Notification;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    long countByUserIdAndIsReadFalse(String userId);
}
