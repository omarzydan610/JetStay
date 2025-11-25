package com.example.backend.dto.PartnershipRequist;

import org.springframework.web.multipart.MultipartFile;

public class HotelPartnershipRequest {
    private String hotelName;
    private Double latitude;
    private Double longitude;
    private String city;
    private String country;
    private String adminFirstName;
    private String adminLastName;
    private String adminPhone;
    private String managerEmail;
    private String managerPassword;
    private MultipartFile hotelLogo;
    
    // Getters and Setters
    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
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
    
    public MultipartFile getHotelLogo() { return hotelLogo; }
    public void setHotelLogo(MultipartFile hotelLogo) { this.hotelLogo = hotelLogo; }
}