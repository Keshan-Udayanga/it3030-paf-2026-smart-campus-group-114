package smart_campus.back_end.booking.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import smart_campus.back_end.auth.service.CustomUserDetails;
import smart_campus.back_end.booking.dto.BookingResponse;
import smart_campus.back_end.booking.dto.CreateBookingRequest;
import smart_campus.back_end.booking.dto.ReviewBookingRequest;
import smart_campus.back_end.booking.service.BookingService;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody CreateBookingRequest request, @AuthenticationPrincipal CustomUserDetails userDetails) {
        System.out.println(request);
        String userId = userDetails.getUser().getId();
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request, userId));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@RequestParam String userId) {
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<BookingResponse> reviewBooking(
            @PathVariable String id,
            @Valid @RequestBody ReviewBookingRequest request
    ) {
        return ResponseEntity.ok(bookingService.reviewBooking(id, request));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}