package smart_campus.back_end.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import smart_campus.back_end.auth.dto.UpdateUserRolesRequest;
import smart_campus.back_end.auth.dto.UserResponse;
import smart_campus.back_end.auth.mapper.UserMapper;
import smart_campus.back_end.auth.model.User;
import smart_campus.back_end.auth.service.UserService;
import smart_campus.back_end.notification.service.NotificationService;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    private final NotificationService notificationService;

    private final UserMapper userMapper;

    public UserController(UserMapper userMapper, UserService userService, NotificationService notificationService){
        this.userMapper = userMapper;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> userList = userService.findAll();
        return ResponseEntity.ok(userMapper.toUserResponse(userList));
    }

    @GetMapping("/technicians")
    public ResponseEntity<List<UserResponse>> getTechnicians() {
        List<User> technicians = userService.getUsersByRole("ROLE_TECHNICIAN");
        return ResponseEntity.ok(userMapper.toUserResponse(technicians));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String id){
        User user = userService.findById(id);
        UserResponse response = userMapper.toUserResponse(user);
        response.add(linkTo(methodOn(UserController.class).getUser(id)).withSelfRel());

        response.add(linkTo(methodOn(UserController.class)
                    .updateRoles(id, null)).withRel("updateRoles"));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email){
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        UserResponse response = userMapper.toUserResponse(user);

        response.add(linkTo(methodOn(UserController.class)
                .getUserByEmail(email)).withSelfRel());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/roles")
    public ResponseEntity<UserResponse> updateRoles(@PathVariable String id, @RequestBody UpdateUserRolesRequest request){
        User user = userService.findById(id);

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found"
            );
        }

        if (request.roles() == null || request.roles().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Roles cannot be empty"
            );
        }

        user.setRoles(request.roles());

        userService.saveUser(user);

        //Notification
        notificationService.createNotification(
                user.getId(),
                "Your role has been updated to " + request.roles(),
                "ROLE_UPDATE"
        );

        UserResponse response = userMapper.toUserResponse(user);

        response.add(linkTo(methodOn(UserController.class)
                .getUser(id)).withSelfRel());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getUserCount(){
        return ResponseEntity.ok(userService.countUsers());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        User user = userService.findById(id);

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found"
            );
        }

        // Prevent deleting admins (important safeguard)
        if (user.getRoles().contains("ROLE_ADMIN")) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Cannot delete admin users"
            );
        }

        userService.deleteUser(id);
        return ResponseEntity.noContent().build(); // 204
    }

    @PutMapping("/{id}/disable")
    public ResponseEntity<Void> disableUser(@PathVariable String id) {
        User user = userService.findById(id);

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found"
            );
        }

        user.setEnabled(false);
        userService.saveUser(user);

        return ResponseEntity.noContent().build(); // 204
    }

    @PutMapping("/{id}/enable")
    public ResponseEntity<Void> enableUser(@PathVariable String id) {
        User user = userService.findById(id);

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found"
            );
        }

        user.setEnabled(true);
        userService.saveUser(user);

        return ResponseEntity.noContent().build(); // 204
    }
}
