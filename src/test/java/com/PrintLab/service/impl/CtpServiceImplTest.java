package com.PrintLab.service.impl;

import com.PrintLab.dto.CtpDto;
import com.PrintLab.model.Ctp;
import com.PrintLab.model.Vendor;
import com.PrintLab.model.VendorProcess;
import com.PrintLab.repository.CtpRepository;
import com.PrintLab.repository.VendorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CtpServiceImplTest
{
    @Mock
    private CtpRepository ctpRepository;
    @Mock
    private VendorRepository vendorRepository;
    @InjectMocks
    private CtpServiceImpl ctpService;

//    @Test
//    void testSaveCtpDto() {
//        // Arrange
//
//        VendorProcess vendorProcess1 = createVendorProcess(1L, "MaterialType1", 10.5, "Notes1");
//        VendorProcess vendorProcess2 = createVendorProcess(2L, "MaterialType2", 15.0, "Notes2");
//        Vendor vendor = createVendor(1L, "Nadeem & Sons", "Nadeem", "03334215643", "nadeem@gmail.com", "johar", "hello", vendorProcess1, vendorProcess2);
//        Ctp ctpEntity = createCtp(1L, LocalDate.now(), 450, 370, "450\"x370\"", 160.0, vendor);
//
//        when(ctpRepository.save(any())).thenReturn(ctpEntity);
//
//        // Act
//        CtpDto savedCtpDto = ctpService.save(ctpService.toDto(ctpEntity));
//
//        // Assert
//        verify(ctpRepository, times(1)).save(any());
//        assertEquals(/* expected CtpDto properties */, savedCtpDto /* actual CtpDto returned by the service */);
//    }

    @Test
    void testToDto() {
        // Arrange
        VendorProcess vendorProcess1 = createVendorProcess(1L, "MaterialType1", 10.5, "Notes1");
        VendorProcess vendorProcess2 = createVendorProcess(2L, "MaterialType2", 15.0, "Notes2");
        Vendor vendor = createVendor(1L, "Nadeem & Sons", "Nadeem", "03334215643", "nadeem@gmail.com", "johar", "hello", Arrays.asList(vendorProcess1, vendorProcess2));
        Ctp ctpEntity = createCtp(1L, LocalDate.now(), 450, 370, "450\"x370\"", 160.0, vendor);

        // Mock the VendorRepository to return the vendor when findById is called
        when(vendorRepository.findById(1L)).thenReturn(Optional.of(vendor));

        // Act
        CtpDto ctpDto = ctpService.toDto(ctpEntity);

        // Assert
        assertAll("CtpDto properties",
                () -> assertEquals(ctpEntity.getId(), ctpDto.getId()),
                () -> assertEquals(ctpEntity.getDate(), ctpDto.getDate()),
                () -> assertEquals(ctpEntity.getL1(), ctpDto.getL1()),
                () -> assertEquals(ctpEntity.getL2(), ctpDto.getL2()),
                () -> assertEquals(ctpEntity.getPlateDimension(), ctpDto.getPlateDimension()),
                () -> assertEquals(ctpEntity.getRate(), ctpDto.getRate()),
                () -> assertEquals(ctpEntity.getVendor().getId(), ctpDto.getVendor().getId()),
                () -> assertEquals(ctpEntity.getVendor().getName(), ctpDto.getVendor().getName()),
                () -> assertEquals(ctpEntity.getVendor().getContactName(), ctpDto.getVendor().getContactName()),
                () -> assertEquals(ctpEntity.getVendor().getContactNumber(), ctpDto.getVendor().getContactNumber()),
                () -> assertEquals(ctpEntity.getVendor().getEmail(), ctpDto.getVendor().getEmail()),
                () -> assertEquals(ctpEntity.getVendor().getAddress(), ctpDto.getVendor().getAddress()),
                () -> assertEquals(ctpEntity.getVendor().getNotes(), ctpDto.getVendor().getNotes()),
                () -> assertEquals(ctpEntity.getVendor().getVendorProcessList(), ctpDto.getVendor().getVendorProcessList())
        );
    }

    @Test
    void testToEntity() {
        // Arrange
        VendorProcess vendorProcess1 = createVendorProcess(1L, "MaterialType1", 10.5, "Notes1");
        VendorProcess vendorProcess2 = createVendorProcess(2L, "MaterialType2", 15.0, "Notes2");
        Vendor vendor = createVendor(1L, "Nadeem & Sons", "Nadeem", "03334215643", "nadeem@gmail.com", "johar", "hello", Arrays.asList(vendorProcess1, vendorProcess2));

        CtpDto ctpDto = CtpDto.builder()
                .id(1L)
                .date(LocalDate.now())
                .l1(450)
                .l2(370)
                .plateDimension("450\"x370\"")
                .rate(160.0)
                .vendor(vendor)
                .build();

        // Mock the VendorRepository to return the vendor when findById is called
        when(vendorRepository.findById(1L)).thenReturn(Optional.of(vendor));

        // Act
        Ctp ctpEntity = ctpService.toEntity(ctpDto);

        // Assert
        assertAll("CtpEntity properties",
                () -> assertEquals(ctpDto.getId(), ctpEntity.getId()),
                () -> assertEquals(ctpDto.getDate(), ctpEntity.getDate()),
                () -> assertEquals(ctpDto.getL1(), ctpEntity.getL1()),
                () -> assertEquals(ctpDto.getL2(), ctpEntity.getL2()),
                () -> assertEquals(ctpDto.getPlateDimension(), ctpEntity.getPlateDimension()),
                () -> assertEquals(ctpDto.getRate(), ctpEntity.getRate()),
                () -> assertEquals(ctpDto.getVendor().getId(), ctpEntity.getVendor().getId()),
                () -> assertEquals(ctpDto.getVendor().getName(), ctpEntity.getVendor().getName()),
                () -> assertEquals(ctpDto.getVendor().getContactName(), ctpEntity.getVendor().getContactName()),
                () -> assertEquals(ctpDto.getVendor().getContactNumber(), ctpEntity.getVendor().getContactNumber()),
                () -> assertEquals(ctpDto.getVendor().getEmail(), ctpEntity.getVendor().getEmail()),
                () -> assertEquals(ctpDto.getVendor().getAddress(), ctpEntity.getVendor().getAddress()),
                () -> assertEquals(ctpDto.getVendor().getNotes(), ctpEntity.getVendor().getNotes()),
                () -> assertEquals(ctpDto.getVendor().getVendorProcessList(), ctpEntity.getVendor().getVendorProcessList())
        );    }

    private VendorProcess createVendorProcess(Long id, String materialType, Double rateSqft, String notes) {
        return VendorProcess.builder()
                .id(id)
                .materialType(materialType)
                .rateSqft(rateSqft)
                .notes(notes)
                .build();
    }

    private Vendor createVendor(Long id, String name, String contactName, String contactNumber, String email, String address, String notes, List<VendorProcess> vendorProcessList) {
        return Vendor.builder()
                .id(id)
                .name(name)
                .contactName(contactName)
                .contactNumber(contactNumber)
                .email(email)
                .address(address)
                .notes(notes)
                .vendorProcessList(vendorProcessList)
                .build();
    }

    private Ctp createCtp(Long id, LocalDate date, Integer l1, Integer l2, String plateDimension, Double rate, Vendor vendor) {
        return Ctp.builder()
                .id(id)
                .date(date)
                .l1(l1)
                .l2(l2)
                .plateDimension(plateDimension)
                .rate(rate)
                .vendor(vendor)
                .build();
    }
}
