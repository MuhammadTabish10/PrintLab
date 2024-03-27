package com.PrintLab.service;

import com.PrintLab.dto.BusinessDto;
import com.PrintLab.model.Business;

import java.util.List;

public interface BusinessService {
    List<Business> getAllBusinesses();

    Business getBusinessById(Long id);

    BusinessDto createBusiness(BusinessDto businessDto);

    BusinessDto updateBusiness(Long id, BusinessDto businessDto);

    void deleteBusiness(Long id);

    void deleteBranch(Long id);
}
