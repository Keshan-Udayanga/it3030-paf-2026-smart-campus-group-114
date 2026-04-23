package smart_campus.back_end.notification.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import smart_campus.back_end.notification.model.NotificationPreference;

import java.util.Optional;

public interface NotificationPreferenceRepository extends MongoRepository<NotificationPreference, String> {

    Optional<NotificationPreference> findByUserId(String userId);
}
