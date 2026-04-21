package smart_campus.back_end.booking.mapper;

import smart_campus.back_end.booking.DTO.BookingRequestDTO;
import smart_campus.back_end.booking.DTO.BookingResponseDTO;
import smart_campus.back_end.booking.model.booking;
import smart_campus.back_end.booking.model.BookingStatus;
public class BookingMapper {
    public static booking toEntity(BookingRequestDTO dto) {
        return booking.builder()
                .resourceId(dto.getResourceId())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .purpose(dto.getPurpose())
                .expectedAttendees(dto.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .build();
    }

    public static BookingResponseDTO toDTO(booking booking) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .resourceId(booking.getResourceId())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .purpose(booking.getPurpose())
                .expectedAttendees(booking.getExpectedAttendees())
                .status(booking.getStatus())
                .adminReason(booking.getAdminReason())
                .build();
    }
}
