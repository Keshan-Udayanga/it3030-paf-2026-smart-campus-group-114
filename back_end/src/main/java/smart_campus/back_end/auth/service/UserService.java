package smart_campus.back_end.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smart_campus.back_end.auth.model.User;
import smart_campus.back_end.auth.repository.UserRepository;
import java.util.List;
import java.util.Optional;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public User findById(String id){
        return userRepository.findById(id).orElseThrow();
    }

    public User saveUser(User user){
        return userRepository.save(user);
    }

    public List<User> findAll(){
        return userRepository.findAll();
    }

    public long countUsers(){
        return userRepository.count();
    }

    public void deleteUser(String id) {

        userRepository.deleteById(id);
    }

    public List<User> getUsersByRole(String technician) {
        return userRepository.findByRolesContaining(technician);
    }
}
