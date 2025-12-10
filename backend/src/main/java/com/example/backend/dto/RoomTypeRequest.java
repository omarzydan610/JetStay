package com.example.backend.dto;

import lombok.Data;

@Data
public class RoomTypeRequest {

    private int hotelId;
    private String roomTypeName;
    private float price;
    private String description;
    private int quantity;
    private int numberOfGuests;

    public void setPrice(double price) {
        this.price = (float) price;
    }
    public void setCapacity(int capacity) {
        this.numberOfGuests = capacity;
    }
}