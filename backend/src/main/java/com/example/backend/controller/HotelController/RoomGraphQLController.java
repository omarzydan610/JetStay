package com.example.backend.controller.HotelController;

import com.example.backend.dto.HotelDTO.RoomFilterDTO;
import com.example.backend.entity.RoomType;
import com.example.backend.repository.RoomTypeRepository;
import com.example.backend.service.HotelService.RoomGraphQLService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class RoomGraphQLController {

    @Autowired
    private final RoomTypeRepository roomRepository;

    @Autowired
    private final RoomGraphQLService roomGraphQLService;

    public RoomGraphQLController(RoomTypeRepository roomRepository, RoomGraphQLService roomGraphQLService) {
        this.roomRepository = roomRepository;
        this.roomGraphQLService = roomGraphQLService;
    }

    @QueryMapping
    public List<RoomType> rooms(@Argument RoomFilterDTO filter,
                                @Argument int page,
                                @Argument int size) {
        return roomGraphQLService.filterRooms(filter, roomRepository, page, size);
    }
}