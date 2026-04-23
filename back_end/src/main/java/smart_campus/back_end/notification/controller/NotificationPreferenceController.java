package smart_campus.back_end.notification.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import smart_campus.back_end.auth.service.CustomUserDetails;
import smart_campus.back_end.notification.model.NotificationPreference;
import smart_campus.back_end.notification.service.NotificationPreferenceService;

@RestController
@RequestMapping("/api/v1/notifications/preferences")
public class NotificationPreferenceController {
    @Autowired
    private NotificationPreferenceService service;

    @GetMapping
    public NotificationPreference getPreferences(@AuthenticationPrincipal CustomUserDetails userDetails){
        String userId = userDetails.getUser().getId();
        return service.getOrCreate(userId);
    }

    @PutMapping
    public NotificationPreference updatePreferences(
            @RequestBody NotificationPreference updated,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        String userId = userDetails.getUser().getId();
        return service.update(userId, updated);
    }

}
