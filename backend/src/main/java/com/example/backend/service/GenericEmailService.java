package com.example.backend.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;

@Service
public class GenericEmailService {

  @Autowired
  private JavaMailSender mailSender;

  /**
   * Send HTML email
   */
  public void sendEmail(String to, String subject, String htmlContent) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true);

      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(htmlContent, true);
      helper.setFrom("jetstay.help@gmail.com");
      mailSender.send(message);
      
    } catch (Exception e) {
      e.printStackTrace();
      throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
    }
  }
}