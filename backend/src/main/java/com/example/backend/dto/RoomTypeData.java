package com.example.backend.dto;
import lombok.Data;

@Data
public class RoomTypeData {
    private int roomTypeID;
    private String roomTypeName;
    private int numberOfGuests;
    private float price;
    private int quantity;

    public RoomTypeData(int roomTypeID, String roomTypeName, int numberOfGuests, float price, int quantity) {
        this.roomTypeID = roomTypeID;
        this.roomTypeName = roomTypeName;
        this.numberOfGuests = numberOfGuests;
        this.price = price;
        this.quantity = quantity;
    }

    public RoomTypeData() {
    }

}
