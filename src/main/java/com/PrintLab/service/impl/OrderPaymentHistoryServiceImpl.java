package com.PrintLab.service.impl;

import com.PrintLab.Mapper.OrderPaymentHistoryMapper;
import com.PrintLab.dto.BusinessDto;
import com.PrintLab.dto.OrderPaymentHistoryDto;
import com.PrintLab.dto.OrderDto;
import com.PrintLab.model.Business;
import com.PrintLab.model.OrderPaymentHistory;
import com.PrintLab.repository.OrderPaymentHistoryRepository;
import com.PrintLab.service.OrderPaymentHistoryService;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderPaymentHistoryServiceImpl implements OrderPaymentHistoryService {

    private final OrderPaymentHistoryRepository orderPaymentHistoryRepository;
    private final OrderPaymentHistoryMapper orderPaymentHistoryMapper;

    public OrderPaymentHistoryServiceImpl(OrderPaymentHistoryRepository orderPaymentHistoryRepository, OrderPaymentHistoryMapper orderPaymentHistoryMapper) {
        this.orderPaymentHistoryRepository = orderPaymentHistoryRepository;
        this.orderPaymentHistoryMapper = orderPaymentHistoryMapper;
    }

    @Override
    public OrderPaymentHistoryDto findById(Long id) {
        Optional<OrderPaymentHistory> paymentHistoryOptional = orderPaymentHistoryRepository.findById(id);
        return paymentHistoryOptional.map(orderPaymentHistoryMapper::toDto).orElse(null);
    }

    @Override
    public List<OrderPaymentHistoryDto> getAll() {
        List<OrderPaymentHistory> paymentHistories = orderPaymentHistoryRepository.findAll();
        Set<Long> seenId = new LinkedHashSet<>();
        return paymentHistories.stream()
                .filter(orderPaymentHistory -> seenId.add(orderPaymentHistory.getId()))
                .map(orderPaymentHistoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrderPaymentHistoryDto findByName(String businessName) {
        List<OrderPaymentHistory> paymentHistoryOptional = orderPaymentHistoryRepository.findByBusinessBusinessName(businessName);
        Set<String> seenName = new LinkedHashSet<>();
        return (OrderPaymentHistoryDto) paymentHistoryOptional.stream()
                .filter(orderPaymentHistory -> seenName.add(orderPaymentHistory.getBusiness().stream().map(Business::getBusinessName).toString()))
                .map(orderPaymentHistoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrderPaymentHistoryDto save(OrderPaymentHistoryDto paymentHistoryDto) {
        OrderPaymentHistory paymentHistory = orderPaymentHistoryMapper.toEntity(paymentHistoryDto);
        OrderPaymentHistory savedPaymentHistory = orderPaymentHistoryRepository.save(paymentHistory);
        return orderPaymentHistoryMapper.toDto(savedPaymentHistory);
    }

    @Override
    public void deleteById(Long id) {
        orderPaymentHistoryRepository.deleteById(id);
    }

    @Override
    public OrderPaymentHistoryDto updateById(Long id, OrderPaymentHistoryDto updatedPaymentHistoryDto) {
        Optional<OrderPaymentHistory> existingPaymentHistoryOptional = orderPaymentHistoryRepository.findById(id);
        if (existingPaymentHistoryOptional.isPresent()) {
            OrderPaymentHistory existingPaymentHistory = existingPaymentHistoryOptional.get();
            existingPaymentHistory.setDescription(updatedPaymentHistoryDto.getDescription());
            existingPaymentHistory.setAmount(updatedPaymentHistoryDto.getAmount());

            OrderPaymentHistory updatedPaymentHistory = orderPaymentHistoryRepository.save(existingPaymentHistory);
            return orderPaymentHistoryMapper.toDto(updatedPaymentHistory);
        }
        return null;
    }
}
