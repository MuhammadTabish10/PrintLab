package com.PrintLab.Mapper;

import com.PrintLab.dto.OrderPaymentHistoryDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.OrderPaymentHistory;
import com.PrintLab.repository.OrderRepository;
import com.PrintLab.service.impl.OrderServiceImpl;
import com.PrintLab.service.impl.UserServiceImpl;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class OrderPaymentHistoryMapper {

    private final BusinessAndBranchMapper businessAndBranchMapper;
    private final UserServiceImpl userService;
    private final OrderRepository orderRepository;
    private final OrderServiceImpl orderService;

    public OrderPaymentHistoryMapper(BusinessAndBranchMapper businessAndBranchMapper, UserServiceImpl userService, OrderRepository orderRepository, OrderServiceImpl orderService) {
        this.businessAndBranchMapper = businessAndBranchMapper;
        this.userService = userService;
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    public OrderPaymentHistory toEntity(OrderPaymentHistoryDto detailDto) {
        return OrderPaymentHistory.builder()
                .id(detailDto.getId())
                .timeStamp(detailDto.getTimeStamp())
                .description(detailDto.getDescription())
                .type(detailDto.getType())
                .amount(detailDto.getAmount())
                .paymentReceivedBy(detailDto.getPaymentReceivedBy().stream()
                        .map(userService::toEntity)
                        .collect(Collectors.toList()))
                .business(detailDto.getBusiness().stream()
                        .map(businessAndBranchMapper::toBusinessEntity)
                        .collect(Collectors.toList()))
                .businessBranch(detailDto.getBusinessBranch().stream()
                        .map(businessAndBranchMapper::toBusinessBranchEntity)
                        .collect(Collectors.toList()))
                .status(detailDto.getStatus())
                .order(orderRepository.findById(detailDto.getOrder().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Order not found")))
                .build();
    }

    public OrderPaymentHistoryDto toDto(OrderPaymentHistory detail) {
        return OrderPaymentHistoryDto.builder()
                .id(detail.getId())
                .timeStamp(detail.getTimeStamp())
                .description(detail.getDescription())
                .type(detail.getType())
                .amount(detail.getAmount())
                .paymentReceivedBy(detail.getPaymentReceivedBy().stream()
                        .map(userService::toDto)
                        .collect(Collectors.toList()))
                .business(detail.getBusiness().stream()
                        .map(businessAndBranchMapper::toBusinessDto)
                        .collect(Collectors.toList()))
                .businessBranch(detail.getBusinessBranch().stream()
                        .map(businessAndBranchMapper::toBusinessBranchDto)
                        .collect(Collectors.toList()))
                .status(detail.getStatus())
                .order(orderService.toDto(detail.getOrder()))
                .build();
    }
}
