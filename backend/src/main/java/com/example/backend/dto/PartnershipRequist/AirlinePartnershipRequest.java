package com.example.backend.dto.PartnershipRequist;

import org.springframework.web.multipart.MultipartFile;

public class AirlinePartnershipRequest {
    private String airlineName;
    private String airlineNationality;
    private String adminFirstName;
    private String adminLastName;
    private String adminPhone;
    private String managerEmail;
    private String managerPassword;
    private MultipartFile airlineLogo;
    
    // Getters and Setters
    public String getAirlineName() { return airlineName; }
    public void setAirlineName(String airlineName) { this.airlineName = airlineName; }
    
    public String getAirlineNationality() { return airlineNationality; }
    public void setAirlineNationality(String airlineNationality) { this.airlineNationality = airlineNationality; }
    
    public String getAdminFirstName() { return adminFirstName; }
    public void setAdminFirstName(String adminFirstName) { this.adminFirstName = adminFirstName; }
    
    public String getAdminLastName() { return adminLastName; }
    public void setAdminLastName(String adminLastName) { this.adminLastName = adminLastName; }
    
    public String getAdminPhone() { return adminPhone; }
    public void setAdminPhone(String adminPhone) { this.adminPhone = adminPhone; }
    
    public String getManagerEmail() { return managerEmail; }
    public void setManagerEmail(String managerEmail) { this.managerEmail = managerEmail; }
    
    public String getManagerPassword() { return managerPassword; }
    public void setManagerPassword(String managerPassword) { this.managerPassword = managerPassword; }
    
    public MultipartFile getAirlineLogo() { return airlineLogo; }
    public void setAirlineLogo(MultipartFile airlineLogo) { this.airlineLogo = airlineLogo; }
}
