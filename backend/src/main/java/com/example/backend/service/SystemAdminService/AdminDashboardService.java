package com.example.backend.service.SystemAdminService;

import com.example.backend.dto.AdminDashboard.*;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.User;
import com.example.backend.mapper.AirlineViewDataMapper;
import com.example.backend.mapper.HotelViewDataMapper;
import com.example.backend.mapper.UserViewDataMapper;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AdminDashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    public Page<UserDataDTO> getUsersByCriteria (UserViewCriteriaDTO criteria){
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize());
        Page<User> usersPage = userRepository.findUsersWithFilters(
                criteria.getSearch(),
                criteria.getRole(),
                criteria.getStatus(),
                pageable
        );
        UserViewDataMapper usermapper = new UserViewDataMapper();
        return usersPage.map(usermapper::DataToDTO);
    }

    public Page<HotelDataDTO> getHotelsByCriteria (HotelViewCriteriaDTO criteria){
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize());
        Page<Hotel> hotelPage = hotelRepository.findHotelsWithFilters(
                criteria.getSearch(),
                criteria.getCity(),
                criteria.getCountry(),
                criteria.getStatus(),
                pageable
        );
        HotelViewDataMapper hotelmapper = new HotelViewDataMapper();
        return hotelPage.map(hotelmapper::DataToDTO);
    }

    public Page<AirlineDataDTO> getAirlinesByCriteria (AirlineViewCriteriaDTO criteria){
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize());
        Page<Airline> airlinePage = airlineRepository.findAirlinesWithFilters(
                criteria.getSearch(),
                criteria.getNationality(),
                criteria.getStatus(),
                pageable
        );
        AirlineViewDataMapper airlinemapper = new AirlineViewDataMapper();
        return airlinePage.map(airlinemapper::DataToDTO);
    }
}
