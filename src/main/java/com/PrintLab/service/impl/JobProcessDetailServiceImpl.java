package com.PrintLab.service.impl;

import com.PrintLab.Mapper.JobProcessedDetailsMapper;
import com.PrintLab.dto.JobProcessedDetailsDto;
import com.PrintLab.dto.VendorSettlementDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.JobProcessedDetails;
import com.PrintLab.model.Order;
import com.PrintLab.model.Vendor;
import com.PrintLab.model.VendorSettlement;
import com.PrintLab.dto.JobProcessedDetailsDto;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.util.IOUtils;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;
import com.PrintLab.repository.JobProcessedDetailsRepository;
import com.PrintLab.repository.OrderRepository;
import com.PrintLab.repository.VendorRepository;
import com.PrintLab.service.JobProcessedDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobProcessDetailServiceImpl implements JobProcessedDetailsService {

    private final JobProcessedDetailsRepository jobProcessedDetailsRepository;
    private final JobProcessedDetailsMapper jobProcessedDetailsMapper;

    private final ResourceLoader resourceLoader;

    private final OrderRepository orderRepository;

    @Autowired
    public JobProcessDetailServiceImpl(JobProcessedDetailsRepository jobProcessedDetailsRepository, JobProcessedDetailsMapper jobProcessedDetailsMapper, ResourceLoader resourceLoader, OrderRepository orderRepository) {
        this.jobProcessedDetailsRepository = jobProcessedDetailsRepository;
        this.jobProcessedDetailsMapper = jobProcessedDetailsMapper;
        this.resourceLoader = resourceLoader;
        this.orderRepository = orderRepository;
    }

    @Override
    public JobProcessedDetailsDto getJobDetailById(Long id) {
        return jobProcessedDetailsRepository.findById(id)
                .map(jobProcessedDetailsMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Job detail with ID " + id + " not found"));
    }

    @Override
    public JobProcessedDetailsDto createJobDetail(JobProcessedDetailsDto jobDetailDTO) {
        JobProcessedDetails jobDetail = jobProcessedDetailsMapper.toEntity(jobDetailDTO);

        if(jobDetail.getOrder() != null){
            Long orderId = jobDetail.getOrder().getId();

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RecordNotFoundException("Order not found at id: " + orderId));

            jobDetail.setOrder(order);
        }

        jobDetail = jobProcessedDetailsRepository.save(jobDetail);
        return jobProcessedDetailsMapper.toDto(jobDetail);
    }

    @Override
    public JobProcessedDetailsDto updateJobDetail(Long id, JobProcessedDetailsDto jobDetailDTO) {
        return jobProcessedDetailsRepository.findById(id)
                .map(existingJobDetail -> {
                    JobProcessedDetails updatedJobDetail = jobProcessedDetailsMapper.toEntity(jobDetailDTO);
                    updatedJobDetail.setId(id);

                    // Set the order entity if present in the DTO
                    if (jobDetailDTO.getOrder() != null && jobDetailDTO.getOrder().getId() != null) {
                        Long orderId = jobDetailDTO.getOrder().getId();

                        Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RecordNotFoundException("Order not found at id: " + orderId));

                        updatedJobDetail.setOrder(order);
                    }

                    updatedJobDetail = jobProcessedDetailsRepository.save(updatedJobDetail);
                    return jobProcessedDetailsMapper.toDto(updatedJobDetail);
                })
                .orElseThrow(() -> new EntityNotFoundException("Job detail with ID " + id + " not found"));
    }


    @Override
    public void deleteJobDetail(Long id) {
        if (!jobProcessedDetailsRepository.existsById(id)) {
            throw new EntityNotFoundException("Job detail with ID " + id + " not found");
        }
        jobProcessedDetailsRepository.deleteById(id);
    }

    @Override
    public List<JobProcessedDetailsDto> getAllJobDetails() {
        List<JobProcessedDetails> allJobDetails = jobProcessedDetailsRepository.findAll();
        return allJobDetails.stream()
                .map(jobProcessedDetailsMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobProcessedDetailsDto> getJobDetailByProductRuleJobId(Long id) {
        List<JobProcessedDetails> jobDetailsList = jobProcessedDetailsRepository.findByProductRuleIdAndJobProcessedIsTrue(id);
        if (jobDetailsList.isEmpty()) {
            throw new RecordNotFoundException(String.format("No job details found for product job ID %d", id));
        }
        return jobDetailsList.stream()
                .map(jobProcessedDetailsMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobProcessedDetailsDto> getJobDetailsByVendor(String vendor) {
        List<JobProcessedDetails> jobDetailsList = jobProcessedDetailsRepository.findByVendor(vendor);
        if (jobDetailsList.isEmpty()) {
            throw new RecordNotFoundException(String.format("No job details found for vendor %s", vendor));
        }
        return jobDetailsList.stream()
                .map(jobProcessedDetailsMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobProcessedDetailsDto> getJobDetailsByVendorAndDateRange(String vendor, LocalDate startDate, LocalDate endDate) {
        List<JobProcessedDetails> jobDetails = jobProcessedDetailsRepository.findByVendorAndDateRange(vendor, startDate, endDate);
        return jobDetails.stream()
                .map(jobProcessedDetailsMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobProcessedDetails> getJobProcessesByOrderId(Long orderId) {
        return jobProcessedDetailsRepository.findByOrderIdAndPaymentIn(orderId, Arrays.asList("cash", "credit"));
    }

    @Override
    public ByteArrayInputStream exportJobDetailsToExcel(List<JobProcessedDetailsDto> jobDetails) {
        List<Map<String, Object>> excelData = jobDetails.stream().map(dto -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("JOB ID", dto.getOrder().getId());
            map.put("Date", dto.getDateAdded());
            map.put("Client", dto.getOrder().getCustomer().getName());
            map.put("Added By", dto.getOrder().getCreatedBy().getName());
            map.put("Product", dto.getOrder().getProduct());
            map.put("Size", dto.getOrder().getSize());
            map.put("Process", dto.getProcessName());
            map.put("Type", dto.getPayment());
            map.put("Debit", dto.getPayment().equals("Credit") ? dto.getAmount() : "");
            map.put("Credit", dto.getPayment().equals("Cash") || dto.getPayment().equals("Paid") ? dto.getAmount() : "");
            map.put("Balance", dto.getBalance());
            return map;
        }).collect(Collectors.toList());

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            createExcelFile(excelData, out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate Excel file", e);
        }
    }

    private void createExcelFile(List<Map<String, Object>> excelData, ByteArrayOutputStream outputStream) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("JobProcessedDetails");

        int dataStartRow = 0;

        // Add the logo to the first row and first cell
        Resource resource = resourceLoader.getResource("classpath:static/images/print-lab-logo.png");
        InputStream logoInputStream = resource.getInputStream();
        byte[] logoBytes = IOUtils.toByteArray(logoInputStream);
        int pictureIdx = workbook.addPicture(logoBytes, Workbook.PICTURE_TYPE_JPEG);
        logoInputStream.close();

        Drawing drawing = sheet.createDrawingPatriarch();
        ClientAnchor anchor = workbook.getCreationHelper().createClientAnchor();
        anchor.setCol1(0); // Column A
        anchor.setRow1(0); // Row 1
        anchor.setCol2(2); // Column C (for larger width)
        anchor.setRow2(4); // Row 4 (for larger height)

        drawing.createPicture(anchor, pictureIdx);

        // Ensure correct indices for shifting rows
        if (sheet.getLastRowNum() >= 0) {
            sheet.shiftRows(0, sheet.getLastRowNum(), 5);
        }
        dataStartRow = 5; // Data should start from row 5

        if (excelData == null || excelData.isEmpty()) {
            // If excelData is empty, write a message in the Excel file
            Row emptyRow = sheet.createRow(dataStartRow);
            Cell emptyCell = emptyRow.createCell(0);
            emptyCell.setCellValue("No data available");
            workbook.write(outputStream);
            workbook.close();
            return;
        }

        // Create header row
        Row headerRow = sheet.createRow(dataStartRow);
        int colIndex = 0;

        // Set bold font style for header
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setFontHeightInPoints((short) 12);
        headerStyle.setFont(headerFont);
        headerStyle.setAlignment(HorizontalAlignment.CENTER);

        CellStyle centerStyle = workbook.createCellStyle();
        centerStyle.setAlignment(HorizontalAlignment.CENTER);

        for (String key : excelData.get(0).keySet()) {
            Cell cell = headerRow.createCell(colIndex++);
            cell.setCellValue(key);
            cell.setCellStyle(headerStyle);
        }

        // Populate data rows
        int rowIndex = dataStartRow + 1;
        for (Map<String, Object> rowData : excelData) {
            Row row = sheet.createRow(rowIndex++);
            colIndex = 0;
            for (Object value : rowData.values()) {
                Cell cell = row.createCell(colIndex++);
                if (value != null) {
                    if (value instanceof String) {
                        cell.setCellValue((String) value);
                    } else if (value instanceof Long) {
                        cell.setCellValue((Long) value);
                    } else if (value instanceof Integer) {
                        cell.setCellValue((Integer) value);
                    } else if (value instanceof Double) {
                        cell.setCellValue((Double) value);
                    } else if (value instanceof Boolean) {
                        cell.setCellValue((Boolean) value);
                    } else if (value instanceof java.time.LocalDate) {
                        cell.setCellValue(((java.time.LocalDate) value).toString());
                    } else if (value instanceof java.time.LocalDateTime) {
                        cell.setCellValue(((java.time.LocalDateTime) value).toString());
                    } else {
                        cell.setCellValue(value.toString());
                    }
                } else {
                    cell.setCellValue("N/A");
                }
            }
        }

        // Apply center alignment for all rows except header row
        for (int r = dataStartRow + 1; r < rowIndex; r++) {
            Row currentRow = sheet.getRow(r);
            for (int c = 0; c < excelData.get(0).size(); c++) {
                Cell currentCell = currentRow.getCell(c);
                if (currentCell != null) {
                    currentCell.setCellStyle(centerStyle);
                }
            }
        }

        // Auto-size columns
        for (int i = 0; i < excelData.get(0).size(); i++) {
            sheet.autoSizeColumn(i);
        }

        // Add additional information at the right corner
        Row infoRow = sheet.createRow(1); // Skipping one row from the top
        Font boldFont = workbook.createFont();
        boldFont.setBold(true);
        Cell firstLineCell = infoRow.createCell(excelData.get(0).size() - 2); // Adjust the column position for the right corner
        firstLineCell.setCellValue("PRINTLAB");
        CellStyle boldStyle = workbook.createCellStyle();
        boldStyle.setFont(boldFont);
        firstLineCell.setCellStyle(boldStyle);

        Row secondLineRow = sheet.createRow(2); // Move to the next row
        Cell secondLineCell = secondLineRow.createCell(excelData.get(0).size() - 2); // Adjust the column position for the right corner
        secondLineCell.setCellValue("Vendor Statement");
        secondLineCell.setCellStyle(boldStyle);

        // Add additional row with balance information
        Row balanceRow = sheet.createRow(rowIndex + 1);
        Cell balanceLabelCell = balanceRow.createCell(excelData.get(0).size() - 2);
        balanceLabelCell.setCellValue("Balance:");
        balanceLabelCell.setCellStyle(headerStyle);

        Cell balanceValueCell = balanceRow.createCell(excelData.get(0).size() - 1);
        Double lastBalance = (Double) excelData.get(excelData.size() - 1).get("Balance");
        balanceValueCell.setCellValue(lastBalance);
        balanceValueCell.setCellStyle(centerStyle);

        workbook.write(outputStream);
        workbook.close();
    }




}
