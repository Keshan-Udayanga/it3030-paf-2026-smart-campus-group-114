package smart_campus.back_end.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import smart_campus.back_end.auth.dto.AuthResponse;
import smart_campus.back_end.auth.model.User;
import smart_campus.back_end.auth.service.CustomUserDetails;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> currentUser(Authentication authentication){
        if(authentication == null || !authentication.isAuthenticated()){
            return ResponseEntity.status(401).build();
        }

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = customUserDetails.getUser();

        AuthResponse response = new AuthResponse(
                user.getName(),
                user.getEmail(),
                user.getRoles()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> status(){
        return ResponseEntity.ok(Map.of("status", "authenticated"));
    }
}
