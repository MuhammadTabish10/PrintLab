package com.PrintLab.service.impl;

import com.PrintLab.Mapper.OrderPaymentHistoryMapper;
import com.PrintLab.dto.OrderPaymentHistoryDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.*;
import com.PrintLab.repository.MasterCustomerStatementRepository;
import com.PrintLab.repository.OrderPaymentHistoryRepository;
import com.PrintLab.repository.OrderRepository;
import com.PrintLab.service.OrderPaymentHistoryService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderPaymentHistoryServiceImpl implements OrderPaymentHistoryService {

    private final MasterCustomerStatementRepository masterCustomerStatementRepository;
    private final OrderPaymentHistoryRepository orderPaymentHistoryRepository;
    private final OrderPaymentHistoryMapper orderPaymentHistoryMapper;
    private final OrderRepository orderRepository;
    public OrderPaymentHistoryServiceImpl(OrderPaymentHistoryRepository orderPaymentHistoryRepository, OrderPaymentHistoryMapper orderPaymentHistoryMapper, OrderRepository orderRepository, MasterCustomerStatementRepository masterCustomerStatementRepository) {
        this.masterCustomerStatementRepository = masterCustomerStatementRepository;
        this.orderPaymentHistoryRepository = orderPaymentHistoryRepository;
        this.orderPaymentHistoryMapper = orderPaymentHistoryMapper;
        this.orderRepository = orderRepository;
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

    @Override
    public List<OrderPaymentHistoryDto> findByOrderId(Long id) {
        List<OrderPaymentHistory> paymentHistoryList = orderPaymentHistoryRepository.findByOrderId(id);
        if (paymentHistoryList.isEmpty()) {
            throw new RecordNotFoundException("OrderPaymentHistory not found with id: " + id);
        }
        return paymentHistoryList.stream()
                .map(orderPaymentHistoryMapper::toDto)
                .collect(Collectors.toList());
    }
    @Override
    @Transactional
    public OrderPaymentHistoryDto saveOrderPaymentHistory(Long orderId, OrderPaymentHistoryDto orderPaymentHistoryDto) {
        // Find the order by ID
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Map DTO to entity
        OrderPaymentHistory orderPaymentHistory = orderPaymentHistoryMapper.toEntity(orderPaymentHistoryDto);

        // Set the order in the orderPaymentHistory
        orderPaymentHistory.setOrder(order);

        // Add orderPaymentHistory to the order's list
        order.getOrderPaymentHistory().add(orderPaymentHistory);

        // Save the orderPaymentHistory
        OrderPaymentHistory savedOrderPaymentHistory = orderPaymentHistoryRepository.save(orderPaymentHistory);

        MasterCustomerStatement customerStatement = MasterCustomerStatement.builder()
                .date(LocalDate.now())
                .time(LocalTime.now())
                .description("Payment received from " + savedOrderPaymentHistory.getPaymentReceivedBy().stream().map(User::getName).collect(Collectors.joining(", ")))
                .paymentHistory(savedOrderPaymentHistory)
                .credit(order.getAmount())
                .debit(savedOrderPaymentHistory.getAmount())
                .balance(order.getAmount() - savedOrderPaymentHistory.getAmount())
                .build();

        masterCustomerStatementRepository.save(customerStatement);

        // Map entity back to DTO
        return orderPaymentHistoryMapper.toDto(savedOrderPaymentHistory);
    }
}
