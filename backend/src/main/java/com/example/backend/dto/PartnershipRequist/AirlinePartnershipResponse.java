package com.example.backend.dto.PartnershipRequist;
import java.time.LocalDateTime;

public class AirlinePartnershipResponse {
    private Integer airlineID;
    private String airlineName;
    private String airlineNationality;
    private String managerEmail;
    private String airlineLogoPath;
    private Integer numberOfRates;
    private LocalDateTime createdAt;
    private String status;
    
    // Getters and Setters
    public Integer getAirlineID() { return airlineID; }
    public void setAirlineID(Integer airlineID) { this.airlineID = airlineID; }
    
    public String getAirlineName() { return airlineName; }
    public void setAirlineName(String airlineName) { this.airlineName = airlineName; }
    
    public String getAirlineNationality() { return airlineNationality; }
    public void setAirlineNationality(String airlineNationality) { this.airlineNationality = airlineNationality; }
    
    public String getManagerEmail() { return managerEmail; }
    public void setManagerEmail(String managerEmail) { this.managerEmail = managerEmail; }
    
    public String getAirlineLogoPath() { return airlineLogoPath; }
    public void setAirlineLogoPath(String airlineLogoPath) { this.airlineLogoPath = airlineLogoPath; }
    
    public Integer getNumberOfRates() { return numberOfRates; }
    public void setNumberOfRates(Integer numberOfRates) { this.numberOfRates = numberOfRates; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}