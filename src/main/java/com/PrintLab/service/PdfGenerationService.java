package com.PrintLab.service;

public interface PdfGenerationService {

    byte[] generatePdf(String htmlContent);
}
