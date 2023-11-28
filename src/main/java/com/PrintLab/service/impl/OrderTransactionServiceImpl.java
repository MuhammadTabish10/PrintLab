package com.PrintLab.service.impl;

import com.PrintLab.dto.OrderTransactionDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.*;
import com.PrintLab.repository.*;
import com.PrintLab.service.OrderTransactionService;
import com.PrintLab.utils.HelperUtils;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class OrderTransactionServiceImpl implements OrderTransactionService {

    private final OrderTransactionRepository orderTransactionRepository;
    private final OrderRepository orderRepository;
    private final CtpRepository ctpRepository;
    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final ProductRuleRepository productRuleRepository;
    private final VendorSettlementRepository vendorSettlementRepository;
    private final UserPettyCashRepository userPettyCashRepository;
    private final HelperUtils helperUtils;

    private static final String CTP = "CTP";
    private static final String PAPER_MARKET = "PAPER-MARKET";
    private static final String CREDIT = "Credit";
    private static final String CASH = "Cash";

    public OrderTransactionServiceImpl(OrderTransactionRepository orderTransactionRepository, OrderRepository orderRepository, CtpRepository ctpRepository, UserRepository userRepository, VendorRepository vendorRepository, ProductRuleRepository productRuleRepository, VendorSettlementRepository vendorSettlementRepository, UserPettyCashRepository userPettyCashRepository, HelperUtils helperUtils) {
        this.orderTransactionRepository = orderTransactionRepository;
        this.orderRepository = orderRepository;
        this.ctpRepository = ctpRepository;
        this.userRepository = userRepository;
        this.vendorRepository = vendorRepository;
        this.productRuleRepository = productRuleRepository;
        this.vendorSettlementRepository = vendorSettlementRepository;
        this.userPettyCashRepository = userPettyCashRepository;
        this.helperUtils = helperUtils;
    }

    @Override
    @Transactional
    public OrderTransactionDto save(OrderTransactionDto orderTransactionDto) {
        OrderTransaction orderTransaction = toEntity(orderTransactionDto);
        orderTransaction.setStatus(true);

        User user = helperUtils.getCurrentUser();

        Order order = orderRepository.findById(orderTransaction.getOrder().getId())
                .orElseThrow(() -> new RecordNotFoundException(String.format("Order not found for id => %d", orderTransaction.getOrder().getId())));

        ProductRule productRule = productRuleRepository.findById(order.getProductRule())
                .orElseThrow(() -> new RecordNotFoundException(String.format("ProductRule not found for id => %d", orderTransaction.getOrder().getProductRule())));

        Ctp ctp = ctpRepository.findById(productRule.getCtp().getId())
                .orElseThrow(() -> new RecordNotFoundException(String.format("Ctp not found for id => %d", productRule.getCtp().getId())));

        Optional<Vendor> optionalVendor = Optional.ofNullable(vendorRepository.findByName(ctp.getVendor().getName()));
        Vendor vendor = optionalVendor.orElseThrow(() -> new RecordNotFoundException("Vendor not found"));

        if(orderTransaction.getPaymentMode() != null && orderTransaction.getPaymentMode().equalsIgnoreCase(CREDIT)){
            VendorSettlement vendorSettlement = new VendorSettlement();
            vendorSettlement.setStatus(true);
            vendorSettlement.setDebit(0.0);
            vendorSettlement.setCredit(orderTransaction.getAmount());
            vendorSettlement.setVendor(vendor);
            vendorSettlement.setOrder(order);
            vendorSettlementRepository.save(vendorSettlement);
        }
        else if (orderTransaction.getPaymentMode() != null && orderTransaction.getPaymentMode().equalsIgnoreCase(CASH)) {
            UserPettyCash userPettyCash = new UserPettyCash();
            userPettyCash.setStatus(true);
            userPettyCash.setDebit(0.0);
            userPettyCash.setCredit(orderTransaction.getAmount());
            userPettyCash.setUser(user);
            userPettyCash.setOrder(order);
            userPettyCashRepository.save(userPettyCash);
        }
        else {
            throw new RecordNotFoundException("Payment Mode is Null");
        }

        orderTransaction.setUserId(user.getId());
        orderTransaction.setOrder(order);
        OrderTransaction savedOrderTransaction = orderTransactionRepository.save(orderTransaction);
        return toDto(savedOrderTransaction);
    }

    @Override
    public List<OrderTransactionDto> getAll() {
        List<OrderTransaction> orderTransactionList = orderTransactionRepository.findAllInDesOrderByIdAndStatus();
        List<OrderTransactionDto> orderTransactionDtoList = new ArrayList<>();

        for (OrderTransaction orderTransaction : orderTransactionList) {
            OrderTransactionDto orderTransactionDto = toDto(orderTransaction);
            orderTransactionDtoList.add(orderTransactionDto);
        }
        return orderTransactionDtoList;
    }

    @Override
    public List<OrderTransactionDto> searchByPlateDimension(String plateDimension) {
        List<OrderTransaction> orderTransactionList = orderTransactionRepository.findByPlateDimension(plateDimension);
        List<OrderTransactionDto> orderTransactionDtoList = new ArrayList<>();

        for (OrderTransaction orderTransaction : orderTransactionList) {
            OrderTransactionDto orderTransactionDto = toDto(orderTransaction);
            orderTransactionDtoList.add(orderTransactionDto);
        }
        return orderTransactionDtoList;
    }

    @Override
    public OrderTransactionDto findById(Long id) {
        OrderTransaction orderTransaction = orderTransactionRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(String.format("OrderTransaction not found for id => %d", id)));
        return toDto(orderTransaction);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        OrderTransaction orderTransaction = orderTransactionRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(String.format("OrderTransaction not found for id => %d", id)));
        orderTransactionRepository.setStatusInactive(orderTransaction.getId());
    }

    @Override
    @Transactional
    public OrderTransactionDto update(Long id, OrderTransactionDto orderTransactionDto) {
        OrderTransaction existingOrderTransaction = orderTransactionRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(String.format("OrderTransaction not found for id => %d", id)));

        existingOrderTransaction.setVendor(orderTransactionDto.getVendor());
        existingOrderTransaction.setQuantity(orderTransactionDto.getQuantity());
        existingOrderTransaction.setUnitPrice(orderTransactionDto.getUnitPrice());
        existingOrderTransaction.setAmount(orderTransactionDto.getAmount());
        existingOrderTransaction.setPaymentMode(orderTransactionDto.getPaymentMode());

        OrderTransaction updatedOrderTransaction = orderTransactionRepository.save(existingOrderTransaction);
        return toDto(updatedOrderTransaction);
    }

    @Override
    public HashMap<String,Object> getOrderProcess(Long orderId, String processType) {

        HashMap<String, Object> resultMap = new LinkedHashMap<>();

        switch (processType) {
            case CTP: {
                Order order = orderRepository.findById(orderId)
                        .orElseThrow(() -> new RecordNotFoundException(String.format("Order not found for id => %d", orderId)));

                ProductRule productRule = productRuleRepository.findById(order.getProductRule())
                        .orElseThrow(() -> new RecordNotFoundException(String.format("ProductRule not found for id => %d", order.getProductRule())));

                Ctp ctp = ctpRepository.findById(productRule.getCtp().getId())
                        .orElseThrow(() -> new RecordNotFoundException(String.format("Ctp not found for id => %d", productRule.getCtp().getId())));

                int jobFrontColor = countColors(productRule.getJobColorFront());
                int jobBackColor = countColors(productRule.getJobColorBack());

                Ctp ctpForUnitPrice = ctpRepository.findByPlateDimensionAndVendor(ctp.getPlateDimension(), ctp.getVendor());

                resultMap.put("plateDimension", ctp.getPlateDimension());
                resultMap.put("vendor", ctp.getVendor());
                resultMap.put("quantity", jobFrontColor + jobBackColor);
                resultMap.put("unitPrice", ctpForUnitPrice.getRate());
                resultMap.put("amount", ctpForUnitPrice.getRate() * (jobFrontColor + jobBackColor));
            }
            case PAPER_MARKET:
            {

            }
        }
        return resultMap;
    }

    private static int countColors(String input) {
        if (input == null || input.isEmpty()) {
            return 0;
        }
        String[] values = input.split(",");
        return values.length;
    }

    public OrderTransactionDto toDto(OrderTransaction orderTransaction) {
        return OrderTransactionDto.builder()
                .id(orderTransaction.getId())
                .plateDimension(orderTransaction.getPlateDimension())
                .vendor(orderTransaction.getVendor())
                .quantity(orderTransaction.getQuantity())
                .unitPrice(orderTransaction.getUnitPrice())
                .amount(orderTransaction.getAmount())
                .paymentMode(orderTransaction.getPaymentMode())
                .userId(orderTransaction.getUserId())
                .order(orderTransaction.getOrder())
                .status(orderTransaction.getStatus())
                .build();
    }

    public OrderTransaction toEntity(OrderTransactionDto orderTransactionDto) {
        return OrderTransaction.builder()
                .id(orderTransactionDto.getId())
                .plateDimension(orderTransactionDto.getPlateDimension())
                .vendor(orderTransactionDto.getVendor())
                .quantity(orderTransactionDto.getQuantity())
                .unitPrice(orderTransactionDto.getUnitPrice())
                .amount(orderTransactionDto.getAmount())
                .paymentMode(orderTransactionDto.getPaymentMode())
                .userId(orderTransactionDto.getUserId())
                .order(orderTransactionDto.getOrder())
                .status(orderTransactionDto.getStatus())
                .build();
    }

}
