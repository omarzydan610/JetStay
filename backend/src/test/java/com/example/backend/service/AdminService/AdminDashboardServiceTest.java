package com.example.backend.service.AdminService;

import com.example.backend.dto.AdminDashboard.*;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.User;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.SystemAdminService.AdminDashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AdminDashboardService Tests")
class AdminDashboardServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private AirlineRepository airlineRepository;

    @InjectMocks
    private AdminDashboardService adminDashboardService;

    // ==================== USER TESTS ====================

    @Nested
    @DisplayName("getUsersByCriteria Tests")
    class GetUsersByCriteriaTests {

        private UserViewCriteriaDTO criteria;
        private User testUser1;
        private User testUser2;
        private List<User> userList;

        @BeforeEach
        void setUp() {
            // Setup test criteria
            criteria = new UserViewCriteriaDTO();
            criteria.setSearch("john");
            criteria.setRole(User.UserRole.CLIENT);
            criteria.setStatus(User.UserStatus.ACTIVE);
            criteria.setPage(0);
            criteria.setSize(10);

            // Setup test users
            testUser1 = new User();
            testUser1.setUserID(1);
            testUser1.setFirstName("John");
            testUser1.setLastName("Doe");
            testUser1.setEmail("john.doe@example.com");
            testUser1.setPhoneNumber("1234567890");
            testUser1.setRole(User.UserRole.CLIENT);
            testUser1.setStatus(User.UserStatus.ACTIVE);

            testUser2 = new User();
            testUser2.setUserID(2);
            testUser2.setFirstName("John");
            testUser2.setLastName("Smith");
            testUser2.setEmail("john.smith@example.com");
            testUser2.setPhoneNumber("0987654321");
            testUser2.setRole(User.UserRole.CLIENT);
            testUser2.setStatus(User.UserStatus.ACTIVE);

            userList = Arrays.asList(testUser1, testUser2);
        }

        @Test
        @DisplayName("Should return paginated users with all filters applied")
        void shouldReturnPaginatedUsersWithAllFilters() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            Page<User> userPage = new PageImpl<>(userList, pageable, userList.size());

            when(userRepository.findUsersWithFilters(
                    eq("john"),
                    eq(User.UserRole.CLIENT),
                    eq(User.UserStatus.ACTIVE),
                    any(Pageable.class)
            )).thenReturn(userPage);

            // Act
            Page<UserDataDTO> result = adminDashboardService.getUsersByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals(2, result.getTotalElements());
            assertEquals(2, result.getContent().size());

            UserDataDTO firstUser = result.getContent().get(0);
            assertEquals(1, firstUser.getId());
            assertEquals("John", firstUser.getFirstName());
            assertEquals("Doe", firstUser.getLastName());
            assertEquals("john.doe@example.com", firstUser.getEmail());
            assertEquals("1234567890", firstUser.getPhoneNumber());
            assertEquals(User.UserRole.CLIENT, firstUser.getRole());
            assertEquals(User.UserStatus.ACTIVE, firstUser.getStatus());

            // Verify repository was called with correct parameters
            verify(userRepository, times(1)).findUsersWithFilters(
                    eq("john"),
                    eq(User.UserRole.CLIENT),
                    eq(User.UserStatus.ACTIVE),
                    any(Pageable.class)
            );
        }

        @Test
        @DisplayName("Should return paginated users with null filters")
        void shouldReturnPaginatedUsersWithNullFilters() {
            // Arrange
            criteria.setSearch(null);
            criteria.setRole(null);
            criteria.setStatus(null);

            Pageable pageable = PageRequest.of(0, 10);
            Page<User> userPage = new PageImpl<>(userList, pageable, userList.size());

            when(userRepository.findUsersWithFilters(
                    isNull(),
                    isNull(),
                    isNull(),
                    any(Pageable.class)
            )).thenReturn(userPage);

            // Act
            Page<UserDataDTO> result = adminDashboardService.getUsersByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals(2, result.getTotalElements());
            verify(userRepository, times(1)).findUsersWithFilters(
                    isNull(),
                    isNull(),
                    isNull(),
                    any(Pageable.class)
            );
        }

        @Test
        @DisplayName("Should return empty page when no users match criteria")
        void shouldReturnEmptyPageWhenNoUsersMatch() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            Page<User> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);

            when(userRepository.findUsersWithFilters(
                    anyString(),
                    any(),
                    any(),
                    any(Pageable.class)
            )).thenReturn(emptyPage);

            // Act
            Page<UserDataDTO> result = adminDashboardService.getUsersByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals(0, result.getTotalElements());
            assertTrue(result.getContent().isEmpty());
        }

        @Test
        @DisplayName("Should handle different page sizes correctly")
        void shouldHandleDifferentPageSizesCorrectly() {
            // Arrange
            criteria.setPage(1);
            criteria.setSize(5);

            Pageable pageable = PageRequest.of(1, 5);
            Page<User> userPage = new PageImpl<>(Collections.singletonList(testUser1), pageable, 10);

            when(userRepository.findUsersWithFilters(
                    anyString(),
                    any(),
                    any(),
                    any(Pageable.class)
            )).thenReturn(userPage);

            // Act
            Page<UserDataDTO> result = adminDashboardService.getUsersByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals(10, result.getTotalElements());
            assertEquals(1, result.getContent().size());
            assertEquals(1, result.getNumber()); // Current page
            assertEquals(5, result.getSize()); // Page size
        }

        @Test
        @DisplayName("Should correctly map all User fields to UserDataDTO")
        void shouldCorrectlyMapAllUserFields() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            Page<User> userPage = new PageImpl<>(Collections.singletonList(testUser1), pageable, 1);

            when(userRepository.findUsersWithFilters(
                    anyString(),
                    any(),
                    any(),
                    any(Pageable.class)
            )).thenReturn(userPage);

            // Act
            Page<UserDataDTO> result = adminDashboardService.getUsersByCriteria(criteria);

            // Assert
            UserDataDTO dto = result.getContent().get(0);
            assertEquals(testUser1.getUserID(), dto.getId());
            assertEquals(testUser1.getFirstName(), dto.getFirstName());
            assertEquals(testUser1.getLastName(), dto.getLastName());
            assertEquals(testUser1.getEmail(), dto.getEmail());
            assertEquals(testUser1.getPhoneNumber(), dto.getPhoneNumber());
            assertEquals(testUser1.getRole(), dto.getRole());
            assertEquals(testUser1.getStatus(), dto.getStatus());
        }

        @Test
        @DisplayName("Should filter by ADMIN role")
        void shouldFilterByAdminRole() {
            // Arrange
            criteria.setRole(User.UserRole.SYSTEM_ADMIN);
            testUser1.setRole(User.UserRole.SYSTEM_ADMIN);

            Pageable pageable = PageRequest.of(0, 10);
            Page<User> userPage = new PageImpl<>(Collections.singletonList(testUser1), pageable, 1);

            when(userRepository.findUsersWithFilters(
                    anyString(),
                    eq(User.UserRole.SYSTEM_ADMIN),
                    any(),
                    any(Pageable.class)
            )).thenReturn(userPage);

            // Act
            Page<UserDataDTO> result = adminDashboardService.getUsersByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals(1, result.getTotalElements());
            assertEquals(User.UserRole.SYSTEM_ADMIN, result.getContent().get(0).getRole());
            verify(userRepository).findUsersWithFilters(
                    anyString(),
                    eq(User.UserRole.SYSTEM_ADMIN),
                    any(),
                    any(Pageable.class)
            );
        }

        @Test
        @DisplayName("Should filter by INACTIVE status")
        void shouldFilterByInactiveStatus() {
            // Arrange
            criteria.setStatus(User.UserStatus.DEACTIVATED);
            testUser1.setStatus(User.UserStatus.DEACTIVATED);

            Pageable pageable = PageRequest.of(0, 10);
            Page<User> userPage = new PageImpl<>(Collections.singletonList(testUser1), pageable, 1);

            when(userRepository.findUsersWithFilters(
                    anyString(),
                    any(),
                    eq(User.UserStatus.DEACTIVATED),
                    any(Pageable.class)
            )).thenReturn(userPage);

            // Act
            Page<UserDataDTO> result = adminDashboardService.getUsersByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals(User.UserStatus.DEACTIVATED, result.getContent().get(0).getStatus());
            verify(userRepository).findUsersWithFilters(
                    anyString(),
                    any(),
                    eq(User.UserStatus.DEACTIVATED),
                    any(Pageable.class)
            );
        }
    }

    // ==================== HOTEL TESTS ====================

    @Nested
    @DisplayName("getHotelsByCriteria Tests")
    class GetHotelsByCriteriaTests {

        private HotelViewCriteriaDTO criteria;
        private Hotel testHotel1;
        private Hotel testHotel2;
        private List<Hotel> hotelList;

        @BeforeEach
        void setUp() {
            // Setup test criteria
            criteria = new HotelViewCriteriaDTO();
            criteria.setSearch("Grand");
            criteria.setCountry("USA");
            criteria.setCity("New York");
            criteria.setStatus(Hotel.Status.ACTIVE);
            criteria.setPage(0);
            criteria.setSize(10);

            // Setup test hotels
            testHotel1 = new Hotel();
            testHotel1.setHotelID(1);
            testHotel1.setHotelName("Grand Hotel");
            testHotel1.setLogoUrl("http://example.com/logo1.png");
            testHotel1.setCountry("USA");
            testHotel1.setCity("New York");
            testHotel1.setHotelRate(4.5f);
            testHotel1.setStatus(Hotel.Status.ACTIVE);

            testHotel2 = new Hotel();
            testHotel2.setHotelID(2);
            testHotel2.setHotelName("Grand Plaza");
            testHotel2.setLogoUrl("http://example.com/logo2.png");
            testHotel2.setCountry("USA");
            testHotel2.setCity("New York");
            testHotel2.setHotelRate(4.8f);
            testHotel2.setStatus(Hotel.Status.ACTIVE);

            hotelList = Arrays.asList(testHotel1, testHotel2);
        }

        @Test
        @DisplayName("Should return paginated hotels with all filters applied")
        void shouldReturnPaginatedHotelsWithAllFilters() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            Page<Hotel> hotelPage = new PageImpl<>(hotelList, pageable, hotelList.size());

            when(hotelRepository.findHotelsWithFilters(
                    eq("Grand"),
                    eq("New York"),
                    eq("USA"),
                    eq(Hotel.Status.ACTIVE),
                    any(Pageable.class)
            )).thenReturn(hotelPage);

            // Act
            Page<HotelDataDTO> result = adminDashboardService.getHotelsByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals(2, result.getTotalElements());
            assertEquals(2, result.getContent().size());

            HotelDataDTO firstHotel = result.getContent().get(0);
            assertEquals(1, firstHotel.getId());
            assertEquals("Grand Hotel", firstHotel.getName());
            assertEquals("http://example.com/logo1.png", firstHotel.getLogoURL());
            assertEquals("USA", firstHotel.getCountry());
            assertEquals("New York", firstHotel.getCity());
            assertEquals(4.5f, firstHotel.getRate());
            assertEquals(Hotel.Status.ACTIVE, firstHotel.getStatus());

            verify(hotelRepository, times(1)).findHotelsWithFilters(
                    eq("Grand"),
                    eq("New York"),
                    eq("USA"),
                    eq(Hotel.Status.ACTIVE),
                    any(Pageable.class)
            );
        }

        @Test
        @DisplayName("Should return paginated hotels with null filters")
        void shouldReturnPaginatedHotelsWithNullFilters() {
            // Arrange
            criteria.setSearch(null);
            criteria.setCountry(null);
            criteria.setCity(null);
            criteria.setStatus(null);

            Pageable pageable = PageRequest.of(0, 10);
            Page<Hotel> hotelPage = new PageImpl<>(hotelList, pageable, hotelList.size());

            when(hotelRepository.findHotelsWithFilters(
                    isNull(),
                    isNull(),
                    isNull(),
                    isNull(),
                    any(Pageable.class)
            )).thenReturn(hotelPage);

            // Act
            Page<HotelDataDTO> result = adminDashboardService.getHotelsByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals(2, result.getTotalElements());
            verify(hotelRepository, times(1)).findHotelsWithFilters(
                    isNull(),
                    isNull(),
                    isNull(),
                    isNull(),
                    any(Pageable.class)
            );
        }

        @Test
        @DisplayName("Should return empty page when no hotels match criteria")
        void shouldReturnEmptyPageWhenNoHotelsMatch() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            Page<Hotel> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);

            when(hotelRepository.findHotelsWithFilters(
                    anyString(),
                    anyString(),
                    anyString(),
                    any(),
                    any(Pageable.class)
            )).thenReturn(emptyPage);

            // Act
            Page<HotelDataDTO> result = adminDashboardService.getHotelsByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals(0, result.getTotalElements());
            assertTrue(result.getContent().isEmpty());
        }

        @Test
        @DisplayName("Should handle different page numbers correctly")
        void shouldHandleDifferentPageNumbersCorrectly() {
            // Arrange
            criteria.setPage(2);
            criteria.setSize(5);

            Pageable pageable = PageRequest.of(2, 5);
            Page<Hotel> hotelPage = new PageImpl<>(Collections.singletonList(testHotel1), pageable, 15);

            when(hotelRepository.findHotelsWithFilters(
                    anyString(),
                    anyString(),
                    anyString(),
                    any(),
                    any(Pageable.class)
            )).thenReturn(hotelPage);

            // Act
            Page<HotelDataDTO> result = adminDashboardService.getHotelsByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals(15, result.getTotalElements());
            assertEquals(1, result.getContent().size());
            assertEquals(2, result.getNumber());
            assertEquals(5, result.getSize());
        }

        @Test
        @DisplayName("Should correctly map all Hotel fields to HotelDataDTO")
        void shouldCorrectlyMapAllHotelFields() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            Page<Hotel> hotelPage = new PageImpl<>(Collections.singletonList(testHotel1), pageable, 1);

            when(hotelRepository.findHotelsWithFilters(
                    anyString(),
                    anyString(),
                    anyString(),
                    any(),
                    any(Pageable.class)
            )).thenReturn(hotelPage);

            // Act
            Page<HotelDataDTO> result = adminDashboardService.getHotelsByCriteria(criteria);

            // Assert
            HotelDataDTO dto = result.getContent().get(0);
            assertEquals(testHotel1.getHotelID(), dto.getId());
            assertEquals(testHotel1.getHotelName(), dto.getName());
            assertEquals(testHotel1.getLogoUrl(), dto.getLogoURL());
            assertEquals(testHotel1.getCountry(), dto.getCountry());
            assertEquals(testHotel1.getCity(), dto.getCity());
            assertEquals(testHotel1.getHotelRate(), dto.getRate());
            assertEquals(testHotel1.getStatus(), dto.getStatus());
        }

        @Test
        @DisplayName("Should filter by specific city")
        void shouldFilterBySpecificCity() {
            // Arrange
            criteria.setCity("Los Angeles");
            testHotel1.setCity("Los Angeles");

            Pageable pageable = PageRequest.of(0, 10);
            Page<Hotel> hotelPage = new PageImpl<>(Collections.singletonList(testHotel1), pageable, 1);

            when(hotelRepository.findHotelsWithFilters(
                    anyString(),
                    eq("Los Angeles"),
                    anyString(),
                    any(),
                    any(Pageable.class)
            )).thenReturn(hotelPage);

            // Act
            Page<HotelDataDTO> result = adminDashboardService.getHotelsByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals("Los Angeles", result.getContent().get(0).getCity());
            verify(hotelRepository).findHotelsWithFilters(
                    anyString(),
                    eq("Los Angeles"),
                    anyString(),
                    any(),
                    any(Pageable.class)
            );
        }

        @Test
        @DisplayName("Should filter by INACTIVE status")
        void shouldFilterByInactiveStatus() {
            // Arrange
            criteria.setStatus(Hotel.Status.INACTIVE);
            testHotel1.setStatus(Hotel.Status.INACTIVE);

            Pageable pageable = PageRequest.of(0, 10);
            Page<Hotel> hotelPage = new PageImpl<>(Collections.singletonList(testHotel1), pageable, 1);

            when(hotelRepository.findHotelsWithFilters(
                    anyString(),
                    anyString(),
                    anyString(),
                    eq(Hotel.Status.INACTIVE),
                    any(Pageable.class)
            )).thenReturn(hotelPage);

            // Act
            Page<HotelDataDTO> result = adminDashboardService.getHotelsByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals(Hotel.Status.INACTIVE, result.getContent().get(0).getStatus());
            verify(hotelRepository).findHotelsWithFilters(
                    anyString(),
                    anyString(),
                    anyString(),
                    eq(Hotel.Status.INACTIVE),
                    any(Pageable.class)
            );
        }

        @Test
        @DisplayName("Should handle hotels with null rates")
        void shouldHandleHotelsWithNullRates() {
            // Arrange
            testHotel1.setHotelRate(null);

            Pageable pageable = PageRequest.of(0, 10);
            Page<Hotel> hotelPage = new PageImpl<>(Collections.singletonList(testHotel1), pageable, 1);

            when(hotelRepository.findHotelsWithFilters(
                    anyString(),
                    anyString(),
                    anyString(),
                    any(),
                    any(Pageable.class)
            )).thenReturn(hotelPage);

            // Act
            Page<HotelDataDTO> result = adminDashboardService.getHotelsByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertNull(result.getContent().get(0).getRate());
        }
    }

    // ==================== AIRLINE TESTS ====================

    @Nested
    @DisplayName("getAirlinesByCriteria Tests")
    class GetAirlinesByCriteriaTests {

        private AirlineViewCriteriaDTO criteria;
        private Airline testAirline1;
        private Airline testAirline2;
        private List<Airline> airlineList;

        @BeforeEach
        void setUp() {
            // Setup test criteria
            criteria = new AirlineViewCriteriaDTO();
            criteria.setSearch("American");
            criteria.setNationality("USA");
            criteria.setStatus(Airline.Status.ACTIVE);
            criteria.setPage(0);
            criteria.setSize(10);

            // Setup test airlines
            testAirline1 = new Airline();
            testAirline1.setAirlineID(1);
            testAirline1.setAirlineName("American Airlines");
            testAirline1.setLogoUrl("http://example.com/aa-logo.png");
            testAirline1.setAirlineNationality("USA");
            testAirline1.setAirlineRate(4.2f);
            testAirline1.setStatus(Airline.Status.ACTIVE);

            testAirline2 = new Airline();
            testAirline2.setAirlineID(2);
            testAirline2.setAirlineName("American Eagle");
            testAirline2.setLogoUrl("http://example.com/ae-logo.png");
            testAirline2.setAirlineNationality("USA");
            testAirline2.setAirlineRate(4.0f);
            testAirline2.setStatus(Airline.Status.ACTIVE);

            airlineList = Arrays.asList(testAirline1, testAirline2);
        }

        @Test
        @DisplayName("Should return paginated airlines with all filters applied")
        void shouldReturnPaginatedAirlinesWithAllFilters() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            Page<Airline> airlinePage = new PageImpl<>(airlineList, pageable, airlineList.size());

            when(airlineRepository.findAirlinesWithFilters(
                    eq("American"),
                    eq("USA"),
                    eq(Airline.Status.ACTIVE),
                    any(Pageable.class)
            )).thenReturn(airlinePage);

            // Act
            Page<AirlineDataDTO> result = adminDashboardService.getAirlinesByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals(2, result.getTotalElements());
            assertEquals(2, result.getContent().size());

            AirlineDataDTO firstAirline = result.getContent().get(0);
            assertEquals(1, firstAirline.getId());
            assertEquals("American Airlines", firstAirline.getName());
            assertEquals("http://example.com/aa-logo.png", firstAirline.getLogoURL());
            assertEquals("USA", firstAirline.getNationality());
            assertEquals(4.2f, firstAirline.getRate());
            assertEquals(Airline.Status.ACTIVE, firstAirline.getStatus());

            verify(airlineRepository, times(1)).findAirlinesWithFilters(
                    eq("American"),
                    eq("USA"),
                    eq(Airline.Status.ACTIVE),
                    any(Pageable.class)
            );
        }

        @Test
        @DisplayName("Should return paginated airlines with null filters")
        void shouldReturnPaginatedAirlinesWithNullFilters() {
            // Arrange
            criteria.setSearch(null);
            criteria.setNationality(null);
            criteria.setStatus(null);

            Pageable pageable = PageRequest.of(0, 10);
            Page<Airline> airlinePage = new PageImpl<>(airlineList, pageable, airlineList.size());

            when(airlineRepository.findAirlinesWithFilters(
                    isNull(),
                    isNull(),
                    isNull(),
                    any(Pageable.class)
            )).thenReturn(airlinePage);

            // Act
            Page<AirlineDataDTO> result = adminDashboardService.getAirlinesByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals(2, result.getTotalElements());
            verify(airlineRepository, times(1)).findAirlinesWithFilters(
                    isNull(),
                    isNull(),
                    isNull(),
                    any(Pageable.class)
            );
        }

        @Test
        @DisplayName("Should return empty page when no airlines match criteria")
        void shouldReturnEmptyPageWhenNoAirlinesMatch() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            Page<Airline> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);

            when(airlineRepository.findAirlinesWithFilters(
                    anyString(),
                    anyString(),
                    any(),
                    any(Pageable.class)
            )).thenReturn(emptyPage);

            // Act
            Page<AirlineDataDTO> result = adminDashboardService.getAirlinesByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals(0, result.getTotalElements());
            assertTrue(result.getContent().isEmpty());
        }

        @Test
        @DisplayName("Should handle pagination correctly")
        void shouldHandlePaginationCorrectly() {
            // Arrange
            criteria.setPage(1);
            criteria.setSize(1);

            Pageable pageable = PageRequest.of(1, 1);
            Page<Airline> airlinePage = new PageImpl<>(
                    Collections.singletonList(testAirline2),
                    pageable,
                    2
            );

            when(airlineRepository.findAirlinesWithFilters(
                    anyString(),
                    anyString(),
                    any(),
                    any(Pageable.class)
            )).thenReturn(airlinePage);

            // Act
            Page<AirlineDataDTO> result = adminDashboardService.getAirlinesByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals(2, result.getTotalElements());
            assertEquals(1, result.getContent().size());
            assertEquals(1, result.getNumber());
            assertEquals(1, result.getSize());
            assertEquals(2, result.getContent().get(0).getId());
        }

        @Test
        @DisplayName("Should correctly map all Airline fields to AirlineDataDTO")
        void shouldCorrectlyMapAllAirlineFields() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            Page<Airline> airlinePage = new PageImpl<>(Collections.singletonList(testAirline1), pageable, 1);

            when(airlineRepository.findAirlinesWithFilters(
                    anyString(),
                    anyString(),
                    any(),
                    any(Pageable.class)
            )).thenReturn(airlinePage);

            // Act
            Page<AirlineDataDTO> result = adminDashboardService.getAirlinesByCriteria(criteria);

            // Assert
            AirlineDataDTO dto = result.getContent().get(0);
            assertEquals(testAirline1.getAirlineID(), dto.getId());
            assertEquals(testAirline1.getAirlineName(), dto.getName());
            assertEquals(testAirline1.getLogoUrl(), dto.getLogoURL());
            assertEquals(testAirline1.getAirlineNationality(), dto.getNationality());
            assertEquals(testAirline1.getAirlineRate(), dto.getRate());
            assertEquals(testAirline1.getStatus(), dto.getStatus());
        }

        @Test
        @DisplayName("Should filter by specific nationality")
        void shouldFilterBySpecificNationality() {
            // Arrange
            criteria.setNationality("UK");
            testAirline1.setAirlineNationality("UK");

            Pageable pageable = PageRequest.of(0, 10);
            Page<Airline> airlinePage = new PageImpl<>(Collections.singletonList(testAirline1), pageable, 1);

            when(airlineRepository.findAirlinesWithFilters(
                    anyString(),
                    eq("UK"),
                    any(),
                    any(Pageable.class)
            )).thenReturn(airlinePage);

            // Act
            Page<AirlineDataDTO> result = adminDashboardService.getAirlinesByCriteria(criteria);

            // Assert
            assertNotNull(result);
            assertEquals("UK", result.getContent().get(0).getNationality());
            verify(airlineRepository).findAirlinesWithFilters(
                    anyString(),
                    eq("UK"),
                    any(),
                    any(Pageable.class)
            );
        }
    }
}