package smart_campus.back_end.notification.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smart_campus.back_end.notification.model.NotificationPreference;
import smart_campus.back_end.notification.repository.NotificationPreferenceRepository;

@Service
public class NotificationPreferenceService {

    @Autowired
    private NotificationPreferenceRepository repo;

    public NotificationPreference getOrCreate(String userId) {
        return repo.findByUserId(userId)
                .orElseGet(() -> {
                    NotificationPreference pref = new NotificationPreference();
                    pref.setUserId(userId);
                    pref.setBookingEnabled(true);
                    pref.setTicketEnabled(true);
                    pref.setCommentEnabled(true);
                    pref.setRoleChangedEnabled(true);
                    return repo.save(pref);
                });
    }

    public NotificationPreference update(String userId, NotificationPreference updated) {
        NotificationPreference pref = getOrCreate(userId);

        pref.setBookingEnabled(updated.isBookingEnabled());
        pref.setTicketEnabled(updated.isTicketEnabled());
        pref.setCommentEnabled(updated.isCommentEnabled());
        pref.setRoleChangedEnabled(updated.isRoleChangedEnabled());

        return repo.save(pref);
    }
}
