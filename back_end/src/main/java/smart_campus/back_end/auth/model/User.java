package smart_campus.back_end.auth.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;
    private String email;
    private List<String> roles;
    private String provider;
    private LocalDateTime createdAt;

    public User(){}

    public User(String name, String email, List<String> roles, String provider){
        this.name = name;
        this.email = email;
        this.roles = roles;
        this.provider = provider;
        this.createdAt = LocalDateTime.now();
    }

    public String getId(){
        return this.id;
    }
    public void setId(String id){
        this.id = id;
    }

    public String getName(){
        return this.name;
    }
    public void setName(String name){
        this.name = name;
    }

    public String getEmail(){
        return this.email;
    }
    public void setEmail(String email){
        this.email = email;
    }

    public List<String> getRoles() { 
        return roles; }
    public void setRoles(List<String> roles) { 
        this.roles = roles; }

    public String getProvider() { 
        return provider; }
    public void setProvider(String provider) { 
        this.provider = provider; }

    public LocalDateTime getCreatedAt() { 
        return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { 
        this.createdAt = createdAt; }
    
    
}
