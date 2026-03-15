package smart_campus.back_end.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import smart_campus.back_end.auth.model.User;
import smart_campus.back_end.auth.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public User getUser(@PathVariable String id){
        return userRepository.findById(id).orElseThrow();
    }

    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email){
        return userRepository.findByEmail(email).orElseThrow();
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public User updateRoles(@PathVariable String id, @RequestBody List<String> roles){
        User user = userRepository.findById(id).orElseThrow();

        user.setRoles(roles);

        return userRepository.save(user);
    }
}
