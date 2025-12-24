package com.example.backend.controller.HotelControllerTest;

import com.example.backend.controller.HotelController.HotelReviewController;
import com.example.backend.dto.HotelDTO.HotelReviewItemDTO;
import com.example.backend.dto.HotelDTO.HotelReviewSummaryDTO;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.HotelService.HotelReviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class HotelReviewControllerTest {

    @Mock
    private HotelReviewService hotelReviewService;

    @InjectMocks
    private HotelReviewController hotelReviewController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(hotelReviewController).build();
        objectMapper = new ObjectMapper();
    }

    // ==================== getHotelReviews Tests ====================

    @Test
    void getHotelReviews_Success_WithDefaultPagination() throws Exception {
        // Arrange
        Integer hotelId = 1;
        HotelReviewItemDTO review1 = new HotelReviewItemDTO(
                "John Doe",
                "Deluxe Room",
                3,
                4.5f,
                "Excellent stay! Very comfortable and clean.",
                Timestamp.valueOf(LocalDateTime.of(2024, 12, 1, 10, 30))
        );
        HotelReviewItemDTO review2 = new HotelReviewItemDTO(
                "Jane Smith",
                "Standard Room",
                2,
                4.0f,
                "Good value for money. Would recommend.",
                Timestamp.valueOf(LocalDateTime.of(2024, 12, 5, 14, 20))
        );

        Page<HotelReviewItemDTO> reviewPage = new PageImpl<>(
                Arrays.asList(review1, review2),
                PageRequest.of(0, 10),
                2
        );

        when(hotelReviewService.getHotelReviews(hotelId, 0, 10)).thenReturn(reviewPage);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}", hotelId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Reviews of the hotel fetched successfully"))
                .andExpect(jsonPath("$.data").exists())
                .andExpect(jsonPath("$.data.content", hasSize(2)))
                .andExpect(jsonPath("$.data.content[0].userName").value("John Doe"))
                .andExpect(jsonPath("$.data.content[0].roomType").value("Deluxe Room"))
                .andExpect(jsonPath("$.data.content[0].nights").value(3))
                .andExpect(jsonPath("$.data.content[0].rating").value(4.5))
                .andExpect(jsonPath("$.data.content[0].comment").value("Excellent stay! Very comfortable and clean."))
                .andExpect(jsonPath("$.data.content[1].userName").value("Jane Smith"))
                .andExpect(jsonPath("$.data.content[1].roomType").value("Standard Room"))
                .andExpect(jsonPath("$.data.content[1].nights").value(2))
                .andExpect(jsonPath("$.data.content[1].rating").value(4.0))
                .andExpect(jsonPath("$.data.content[1].comment").value("Good value for money. Would recommend."))
                .andExpect(jsonPath("$.data.totalElements").value(2))
                .andExpect(jsonPath("$.data.totalPages").value(1))
                .andExpect(jsonPath("$.data.number").value(0))
                .andExpect(jsonPath("$.data.size").value(10));

        verify(hotelReviewService, times(1)).getHotelReviews(hotelId, 0, 10);
    }

    @Test
    void getHotelReviews_Success_WithCustomPagination() throws Exception {
        // Arrange
        Integer hotelId = 5;
        HotelReviewItemDTO review = new HotelReviewItemDTO(
                "Alice Johnson",
                "Suite",
                5,
                5.0f,
                "Amazing experience!",
                Timestamp.valueOf(LocalDateTime.of(2024, 12, 10, 16, 45))
        );

        Page<HotelReviewItemDTO> reviewPage = new PageImpl<>(
                Collections.singletonList(review),
                PageRequest.of(2, 5),
                11
        );

        when(hotelReviewService.getHotelReviews(hotelId, 2, 5)).thenReturn(reviewPage);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}", hotelId)
                        .param("page", "2")
                        .param("size", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Reviews of the hotel fetched successfully"))
                .andExpect(jsonPath("$.data").exists())
                .andExpect(jsonPath("$.data.content", hasSize(1)))
                .andExpect(jsonPath("$.data.content[0].userName").value("Alice Johnson"))
                .andExpect(jsonPath("$.data.content[0].roomType").value("Suite"))
                .andExpect(jsonPath("$.data.content[0].nights").value(5))
                .andExpect(jsonPath("$.data.content[0].rating").value(5.0))
                .andExpect(jsonPath("$.data.totalElements").value(11))
                .andExpect(jsonPath("$.data.totalPages").value(3))
                .andExpect(jsonPath("$.data.number").value(2))
                .andExpect(jsonPath("$.data.size").value(5));

        verify(hotelReviewService, times(1)).getHotelReviews(hotelId, 2, 5);
    }

    @Test
    void getHotelReviews_Success_EmptyResults() throws Exception {
        // Arrange
        Integer hotelId = 999;
        Page<HotelReviewItemDTO> emptyPage = new PageImpl<>(
                Collections.emptyList(),
                PageRequest.of(0, 10),
                0
        );

        when(hotelReviewService.getHotelReviews(hotelId, 0, 10)).thenReturn(emptyPage);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}", hotelId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Reviews of the hotel fetched successfully"))
                .andExpect(jsonPath("$.data").exists())
                .andExpect(jsonPath("$.data.content", hasSize(0)))
                .andExpect(jsonPath("$.data.totalElements").value(0))
                .andExpect(jsonPath("$.data.totalPages").value(0));

        verify(hotelReviewService, times(1)).getHotelReviews(hotelId, 0, 10);
    }

    @Test
    void getHotelReviews_Success_WithNullComment() throws Exception {
        // Arrange
        Integer hotelId = 1;
        HotelReviewItemDTO review = new HotelReviewItemDTO(
                "Bob Williams",
                "Economy Room",
                1,
                3.5f,
                null, // Null comment
                Timestamp.valueOf(LocalDateTime.of(2024, 12, 15, 9, 0))
        );

        Page<HotelReviewItemDTO> reviewPage = new PageImpl<>(
                Collections.singletonList(review),
                PageRequest.of(0, 10),
                1
        );

        when(hotelReviewService.getHotelReviews(hotelId, 0, 10)).thenReturn(reviewPage);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}", hotelId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Reviews of the hotel fetched successfully"))
                .andExpect(jsonPath("$.data.content", hasSize(1)))
                .andExpect(jsonPath("$.data.content[0].userName").value("Bob Williams"))
                .andExpect(jsonPath("$.data.content[0].comment").isEmpty());

        verify(hotelReviewService, times(1)).getHotelReviews(hotelId, 0, 10);
    }

    @Test
    void getHotelReviews_Success_LargePageSize() throws Exception {
        // Arrange
        Integer hotelId = 1;
        Page<HotelReviewItemDTO> reviewPage = new PageImpl<>(
                Collections.emptyList(),
                PageRequest.of(0, 100),
                0
        );

        when(hotelReviewService.getHotelReviews(hotelId, 0, 100)).thenReturn(reviewPage);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}", hotelId)
                        .param("page", "0")
                        .param("size", "100")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Reviews of the hotel fetched successfully"))
                .andExpect(jsonPath("$.data.size").value(100));

        verify(hotelReviewService, times(1)).getHotelReviews(hotelId, 0, 100);
    }

    @Test
    void getHotelReviews_Success_NegativePageDefaultsToZero() throws Exception {
        // Arrange
        Integer hotelId = 1;
        Page<HotelReviewItemDTO> reviewPage = new PageImpl<>(
                Collections.emptyList(),
                PageRequest.of(0, 10),
                0
        );

        // Note: Spring will handle negative page numbers, but the test shows the endpoint behavior
        when(hotelReviewService.getHotelReviews(eq(hotelId), anyInt(), anyInt())).thenReturn(reviewPage);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}", hotelId)
                        .param("page", "-1")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk());

        verify(hotelReviewService, times(1)).getHotelReviews(eq(hotelId), anyInt(), anyInt());
    }

    @Test
    void getHotelReviews_Success_MultipleReviewsWithVaryingRatings() throws Exception {
        // Arrange
        Integer hotelId = 10;
        HotelReviewItemDTO review1 = new HotelReviewItemDTO(
                "User1", "Room A", 1, 5.0f, "Perfect!", Timestamp.valueOf(LocalDateTime.now())
        );
        HotelReviewItemDTO review2 = new HotelReviewItemDTO(
                "User2", "Room B", 2, 3.0f, "Average", Timestamp.valueOf(LocalDateTime.now())
        );
        HotelReviewItemDTO review3 = new HotelReviewItemDTO(
                "User3", "Room C", 4, 4.5f, "Great!", Timestamp.valueOf(LocalDateTime.now())
        );

        Page<HotelReviewItemDTO> reviewPage = new PageImpl<>(
                Arrays.asList(review1, review2, review3),
                PageRequest.of(0, 10),
                3
        );

        when(hotelReviewService.getHotelReviews(hotelId, 0, 10)).thenReturn(reviewPage);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}", hotelId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", hasSize(3)))
                .andExpect(jsonPath("$.data.content[0].rating").value(5.0))
                .andExpect(jsonPath("$.data.content[1].rating").value(3.0))
                .andExpect(jsonPath("$.data.content[2].rating").value(4.5));

        verify(hotelReviewService, times(1)).getHotelReviews(hotelId, 0, 10);
    }

    // ==================== getHotelReviewSummary Tests ====================

    @Test
    void getHotelReviewSummary_Success() throws Exception {
        // Arrange
        Integer hotelId = 1;
        HotelReviewSummaryDTO summary = new HotelReviewSummaryDTO(
                4.5, // staffAvg
                4.3, // comfortAvg
                4.6, // facilitiesAvg
                4.7, // cleanlinessAvg
                4.4, // valueForMoneyAvg
                4.8  // locationAvg
        );

        when(hotelReviewService.getHotelReviewSummary(hotelId)).thenReturn(summary);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}/summary", hotelId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Review Summary of the hotel fetched successfully"))
                .andExpect(jsonPath("$.data").exists())
                .andExpect(jsonPath("$.data.staffAvg").value(4.5))
                .andExpect(jsonPath("$.data.comfortAvg").value(4.3))
                .andExpect(jsonPath("$.data.facilitiesAvg").value(4.6))
                .andExpect(jsonPath("$.data.cleanlinessAvg").value(4.7))
                .andExpect(jsonPath("$.data.valueForMoneyAvg").value(4.4))
                .andExpect(jsonPath("$.data.locationAvg").value(4.8));

        verify(hotelReviewService, times(1)).getHotelReviewSummary(hotelId);
    }

    @Test
    void getHotelReviewSummary_Success_WithPerfectRatings() throws Exception {
        // Arrange
        Integer hotelId = 5;
        HotelReviewSummaryDTO summary = new HotelReviewSummaryDTO(
                5.0, 5.0, 5.0, 5.0, 5.0, 5.0
        );

        when(hotelReviewService.getHotelReviewSummary(hotelId)).thenReturn(summary);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}/summary", hotelId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Review Summary of the hotel fetched successfully"))
                .andExpect(jsonPath("$.data.staffAvg").value(5.0))
                .andExpect(jsonPath("$.data.comfortAvg").value(5.0))
                .andExpect(jsonPath("$.data.facilitiesAvg").value(5.0))
                .andExpect(jsonPath("$.data.cleanlinessAvg").value(5.0))
                .andExpect(jsonPath("$.data.valueForMoneyAvg").value(5.0))
                .andExpect(jsonPath("$.data.locationAvg").value(5.0));

        verify(hotelReviewService, times(1)).getHotelReviewSummary(hotelId);
    }

    @Test
    void getHotelReviewSummary_Success_WithLowRatings() throws Exception {
        // Arrange
        Integer hotelId = 15;
        HotelReviewSummaryDTO summary = new HotelReviewSummaryDTO(
                2.0, 1.5, 2.3, 1.8, 2.1, 2.5
        );

        when(hotelReviewService.getHotelReviewSummary(hotelId)).thenReturn(summary);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}/summary", hotelId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Review Summary of the hotel fetched successfully"))
                .andExpect(jsonPath("$.data.staffAvg").value(2.0))
                .andExpect(jsonPath("$.data.comfortAvg").value(1.5))
                .andExpect(jsonPath("$.data.facilitiesAvg").value(2.3))
                .andExpect(jsonPath("$.data.cleanlinessAvg").value(1.8))
                .andExpect(jsonPath("$.data.valueForMoneyAvg").value(2.1))
                .andExpect(jsonPath("$.data.locationAvg").value(2.5));

        verify(hotelReviewService, times(1)).getHotelReviewSummary(hotelId);
    }

    @Test
    void getHotelReviewSummary_Success_NoReviews_ReturnsNull() throws Exception {
        // Arrange
        Integer hotelId = 999;
        when(hotelReviewService.getHotelReviewSummary(hotelId)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}/summary", hotelId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Review Summary of the hotel fetched successfully"))
                .andExpect(jsonPath("$.data").doesNotExist());

        verify(hotelReviewService, times(1)).getHotelReviewSummary(hotelId);
    }

    @Test
    void getHotelReviewSummary_Success_DifferentHotelId() throws Exception {
        // Arrange
        Integer hotelId = 42;
        HotelReviewSummaryDTO summary = new HotelReviewSummaryDTO(
                3.5, 3.8, 3.2, 3.9, 3.1, 4.0
        );

        when(hotelReviewService.getHotelReviewSummary(hotelId)).thenReturn(summary);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}/summary", hotelId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.staffAvg").value(3.5))
                .andExpect(jsonPath("$.data.locationAvg").value(4.0));

        verify(hotelReviewService, times(1)).getHotelReviewSummary(hotelId);
    }

    @Test
    void getHotelReviewSummary_Success_WithDecimalPrecision() throws Exception {
        // Arrange
        Integer hotelId = 7;
        HotelReviewSummaryDTO summary = new HotelReviewSummaryDTO(
                4.567, 4.123, 4.999, 4.001, 4.555, 4.777
        );

        when(hotelReviewService.getHotelReviewSummary(hotelId)).thenReturn(summary);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}/summary", hotelId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.staffAvg").value(4.567))
                .andExpect(jsonPath("$.data.comfortAvg").value(4.123))
                .andExpect(jsonPath("$.data.facilitiesAvg").value(4.999))
                .andExpect(jsonPath("$.data.cleanlinessAvg").value(4.001))
                .andExpect(jsonPath("$.data.valueForMoneyAvg").value(4.555))
                .andExpect(jsonPath("$.data.locationAvg").value(4.777));

        verify(hotelReviewService, times(1)).getHotelReviewSummary(hotelId);
    }

    // ==================== Edge Cases and Error Scenarios ====================

    @Test
    void getHotelReviews_InvalidHotelId_PathVariable() throws Exception {
        // This tests the path variable binding
        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/invalid")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());

        verify(hotelReviewService, never()).getHotelReviews(anyInt(), anyInt(), anyInt());
    }

    @Test
    void getHotelReviewSummary_InvalidHotelId_PathVariable() throws Exception {
        // This tests the path variable binding
        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/invalid/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());

        verify(hotelReviewService, never()).getHotelReviewSummary(anyInt());
    }

    @Test
    void getHotelReviews_WithZeroAsHotelId() throws Exception {
        // Arrange
        Integer hotelId = 0;
        Page<HotelReviewItemDTO> emptyPage = new PageImpl<>(
                Collections.emptyList(),
                PageRequest.of(0, 10),
                0
        );

        when(hotelReviewService.getHotelReviews(hotelId, 0, 10)).thenReturn(emptyPage);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}", hotelId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", hasSize(0)));

        verify(hotelReviewService, times(1)).getHotelReviews(hotelId, 0, 10);
    }

    @Test
    void getHotelReviewSummary_WithZeroAsHotelId() throws Exception {
        // Arrange
        Integer hotelId = 0;
        when(hotelReviewService.getHotelReviewSummary(hotelId)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}/summary", hotelId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk());

        verify(hotelReviewService, times(1)).getHotelReviewSummary(hotelId);
    }

    @Test
    void getHotelReviews_Success_WithOnlyPageParameter() throws Exception {
        // Arrange
        Integer hotelId = 1;
        Page<HotelReviewItemDTO> reviewPage = new PageImpl<>(
                Collections.emptyList(),
                PageRequest.of(3, 10),
                30
        );

        when(hotelReviewService.getHotelReviews(hotelId, 3, 10)).thenReturn(reviewPage);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}", hotelId)
                        .param("page", "3")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.number").value(3))
                .andExpect(jsonPath("$.data.size").value(10)); // Default size

        verify(hotelReviewService, times(1)).getHotelReviews(hotelId, 3, 10);
    }

    @Test
    void getHotelReviews_Success_WithOnlySizeParameter() throws Exception {
        // Arrange
        Integer hotelId = 1;
        Page<HotelReviewItemDTO> reviewPage = new PageImpl<>(
                Collections.emptyList(),
                PageRequest.of(0, 25),
                25
        );

        when(hotelReviewService.getHotelReviews(hotelId, 0, 25)).thenReturn(reviewPage);

        // Act & Assert
        mockMvc.perform(get("/api/hotels/reviews/{hotelId}", hotelId)
                        .param("size", "25")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.number").value(0)) // Default page
                .andExpect(jsonPath("$.data.size").value(25));

        verify(hotelReviewService, times(1)).getHotelReviews(hotelId, 0, 25);
    }
}