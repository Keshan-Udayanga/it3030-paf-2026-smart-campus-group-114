package smart_campus.back_end.resources.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import smart_campus.back_end.resources.model.Resource;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
}
