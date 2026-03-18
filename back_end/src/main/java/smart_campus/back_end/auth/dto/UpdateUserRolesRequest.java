package smart_campus.back_end.auth.dto;

import java.util.List;

public record UpdateUserRolesRequest(List<String> roles) {
}
