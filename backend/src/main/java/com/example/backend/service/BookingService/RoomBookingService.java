package com.example.backend.service.BookingService;

import java.time.LocalDate;
import com.example.backend.entity.User;
import com.example.backend.entity.Hotel;
import jakarta.transaction.Transactional;
import com.example.backend.entity.RoomType;
import com.example.backend.entity.RoomBooking;
import org.springframework.stereotype.Service;
import com.example.backend.repository.UserRepository;
import com.example.backend.entity.BookingTransaction;
import com.example.backend.repository.HotelRepository;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.RoomTypeRepository;
import com.example.backend.repository.RoomBookingRepository;
import com.example.backend.dto.BookingDTOs.CreateBookingDTO;
import com.example.backend.dto.BookingDTOs.RoomTypeBookingDTO;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.backend.repository.BookingTransactionRepository;

@Service
public class RoomBookingService {
    @Autowired
    RoomBookingRepository roomBookingRepository;

    @Autowired
    RoomTypeRepository roomTypeRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    HotelRepository hotelRepository;

    @Autowired
    BookingTransactionRepository bookingTransactionRepository;

    @Transactional
    public Integer bookingService(CreateBookingDTO createBookingDTO, Integer user_id) {
        User user = userRepository.getByUserID(user_id);
        Hotel hotel = hotelRepository.getByHotelID(createBookingDTO.getHotelID());
        LocalDate checkIn = createBookingDTO.getCheckIn();
        LocalDate checkOut = createBookingDTO.getCheckOut();
        int noOfGuests = createBookingDTO.getNoOfGuests();

        long numberOfNights = java.time.temporal.ChronoUnit.DAYS.between(checkIn, checkOut);
        if (numberOfNights == 0) {
            numberOfNights = 1;
        }

        float totalPrice = 0;

        BookingTransaction bookingTransaction = getBookingTransaction(user, hotel, checkIn, checkOut, noOfGuests);
        for (RoomTypeBookingDTO roomTypeBookingDTO : createBookingDTO.getRoomTypeBookingDTO()) {
            totalPrice += bookRoom(roomTypeBookingDTO, user, hotel, checkIn, checkOut, bookingTransaction,
                    numberOfNights);
        }
        bookingTransaction.setTotalPrice(totalPrice);
        bookingTransactionRepository.save(bookingTransaction);
        return bookingTransaction.getBookingTransactionId();
    }

    private BookingTransaction getBookingTransaction(User user, Hotel hotel, LocalDate checkIn, LocalDate checkOut,
            int noOfGuests) {
        BookingTransaction bookingTransaction = new BookingTransaction();
        bookingTransaction.setUser(user);
        bookingTransaction.setHotel(hotel);
        bookingTransaction.setCheckIn(checkIn);
        bookingTransaction.setCheckOut(checkOut);
        bookingTransaction.setNumberOfGuests(noOfGuests);
        bookingTransactionRepository.save(bookingTransaction);
        return bookingTransaction;
    }

    private float bookRoom(RoomTypeBookingDTO roomTypeBookingDTO, User user, Hotel hotel, LocalDate checkIn,
            LocalDate checkOut, BookingTransaction bookingTransaction, long numberOfNights) {
        RoomType roomType = roomTypeRepository.lockRoomType(roomTypeBookingDTO.getRoomTypeID());
        Integer bookedRoomCount = roomBookingRepository.getNumberOfBookedRoom(checkIn, checkOut,
                roomTypeBookingDTO.getRoomTypeID());
        int noOfBookedRoom = (bookedRoomCount == null) ? 0 : bookedRoomCount;
        int noOfAvailableRoom = roomType.getQuantity() - noOfBookedRoom;
        if (noOfAvailableRoom < roomTypeBookingDTO.getNoOfRooms()) {
            throw new BadRequestException("this number of rooms is Not available ");
        }
        saveTheRoomBooking(roomTypeBookingDTO, user, hotel, checkIn, checkOut, roomType, bookingTransaction);

        return roomType.getPrice() * roomTypeBookingDTO.getNoOfRooms() * numberOfNights;
    }

    private void saveTheRoomBooking(RoomTypeBookingDTO roomTypeBookingDTO, User user, Hotel hotel, LocalDate checkIn,
            LocalDate checkOut, RoomType roomType, BookingTransaction bookingTransaction) {
        RoomBooking roomBooking = new RoomBooking();
        roomBooking.setUser(user);
        roomBooking.setHotel(hotel);
        roomBooking.setRoomType(roomType);
        roomBooking.setCheckIn(checkIn);
        roomBooking.setCheckOut(checkOut);
        roomBooking.setNoOfRooms(roomTypeBookingDTO.getNoOfRooms());
        roomBooking.setBookingTransaction(bookingTransaction);
        roomBookingRepository.save(roomBooking);
    }

}
