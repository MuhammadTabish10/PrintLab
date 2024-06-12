package com.PrintLab.service.impl;

import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.Vendor;
import com.PrintLab.model.VendorNote;
import com.PrintLab.repository.VendorNoteRepository;
import com.PrintLab.repository.VendorRepository;
import com.PrintLab.service.VendorNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorNoteServiceImpl implements VendorNoteService {

    @Autowired
    private VendorNoteRepository vendorNoteRepository;
    @Autowired
    private VendorRepository vendorRepository;

    @Override
    @Transactional
    public VendorNote addNote(VendorNote vendorNote) {
        vendorNote.setStatus(true);
        Vendor vendor = vendorRepository.findById(vendorNote.getVendorId())
                .orElseThrow(() -> new RecordNotFoundException("Vendor not found at id: " + vendorNote.getVendorId()));
        return vendorNoteRepository.save(vendorNote);
    }

    @Override
    public List<VendorNote> getAllNotesByVendor(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RecordNotFoundException("Vendor not found at id: " + vendorId));
        return vendorNoteRepository.findAllByVendorId(vendorId);
    }
}
