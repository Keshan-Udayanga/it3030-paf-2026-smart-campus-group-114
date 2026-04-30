package smart_campus.back_end.tickets.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import smart_campus.back_end.tickets.entity.Ticket;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findAllByOrderByCreatedAtAsc();
    List<Ticket> findByCreatedBy(String createdBy);
}