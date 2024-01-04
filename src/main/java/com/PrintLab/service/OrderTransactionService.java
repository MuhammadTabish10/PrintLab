package com.PrintLab.service;

import com.PrintLab.dto.OrderTransactionDto;

import java.util.HashMap;
import java.util.List;

public interface OrderTransactionService {
    OrderTransactionDto save(OrderTransactionDto orderTransactionDto);
    List<OrderTransactionDto> getAll();
    List<OrderTransactionDto> searchByPlateDimension(String plateDimension);
    OrderTransactionDto findById(Long id);
    void deleteById(Long id);
    OrderTransactionDto update(Long id, OrderTransactionDto orderTransactionDto);
    HashMap<String,Object> getOrderProcess(Long orderId, String processType);
}
