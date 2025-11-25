package com.example.backend.service.AuthService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.backend.exception.BadRequestException;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtPassResetService {

  @Value("${jwt.password-reset.secret}")
  private String secretKeyString;

  private static final long PASSWORD_RESET_TOKEN_EXPIRATION_TIME = 600000; // 10 minutes

  private SecretKey getSecretKey() {
    return Keys.hmacShaKeyFor(secretKeyString.getBytes());
  }

  public String generatePasswordResetToken(String email, String otp) {
    return Jwts.builder()
        .claim("email", email)
        .claim("otp", otp)
        .claim("purpose", "password_reset")
        .subject(email)
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + PASSWORD_RESET_TOKEN_EXPIRATION_TIME))
        .signWith(getSecretKey())
        .compact();
  }

  public Claims validateToken(String token) {
    try {
      return Jwts.parser()
          .verifyWith(getSecretKey())
          .build()
          .parseSignedClaims(token)
          .getPayload();
    } catch (Exception e) {
      throw new BadRequestException("Invalid or expired reset token");
    }
  }

  public String extractEmail(String token) {
    Claims claims = validateToken(token);
    return claims.get("email", String.class);
  }

  public boolean isTokenValid(String token, String email) {
    try {
      Claims claims = validateToken(token);
      String tokenEmail = claims.get("email", String.class);
      String purpose = claims.get("purpose", String.class);

      return tokenEmail.equals(email) &&
          "password_reset".equals(purpose) &&
          !claims.getExpiration().before(new Date());
    } catch (Exception e) {
      return false;
    }
  }
}
