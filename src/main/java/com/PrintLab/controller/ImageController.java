package com.PrintLab.controller;

import com.PrintLab.service.impl.ImageServiceImpl;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class ImageController
{
    private final ImageServiceImpl imageService;

    public ImageController(ImageServiceImpl imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = imageService.uploadImage(file);
        return ResponseEntity.ok(imageUrl);
    }
    @GetMapping("/image/{fileName}")
    public ResponseEntity<Resource> getImageUrl(@PathVariable String fileName) {
        Resource imageResource = imageService.getImage(fileName);

        if (imageResource != null) {
            MediaType contentType = imageService.determineMediaType(fileName);

            if (contentType != null) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(contentType);

                return ResponseEntity.ok().headers(headers).body(imageResource);
            } else {
                return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
