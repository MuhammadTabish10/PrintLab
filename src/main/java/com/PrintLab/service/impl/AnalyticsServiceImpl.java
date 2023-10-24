package com.PrintLab.service.impl;

import com.PrintLab.repository.*;
import com.PrintLab.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    ProductRuleRepository productRuleRepository;
    @Autowired
    VendorRepository vendorRepository;
    @Autowired
    CustomerRepository customerRepository;

    @Override
    public Map<String, Long> count() {
        Map<String, Long> resultMap = new LinkedHashMap<>();

        Long orderCount = getTotalOrderCount();
        Long productCount = getTotalProductCount();
        Long vendorCount = getTotalVendorCount();
        Long customerCount = getTotalCustomerCount();

        resultMap.put("orderCount", orderCount);
        resultMap.put("productCount", productCount);
        resultMap.put("vendorCount", vendorCount);
        resultMap.put("customerCount", customerCount);
        return resultMap;
    }

    public Long getTotalOrderCount() {
        return orderRepository.getAllOrderCount();
    }
    public  Long getTotalProductCount(){ return productRuleRepository.getAllProductCount(); }
    public Long getTotalVendorCount() {return vendorRepository.getAllVendorCount();}
    public Long getTotalCustomerCount() {
        return customerRepository.getAllCustomersCount();
    }
}
