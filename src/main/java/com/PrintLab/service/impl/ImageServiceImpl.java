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
            String fileName = file.getOriginalFilename();
            Path imagePath = Paths.get(imageUploadPath).resolve(fileName);
            Files.copy(inputStream, imagePath);
            return ("/image/"+fileName);
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