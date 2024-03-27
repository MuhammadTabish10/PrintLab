package com.PrintLab.Mapper;

import com.PrintLab.dto.BusinessBranchDto;
import com.PrintLab.dto.BusinessDto;
import com.PrintLab.model.Business;
import com.PrintLab.model.BusinessBranch;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;
@Component
public class BusinessAndBranchMapper {

    public BusinessDto toBusinessDto(Business business) {
            List<BusinessBranchDto> branchDtoList = business.getBusinessBranchList().stream()
                .map(branch -> BusinessBranchDto.builder()
                        .id(branch.getId())
                        .address(branch.getAddress())
                        .city(branch.getCity())
                        .pointOfContact(branch.getPointOfContact())
                        .phoneNumber(branch.getPhoneNumber())
                        .build())
                .collect(Collectors.toList());

        return BusinessDto.builder()
                .id(business.getId())
                .businessName(business.getBusinessName())
                .businessBranchList(branchDtoList)
                .build();
    }

    public Business toBusinessEntity(BusinessDto businessDto) {
        List<BusinessBranch> branchList = businessDto.getBusinessBranchList().stream()
                .map(branchDto -> BusinessBranch.builder()
                        .id(branchDto.getId())
                        .address(branchDto.getAddress())
                        .city(branchDto.getCity())
                        .pointOfContact(branchDto.getPointOfContact())
                        .phoneNumber(branchDto.getPhoneNumber())
                        .build())
                .collect(Collectors.toList());

        return Business.builder()
                .id(businessDto.getId())
                .businessName(businessDto.getBusinessName())
                .businessBranchList(branchList)
                .build();
    }

    public BusinessBranch toBusinessBranchEntity(BusinessBranchDto businessBranchDto) {
        return BusinessBranch.builder()
                .id(businessBranchDto.getId())
                .address(businessBranchDto.getAddress())
                .city(businessBranchDto.getCity())
                .pointOfContact(businessBranchDto.getPointOfContact())
                .phoneNumber(businessBranchDto.getPhoneNumber())
                .build();
    }

}
