package smart_campus.back_end.auth.dto;

import java.util.List;

public record UserResponse(
        String name,
        String email,
        List<String> roles
) {
}
