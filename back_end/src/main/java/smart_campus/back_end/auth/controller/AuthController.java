package smart_campus.back_end.auth.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @GetMapping("/me")
    public Map<String, Object> currentUser(@AuthenticationPrincipal OAuth2User user){
        Map<String, Object> response = new HashMap<>();

        response.put("email", user.getAttribute("email"));
        response.put("name", user.getAttribute("name"));
        response.put("roles", user.getAuthorities());

        return response;
    }

    @GetMapping("/status")
    public Map<String, Object> status(){
        return Map.of("status", "authenticated");
    }
}
