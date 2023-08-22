package com.PrintLab.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService
{
    String uploadImage(MultipartFile file);
    Resource getImage(String fileName);
}
