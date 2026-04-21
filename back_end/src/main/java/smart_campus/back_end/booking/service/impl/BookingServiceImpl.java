package smart_campus.back_end.booking.service.impl;

import smart_campus.back_end.booking.DTO.BookingRequestDTO;
import smart_campus.back_end.booking.DTO.BookingResponseDTO;
import smart_campus.back_end.booking.mapper.BookingMapper;
import smart_campus.back_end.booking.model.booking;
import smart_campus.back_end.booking.model.BookingStatus;
import smart_campus.back_end.booking.repostory.BookingRepository;
import smart_campus.back_end.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService{
    private final BookingRepository repository;


    @Override
    public List<BookingResponseDTO> getAllBookings() {
        return repository.findAll()
                .stream()
                .map(BookingMapper::toDTO)
                .collect(Collectors.toList());
    }


}


