package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "room_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomImage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "image_id")
  private Integer imageID;

  @ManyToOne
  @JoinColumn(name = "room_type_id", nullable = false)
  private RoomType roomType;

  @Column(name = "image_url", nullable = false)
  private String imageUrl;
}
