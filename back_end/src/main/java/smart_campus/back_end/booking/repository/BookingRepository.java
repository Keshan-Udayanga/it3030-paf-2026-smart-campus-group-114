package smart_campus.back_end.booking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import smart_campus.back_end.booking.model.Booking;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findByResourceIdAndBookingDate(String resourceId, LocalDate bookingDate);
}