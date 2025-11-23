package com.example.backend.exception;

import com.example.backend.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

  // Handle custom base exceptions
  @ExceptionHandler(BaseException.class)
  public ResponseEntity<ErrorResponse> handleBaseException(
      BaseException ex,
      HttpServletRequest request) {

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

    ErrorResponse errorResponse = ErrorResponse.of(
        "Bad Request",
        ex.getMessage(),
        request.getRequestURI());

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  // Handle resource not found exception
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
      ResourceNotFoundException ex,
      HttpServletRequest request) {

    ErrorResponse errorResponse = ErrorResponse.of(
        "Not Found",
        ex.getMessage(),
        request.getRequestURI());

    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
  }

  // Handle bad request exception
  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ErrorResponse> handleBadRequestException(
      BadRequestException ex,
      HttpServletRequest request) {

    ErrorResponse errorResponse = ErrorResponse.of(
        "Bad Request",
        ex.getMessage(),
        request.getRequestURI());

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  // Handle unauthorized exception
  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<ErrorResponse> handleUnauthorizedException(
      UnauthorizedException ex,
      HttpServletRequest request) {

    ErrorResponse errorResponse = ErrorResponse.of(
        "Unauthorized",
        ex.getMessage(),
        request.getRequestURI());

    return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
  }

  // Handle internal server error exception
  @ExceptionHandler(InternalServerErrorException.class)
  public ResponseEntity<ErrorResponse> handleInternalServerErrorException(
      InternalServerErrorException ex,
      HttpServletRequest request) {

    ErrorResponse errorResponse = ErrorResponse.of(
        "Internal Server Error",
        ex.getMessage(),
        request.getRequestURI());

    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // Handle all other runtime exceptions
  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ErrorResponse> handleRuntimeException(
      RuntimeException ex,
      HttpServletRequest request) {

    ErrorResponse errorResponse = ErrorResponse.of(
        "Internal Server Error",
        ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred",
        request.getRequestURI());

    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // Handle all other exceptions
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGenericException(
      Exception ex,
      HttpServletRequest request) {

    ErrorResponse errorResponse = ErrorResponse.of(
        "Internal Server Error",
        "An unexpected error occurred",
        request.getRequestURI());

    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
