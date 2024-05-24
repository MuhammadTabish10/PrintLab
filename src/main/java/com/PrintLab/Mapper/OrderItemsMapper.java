package com.PrintLab.Mapper;

import com.PrintLab.dto.OrderItemsDto;
import com.PrintLab.model.OrderItems;
import org.springframework.stereotype.Component;

@Component
public class OrderItemsMapper {

    public OrderItemsDto toDto(OrderItems orderItems) {

        return OrderItemsDto.builder()
                .id(orderItems.getId())
                .name(orderItems.getName())
                .quantity(orderItems.getQuantity())
                .build();
    }

    public OrderItems toEntity(OrderItemsDto orderItemsDto) {

        return OrderItems.builder()
                .id(orderItemsDto.getId())
                .name(orderItemsDto.getName())
                .quantity(orderItemsDto.getQuantity())
                .build();
    }
}
