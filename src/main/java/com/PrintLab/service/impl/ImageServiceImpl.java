package com.PrintLab.service.impl;

import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.service.ImageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Service
public class ImageServiceImpl implements ImageService {

    @Value("${image.upload.path}")
    private String imageUploadPath;

    private static final long MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

    @Override
    public String uploadImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RecordNotFoundException("File not found.");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new RecordNotFoundException("File size exceeds the allowed limit.");
        }

        try {
            InputStream inputStream = file.getInputStream();
            String originalFileName = file.getOriginalFilename();

            // Extract file name without extension
            String fileNameWithoutExtension = originalFileName.substring(0, originalFileName.lastIndexOf("."));

            // Generate timestamp
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy_MM_dd HH_mm_ss");
            String timestamp = LocalDateTime.now().format(formatter);

            // Extract file extension
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));

            // Create new file name with timestamp and without extension
            String newFileName = fileNameWithoutExtension + "_" + timestamp + fileExtension;

            // Construct file path
            Path imagePath = Paths.get(imageUploadPath).resolve(newFileName);

            // Copy file
            Files.copy(inputStream, imagePath);

            return ("/image/" + newFileName);
        } catch (IOException e) {
            return ("Failed to upload image: " + e.getMessage());
        }
    }
    @Override
    public Resource getImage(String fileName) {
        Path imagePath = Paths.get(imageUploadPath).resolve(fileName);
        return new PathResource(imagePath);
    }

    public MediaType determineMediaType(String fileName) {
        if (fileName.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        } else if (fileName.endsWith(".jpg")) {
            return MediaType.IMAGE_JPEG;
        } else if (fileName.endsWith(".jpeg")) {
            return MediaType.IMAGE_JPEG;
        } else if (fileName.endsWith(".pdf")) {
            return MediaType.APPLICATION_PDF;
        } else if (fileName.endsWith(".ai")) {
            return MediaType.parseMediaType("application/illustrator");
        } else if (fileName.endsWith(".psd")) {
            return MediaType.parseMediaType("application/photoshop");
        } else if (fileName.endsWith(".cdr")) {
            return MediaType.parseMediaType("application/coreldraw");
        }
        return null; // Unsupported format
    }
}