package smart_campus.back_end.auth.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;
    private String email;
    private List<String> roles;
    private String provider;
    private LocalDateTime createdAt;
    private boolean enabled;

    public User(){}

    public User(String name, String email, List<String> roles, String provider){
        this.name = name;
        this.email = email;
        this.roles = roles;
        this.provider = provider;
        this.createdAt = LocalDateTime.now();
        this.enabled = true;
    }
    
    
}
