package smart_campus.back_end.tickets.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import smart_campus.back_end.tickets.entity.Comment;
import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByTicketIdOrderByCreatedAtDesc(String ticketId);
}
