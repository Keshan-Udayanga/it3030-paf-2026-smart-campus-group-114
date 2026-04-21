package smart_campus.back_end.booking.service;


import smart_campus.back_end.booking.DTO.BookingResponseDTO;

import java.util.List;
public interface BookingService {



    List<BookingResponseDTO> getAllBookings();


}
