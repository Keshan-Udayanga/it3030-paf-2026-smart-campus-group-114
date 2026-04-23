package smart_campus.back_end.auth.repository;


import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import smart_campus.back_end.auth.model.User;

public interface UserRepository extends MongoRepository<User, String>{
    Optional<User> findByEmail(String email);
}
