package smart_campus.back_end.booking.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smart_campus.back_end.auth.model.User;
import smart_campus.back_end.auth.repository.UserRepository;
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
import smart_campus.back_end.notification.service.NotificationService;
import smart_campus.back_end.resources.model.Resource;
import smart_campus.back_end.resources.repository.ResourceRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private NotificationService notificationService;

    private final BookingRepository bookingRepository;

    // ================= CREATE BOOKING =================
    public BookingResponse createBooking(CreateBookingRequest request, String userID) {

        checkForConflicts(
                request.getResourceId(),
                request.getBookingDate(),
                request.getStartDateTime(),
                request.getEndDateTime(),
                null
        );

        Booking booking = Booking.builder()
                .resourceId(request.getResourceId())
                .userId(userID)
                .bookingDate(request.getBookingDate())
                .startDateTime(request.getStartDateTime())
                .endDateTime(request.getEndDateTime())
                .purpose(request.getPurpose())
                .expectedAttendees(request.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .adminReason(null)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Booking saved = bookingRepository.save(booking);

        //Notification Implementations
        List<User> managers = userRepository.findByRolesContaining("ROLE_RESOURCE_MANAGER");
        List<User> admins = userRepository.findByRolesContaining("ROLE_ADMIN");

        String message = "New booking request for resource " + saved.getResourceId();

        managers.forEach(u ->
                notificationService.createNotification(u.getId(), message, "BOOKING")
        );

        admins.forEach(u ->
                notificationService.createNotification(u.getId(), message, "BOOKING")
        );

        return BookingMapper.toResponse(saved);
    }

    // ================= GET ALL =================
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    // ================= GET MY BOOKINGS =================
    public List<BookingResponse> getMyBookings(String userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    // ================= GET BY ID =================
    public BookingResponse getBookingById(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));

        return BookingMapper.toResponse(booking);
    }

    // ================= REVIEW BOOKING =================
    public BookingResponse reviewBooking(String id, ReviewBookingRequest request) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be reviewed");
        }

        String decision = request.getDecision();

        if (decision == null) {
            throw new BadRequestException("Decision cannot be null");
        }

        decision = decision.trim().toUpperCase();

        if (!decision.equals("APPROVED") && !decision.equals("REJECTED")) {
            throw new BadRequestException("Decision must be APPROVED or REJECTED");
        }

        // ================= APPROVE =================
        if (decision.equals("APPROVED")) {

            checkForConflicts(
                    booking.getResourceId(),
                    booking.getBookingDate(),
                    booking.getStartDateTime(),
                    booking.getEndDateTime(),
                    booking.getId()
            );

            booking.setStatus(BookingStatus.APPROVED);
            booking.setAdminReason(null);
        }

        // ================= REJECT =================
        else {

            booking.setStatus(BookingStatus.REJECTED);

            String reason = request.getAdminReason();

            if (reason != null && !reason.trim().isEmpty()) {
                booking.setAdminReason(reason.trim());
            } else {
                booking.setAdminReason("Rejected by admin");
            }
        }

        booking.setUpdatedAt(LocalDateTime.now());

        Booking updated = bookingRepository.save(booking);

        String resourceName = resourceRepository.findById(updated.getResourceId())
                .map(Resource::getName)
                .orElse("Resource");

        String message;

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        String formattedDate = updated.getStartDateTime().format(formatter);

        if (updated.getStatus() == BookingStatus.APPROVED) {
            message = "Your booking for " + resourceName +
                    " on " + formattedDate + " has been approved";
        } else {
            message = "Your booking for " + resourceName +
                    " on " + formattedDate +
                    " was rejected. Reason: " + updated.getAdminReason();
        }

        notificationService.createNotification(
                updated.getUserId(),
                message,
                "BOOKING"
        );

        return BookingMapper.toResponse(updated);
    }

    // ================= CANCEL BOOKING =================
    public BookingResponse cancelBooking(String id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new BadRequestException("Only APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());

        return BookingMapper.toResponse(bookingRepository.save(booking));
    }

    // ================= DELETE BOOKING =================
    public void deleteBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));

        bookingRepository.delete(booking);
    }

    // ================= CONFLICT CHECK =================
    private void checkForConflicts(String resourceId,
                                   LocalDate bookingDate,
                                   LocalDateTime newStart,
                                   LocalDateTime newEnd,
                                   String currentId) {

        List<Booking> sameDay = bookingRepository.findByResourceIdAndBookingDate(resourceId, bookingDate);

        boolean conflict = sameDay.stream()
                .filter(b -> currentId == null || !b.getId().equals(currentId))
                .filter(b -> b.getStatus() == BookingStatus.PENDING
                        || b.getStatus() == BookingStatus.APPROVED)
                .anyMatch(b ->
                        newStart.isBefore(b.getEndDateTime()) &&
                                newEnd.isAfter(b.getStartDateTime())
                );

        if (conflict) {
            throw new ConflictException("Time slot already booked");
        }
    }

}