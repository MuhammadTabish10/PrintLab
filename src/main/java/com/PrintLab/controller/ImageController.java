package com.PrintLab.controller;

import com.PrintLab.service.ImageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class ImageController
{
    private final ImageService imageService;
    public ImageController(ImageService imageService) {
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
            MediaType contentType = MediaType.IMAGE_JPEG;

            if (fileName.endsWith(".png")) {
                contentType = MediaType.IMAGE_PNG;
            } else if (fileName.endsWith(".gif")) {
                contentType = MediaType.IMAGE_GIF;
            } else if (fileName.endsWith(".pdf")){
                contentType = MediaType.APPLICATION_PDF;
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(contentType);

            return ResponseEntity.ok().headers(headers).body(imageResource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
