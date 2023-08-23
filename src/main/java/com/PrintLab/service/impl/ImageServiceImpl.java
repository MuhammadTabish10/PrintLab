package com.PrintLab.service.impl;

import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.service.ImageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
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

    @Override
    public String uploadImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RecordNotFoundException("File not found.");
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
}