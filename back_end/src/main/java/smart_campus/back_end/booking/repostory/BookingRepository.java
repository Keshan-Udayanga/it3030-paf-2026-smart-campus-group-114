package smart_campus.back_end.booking.repostory;

import smart_campus.back_end.booking.model.booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
public interface BookingRepository extends MongoRepository<booking, String> {

    List<booking> findByResourceId(String resourceId);

    // used for conflict checking
    List<booking> findByResourceIdAndStatusIn(
            String resourceId,
            List<String> status
    );
}
