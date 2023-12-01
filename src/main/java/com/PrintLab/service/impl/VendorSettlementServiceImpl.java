package com.PrintLab.service.impl;

import com.PrintLab.dto.VendorSettlementDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.VendorSettlement;
import com.PrintLab.repository.OrderRepository;
import com.PrintLab.repository.VendorRepository;
import com.PrintLab.repository.VendorSettlementRepository;
import com.PrintLab.service.VendorSettlementService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class VendorSettlementServiceImpl implements VendorSettlementService {
    private final VendorSettlementRepository vendorSettlementRepository;
    private final VendorRepository vendorRepository;
    private final OrderRepository orderRepository;

    public VendorSettlementServiceImpl(VendorSettlementRepository vendorSettlementRepository, VendorRepository vendorRepository, OrderRepository orderRepository) {
        this.vendorSettlementRepository = vendorSettlementRepository;
        this.vendorRepository = vendorRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public VendorSettlementDto save(VendorSettlementDto vendorSettlementDto) {
        VendorSettlement vendorSettlement = toEntity(vendorSettlementDto);
        vendorSettlement.setStatus(true);

        vendorSettlement.setVendor(vendorRepository.findById(vendorSettlement.getVendor().getId())
                .orElseThrow(() -> new RecordNotFoundException(String.format("VendorSettlement not found for id => %d", vendorSettlement.getVendor().getId()))));

        if (vendorSettlement.getOrder() != null) {
            vendorSettlement.setOrder(orderRepository.findById(vendorSettlement.getOrder().getId())
                    .orElseThrow(() -> new RecordNotFoundException(String.format("Order not found for id => %d", vendorSettlement.getOrder().getId()))));
        }

        VendorSettlement savedVendorSettlement = vendorSettlementRepository.save(vendorSettlement);
        return toDto(savedVendorSettlement);
    }

    @Override
    public List<VendorSettlementDto> getAll() {
        List<VendorSettlement> vendorSettlementList = vendorSettlementRepository.findAllInDesOrderByIdAndStatus();
        List<VendorSettlementDto> vendorSettlementDtoList = new ArrayList<>();

        for (VendorSettlement vendorSettlement : vendorSettlementList) {
            VendorSettlementDto vendorSettlementDto = toDto(vendorSettlement);
            vendorSettlementDtoList.add(vendorSettlementDto);
        }
        return vendorSettlementDtoList;
    }

    @Override
    public List<VendorSettlementDto> findByVendor(Long vendorId) {
        List<VendorSettlement> vendorSettlementList = vendorSettlementRepository.findByVendorIdAndStatus(vendorId);
        List<VendorSettlementDto> vendorSettlementDtoList = new ArrayList<>();

        for (VendorSettlement vendorSettlement : vendorSettlementList) {
            VendorSettlementDto vendorSettlementDto = toDto(vendorSettlement);
            vendorSettlementDtoList.add(vendorSettlementDto);
        }
        return vendorSettlementDtoList;
    }

    @Override
    public VendorSettlementDto findById(Long id) {
        VendorSettlement vendorSettlement = vendorSettlementRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(String.format("VendorSettlement not found for id => %d", id)));
        return toDto(vendorSettlement);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        VendorSettlement vendorSettlement = vendorSettlementRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(String.format("VendorSettlement not found for id => %d", id)));
        vendorSettlementRepository.setStatusInactive(vendorSettlement.getId());
    }

    @Override
    @Transactional
    public VendorSettlementDto update(Long id, VendorSettlementDto vendorSettlementDto) {
        VendorSettlement existingVendorSettlement = vendorSettlementRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(String.format("VendorSettlement not found for id => %d", id)));

        existingVendorSettlement.setDebit(vendorSettlementDto.getDebit());
        existingVendorSettlement.setCredit(vendorSettlementDto.getCredit());

        existingVendorSettlement.setVendor(vendorRepository.findById(vendorSettlementDto.getVendor().getId())
                .orElseThrow(() -> new RecordNotFoundException(String.format("VendorSettlement not found for id => %d", vendorSettlementDto.getVendor().getId()))));

        if (vendorSettlementDto.getOrder() != null) {
            existingVendorSettlement.setOrder(orderRepository.findById(vendorSettlementDto.getOrder().getId())
                    .orElseThrow(() -> new RecordNotFoundException(String.format("Order not found for id => %d", vendorSettlementDto.getOrder().getId()))));
        }

        VendorSettlement updatedVendorSettlement = vendorSettlementRepository.save(existingVendorSettlement);
        return toDto(updatedVendorSettlement);
    }

    public VendorSettlementDto toDto(VendorSettlement vendorSettlement) {
        return VendorSettlementDto.builder()
                .id(vendorSettlement.getId())
                .dateAndTime(vendorSettlement.getDateAndTime())
                .debit(vendorSettlement.getDebit())
                .credit(vendorSettlement.getCredit())
                .vendor(vendorSettlement.getVendor())
                .order(vendorSettlement.getOrder())
                .status(vendorSettlement.getStatus())
                .build();
    }

    public VendorSettlement toEntity(VendorSettlementDto vendorSettlementDto) {
        return VendorSettlement.builder()
                .id(vendorSettlementDto.getId())
                .dateAndTime(vendorSettlementDto.getDateAndTime())
                .debit(vendorSettlementDto.getDebit())
                .credit(vendorSettlementDto.getCredit())
                .vendor(vendorSettlementDto.getVendor())
                .order(vendorSettlementDto.getOrder())
                .status(vendorSettlementDto.getStatus())
                .build();
    }

}
