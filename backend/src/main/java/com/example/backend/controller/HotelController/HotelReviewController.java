package com.example.backend.controller.HotelController;

import com.example.backend.dto.HotelDTO.HotelReviewItemDTO;
import com.example.backend.dto.HotelDTO.HotelReviewRequest;
import com.example.backend.dto.HotelDTO.HotelReviewSummaryDTO;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.HotelService.HotelReviewService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/hotels/reviews")
public class HotelReviewController {

    @Autowired
    private HotelReviewService hotelReviewService;

    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody HotelReviewRequest request) {
        Claims claims = getClaims();
        boolean flag = hotelReviewService.addReview(claims.get("user_id", Integer.class), request);
        if(flag) {
            return ResponseEntity.ok(SuccessResponse.of("Review is added successfully"));
        }else {
            return ResponseEntity.ok(SuccessResponse.of("Your comment needs System Admin approval !"));
        }
    }

    @PutMapping("/edit")
    public ResponseEntity<?> editReview(@RequestBody HotelReviewRequest request) {
        Claims claims = getClaims();
        boolean flag = hotelReviewService.editReview(claims.get("user_id", Integer.class), request);
        if(flag) {
            return ResponseEntity.ok(SuccessResponse.of("Review is edited successfully"));
        }else {
            return ResponseEntity.ok(SuccessResponse.of("Your comment needs System Admin approval !"));
        }
    }

    @DeleteMapping("/delete/{bookingTransactionId}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer bookingTransactionId) {
        Claims claims = getClaims();
        hotelReviewService.deleteReview(claims.get("user_id", Integer.class),bookingTransactionId);
        return ResponseEntity.ok(SuccessResponse.of("Review is deleted successfully"));
    }

    @GetMapping("/{hotelId}")
    public ResponseEntity<?> getHotelReviews(
            @PathVariable Integer hotelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<HotelReviewItemDTO> data = hotelReviewService.getHotelReviews(hotelId, page, size);
        return ResponseEntity.ok(SuccessResponse.of("Reviews of the hotel fetched successfully",data));
    }

    @GetMapping("/{hotelId}/summary")
    public ResponseEntity<?> getHotelReviewSummary(@PathVariable Integer hotelId) {
        HotelReviewSummaryDTO data = hotelReviewService.getHotelReviewSummary(hotelId);
        return ResponseEntity.ok(SuccessResponse.of("Review Summary of the hotel fetched successfully",data));
    }

    private static Claims getClaims() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        return claims;
    }
}
