package smart_campus.back_end.auth.dto;

import lombok.Data;
import org.springframework.hateoas.RepresentationModel;

import java.util.List;

@Data
public class UserResponse extends RepresentationModel<UserResponse> {
    private String id;
    private String name;
    private String email;
    private List<String> roles;
    private boolean enabled;

}
