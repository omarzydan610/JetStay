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

  @Column(name = "room_type_name", nullable = false)
  private String roomTypeName;

  @Column(name = "number_of_guests", nullable = false)
  private Integer numberOfGuests;

  @ManyToOne
  @JoinColumn(name = "hotel_id", nullable = false)
  private Hotel hotel;

  @Column(name = "quantity", nullable = false)
  private Integer quantity;

  @Column(name = "description")
  private String description;

  @Column(name = "price", nullable = false)
  private Float price;
}
