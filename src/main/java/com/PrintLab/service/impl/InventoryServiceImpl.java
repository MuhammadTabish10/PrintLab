package com.PrintLab.service.impl;

import com.PrintLab.dto.InventoryDto;
import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.modal.Inventory;
import com.PrintLab.modal.PaperMarketRates;
import com.PrintLab.repository.InventoryRepository;
import com.PrintLab.repository.PaperMarketRatesRepository;
import com.PrintLab.service.InventoryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final PaperMarketRatesRepository paperMarketRatesRepository;
    private final ObjectMapper objectMapper;


    public InventoryServiceImpl(InventoryRepository inventoryRepository, PaperMarketRatesRepository paperMarketRatesRepository, ObjectMapper objectMapper) {
        this.inventoryRepository = inventoryRepository;
        this.paperMarketRatesRepository = paperMarketRatesRepository;
        this.objectMapper = objectMapper;
    }


    @Override
    @Transactional
    public InventoryDto save(InventoryDto inventoryDto) {
        if (inventoryDto.getCreated_at() == null) {
            inventoryDto.setCreated_at(LocalDate.now());
        }
        Inventory inventory = inventoryRepository.save(toEntity(inventoryDto));
        return toDto(inventory);
    }

    @Override
    public List<InventoryDto> getAll() {
        List<Inventory> inventoryList = inventoryRepository.findAll();
        List<InventoryDto> inventoryDtoList = new ArrayList<>();

        for (Inventory inventory : inventoryList) {
            InventoryDto inventoryDto = toDto(inventory);
            inventoryDtoList.add(inventoryDto);
        }
        return inventoryDtoList;
    }

    @Override
    public InventoryDto findById(Long id) {
        Optional<Inventory> optionalInventory = inventoryRepository.findById(id);

        if (optionalInventory.isPresent()) {
            Inventory inventory = optionalInventory.get();
            return toDto(inventory);
        } else {
            throw new RecordNotFoundException(String.format("Inventory not found for id => %d", id));
        }
    }

    @Override
    public String deleteById(Long id) {
        Optional<Inventory> optionalInventory = inventoryRepository.findById(id);

        if (optionalInventory.isPresent()) {
            Inventory inventory = optionalInventory.get();
            inventoryRepository.deleteById(id);
        } else {
            throw new RecordNotFoundException(String.format("Inventory not found for id => %d", id));
        }
        return null;
    }

    @Override
    public InventoryDto updateInventory(Long id, InventoryDto inventoryDto) {
        Optional<Inventory> optionalInventory = inventoryRepository.findById(id);
        if (optionalInventory.isPresent()) {
            Inventory existingInventory = optionalInventory.get();
            existingInventory.setPaperStock(inventoryDto.getPaperStock());
            existingInventory.setAvailableGsm(inventoryDto.getAvailableGsm());
            existingInventory.setAvailableSizes(inventoryDto.getAvailableSizes());
            existingInventory.setQty(inventoryDto.getQty());
            existingInventory.setMadeIn(inventoryDto.getMadeIn());
            existingInventory.setBrandName(inventoryDto.getBrandName());
            existingInventory.setVendor(inventoryDto.getVendor());
            existingInventory.setDateUpdated(LocalDate.now());
            if (inventoryDto.getRate() != null) {
                existingInventory.setOldRate(existingInventory.getRate());
            }
            existingInventory.setRate(inventoryDto.getRate());
            existingInventory.setStatus(inventoryDto.getStatus());

            Inventory updatedInventory = inventoryRepository.save(existingInventory);
            return toDto(updatedInventory);
        } else {
            throw new RecordNotFoundException(String.format("Inventory not found for id => %d", id));
        }
    }

    @Override
    @Transactional
    public PaperMarketRatesDto updatePaperMarketRate(Long inventoryId) {
        Optional<Inventory> optionalInventory = inventoryRepository.findById(inventoryId);
        if (optionalInventory.isPresent()) {
            Inventory inventory = optionalInventory.get();
            String gsmListJson = inventory.getAvailableGsm();
            String sizeListJson = inventory.getAvailableSizes();

            try {
                // Parse the JSON strings into Java objects
                Map<String, List<Integer>> gsmMap = objectMapper.readValue(gsmListJson, new TypeReference<Map<String, List<Integer>>>() {});
                Map<String, List<String>> sizeMap = objectMapper.readValue(sizeListJson, new TypeReference<Map<String, List<String>>>() {});

                // Now you have the parsed values in gsmMap and sizeMap
                // You can access them by keys ("gsm" and "sizes") and get the lists
                List<Integer> gsmValues = gsmMap.get("gsm");
                List<String> sizeValues = sizeMap.get("sizes");

                for(Integer gsm : gsmValues){
                    for(String dimension : sizeValues){
                        Optional<PaperMarketRates> paperMarketRatesOptional = Optional.ofNullable(paperMarketRatesRepository
                                .findByPaperStockAndGSMAndDimension(inventory.getPaperStock(), gsm, dimension));

                        if(paperMarketRatesOptional.isPresent()){
                            PaperMarketRates paperMarketRates = paperMarketRatesOptional.get();

                            // Split the input string by the "x" character and remove the double quotes
                            String[] parts = dimension.split("x");

                            // Extract and convert the numbers to double
                            double length = Double.parseDouble(parts[0].replaceAll("[^\\d.]", ""));
                            double width = Double.parseDouble(parts[1].replaceAll("[^\\d.]", ""));

                            Double kg = null;
                            if(inventory.getQty() == 500){
                                kg = ((length * width * gsm) / 3100);
                            }
                            else if(inventory.getQty() == 100){
                                kg = ((length * width * gsm) / 15500);
                            }
                            paperMarketRates.setKg(kg);
                            paperMarketRates.setRatePkr(inventory.getRate() * kg);

                            paperMarketRates.setRecordType("auto");
                            paperMarketRates.setBrand(inventory.getBrandName());
                            paperMarketRates.setMadeIn(inventory.getMadeIn());
                            paperMarketRates.setQty(inventory.getQty());
                            paperMarketRates.setLength(length);
                            paperMarketRates.setWidth(width);
                            paperMarketRates.setVerified(true);
                            paperMarketRates.setVendor(inventory.getVendor());
                            paperMarketRates.setStatus(inventory.getStatus());

                            PaperMarketRates updatedPaperMarketRates = paperMarketRatesRepository.save(paperMarketRates);

                        } else{

                            // Split the input string by the "x" character and remove the double quotes
                            String[] parts = dimension.split("x");

                            // Extract and convert the numbers to double
                            double length = Double.parseDouble(parts[0].replaceAll("[^\\d.]", ""));
                            double width = Double.parseDouble(parts[1].replaceAll("[^\\d.]", ""));

                            PaperMarketRates paperMarketRates = new PaperMarketRates();
                            paperMarketRates.setTimeStamp(LocalDate.now());
                            paperMarketRates.setPaperStock(inventory.getPaperStock());
                            paperMarketRates.setBrand(inventory.getBrandName());
                            paperMarketRates.setMadeIn(inventory.getMadeIn());
                            paperMarketRates.setQty(inventory.getQty());
                            paperMarketRates.setLength(length);
                            paperMarketRates.setWidth(width);
                            paperMarketRates.setVendor(inventory.getVendor());
                            paperMarketRates.setStatus(inventory.getStatus());
                            paperMarketRates.setVerified(true);
                            paperMarketRates.setRecordType("auto");
                            paperMarketRates.setGSM(gsm);
                            paperMarketRates.setDimension(dimension);

                            Double kg = null;
                            if(inventory.getQty() == 500){
                                kg = ((length * width * gsm) / 3100);
                            }
                            else if(inventory.getQty() == 100){
                                kg = (length * width * gsm) / 15500;
                            }
                            paperMarketRates.setKg(kg);
                            paperMarketRates.setRatePkr(inventory.getRate() * kg);

                            PaperMarketRates newPaperMarketRates = paperMarketRatesRepository.save(paperMarketRates);
                        }
                    }
                }

                // qty = 500 (Len x Width x gsm) / 3100
                // qty = 100 (Len x Width x gsm) / 15500

                return null;

            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }

        } else {
            throw new RecordNotFoundException(String.format("Inventory not found for id => %d", inventoryId));
        }
        return null;
    }

    public Inventory toEntity(InventoryDto inventoryDto) {
        return Inventory.builder()
                .id(inventoryDto.getId())
                .created_at(inventoryDto.getCreated_at())
                .paperStock(inventoryDto.getPaperStock())
                .availableGsm(inventoryDto.getAvailableGsm())
                .availableSizes(inventoryDto.getAvailableSizes())
                .qty(inventoryDto.getQty())
                .madeIn(inventoryDto.getMadeIn())
                .brandName(inventoryDto.getBrandName())
                .vendor(inventoryDto.getVendor())
                .dateUpdated(inventoryDto.getDateUpdated())
                .rate(inventoryDto.getRate())
                .status(inventoryDto.getStatus())
                .oldRate(inventoryDto.getOldRate())
                .build();
    }

    public InventoryDto toDto(Inventory inventory) {
        return InventoryDto.builder()
                .id(inventory.getId())
                .created_at(inventory.getCreated_at())
                .paperStock(inventory.getPaperStock())
                .availableGsm(inventory.getAvailableGsm())
                .availableSizes(inventory.getAvailableSizes())
                .qty(inventory.getQty())
                .madeIn(inventory.getMadeIn())
                .brandName(inventory.getBrandName())
                .vendor(inventory.getVendor())
                .dateUpdated(inventory.getDateUpdated())
                .rate(inventory.getRate())
                .status(inventory.getStatus())
                .oldRate(inventory.getOldRate())
                .build();
    }
}
