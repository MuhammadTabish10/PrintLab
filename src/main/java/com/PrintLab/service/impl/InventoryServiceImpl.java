package com.PrintLab.service.impl;

import com.PrintLab.dto.InventoryDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.modal.Inventory;
import com.PrintLab.repository.InventoryRepository;
import com.PrintLab.service.InventoryService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryServiceImpl(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @Override
    @Transactional
    public InventoryDto save(InventoryDto inventoryDto) {
        if(inventoryDto.getCreated_at() == null) {
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
            if(inventoryDto.getRate() != null){
                existingInventory.setOldRate(existingInventory.getRate());
            }
            existingInventory.setRate(inventoryDto.getRate());
            existingInventory.setStatus(inventoryDto.getStatus());

            Inventory updatedInventory = inventoryRepository.save(existingInventory);
            return toDto(updatedInventory);
        } else {
            throw new RecordNotFoundException(String.format("Order not found for id => %d", id));
        }
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
    public InventoryDto toDto(Inventory inventory){
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
