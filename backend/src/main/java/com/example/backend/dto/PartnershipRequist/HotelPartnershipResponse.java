package com.example.backend.dto.PartnershipRequist;

import java.time.LocalDateTime;

public class HotelPartnershipResponse {
    private Integer hotelID;
    private String hotelName;
    private Double latitude;
    private Double longitude;
    private String city;
    private String country;
    private String managerEmail;
    private String hotelLogoPath;
    private LocalDateTime createdAt;
    private String status;
    
    // Getters and Setters
    public Integer getHotelID() { return hotelID; }
    public void setHotelID(Integer hotelID) { this.hotelID = hotelID; }
    
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
    
    public String getManagerEmail() { return managerEmail; }
    public void setManagerEmail(String managerEmail) { this.managerEmail = managerEmail; }
    
    public String getHotelLogoPath() { return hotelLogoPath; }
    public void setHotelLogoPath(String hotelLogoPath) { this.hotelLogoPath = hotelLogoPath; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}