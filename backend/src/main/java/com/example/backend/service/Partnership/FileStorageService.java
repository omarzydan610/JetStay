package com.example.backend.service.Partnership;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    
    @Value("${file.upload.directory:./uploads/logos}")
    private String uploadDirectory;
    
    public String storeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        
        // Validate file type
        String contentType = file.getContentType();
        if (!isValidImageType(contentType)) {
            throw new IllegalArgumentException("Invalid file type. Only JPEG, PNG, and GIF images are allowed.");
        }
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        
        // Save file
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);
        
        return uniqueFileName;
    }
    
    private boolean isValidImageType(String contentType) {
        return contentType != null && 
               (contentType.equals("image/jpeg") || 
                contentType.equals("image/png") || 
                contentType.equals("image/gif"));
    }
    
    private String getFileExtension(String fileName) {
        if (fileName == null) return "";
        int lastDotIndex = fileName.lastIndexOf(".");
        return lastDotIndex > 0 ? fileName.substring(lastDotIndex) : "";
    }
}