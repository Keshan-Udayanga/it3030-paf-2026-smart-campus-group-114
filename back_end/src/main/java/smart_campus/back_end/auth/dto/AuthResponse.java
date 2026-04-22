package smart_campus.back_end.auth.dto;

import org.springframework.hateoas.RepresentationModel;

import java.util.List;

public class AuthResponse extends RepresentationModel<AuthResponse> {
    private String name;
    private String email;
    private List<String> roles;

    public AuthResponse(String name, String email, List<String> roles) {
        this.name = name;
        this.email = email;
        this.roles = roles;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
