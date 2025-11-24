package com.example.backend.dto;

import lombok.Data;

@Data
public class RoomTypeDTO {

    private int hotelId;
    private String roomTypeName;
    private float price;
    private String description;
    private int quantity;
    private int numberOfGuests;

}