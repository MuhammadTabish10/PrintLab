package com.PrintLab.Mapper;

import com.PrintLab.dto.MasterCustomerStatementDto;
import com.PrintLab.dto.OrderDto;
import com.PrintLab.dto.OrderPaymentHistoryDto;
import com.PrintLab.model.MasterCustomerStatement;
import com.PrintLab.model.Order;
import com.PrintLab.model.OrderPaymentHistory;
import org.springframework.stereotype.Component;

@Component
public class MasterCustomerStatementMapper {

    public MasterCustomerStatement toEntity(MasterCustomerStatementDto masterCustomerStatementDto){
        MasterCustomerStatement masterCustomerStatement = new MasterCustomerStatement();
        masterCustomerStatement.setId(masterCustomerStatementDto.getId());
        masterCustomerStatement.setLocalDate(masterCustomerStatementDto.getLocalDate());
        masterCustomerStatement.setLocalTime(masterCustomerStatementDto.getLocalTime());
        masterCustomerStatement.setDescription(masterCustomerStatementDto.getDescription());

        if (masterCustomerStatementDto.getOrder() != null) {
            Order order = new Order();
            order.setId(masterCustomerStatementDto.getOrder().getId());
            masterCustomerStatement.setOrder(order);
        }
        masterCustomerStatement.setDebit(masterCustomerStatementDto.getDebit());
        masterCustomerStatement.setCredit(masterCustomerStatementDto.getCredit());
        masterCustomerStatement.setAmount(masterCustomerStatementDto.getAmount());

        if (masterCustomerStatementDto.getPaymentHistory() != null) {
            OrderPaymentHistory paymentHistory = new OrderPaymentHistory();
            paymentHistory.setId(masterCustomerStatementDto.getPaymentHistory().getId());
            masterCustomerStatement.setPaymentHistory(paymentHistory);
        }
        return masterCustomerStatement;
    }

    public MasterCustomerStatementDto toDto(MasterCustomerStatement masterCustomerStatement) {
        MasterCustomerStatementDto masterCustomerStatementDto = new MasterCustomerStatementDto();
        masterCustomerStatementDto.setId(masterCustomerStatement.getId());
        masterCustomerStatementDto.setLocalDate(masterCustomerStatement.getLocalDate());
        masterCustomerStatementDto.setLocalTime(masterCustomerStatement.getLocalTime());
        masterCustomerStatementDto.setDescription(masterCustomerStatement.getDescription());

        if (masterCustomerStatement.getOrder() != null) {
            OrderDto orderDto = new OrderDto();
            orderDto.setId(masterCustomerStatement.getOrder().getId());
            masterCustomerStatementDto.setOrder(orderDto);
        }
        masterCustomerStatementDto.setDebit(masterCustomerStatement.getDebit());
        masterCustomerStatementDto.setCredit(masterCustomerStatement.getCredit());
        masterCustomerStatementDto.setAmount(masterCustomerStatement.getAmount());

        if (masterCustomerStatement.getPaymentHistory() != null) {
            OrderPaymentHistoryDto paymentHistoryDto = new OrderPaymentHistoryDto();
            paymentHistoryDto.setId(masterCustomerStatement.getPaymentHistory().getId());
            masterCustomerStatementDto.setPaymentHistory(paymentHistoryDto);
        }
        return masterCustomerStatementDto;
    }

}
