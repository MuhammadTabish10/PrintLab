//package com.PrintLab.Mapper;
//
//import com.PrintLab.dto.JobSizeDto;
//import com.PrintLab.model.JobSize;
//import org.springframework.stereotype.Component;
//
//@Component
//public class JobSizeMapper {
//
//    public JobSizeDto toDto(JobSize jobSize) {
//        return JobSizeDto.builder()
//                .id(jobSize.getId())
//                .name(jobSize.getName())
//                .build();
//    }
//
//    public JobSize toEntity(JobSizeDto jobSizeDto) {
//        return JobSize.builder()
//                .id(jobSizeDto.getId())
//                .name(jobSizeDto.getName())
//                .build();
//    }
//}
