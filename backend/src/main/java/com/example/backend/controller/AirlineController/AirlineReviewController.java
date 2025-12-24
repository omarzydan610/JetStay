package com.example.backend.controller.AirlineController;

import com.example.backend.dto.AirlineDTO.AirlineReviewItemDTO;
import com.example.backend.dto.AirlineDTO.AirlineReviewRequest;
import com.example.backend.dto.AirlineDTO.AirlineReviewSummaryDTO;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.AirlineService.AirlineReviewService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/airlines/reviews")
public class AirlineReviewController {

    @Autowired
    AirlineReviewService airlineReviewService;

    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody AirlineReviewRequest request) {
        Claims claims = getClaims();
        boolean flag = airlineReviewService.addReview(claims.get("user_id", Integer.class), request);
        if(flag) {
            return ResponseEntity.ok(SuccessResponse.of("Review is added successfully"));
        }else {
            return ResponseEntity.ok(SuccessResponse.of("Your comment needs System Admin approval !"));
        }
    }

    @PutMapping("/edit")
    public ResponseEntity<?> editReview(@RequestBody AirlineReviewRequest request) {
        Claims claims = getClaims();
        boolean flag = airlineReviewService.editReview(claims.get("user_id", Integer.class), request);
        if(flag) {
            return ResponseEntity.ok(SuccessResponse.of("Review is edited successfully"));
        }else {
            return ResponseEntity.ok(SuccessResponse.of("Your comment needs System Admin approval !"));
        }
    }

    @DeleteMapping("/delete/{ticketId}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer ticketId) {
        Claims claims = getClaims();
        airlineReviewService.deleteReview(claims.get("user_id", Integer.class),ticketId);
        return ResponseEntity.ok(SuccessResponse.of("Review is deleted successfully"));
    }

    @GetMapping("/{airlineId}")
    public ResponseEntity<?> getAirlineReviews(
            @PathVariable Integer airlineId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<AirlineReviewItemDTO> data = airlineReviewService.getAirlineReviews(airlineId, page, size);
        return ResponseEntity.ok(SuccessResponse.of("Reviews of the airline fetched successfully",data));
    }

    @GetMapping("/{airlineId}/summary")
    public ResponseEntity<?> getAirlineReviewSummary(@PathVariable Integer airlineId) {
        AirlineReviewSummaryDTO data = airlineReviewService.getAirlineReviewSummary(airlineId);
        return ResponseEntity.ok(SuccessResponse.of("Review Summary of the airline fetched successfully",data));
    }

    private static Claims getClaims() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        return claims;
    }
}
