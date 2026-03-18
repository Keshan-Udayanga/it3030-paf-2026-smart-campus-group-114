package smart_campus.back_end.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import smart_campus.back_end.auth.dto.UpdateUserRolesRequest;
import smart_campus.back_end.auth.dto.UserResponse;
import smart_campus.back_end.auth.mapper.UserMapper;
import smart_campus.back_end.auth.model.User;
import smart_campus.back_end.auth.service.UserService;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    private final UserMapper userMapper;

    public UserController(UserMapper userMapper, UserService userService){
        this.userMapper = userMapper;
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> userList = userService.findAll();
        return ResponseEntity.ok(userMapper.toUserResponse(userList));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
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
        User user = userService.findByEmail(email);
        UserResponse response = userMapper.toUserResponse(user);

        response.add(linkTo(methodOn(UserController.class)
                .getUserByEmail(email)).withSelfRel());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UserResponse> updateRoles(@PathVariable String id, @RequestBody UpdateUserRolesRequest request){
        User user = userService.findById(id);

        user.setRoles(request.roles());

        userService.saveUser(user);
        UserResponse response = userMapper.toUserResponse(user);

        response.add(linkTo(methodOn(UserController.class)
                .getUser(id)).withSelfRel());
        return ResponseEntity.ok(response);
    }
}
