package smart_campus.back_end.resources.repository;


import smart_campus.back_end.resources.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    // custom queries can be added later
}