package com.example.backend.service.AirlineService;

import com.example.backend.dto.AirlineDTO.AirlineReviewItemDTO;
import com.example.backend.dto.AirlineDTO.AirlineReviewRequest;
import com.example.backend.dto.AirlineDTO.AirlineReviewSummaryDTO;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Flight;
import com.example.backend.entity.FlightReview;
import com.example.backend.entity.FlightTicket;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.FlightReviewRepository;
import com.example.backend.repository.FlightTicketRepository;
import com.example.backend.service.CommentModerationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AirlineReviewService Tests")
class AirlineReviewServiceTest {

    @Mock
    private FlightReviewRepository reviewRepository;

    @Mock
    private FlightTicketRepository ticketRepository;

    @Mock
    private AirlineRepository airlineRepository;

    @Mock
    private CommentModerationService moderationService;

    @InjectMocks
    private AirlineReviewService airlineReviewService;

    private User testUser;
    private Airline testAirline;
    private Flight testFlight;
    private FlightTicket testTicket;
    private AirlineReviewRequest testReviewRequest;
    private FlightReview testReview;

    @BeforeEach
    void setUp() {
        // Initialize test user
        testUser = new User();
        testUser.setUserID(1);

        // Initialize test airline
        testAirline = new Airline();
        testAirline.setAirlineID(1);
        testAirline.setAirlineRate(4.0f);
        testAirline.setNumberOfRates(10);

        // Initialize test flight
        testFlight = new Flight();
        testFlight.setFlightID(1);

        // Initialize test ticket
        testTicket = new FlightTicket();
        testTicket.setTicketId(1);
        testTicket.setUser(testUser);
        testTicket.setFlight(testFlight);
        testTicket.setAirline(testAirline);
        testTicket.setIsPaid(true);

        // Initialize test review request
        testReviewRequest = new AirlineReviewRequest();
        testReviewRequest.setTicketId(1);
        testReviewRequest.setOnTimeRate(5);
        testReviewRequest.setComfortRate(4);
        testReviewRequest.setStaffRate(5);
        testReviewRequest.setAmenitiesRate(4);
        testReviewRequest.setComment("Great flight experience!");

        // Initialize test review
        testReview = new FlightReview();
        testReview.setId(1);
        testReview.setUserId(1);
        testReview.setFlightId(1);
        testReview.setTicket(testTicket);
        testReview.setRating(4.5f);
        testReview.setOnTimeRate(5);
        testReview.setComfortRate(4);
        testReview.setStaffRate(5);
        testReview.setAmenitiesRate(4);
        testReview.setComment("Great flight experience!");
        testReview.setToxicFlag(false);
    }

    // ==================== ADD REVIEW TESTS ====================

    @Test
    @DisplayName("Add Review - Success with non-toxic comment")
    void testAddReview_Success() {
        // Arrange
        when(reviewRepository.existsByTicket_TicketId(testReviewRequest.getTicketId())).thenReturn(false);
        when(ticketRepository.findById(testReviewRequest.getTicketId())).thenReturn(Optional.of(testTicket));
        when(moderationService.isToxic(testReviewRequest.getComment())).thenReturn(false);
        when(reviewRepository.calculateAirlineAverageRate(testAirline.getAirlineID())).thenReturn(4.2);

        // Act
        boolean result = airlineReviewService.addReview(testUser.getUserID(), testReviewRequest);

        // Assert
        assertTrue(result);

        ArgumentCaptor<FlightReview> reviewCaptor = ArgumentCaptor.forClass(FlightReview.class);
        verify(reviewRepository).save(reviewCaptor.capture());
        FlightReview savedReview = reviewCaptor.getValue();

        assertEquals(testUser.getUserID(), savedReview.getUserId());
        assertEquals(testFlight.getFlightID(), savedReview.getFlightId());
        assertEquals(testTicket, savedReview.getTicket());
        assertEquals(4.5f, savedReview.getRating(), 0.01);
        assertEquals(5, savedReview.getOnTimeRate());
        assertEquals(4, savedReview.getComfortRate());
        assertEquals(5, savedReview.getStaffRate());
        assertEquals(4, savedReview.getAmenitiesRate());
        assertEquals("Great flight experience!", savedReview.getComment());
        assertFalse(savedReview.getToxicFlag());

        verify(airlineRepository).save(testAirline);
        assertEquals(11, testAirline.getNumberOfRates());
    }

    @Test
    @DisplayName("Add Review - Fails when review already exists for ticket")
    void testAddReview_ReviewAlreadyExists() {
        // Arrange
        when(reviewRepository.existsByTicket_TicketId(testReviewRequest.getTicketId())).thenReturn(true);

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> airlineReviewService.addReview(testUser.getUserID(), testReviewRequest));

        assertEquals("Review already exists for this ticket", exception.getMessage());
        verify(ticketRepository, never()).findById(anyInt());
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Add Review - Fails when ticket not found")
    void testAddReview_TicketNotFound() {
        // Arrange
        when(reviewRepository.existsByTicket_TicketId(testReviewRequest.getTicketId())).thenReturn(false);
        when(ticketRepository.findById(testReviewRequest.getTicketId())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> airlineReviewService.addReview(testUser.getUserID(), testReviewRequest));

        assertEquals("Ticket not found", exception.getMessage());
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Add Review - Fails when ticket is not paid")
    void testAddReview_TicketNotPaid() {
        // Arrange
        testTicket.setIsPaid(false);
        when(reviewRepository.existsByTicket_TicketId(testReviewRequest.getTicketId())).thenReturn(false);
        when(ticketRepository.findById(testReviewRequest.getTicketId())).thenReturn(Optional.of(testTicket));

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> airlineReviewService.addReview(testUser.getUserID(), testReviewRequest));

        assertEquals("Booking Transaction isn't completed yet", exception.getMessage());
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Add Review - Fails when user is not the ticket owner")
    void testAddReview_UnauthorizedUser() {
        // Arrange
        Integer unauthorizedUserId = 999;
        when(reviewRepository.existsByTicket_TicketId(testReviewRequest.getTicketId())).thenReturn(false);
        when(ticketRepository.findById(testReviewRequest.getTicketId())).thenReturn(Optional.of(testTicket));

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> airlineReviewService.addReview(unauthorizedUserId, testReviewRequest));

        assertEquals("You are not allowed to review this ticket", exception.getMessage());
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Add Review - Returns false when comment is toxic")
    void testAddReview_ToxicComment() {
        // Arrange
        when(reviewRepository.existsByTicket_TicketId(testReviewRequest.getTicketId())).thenReturn(false);
        when(ticketRepository.findById(testReviewRequest.getTicketId())).thenReturn(Optional.of(testTicket));
        when(moderationService.isToxic(testReviewRequest.getComment())).thenReturn(true);

        // Act
        boolean result = airlineReviewService.addReview(testUser.getUserID(), testReviewRequest);

        // Assert
        assertFalse(result);

        ArgumentCaptor<FlightReview> reviewCaptor = ArgumentCaptor.forClass(FlightReview.class);
        verify(reviewRepository).save(reviewCaptor.capture());
        FlightReview savedReview = reviewCaptor.getValue();

        assertTrue(savedReview.getToxicFlag());
        verify(airlineRepository, never()).save(any()); // Airline rating should not be updated for toxic reviews
    }

    // ==================== EDIT REVIEW TESTS ====================

    @Test
    @DisplayName("Edit Review - Success with non-toxic comment")
    void testEditReview_Success() {
        // Arrange
        when(reviewRepository.findByTicket_TicketId(testReviewRequest.getTicketId()))
                .thenReturn(Optional.of(testReview));
        when(moderationService.isToxic(testReviewRequest.getComment())).thenReturn(false);
        when(reviewRepository.calculateAirlineAverageRate(testAirline.getAirlineID())).thenReturn(4.3);

        // Act
        boolean result = airlineReviewService.editReview(testUser.getUserID(), testReviewRequest);

        // Assert
        assertTrue(result);

        ArgumentCaptor<FlightReview> reviewCaptor = ArgumentCaptor.forClass(FlightReview.class);
        verify(reviewRepository).save(reviewCaptor.capture());
        FlightReview savedReview = reviewCaptor.getValue();

        assertEquals(4.5f, savedReview.getRating(), 0.01);
        assertEquals(5, savedReview.getOnTimeRate());
        assertEquals(4, savedReview.getComfortRate());
        assertEquals(5, savedReview.getStaffRate());
        assertEquals(4, savedReview.getAmenitiesRate());
        assertEquals("Great flight experience!", savedReview.getComment());
        assertFalse(savedReview.getToxicFlag());

        verify(airlineRepository).save(testAirline);
        assertEquals(10, testAirline.getNumberOfRates()); // Should remain same (delta = 0)
    }

    @Test
    @DisplayName("Edit Review - Fails when review not found")
    void testEditReview_ReviewNotFound() {
        // Arrange
        when(reviewRepository.findByTicket_TicketId(testReviewRequest.getTicketId()))
                .thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> airlineReviewService.editReview(testUser.getUserID(), testReviewRequest));

        assertEquals("Review not found", exception.getMessage());
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Edit Review - Fails when user is not the review owner")
    void testEditReview_UnauthorizedUser() {
        // Arrange
        Integer unauthorizedUserId = 999;
        when(reviewRepository.findByTicket_TicketId(testReviewRequest.getTicketId()))
                .thenReturn(Optional.of(testReview));

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> airlineReviewService.editReview(unauthorizedUserId, testReviewRequest));

        assertEquals("You cannot edit this review", exception.getMessage());
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Edit Review - Returns false when comment is toxic")
    void testEditReview_ToxicComment() {
        // Arrange
        when(reviewRepository.findByTicket_TicketId(testReviewRequest.getTicketId()))
                .thenReturn(Optional.of(testReview));
        when(moderationService.isToxic(testReviewRequest.getComment())).thenReturn(true);

        // Act
        boolean result = airlineReviewService.editReview(testUser.getUserID(), testReviewRequest);

        // Assert
        assertFalse(result);

        ArgumentCaptor<FlightReview> reviewCaptor = ArgumentCaptor.forClass(FlightReview.class);
        verify(reviewRepository).save(reviewCaptor.capture());
        FlightReview savedReview = reviewCaptor.getValue();

        assertTrue(savedReview.getToxicFlag());
        verify(airlineRepository, never()).save(any()); // Airline rating should not be updated for toxic reviews
    }

    // ==================== DELETE REVIEW TESTS ====================

    @Test
    @DisplayName("Delete Review - Success")
    void testDeleteReview_Success() {
        // Arrange
        Integer ticketId = 1;
        when(reviewRepository.findByTicket_TicketId(ticketId)).thenReturn(Optional.of(testReview));
        when(reviewRepository.calculateAirlineAverageRate(testAirline.getAirlineID())).thenReturn(3.9);

        // Act
        airlineReviewService.deleteReview(testUser.getUserID(), ticketId);

        // Assert
        verify(reviewRepository).delete(testReview);
        verify(airlineRepository).save(testAirline);
        assertEquals(9, testAirline.getNumberOfRates()); // Should decrease by 1
    }

    @Test
    @DisplayName("Delete Review - Fails when review not found")
    void testDeleteReview_ReviewNotFound() {
        // Arrange
        Integer ticketId = 1;
        when(reviewRepository.findByTicket_TicketId(ticketId)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> airlineReviewService.deleteReview(testUser.getUserID(), ticketId));

        assertEquals("Review not found", exception.getMessage());
        verify(reviewRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Delete Review - Fails when user is not the review owner")
    void testDeleteReview_UnauthorizedUser() {
        // Arrange
        Integer ticketId = 1;
        Integer unauthorizedUserId = 999;
        when(reviewRepository.findByTicket_TicketId(ticketId)).thenReturn(Optional.of(testReview));

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> airlineReviewService.deleteReview(unauthorizedUserId, ticketId));

        assertEquals("You cannot delete this review", exception.getMessage());
        verify(reviewRepository, never()).delete(any());
    }

    // ==================== GET AIRLINE REVIEWS TESTS ====================

    @Test
    @DisplayName("Get Airline Reviews - Success with paginated results")
    void testGetAirlineReviews_Success() {
        // Arrange
        Integer airlineId = 1;
        int page = 0;
        int size = 10;

        AirlineReviewItemDTO reviewItem1 = new AirlineReviewItemDTO();
        AirlineReviewItemDTO reviewItem2 = new AirlineReviewItemDTO();
        Page<AirlineReviewItemDTO> expectedPage = new PageImpl<>(
                Arrays.asList(reviewItem1, reviewItem2),
                PageRequest.of(page, size),
                2
        );

        when(reviewRepository.getAirlineReviews(eq(airlineId), any(Pageable.class)))
                .thenReturn(expectedPage);

        // Act
        Page<AirlineReviewItemDTO> result = airlineReviewService.getAirlineReviews(airlineId, page, size);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        assertEquals(2, result.getTotalElements());
        assertEquals(page, result.getNumber());
        assertEquals(size, result.getSize());

        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(reviewRepository).getAirlineReviews(eq(airlineId), pageableCaptor.capture());

        Pageable capturedPageable = pageableCaptor.getValue();
        assertEquals(page, capturedPageable.getPageNumber());
        assertEquals(size, capturedPageable.getPageSize());
    }

    @Test
    @DisplayName("Get Airline Reviews - Returns empty page when no reviews exist")
    void testGetAirlineReviews_EmptyResults() {
        // Arrange
        Integer airlineId = 1;
        int page = 0;
        int size = 10;

        Page<AirlineReviewItemDTO> emptyPage = new PageImpl<>(
                Arrays.asList(),
                PageRequest.of(page, size),
                0
        );

        when(reviewRepository.getAirlineReviews(eq(airlineId), any(Pageable.class)))
                .thenReturn(emptyPage);

        // Act
        Page<AirlineReviewItemDTO> result = airlineReviewService.getAirlineReviews(airlineId, page, size);

        // Assert
        assertNotNull(result);
        assertTrue(result.getContent().isEmpty());
        assertEquals(0, result.getTotalElements());
    }

    // ==================== GET AIRLINE REVIEW SUMMARY TESTS ====================

    @Test
    @DisplayName("Get Airline Review Summary - Success")
    void testGetAirlineReviewSummary_Success() {
        // Arrange
        Integer airlineId = 1;
        AirlineReviewSummaryDTO expectedSummary = new AirlineReviewSummaryDTO();

        when(reviewRepository.getAirlineReviewSummary(airlineId)).thenReturn(expectedSummary);

        // Act
        AirlineReviewSummaryDTO result = airlineReviewService.getAirlineReviewSummary(airlineId);

        // Assert
        assertNotNull(result);
        assertEquals(expectedSummary, result);
        verify(reviewRepository).getAirlineReviewSummary(airlineId);
    }

    @Test
    @DisplayName("Get Airline Review Summary - Returns null when no summary available")
    void testGetAirlineReviewSummary_NoSummary() {
        // Arrange
        Integer airlineId = 1;
        when(reviewRepository.getAirlineReviewSummary(airlineId)).thenReturn(null);

        // Act
        AirlineReviewSummaryDTO result = airlineReviewService.getAirlineReviewSummary(airlineId);

        // Assert
        assertNull(result);
        verify(reviewRepository).getAirlineReviewSummary(airlineId);
    }

    // ==================== RATING CALCULATION TESTS ====================

    @Test
    @DisplayName("Calculate Rating - Correct average calculation")
    void testCalculateRating_CorrectAverage() {
        // Arrange
        AirlineReviewRequest request = new AirlineReviewRequest();
        request.setTicketId(1);
        request.setOnTimeRate(5);
        request.setComfortRate(4);
        request.setStaffRate(3);
        request.setAmenitiesRate(4);
        request.setComment("Test");

        when(reviewRepository.existsByTicket_TicketId(request.getTicketId())).thenReturn(false);
        when(ticketRepository.findById(request.getTicketId())).thenReturn(Optional.of(testTicket));
        when(moderationService.isToxic(request.getComment())).thenReturn(false);
        when(reviewRepository.calculateAirlineAverageRate(testAirline.getAirlineID())).thenReturn(4.0);

        // Act
        airlineReviewService.addReview(testUser.getUserID(), request);

        // Assert
        ArgumentCaptor<FlightReview> reviewCaptor = ArgumentCaptor.forClass(FlightReview.class);
        verify(reviewRepository).save(reviewCaptor.capture());
        FlightReview savedReview = reviewCaptor.getValue();

        // Expected rating: (5 + 4 + 3 + 4) / 4 = 4.0
        assertEquals(4.0f, savedReview.getRating(), 0.01);
    }

    @Test
    @DisplayName("Calculate Rating - All maximum ratings")
    void testCalculateRating_AllMaximum() {
        // Arrange
        testReviewRequest.setOnTimeRate(5);
        testReviewRequest.setComfortRate(5);
        testReviewRequest.setStaffRate(5);
        testReviewRequest.setAmenitiesRate(5);

        when(reviewRepository.existsByTicket_TicketId(testReviewRequest.getTicketId())).thenReturn(false);
        when(ticketRepository.findById(testReviewRequest.getTicketId())).thenReturn(Optional.of(testTicket));
        when(moderationService.isToxic(testReviewRequest.getComment())).thenReturn(false);
        when(reviewRepository.calculateAirlineAverageRate(testAirline.getAirlineID())).thenReturn(5.0);

        // Act
        airlineReviewService.addReview(testUser.getUserID(), testReviewRequest);

        // Assert
        ArgumentCaptor<FlightReview> reviewCaptor = ArgumentCaptor.forClass(FlightReview.class);
        verify(reviewRepository).save(reviewCaptor.capture());
        FlightReview savedReview = reviewCaptor.getValue();

        assertEquals(5.0f, savedReview.getRating(), 0.01);
    }

    @Test
    @DisplayName("Calculate Rating - All minimum ratings")
    void testCalculateRating_AllMinimum() {
        // Arrange
        testReviewRequest.setOnTimeRate(1);
        testReviewRequest.setComfortRate(1);
        testReviewRequest.setStaffRate(1);
        testReviewRequest.setAmenitiesRate(1);

        when(reviewRepository.existsByTicket_TicketId(testReviewRequest.getTicketId())).thenReturn(false);
        when(ticketRepository.findById(testReviewRequest.getTicketId())).thenReturn(Optional.of(testTicket));
        when(moderationService.isToxic(testReviewRequest.getComment())).thenReturn(false);
        when(reviewRepository.calculateAirlineAverageRate(testAirline.getAirlineID())).thenReturn(1.0);

        // Act
        airlineReviewService.addReview(testUser.getUserID(), testReviewRequest);

        // Assert
        ArgumentCaptor<FlightReview> reviewCaptor = ArgumentCaptor.forClass(FlightReview.class);
        verify(reviewRepository).save(reviewCaptor.capture());
        FlightReview savedReview = reviewCaptor.getValue();

        assertEquals(1.0f, savedReview.getRating(), 0.01);
    }

    // ==================== AIRLINE RATING UPDATE TESTS ====================

    @Test
    @DisplayName("Update Airline Rating - Add review increases count")
    void testUpdateAirlineRating_AddReview() {
        // Arrange
        when(reviewRepository.existsByTicket_TicketId(testReviewRequest.getTicketId())).thenReturn(false);
        when(ticketRepository.findById(testReviewRequest.getTicketId())).thenReturn(Optional.of(testTicket));
        when(moderationService.isToxic(testReviewRequest.getComment())).thenReturn(false);
        when(reviewRepository.calculateAirlineAverageRate(testAirline.getAirlineID())).thenReturn(4.5);

        int initialRateCount = testAirline.getNumberOfRates();

        // Act
        airlineReviewService.addReview(testUser.getUserID(), testReviewRequest);

        // Assert
        verify(airlineRepository).save(testAirline);
        assertEquals(4.5f, testAirline.getAirlineRate(), 0.01);
        assertEquals(initialRateCount + 1, testAirline.getNumberOfRates());
    }

    @Test
    @DisplayName("Update Airline Rating - Edit review maintains count")
    void testUpdateAirlineRating_EditReview() {
        // Arrange
        when(reviewRepository.findByTicket_TicketId(testReviewRequest.getTicketId()))
                .thenReturn(Optional.of(testReview));
        when(moderationService.isToxic(testReviewRequest.getComment())).thenReturn(false);
        when(reviewRepository.calculateAirlineAverageRate(testAirline.getAirlineID())).thenReturn(4.3);

        int initialRateCount = testAirline.getNumberOfRates();

        // Act
        airlineReviewService.editReview(testUser.getUserID(), testReviewRequest);

        // Assert
        verify(airlineRepository).save(testAirline);
        assertEquals(4.3f, testAirline.getAirlineRate(), 0.01);
        assertEquals(initialRateCount, testAirline.getNumberOfRates()); // Should remain same
    }

    @Test
    @DisplayName("Update Airline Rating - Delete review decreases count")
    void testUpdateAirlineRating_DeleteReview() {
        // Arrange
        Integer ticketId = 1;
        when(reviewRepository.findByTicket_TicketId(ticketId)).thenReturn(Optional.of(testReview));
        when(reviewRepository.calculateAirlineAverageRate(testAirline.getAirlineID())).thenReturn(3.8);

        int initialRateCount = testAirline.getNumberOfRates();

        // Act
        airlineReviewService.deleteReview(testUser.getUserID(), ticketId);

        // Assert
        verify(airlineRepository).save(testAirline);
        assertEquals(3.8f, testAirline.getAirlineRate(), 0.01);
        assertEquals(initialRateCount - 1, testAirline.getNumberOfRates());
    }
}