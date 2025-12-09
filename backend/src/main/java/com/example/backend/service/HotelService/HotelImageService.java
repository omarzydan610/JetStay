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
    public HotelImage addHotelImage(Integer hotelId, MultipartFile file) throws IOException {
        // 1. Validate Hotel Exists
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found with ID: " + hotelId));

        // 2. Prepare Path: jetstay/hotels/hotel_{id}
        String folderPath = BASE_FOLDER + "/hotels/hotel_" + hotelId + "/photos";

        // 3. Upload using the Uploader Utility
        String imageUrl = hotelImagesUploader.uploadToCloudinary(file, folderPath);

        // 4. Save to Database
        HotelImage hotelImage = new HotelImage();
        hotelImage.setHotel(hotel);
        hotelImage.setImageUrl(imageUrl);

        return hotelImageRepository.save(hotelImage);
    }

    @Transactional
    public void deleteHotelImage(Integer imageId) throws IOException {
        HotelImage image = hotelImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found with ID: " + imageId));

        // 1. Delete from Cloudinary using the Uploader Utility
        hotelImagesUploader.deleteFromCloudinary(image.getImageUrl());

        // 2. Delete from Database
        hotelImageRepository.delete(image);
    }

    public List<HotelImage> getHotelImages(Integer hotelId) {
        return hotelImageRepository.findByHotelHotelID(hotelId);
    }
}