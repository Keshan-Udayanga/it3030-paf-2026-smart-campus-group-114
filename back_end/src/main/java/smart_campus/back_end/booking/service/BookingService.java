package smart_campus.back_end.booking.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smart_campus.back_end.booking.dto.BookingResponse;
import smart_campus.back_end.booking.dto.CreateBookingRequest;
import smart_campus.back_end.booking.dto.ReviewBookingRequest;
import smart_campus.back_end.booking.exception.BadRequestException;
import smart_campus.back_end.booking.exception.ConflictException;
import smart_campus.back_end.booking.exception.ResourceNotFoundException;
import smart_campus.back_end.booking.mapper.BookingMapper;
import smart_campus.back_end.booking.model.Booking;
import smart_campus.back_end.booking.model.BookingStatus;
import smart_campus.back_end.booking.repository.BookingRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingResponse createBooking(CreateBookingRequest request) {
        validateTimeRange(request.getStartTime(), request.getEndTime());

        checkForConflicts(
                request.getResourceId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime(),
                null
        );

        Booking booking = Booking.builder()
                .resourceId(request.getResourceId())
                .userId(request.getUserId())
                .bookingDate(request.getBookingDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .expectedAttendees(request.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .adminReason(null)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        return BookingMapper.toResponse(savedBooking);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    public List<BookingResponse> getMyBookings(String userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    public BookingResponse getBookingById(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        return BookingMapper.toResponse(booking);
    }

    public BookingResponse reviewBooking(String id, ReviewBookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be reviewed");
        }

        String decision = request.getDecision().trim().toUpperCase();

        if (!decision.equals("APPROVED") && !decision.equals("REJECTED")) {
            throw new BadRequestException("Decision must be APPROVED or REJECTED");
        }

        if (decision.equals("APPROVED")) {
            checkForConflicts(
                    booking.getResourceId(),
                    booking.getBookingDate(),
                    booking.getStartTime(),
                    booking.getEndTime(),
                    booking.getId()
            );

            booking.setStatus(BookingStatus.APPROVED);
            booking.setAdminReason(null);

        } else {
            booking.setStatus(BookingStatus.REJECTED);
            booking.setAdminReason(request.getAdminReason());
        }

        booking.setUpdatedAt(LocalDateTime.now());
        Booking updatedBooking = bookingRepository.save(booking);
        return BookingMapper.toResponse(updatedBooking);
    }

    public BookingResponse cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new BadRequestException("Only APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());

        Booking updatedBooking = bookingRepository.save(booking);
        return BookingMapper.toResponse(updatedBooking);
    }

    public void deleteBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be deleted");
        }

        bookingRepository.delete(booking);
    }

    private void validateTimeRange(LocalTime startTime, LocalTime endTime) {
        if (!startTime.isBefore(endTime)) {
            throw new BadRequestException("Start time must be before end time");
        }
    }

    private void checkForConflicts(String resourceId,
                                   LocalDate bookingDate,
                                   LocalTime newStartTime,
                                   LocalTime newEndTime,
                                   String currentBookingId) {

        List<Booking> sameDayBookings = bookingRepository.findByResourceIdAndBookingDate(resourceId, bookingDate);

        boolean hasConflict = sameDayBookings.stream()
                .filter(existingBooking ->
                        currentBookingId == null  ||!existingBooking.getId().equals(currentBookingId))
                .filter(existingBooking ->
                        existingBooking.getStatus() == BookingStatus.PENDING ||
                existingBooking.getStatus() == BookingStatus.APPROVED)
                .anyMatch(existingBooking ->
                        newStartTime.isBefore(existingBooking.getEndTime()) &&
                                newEndTime.isAfter(existingBooking.getStartTime()));

        if (hasConflict) {
            throw new ConflictException("This resource already has a booking in the selected time range");
        }
    }
}