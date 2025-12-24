package com.example.backend.service.HotelService;

import com.example.backend.dto.HotelDTO.HotelReviewItemDTO;
import com.example.backend.dto.HotelDTO.HotelReviewRequest;
import com.example.backend.dto.HotelDTO.HotelReviewSummaryDTO;
import com.example.backend.entity.BookingTransaction;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.HotelReview;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.BookingTransactionRepository;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.HotelReviewRepository;
import com.example.backend.service.CommentModerationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HotelReviewServiceTest {

    @Mock
    private HotelReviewRepository reviewRepository;

    @Mock
    private BookingTransactionRepository bookingRepository;

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private CommentModerationService moderationService;

    @InjectMocks
    private HotelReviewService hotelReviewService;

    private User testUser;
    private Hotel testHotel;
    private BookingTransaction testBooking;
    private HotelReviewRequest testReviewRequest;
    private HotelReview testReview;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
        testUser.setUserID(1);
        testUser.setFirstName("testuser");

        // Setup test hotel
        testHotel = new Hotel();
        testHotel.setHotelID(1);
        testHotel.setHotelRate(4.0f);
        testHotel.setNumberOfRates(10);

        // Setup test booking
        testBooking = new BookingTransaction();
        testBooking.setBookingTransactionId(1);
        testBooking.setUser(testUser);
        testBooking.setHotel(testHotel);
        testBooking.setStatus(BookingTransaction.Status.COMPLETED);

        // Setup test review request
        testReviewRequest = new HotelReviewRequest();
        testReviewRequest.setBookingTransactionId(1);
        testReviewRequest.setStaffRate(5);
        testReviewRequest.setComfortRate(4);
        testReviewRequest.setFacilitiesRate(5);
        testReviewRequest.setCleanlinessRate(4);
        testReviewRequest.setValueForMoneyRate(5);
        testReviewRequest.setLocationRate(4);
        testReviewRequest.setComment("Great hotel!");

        // Setup test review
        testReview = new HotelReview();
        testReview.setReviewId(1);
        testReview.setUser(testUser);
        testReview.setHotel(testHotel);
        testReview.setBookingTransaction(testBooking);
        testReview.setStaffRate(5);
        testReview.setComfortRate(4);
        testReview.setFacilitiesRate(5);
        testReview.setCleanlinessRate(4);
        testReview.setValueForMoneyRate(5);
        testReview.setLocationRate(4);
        testReview.setRating(4.5f);
        testReview.setComment("Great hotel!");
    }

    // ==================== addReview Tests ====================

    @Test
    void addReview_Success() {
        // Arrange
        when(reviewRepository.existsByBookingTransaction_BookingTransactionId(1)).thenReturn(false);
        when(bookingRepository.findById(1)).thenReturn(Optional.of(testBooking));
        when(reviewRepository.calculateHotelAverageRate(1)).thenReturn(4.5);
        when(reviewRepository.save(any(HotelReview.class))).thenReturn(testReview);
        when(hotelRepository.save(any(Hotel.class))).thenReturn(testHotel);

        // Act
        hotelReviewService.addReview(1, testReviewRequest);

        // Assert
        ArgumentCaptor<HotelReview> reviewCaptor = ArgumentCaptor.forClass(HotelReview.class);
        verify(reviewRepository).save(reviewCaptor.capture());

        HotelReview savedReview = reviewCaptor.getValue();
        assertEquals(testUser, savedReview.getUser());
        assertEquals(testHotel, savedReview.getHotel());
        assertEquals(testBooking, savedReview.getBookingTransaction());
        assertEquals(5, savedReview.getStaffRate());
        assertEquals(4, savedReview.getComfortRate());
        assertEquals(5, savedReview.getFacilitiesRate());
        assertEquals(4, savedReview.getCleanlinessRate());
        assertEquals(5, savedReview.getValueForMoneyRate());
        assertEquals(4, savedReview.getLocationRate());
        assertEquals("Great hotel!", savedReview.getComment());

        ArgumentCaptor<Hotel> hotelCaptor = ArgumentCaptor.forClass(Hotel.class);
        verify(hotelRepository).save(hotelCaptor.capture());

        Hotel updatedHotel = hotelCaptor.getValue();
        assertEquals(4.5f, updatedHotel.getHotelRate());
        assertEquals(11, updatedHotel.getNumberOfRates());
    }

    @Test
    void addReview_ReviewAlreadyExists_ThrowsBadRequestException() {
        // Arrange
        when(reviewRepository.existsByBookingTransaction_BookingTransactionId(1)).thenReturn(true);

        // Act & Assert
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> hotelReviewService.addReview(1, testReviewRequest)
        );

        assertEquals("Review already exists for this booking", exception.getMessage());
        verify(bookingRepository, never()).findById(any());
        verify(reviewRepository, never()).save(any());
    }

    @Test
    void addReview_BookingNotFound_ThrowsResourceNotFoundException() {
        // Arrange
        when(reviewRepository.existsByBookingTransaction_BookingTransactionId(1)).thenReturn(false);
        when(bookingRepository.findById(1)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> hotelReviewService.addReview(1, testReviewRequest)
        );

        assertEquals("Booking not found", exception.getMessage());
        verify(reviewRepository, never()).save(any());
    }

    @Test
    void addReview_BookingNotCompleted_ThrowsBadRequestException() {
        // Arrange
        testBooking.setStatus(BookingTransaction.Status.PENDING);
        when(reviewRepository.existsByBookingTransaction_BookingTransactionId(1)).thenReturn(false);
        when(bookingRepository.findById(1)).thenReturn(Optional.of(testBooking));

        // Act & Assert
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> hotelReviewService.addReview(1, testReviewRequest)
        );

        assertEquals("Booking Transaction isn't completed yet", exception.getMessage());
        verify(reviewRepository, never()).save(any());
    }

    @Test
    void addReview_UserNotOwnerOfBooking_ThrowsBadRequestException() {
        // Arrange
        when(reviewRepository.existsByBookingTransaction_BookingTransactionId(1)).thenReturn(false);
        when(bookingRepository.findById(1)).thenReturn(Optional.of(testBooking));

        // Act & Assert
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> hotelReviewService.addReview(999, testReviewRequest) // Different user ID
        );

        assertEquals("You are not allowed to review this booking", exception.getMessage());
        verify(reviewRepository, never()).save(any());
    }

    // ==================== editReview Tests ====================

    @Test
    void editReview_Success() {
        // Arrange
        when(reviewRepository.findByBookingTransaction_BookingTransactionId(1))
                .thenReturn(Optional.of(testReview));
        when(reviewRepository.calculateHotelAverageRate(1)).thenReturn(4.8);
        when(reviewRepository.save(any(HotelReview.class))).thenReturn(testReview);
        when(hotelRepository.save(any(Hotel.class))).thenReturn(testHotel);

        HotelReviewRequest updatedRequest = new HotelReviewRequest();
        updatedRequest.setBookingTransactionId(1);
        updatedRequest.setStaffRate(5);
        updatedRequest.setComfortRate(5);
        updatedRequest.setFacilitiesRate(5);
        updatedRequest.setCleanlinessRate(5);
        updatedRequest.setValueForMoneyRate(5);
        updatedRequest.setLocationRate(5);
        updatedRequest.setComment("Updated review - Excellent!");

        // Act
        hotelReviewService.editReview(1, updatedRequest);

        // Assert
        ArgumentCaptor<HotelReview> reviewCaptor = ArgumentCaptor.forClass(HotelReview.class);
        verify(reviewRepository).save(reviewCaptor.capture());

        HotelReview savedReview = reviewCaptor.getValue();
        assertEquals(5, savedReview.getStaffRate());
        assertEquals(5, savedReview.getComfortRate());
        assertEquals(5, savedReview.getFacilitiesRate());
        assertEquals(5, savedReview.getCleanlinessRate());
        assertEquals(5, savedReview.getValueForMoneyRate());
        assertEquals(5, savedReview.getLocationRate());
        assertEquals(5.0f, savedReview.getRating());
        assertEquals("Updated review - Excellent!", savedReview.getComment());

        ArgumentCaptor<Hotel> hotelCaptor = ArgumentCaptor.forClass(Hotel.class);
        verify(hotelRepository).save(hotelCaptor.capture());

        Hotel updatedHotel = hotelCaptor.getValue();
        assertEquals(4.8f, updatedHotel.getHotelRate());
        // Note: numberOfRates should not change on edit
        assertEquals(10, updatedHotel.getNumberOfRates());
    }

    @Test
    void editReview_ReviewNotFound_ThrowsResourceNotFoundException() {
        // Arrange
        when(reviewRepository.findByBookingTransaction_BookingTransactionId(1))
                .thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> hotelReviewService.editReview(1, testReviewRequest)
        );

        assertEquals("Review not found", exception.getMessage());
        verify(reviewRepository, never()).save(any());
    }

    @Test
    void editReview_UserNotOwnerOfReview_ThrowsBadRequestException() {
        // Arrange
        when(reviewRepository.findByBookingTransaction_BookingTransactionId(1))
                .thenReturn(Optional.of(testReview));

        // Act & Assert
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> hotelReviewService.editReview(999, testReviewRequest) // Different user ID
        );

        assertEquals("You cannot edit this review", exception.getMessage());
        verify(reviewRepository, never()).save(any());
    }

    @Test
    void editReview_CalculatesCorrectOverallRating() {
        // Arrange
        when(reviewRepository.findByBookingTransaction_BookingTransactionId(1))
                .thenReturn(Optional.of(testReview));
        when(reviewRepository.calculateHotelAverageRate(1)).thenReturn(4.0);
        when(reviewRepository.save(any(HotelReview.class))).thenReturn(testReview);
        when(hotelRepository.save(any(Hotel.class))).thenReturn(testHotel);

        HotelReviewRequest request = new HotelReviewRequest();
        request.setBookingTransactionId(1);
        request.setStaffRate(3);
        request.setComfortRate(4);
        request.setFacilitiesRate(5);
        request.setCleanlinessRate(2);
        request.setValueForMoneyRate(4);
        request.setLocationRate(3);
        request.setComment("Mixed feelings");

        // Act
        hotelReviewService.editReview(1, request);

        // Assert
        ArgumentCaptor<HotelReview> reviewCaptor = ArgumentCaptor.forClass(HotelReview.class);
        verify(reviewRepository).save(reviewCaptor.capture());

        HotelReview savedReview = reviewCaptor.getValue();
        // (3+4+5+2+4+3)/6 = 21/6 = 3.5
        assertEquals(3.5f, savedReview.getRating(), 0.001);
    }

    // ==================== deleteReview Tests ====================

    @Test
    void deleteReview_Success() {
        // Arrange
        when(reviewRepository.findByBookingTransaction_BookingTransactionId(1))
                .thenReturn(Optional.of(testReview));
        when(reviewRepository.calculateHotelAverageRate(1)).thenReturn(4.2);
        when(hotelRepository.save(any(Hotel.class))).thenReturn(testHotel);

        // Act
        hotelReviewService.deleteReview(1, 1);

        // Assert
        verify(reviewRepository).delete(testReview);

        ArgumentCaptor<Hotel> hotelCaptor = ArgumentCaptor.forClass(Hotel.class);
        verify(hotelRepository).save(hotelCaptor.capture());

        Hotel updatedHotel = hotelCaptor.getValue();
        assertEquals(4.2f, updatedHotel.getHotelRate());
        assertEquals(9, updatedHotel.getNumberOfRates()); // Decremented from 10
    }

    @Test
    void deleteReview_ReviewNotFound_ThrowsResourceNotFoundException() {
        // Arrange
        when(reviewRepository.findByBookingTransaction_BookingTransactionId(1))
                .thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> hotelReviewService.deleteReview(1, 1)
        );

        assertEquals("Review not found", exception.getMessage());
        verify(reviewRepository, never()).delete(any());
    }

    @Test
    void deleteReview_UserNotOwnerOfReview_ThrowsBadRequestException() {
        // Arrange
        when(reviewRepository.findByBookingTransaction_BookingTransactionId(1))
                .thenReturn(Optional.of(testReview));

        // Act & Assert
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> hotelReviewService.deleteReview(999, 1) // Different user ID
        );

        assertEquals("You cannot delete this review", exception.getMessage());
        verify(reviewRepository, never()).delete(any());
    }

    // ==================== getHotelReviews Tests ====================

    @Test
    void getHotelReviews_Success() {
        // Arrange
        HotelReviewItemDTO review1 = new HotelReviewItemDTO(
                "User1", "Deluxe Room", 3L, 4.5f, "Great stay!", Timestamp.valueOf(LocalDateTime.now())
        );
        HotelReviewItemDTO review2 = new HotelReviewItemDTO(
                "User2", "Standard Room", 2L, 4.0f, "Good value", Timestamp.valueOf(LocalDateTime.now())
        );

        Page<HotelReviewItemDTO> expectedPage = new PageImpl<>(
                Arrays.asList(review1, review2),
                PageRequest.of(0, 10),
                2
        );

        when(reviewRepository.getHotelReviews(eq(1), any(Pageable.class)))
                .thenReturn(expectedPage);

        // Act
        Page<HotelReviewItemDTO> result = hotelReviewService.getHotelReviews(1, 0, 10);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(2, result.getContent().size());
        assertEquals("User1", result.getContent().get(0).getUserName());
        assertEquals("User2", result.getContent().get(1).getUserName());

        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(reviewRepository).getHotelReviews(eq(1), pageableCaptor.capture());

        Pageable capturedPageable = pageableCaptor.getValue();
        assertEquals(0, capturedPageable.getPageNumber());
        assertEquals(10, capturedPageable.getPageSize());
    }

    @Test
    void getHotelReviews_EmptyResult() {
        // Arrange
        Page<HotelReviewItemDTO> emptyPage = new PageImpl<>(
                Arrays.asList(),
                PageRequest.of(0, 10),
                0
        );

        when(reviewRepository.getHotelReviews(eq(1), any(Pageable.class)))
                .thenReturn(emptyPage);

        // Act
        Page<HotelReviewItemDTO> result = hotelReviewService.getHotelReviews(1, 0, 10);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        assertTrue(result.getContent().isEmpty());
    }

    @Test
    void getHotelReviews_DifferentPageSize() {
        // Arrange
        HotelReviewItemDTO review1 = new HotelReviewItemDTO(
                "User1", "Suite", 5L, 5.0f, "Amazing!", Timestamp.valueOf(LocalDateTime.now())
        );

        Page<HotelReviewItemDTO> expectedPage = new PageImpl<>(
                Arrays.asList(review1),
                PageRequest.of(2, 5),
                11 // Total elements
        );

        when(reviewRepository.getHotelReviews(eq(1), any(Pageable.class)))
                .thenReturn(expectedPage);

        // Act
        Page<HotelReviewItemDTO> result = hotelReviewService.getHotelReviews(1, 2, 5);

        // Assert
        assertNotNull(result);
        assertEquals(11, result.getTotalElements());
        assertEquals(1, result.getContent().size());

        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(reviewRepository).getHotelReviews(eq(1), pageableCaptor.capture());

        Pageable capturedPageable = pageableCaptor.getValue();
        assertEquals(2, capturedPageable.getPageNumber());
        assertEquals(5, capturedPageable.getPageSize());
    }

    // ==================== getHotelReviewSummary Tests ====================

    @Test
    void getHotelReviewSummary_Success() {
        // Arrange
        HotelReviewSummaryDTO expectedSummary = new HotelReviewSummaryDTO(
                4.5, 4.3, 4.6, 4.7, 4.4, 4.8
        );

        when(reviewRepository.getHotelReviewSummary(1)).thenReturn(expectedSummary);

        // Act
        HotelReviewSummaryDTO result = hotelReviewService.getHotelReviewSummary(1);

        // Assert
        assertNotNull(result);
        assertEquals(4.5, result.getStaffAvg());
        assertEquals(4.3, result.getComfortAvg());
        assertEquals(4.6, result.getFacilitiesAvg());
        assertEquals(4.7, result.getCleanlinessAvg());
        assertEquals(4.4, result.getValueForMoneyAvg());
        assertEquals(4.8, result.getLocationAvg());

        verify(reviewRepository).getHotelReviewSummary(1);
    }

    @Test
    void getHotelReviewSummary_NoReviews_ReturnsNull() {
        // Arrange
        when(reviewRepository.getHotelReviewSummary(1)).thenReturn(null);

        // Act
        HotelReviewSummaryDTO result = hotelReviewService.getHotelReviewSummary(1);

        // Assert
        assertNull(result);
        verify(reviewRepository).getHotelReviewSummary(1);
    }

    @Test
    void getHotelReviewSummary_DifferentHotelId() {
        // Arrange
        HotelReviewSummaryDTO expectedSummary = new HotelReviewSummaryDTO(
                3.5, 3.3, 3.6, 3.7, 3.4, 3.8
        );

        when(reviewRepository.getHotelReviewSummary(999)).thenReturn(expectedSummary);

        // Act
        HotelReviewSummaryDTO result = hotelReviewService.getHotelReviewSummary(999);

        // Assert
        assertNotNull(result);
        assertEquals(3.5, result.getStaffAvg());
        verify(reviewRepository).getHotelReviewSummary(999);
    }

    // ==================== Edge Cases ====================

    @Test
    void addReview_ZeroRatings_CalculatesCorrectly() {
        // Arrange
        HotelReviewRequest zeroRatingRequest = new HotelReviewRequest();
        zeroRatingRequest.setBookingTransactionId(1);
        zeroRatingRequest.setStaffRate(0);
        zeroRatingRequest.setComfortRate(0);
        zeroRatingRequest.setFacilitiesRate(0);
        zeroRatingRequest.setCleanlinessRate(0);
        zeroRatingRequest.setValueForMoneyRate(0);
        zeroRatingRequest.setLocationRate(0);
        zeroRatingRequest.setComment("Not satisfied");

        when(reviewRepository.existsByBookingTransaction_BookingTransactionId(1)).thenReturn(false);
        when(bookingRepository.findById(1)).thenReturn(Optional.of(testBooking));
        when(reviewRepository.calculateHotelAverageRate(1)).thenReturn(0.0);
        when(reviewRepository.save(any(HotelReview.class))).thenReturn(testReview);
        when(hotelRepository.save(any(Hotel.class))).thenReturn(testHotel);

        // Act
        hotelReviewService.addReview(1, zeroRatingRequest);

        // Assert
        verify(reviewRepository).save(any(HotelReview.class));
        verify(hotelRepository).save(any(Hotel.class));
    }

    @Test
    void addReview_EmptyComment_Success() {
        // Arrange
        testReviewRequest.setComment("");

        when(reviewRepository.existsByBookingTransaction_BookingTransactionId(1)).thenReturn(false);
        when(bookingRepository.findById(1)).thenReturn(Optional.of(testBooking));
        when(reviewRepository.calculateHotelAverageRate(1)).thenReturn(4.5);
        when(reviewRepository.save(any(HotelReview.class))).thenReturn(testReview);
        when(hotelRepository.save(any(Hotel.class))).thenReturn(testHotel);

        // Act
        hotelReviewService.addReview(1, testReviewRequest);

        // Assert
        ArgumentCaptor<HotelReview> reviewCaptor = ArgumentCaptor.forClass(HotelReview.class);
        verify(reviewRepository).save(reviewCaptor.capture());
        assertEquals("", reviewCaptor.getValue().getComment());
    }

    @Test
    void addReview_NullComment_Success() {
        // Arrange
        testReviewRequest.setComment(null);

        when(reviewRepository.existsByBookingTransaction_BookingTransactionId(1)).thenReturn(false);
        when(bookingRepository.findById(1)).thenReturn(Optional.of(testBooking));
        when(reviewRepository.calculateHotelAverageRate(1)).thenReturn(4.5);
        when(reviewRepository.save(any(HotelReview.class))).thenReturn(testReview);
        when(hotelRepository.save(any(Hotel.class))).thenReturn(testHotel);

        // Act
        hotelReviewService.addReview(1, testReviewRequest);

        // Assert
        ArgumentCaptor<HotelReview> reviewCaptor = ArgumentCaptor.forClass(HotelReview.class);
        verify(reviewRepository).save(reviewCaptor.capture());
        assertNull(reviewCaptor.getValue().getComment());
    }
}