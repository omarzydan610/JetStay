package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "room_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomType {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "room_type_id")
  private Integer roomTypeID;

  @Column(name = "room_type_name")
  private String roomTypeName;

  @Column(name = "number_of_guests")
  private Integer numberOfGuests;

  @ManyToOne
  @JoinColumn(name = "hotel_id")
  private Hotel hotel;

  @Column(name = "quantity")
  private Integer quantity;

  @Column(name = "description")
  private String description;

  @Column(name = "price")
  private Float price;
}
