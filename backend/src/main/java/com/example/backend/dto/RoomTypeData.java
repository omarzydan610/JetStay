package com.example.backend.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RoomTypeData {
    private int roomTypeID;
    private String roomTypeName;
    private int numberOfGuests;
    private float price;
    private int quantity;

   
}
