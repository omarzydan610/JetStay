package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hotel_amenities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelAmenity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "amenity_id")
  private Integer amenityID;

  @ManyToOne
  @JoinColumn(name = "hotel_id")
  private Hotel hotel;

  @Column(name = "amenity_name")
  private String amenityName;

  @Column(name = "price")
  private Float price;
}
