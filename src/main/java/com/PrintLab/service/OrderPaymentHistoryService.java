package com.PrintLab.service;

import com.PrintLab.dto.BusinessDto;
import com.PrintLab.dto.OrderPaymentHistoryDto;
import com.PrintLab.dto.OrderDto;
import com.PrintLab.model.OrderPaymentHistory;

import java.util.List;

public interface OrderPaymentHistoryService {

    OrderPaymentHistoryDto findById(Long id);
    OrderPaymentHistoryDto save(OrderPaymentHistoryDto paymentHistoryDto);
    List<OrderPaymentHistoryDto> getAll();
    OrderPaymentHistoryDto findByName(String name);
    void deleteById(Long id);
    OrderPaymentHistoryDto updateById(Long id, OrderPaymentHistoryDto updatedPaymentHistoryDto);
}
