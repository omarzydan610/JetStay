package com.example.backend.controller.Hotel_data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.RoomTypeDTO;
import com.example.backend.dto.RoomTypeData;
import com.example.backend.entity.RoomType;
import com.example.backend.service.Hotel_data.RoomTypeService;

@RestController
@RequestMapping("/api/room-type")
public class RoomTypeController {

    @Autowired
    private RoomTypeService roomTypeService;

    @GetMapping("/hotel/{hotelId}")
    public java.util.List<RoomTypeData> getHotelRoomTypes(@PathVariable int hotelId) {
        return roomTypeService.getRoomTypesByHotelId(hotelId);
    }

    @PostMapping("/add")
    public String addRoomType(@RequestBody RoomTypeDTO roomTypeDTO) {
        roomTypeService.addRoomType(roomTypeDTO);
        return "Room type added";
        
        }

    @PatchMapping("/update/{roomTypeId}")
    public String updateRoomType(@RequestBody RoomTypeDTO roomTypeDTO, @PathVariable int roomTypeId) {
        roomTypeService.updateRoomType(roomTypeDTO, roomTypeId);    
        return "Room type updated";
    }

    @DeleteMapping("/delete/{roomTypeId}")
    public String deleteRoomType(@PathVariable int roomTypeId) {
        roomTypeService.deleteRoomType(roomTypeId);
        return "Room type deleted";
    }

    @GetMapping("/{roomTypeId}")
    public RoomType getRoomType(@PathVariable int roomTypeId) {
        return roomTypeService.getRoomTypeById(roomTypeId);
    }

}
