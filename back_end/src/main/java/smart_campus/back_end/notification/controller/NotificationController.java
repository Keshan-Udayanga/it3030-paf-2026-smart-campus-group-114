package smart_campus.back_end.notification.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import smart_campus.back_end.auth.service.CustomUserDetails;
import smart_campus.back_end.notification.dto.NotificationResponse;
import smart_campus.back_end.notification.mapper.NotificationMapper;
import smart_campus.back_end.notification.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service){
        this.service = service;
    }

    //Get notifications for logged in user
    @GetMapping
    public List<NotificationResponse> getMyNotifications(@AuthenticationPrincipal CustomUserDetails userDetails){
        String userId = userDetails.getUser().getId();

        return service.getUserNotifications(userId)
                .stream()
                .map(NotificationMapper::toResponse)
                .toList();
    }

    //Mark as Read
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String id) {
        service.markAsRead(id);
        return ResponseEntity.noContent().build(); // 204
    }

    //Get unread count
    @GetMapping("/unread-count")
    public long getUnreadCount(@AuthenticationPrincipal CustomUserDetails userDetails){
        return service.getUnreadCount(userDetails.getUser().getId());
    }
}
