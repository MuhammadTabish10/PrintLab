package com.PrintLab.service;

import com.PrintLab.model.VendorNote;

import java.util.List;

public interface VendorNoteService {
    VendorNote addNote(VendorNote vendorNote);
    List<VendorNote> getAllNotesByVendor(Long vendorId);
}
