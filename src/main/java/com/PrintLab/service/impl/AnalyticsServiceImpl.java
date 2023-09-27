package com.PrintLab.service.impl;

import com.PrintLab.repository.CustomerRepository;
import com.PrintLab.repository.OrderRepository;
import com.PrintLab.repository.ProductDefinitionRepository;
import com.PrintLab.repository.VendorRepository;
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
    ProductDefinitionRepository productDefinitionRepository;
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

        resultMap.put("Order-Count", orderCount);
        resultMap.put("Product-Count", productCount);
        resultMap.put("Vendor-Count", vendorCount);
        resultMap.put("Customer-Count", customerCount);
        return resultMap;
    }

    public Long getTotalOrderCount() {
        return orderRepository.getAllOrderCount();
    }
    public  Long getTotalProductCount(){ return productDefinitionRepository.getAllProductCount(); }
    public Long getTotalVendorCount() {return vendorRepository.getAllVendorCount();}
    public Long getTotalCustomerCount() {
        return customerRepository.getAllCustomersCount();
    }
}
