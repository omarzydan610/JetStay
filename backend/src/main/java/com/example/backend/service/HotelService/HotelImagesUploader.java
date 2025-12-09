package com.example.backend.service.HotelService;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Component
public class HotelImagesUploader {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadToCloudinary(MultipartFile file, String folderPath) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String publicId = UUID.randomUUID().toString();

        @SuppressWarnings("unchecked")
        Map<String, Object> params = ObjectUtils.asMap(
                "folder", folderPath,
                "public_id", publicId,
                "resource_type", "image"
        );

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
        return uploadResult.get("secure_url").toString();
    }

    public void deleteFromCloudinary(String imageUrl) throws IOException {
        String publicId = extractPublicIdFromUrl(imageUrl);
        if (publicId != null) {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        }
    }

    private String extractPublicIdFromUrl(String imageUrl) {
        try {
            int uploadIndex = imageUrl.indexOf("/upload/");
            if (uploadIndex == -1) return null;

            String pathPart = imageUrl.substring(uploadIndex + 8);

            // Remove version if exists
            if (pathPart.matches("^v\\d+/.*")) {
                pathPart = pathPart.substring(pathPart.indexOf("/") + 1);
            }

            // Remove extension
            int lastDotIndex = pathPart.lastIndexOf(".");
            if (lastDotIndex > 0) {
                pathPart = pathPart.substring(0, lastDotIndex);
            }
            return pathPart;
        } catch (Exception e) {
            return null;
        }
    }
}