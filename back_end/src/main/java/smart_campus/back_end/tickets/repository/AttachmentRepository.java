package smart_campus.back_end.tickets.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import smart_campus.back_end.tickets.entity.Attachment;

@Repository
public interface AttachmentRepository extends MongoRepository<Attachment, String> {
}
