package smart_campus.back_end.auth;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class backendcontrl {
    @GetMapping("/test")
    public String test() {
        return "Backend is running!";
    }
}
