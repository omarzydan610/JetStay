package com.example.backend.service.Partnership;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.InternalServerErrorException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {

    @Autowired
    private Cloudinary cloudinary;

    public String storeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String contentType = file.getContentType();
        if (!isValidImageType(contentType)) {
            throw new BadRequestException("Invalid file type. Only JPEG, PNG, and GIF images are allowed.");
        }

        String publicId = "partnership-" + UUID.randomUUID().toString();

        @SuppressWarnings("unchecked")
        Map<String, Object> uploadParams = ObjectUtils.asMap(
                "folder", "jetstay/partnerships",
                "public_id", publicId,
                "overwrite", false,
                "resource_type", "image");

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            return uploadResult.get("secure_url").toString();
        } catch (Exception e) {
            throw new InternalServerErrorException("Failed to upload file: " + e.getMessage());
        }

    }

    public boolean deleteFile(String imageUrl) throws IOException {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return false;
        }

        try {
            String publicId = extractPublicIdFromUrl(imageUrl);

            if (publicId != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                return "ok".equals(result.get("result"));
            }
        } catch (Exception e) {
            System.err.println("Error deleting file from Cloudinary: " + e.getMessage());
        }
        return false;
    }

    private String extractPublicIdFromUrl(String imageUrl) {
        try {

            String[] parts = imageUrl.split("/upload/");
            if (parts.length > 1) {
                String pathPart = parts[1];
                if (pathPart.contains("/v")) {
                    pathPart = pathPart.substring(pathPart.indexOf("/") + 1);
                }
                int lastDotIndex = pathPart.lastIndexOf(".");
                if (lastDotIndex > 0) {
                    pathPart = pathPart.substring(0, lastDotIndex);
                }
                return pathPart;
            }
        } catch (Exception e) {
            System.err.println("Error extracting public ID from URL: " + e.getMessage());
        }
        return null;
    }

    private boolean isValidImageType(String contentType) {
        return contentType != null &&
                (contentType.equals("image/jpeg") ||
                        contentType.equals("image/png") ||
                        contentType.equals("image/gif") ||
                        contentType.equals("image/webp") ||
                        contentType.equals("image/svg+xml"));
    }
}