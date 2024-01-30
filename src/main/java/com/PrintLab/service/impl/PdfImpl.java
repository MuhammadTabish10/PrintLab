package com.PrintLab.service.impl;

import com.PrintLab.service.PdfGenerationService;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringReader;
@Service
public class PdfImpl implements PdfGenerationService {
    @Override
    public byte[] generatePdf(String htmlContent) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            Document document = new Document();
            PdfWriter writer = PdfWriter.getInstance(document, outputStream);
            document.open();

            XMLWorkerHelper.getInstance().parseXHtml(writer, document, new StringReader(htmlContent));

            document.close();
        } catch (DocumentException | IOException e) {
            e.printStackTrace();
        }

        return outputStream.toByteArray();
    }
}
