package com.PrintLab.service.impl;

import com.PrintLab.Mapper.BusinessAndBranchMapper;
import com.PrintLab.dto.BusinessBranchDto;
import com.PrintLab.dto.BusinessDto;
import com.PrintLab.model.Business;
import com.PrintLab.model.BusinessBranch;
import com.PrintLab.repository.BusinessBranchRepository;
import com.PrintLab.repository.BusinessRepository;
import com.PrintLab.service.BusinessService;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BusinessServiceImpl implements BusinessService {


    private final BusinessRepository businessRepository;

    private final BusinessBranchRepository branchRepository;


    private final BusinessAndBranchMapper businessMapper;

    public BusinessServiceImpl(BusinessRepository businessRepository, BusinessBranchRepository branchRepository, BusinessAndBranchMapper businessMapper) {
        this.businessRepository = businessRepository;
        this.branchRepository = branchRepository;
        this.businessMapper = businessMapper;
    }

    @Override
    public List<Business> getAllBusinesses() {
        return businessRepository.findAll();
    }

    @Override
    public Business getBusinessById(Long id) {
        Optional<Business> businessOptional = businessRepository.findById(id);
        return businessOptional.orElse(null);
    }

    @Override
    public BusinessDto createBusiness(BusinessDto businessDto) {
        Business business = businessMapper.toBusinessEntity(businessDto);
        // Check if the business with the given name already exists
        if (businessRepository.existsByBusinessName(business.getBusinessName())) {
            throw new RuntimeException("Business already exists: " + business.getBusinessName());
        }
        // Save the business to the repository
        business = businessRepository.save(business);
        return businessMapper.toBusinessDto(business);
    }


    @Transactional
    @Override
    public BusinessDto updateBusiness(Long id, BusinessDto businessDto) {
        Optional<Business> businessOptional = businessRepository.findById(id);

        if (businessOptional.isPresent()) {
            Business business = businessOptional.get();
            business.setBusinessName(businessDto.getBusinessName());
            List<BusinessBranch> updatedBranches = updateBranches(business, businessDto.getBusinessBranchList());
            business.setBusinessBranchList(updatedBranches);
            businessRepository.save(business);
            return businessMapper.toBusinessDto(business);
        } else {
            throw new EntityNotFoundException("Business not found with id: " + id);
        }
    }

    private List<BusinessBranch> updateBranches(Business business, List<BusinessBranchDto> businessBranchList) {
        List<BusinessBranch> updatedBranches = new ArrayList<>();
        for (BusinessBranchDto branchDto : businessBranchList) {
            BusinessBranch branch = getOrCreateBranch(business, branchDto);
            updateBranchFields(branch, branchDto);
            updatedBranches.add(branch);
        }
        return branchRepository.saveAll(updatedBranches);
    }

    private BusinessBranch getOrCreateBranch(Business business, BusinessBranchDto branchDto) {
        if (branchDto.getId() != null) {
            return business.getBusinessBranchList().stream()
                    .filter(branch -> branch.getId().equals(branchDto.getId()))
                    .findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("Branch not found with id: " + branchDto.getId()));
        } else {
            return createNewBranch(business, branchDto);
        }
    }

    private BusinessBranch createNewBranch(Business business, BusinessBranchDto branchDto) {
        return BusinessBranch.builder()
                .branchName(branchDto.getBranchName())
                .address(branchDto.getAddress())
                .city(branchDto.getCity())
                .pointOfContact(branchDto.getPointOfContact())
                .phoneNumber(branchDto.getPhoneNumber())
                .business(business)
                .build();
    }

    private void updateBranchFields(BusinessBranch branch, BusinessBranchDto branchDto) {
        branch.setBranchName(branchDto.getBranchName());
        branch.setAddress(branchDto.getAddress());
        branch.setCity(branchDto.getCity());
        branch.setPointOfContact(branchDto.getPointOfContact());
        branch.setPhoneNumber(branchDto.getPhoneNumber());
    }


    @Override
    public void deleteBusiness(Long id) {
        businessRepository.deleteById(id);
    }

    @Override
    public void deleteBranch(Long id) {
        branchRepository.deleteById(id);
    }
}
