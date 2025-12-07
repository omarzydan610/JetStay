package com.example.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
  @Builder.Default
  private boolean success = false;

  private String error;
  private String message;
  private String path;
  private List<String> errors;

  @Builder.Default
  private LocalDateTime timestamp = LocalDateTime.now();

  // Simple error response
  public static ErrorResponse of(String error, String message, String path) {
    return ErrorResponse.builder()
        .success(false)
        .error(error)
        .message(message)
        .path(path)
        .timestamp(LocalDateTime.now())
        .build();
  }

  // Error response with validation errors
  public static ErrorResponse of(String error, String message, String path, List<String> errors) {
    return ErrorResponse.builder()
        .success(false)
        .error(error)
        .message(message)
        .path(path)
        .errors(errors)
        .timestamp(LocalDateTime.now())
        .build();
  }
}
