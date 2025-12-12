package com.example.backend.service.HotelService;

import com.example.backend.entity.Hotel;
import com.example.backend.entity.HotelImage;
import com.example.backend.repository.HotelImageRepository;
import com.example.backend.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.io.IOException;

@Service
public class HotelImageService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private HotelImageRepository hotelImageRepository;

    @Autowired
    private HotelImagesUploader hotelImagesUploader;

    private static final String BASE_FOLDER = "jetstay";

    @Transactional
    public HotelImage addHotelImageForAdmin(String adminEmail, MultipartFile file) throws IOException {
        Hotel hotel = hotelRepository.findByAdmin_Email(adminEmail)
                .orElseThrow(() -> new RuntimeException("No Hotel found for admin: " + adminEmail));

        Integer hotelId = hotel.getHotelID();
        System.out.println("Newwwwww");
        System.out.println("Newwwwww");
        System.out.println("Newwwwww");
        System.out.println("Newwwwww");
        System.out.println("Newwwwww");
        System.out.println("Newwwwww");



        String folderPath = BASE_FOLDER + "/hotels/hotel_" + hotelId + "/photos";

        String imageUrl = hotelImagesUploader.uploadToCloudinary(file, folderPath);
        System.out.println(imageUrl + " ..............................." + imageUrl.length());
        System.out.println();
        System.out.println();
        System.out.println();
        System.out.println();
        System.out.println();

        HotelImage hotelImage = new HotelImage();
        hotelImage.setHotel(hotel);
        hotelImage.setImageUrl(imageUrl);

        return hotelImageRepository.save(hotelImage);
    }

    @Transactional
    public void deleteHotelImageForAdmin(Integer imageId, String adminEmail) throws IOException {
        HotelImage image = hotelImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found with ID: " + imageId));

        String ownerEmail = image.getHotel().getAdmin().getEmail();
        if (!ownerEmail.equals(adminEmail)) {
            throw new RuntimeException("Unauthorized: You do not own this image");
        }

        hotelImagesUploader.deleteFromCloudinary(image.getImageUrl());

        hotelImageRepository.delete(image);
    }

    public List<HotelImage> getHotelImagesForAdmin(String adminEmail) {
        Hotel hotel = hotelRepository.findByAdmin_Email(adminEmail)
                .orElseThrow(() -> new RuntimeException("No Hotel found for admin: " + adminEmail));
        
        return hotelImageRepository.findByHotelHotelID(hotel.getHotelID());
    }
}