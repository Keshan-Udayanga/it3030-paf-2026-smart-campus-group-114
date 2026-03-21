package smart_campus.back_end.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import smart_campus.back_end.auth.dto.AuthResponse;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> currentUser(@AuthenticationPrincipal OAuth2User user){
        if(user == null){
            return ResponseEntity.status(401).build();
        }
        System.out.println("/me triggered");
        List<String> roles = user.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .toList();

        AuthResponse response = new AuthResponse(
                user.getAttribute("email"),
                user.getAttribute("name"),
                roles
        );

        response.add(linkTo(methodOn(AuthController.class).currentUser(user)).withSelfRel());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> status(){
        return ResponseEntity.ok(Map.of("status", "authenticated"));
    }
}
