package com.example.backend.exception;

import com.example.backend.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @Value("${spring.profiles.active:dev}")
  private String activeProfile;

  private boolean isProduction() {
    return "prod".equals(activeProfile) || "production".equals(activeProfile);
  }

  // Handle custom base exceptions (covers all BaseException subclasses)
  @ExceptionHandler(BaseException.class)
  public ResponseEntity<ErrorResponse> handleBaseException(
      BaseException ex,
      HttpServletRequest request) {

    logger.warn("BaseException occurred: {} - {} at {}", 
        ex.getClass().getSimpleName(), 
        ex.getMessage(), 
        request.getRequestURI());

    ErrorResponse errorResponse = ErrorResponse.of(
        ex.getStatus().getReasonPhrase(),
        ex.getMessage(),
        request.getRequestURI());

    return new ResponseEntity<>(errorResponse, ex.getStatus());
  }

  // Handle validation errors
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationException(
      MethodArgumentNotValidException ex,
      HttpServletRequest request) {

    List<String> validationErrors = ex.getBindingResult()
        .getFieldErrors()
        .stream()
        .map(error -> error.getField() + ": " + error.getDefaultMessage())
        .collect(Collectors.toList());

    logger.debug("Validation failed for {}: {}", request.getRequestURI(), validationErrors);

    ErrorResponse errorResponse = ErrorResponse.of(
        "Validation Failed",
        "Invalid input data",
        request.getRequestURI(),
        validationErrors);

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  // Handle illegal argument exceptions
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
      IllegalArgumentException ex,
      HttpServletRequest request) {

    logger.warn("IllegalArgumentException at {}: {}", request.getRequestURI(), ex.getMessage());

    ErrorResponse errorResponse = ErrorResponse.of(
        "Bad Request",
        ex.getMessage(),
        request.getRequestURI());

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  // Handle all other runtime exceptions
  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ErrorResponse> handleRuntimeException(
      RuntimeException ex,
      HttpServletRequest request) {

    // Log the full exception with stack trace for debugging
    logger.error("RuntimeException occurred at {}: {}", 
        request.getRequestURI(), 
        ex.getMessage(), 
        ex);

    // Don't expose internal error details in production
    String errorMessage = isProduction() 
        ? "An unexpected error occurred. Please try again later."
        : (ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred");

    ErrorResponse errorResponse = ErrorResponse.of(
        "Internal Server Error",
        errorMessage,
        request.getRequestURI());

    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // Handle all other exceptions
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGenericException(
      Exception ex,
      HttpServletRequest request) {

    // Log the full exception with stack trace for debugging
    logger.error("Unexpected exception occurred at {}: {}", 
        request.getRequestURI(), 
        ex.getMessage(), 
        ex);

    // Never expose internal error details in production
    String errorMessage = isProduction() 
        ? "An unexpected error occurred. Please try again later."
        : "An unexpected error occurred";

    ErrorResponse errorResponse = ErrorResponse.of(
        "Internal Server Error",
        errorMessage,
        request.getRequestURI());

    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }
  // Handle malformed JSON requests
  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(
          HttpMessageNotReadableException ex,
          HttpServletRequest request) {

    logger.warn("Malformed JSON request at {}: {}", request.getRequestURI(), ex.getMessage());

    String message = "Malformed JSON request";
    if (!isProduction() && ex.getMostSpecificCause() != null) {
      message += ": " + ex.getMostSpecificCause().getMessage();
    }

    ErrorResponse errorResponse = ErrorResponse.of(
            "Bad Request",
            message,
            request.getRequestURI()
    );

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }
}
