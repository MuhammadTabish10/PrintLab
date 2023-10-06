package com.PrintLab.service.impl;

import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.PaperMarketRates;

import com.PrintLab.repository.PaperMarketRatesRepository;
import com.PrintLab.repository.VendorRepository;
import com.PrintLab.service.PaperMarketRatesService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PaperMarketRatesServiceImpI implements PaperMarketRatesService
{
    private final PaperMarketRatesRepository paperMarketRatesRepository;
    private final VendorRepository vendorRepository;

    public PaperMarketRatesServiceImpI(PaperMarketRatesRepository paperMarketRatesRepository, VendorRepository vendorRepository) {
        this.paperMarketRatesRepository = paperMarketRatesRepository;
        this.vendorRepository = vendorRepository;
    }

    @Override
    public PaperMarketRatesDto save(PaperMarketRatesDto paperMarketRatesDto) {
        paperMarketRatesDto.setRecordType("manual");
        PaperMarketRates paperMarketRates = toEntity(paperMarketRatesDto);
        PaperMarketRates savedPaperMarketRates = paperMarketRatesRepository.save(paperMarketRates);
        return toDto(savedPaperMarketRates);
    }

    @Override
    public List<PaperMarketRatesDto> getAll() {
        List<PaperMarketRates> paperMarketRatesList = paperMarketRatesRepository.findAll();
        List<PaperMarketRatesDto> paperMarketRatesDtoList = new ArrayList<>();

        for (PaperMarketRates paperMarketRates : paperMarketRatesList) {
            PaperMarketRatesDto paperMarketRatesDto = toDto(paperMarketRates);
            paperMarketRatesDtoList.add(paperMarketRatesDto);
        }
        return paperMarketRatesDtoList;
    }

    @Override
    public List<Integer> getDistinctGSMForPaperStock(String paperStock) {
        Optional<List<Integer>> optionalGsmList = Optional.ofNullable(paperMarketRatesRepository.findDistinctGSMByPaperStock(paperStock));
        if(optionalGsmList.isPresent()){
            return optionalGsmList.get();
        }
        else{
            throw new RecordNotFoundException("PaperStock not found at: " + paperStock);
        }
    }

    @Override
    public PaperMarketRatesDto findByPaperStock(String paperStock) {
        Optional<PaperMarketRates> paperMarketRates = Optional.ofNullable(paperMarketRatesRepository.findByPaperStock(paperStock));
        if(paperMarketRates.isPresent()){
            PaperMarketRates pmr = paperMarketRates.get();
            return toDto(pmr);
        }
        else {
            throw new RecordNotFoundException(String.format("Paper Market Rate not found at => %s", paperStock));
        }
    }

    @Override
    public List<PaperMarketRatesDto> searchByPaperStock(String paperStock) {
        List<PaperMarketRates> paperMarketRateList = paperMarketRatesRepository.findPaperMarketRatesByPaperStock(paperStock);
        List<PaperMarketRatesDto> paperMarketRatesDtoList = new ArrayList<>();

        for (PaperMarketRates paperMarketRates : paperMarketRateList) {
            PaperMarketRatesDto paperMarketRatesDto = toDto(paperMarketRates);
            paperMarketRatesDtoList.add(paperMarketRatesDto);
        }
        return paperMarketRatesDtoList;
    }


    @Override
    public PaperMarketRatesDto findById(Long id) {
        Optional<PaperMarketRates> optionalPaperMarketRates = paperMarketRatesRepository.findById(id);

        if(optionalPaperMarketRates.isPresent()) {
            PaperMarketRates paperMarketRates = optionalPaperMarketRates.get();
            return toDto(paperMarketRates);
        }
        else {
            throw new RecordNotFoundException(String.format("Paper Market Rate not found for id => %d", id));
        }
    }

    @Override
    public String deleteById(Long id) {
        Optional<PaperMarketRates> optionalPaperMarketRates = paperMarketRatesRepository.findById(id);

        if(optionalPaperMarketRates.isPresent()) {
            PaperMarketRates paperMarketRates = optionalPaperMarketRates.get();
            paperMarketRatesRepository.deleteById(id);
        }
        else{
            throw new RecordNotFoundException(String.format("Paper Market Rate not found for id => %d", id));
        }
        return null;
    }

    @Override
    public PaperMarketRatesDto updatePaperMarketRates(Long id, PaperMarketRates paperMarketRates) {
        Optional<PaperMarketRates> optionalPaperMarketRates = paperMarketRatesRepository.findById(id);
        if(optionalPaperMarketRates.isPresent()){
            PaperMarketRates existingPmr = optionalPaperMarketRates.get();

            // Round off both ratePkr values to 1 decimal place
            double existingRate = Math.round(existingPmr.getRatePkr() * 10.0) / 10.0;
            double newRate = Math.round(paperMarketRates.getRatePkr() * 10.0) / 10.0;

            // Check if rounded ratePkr values are different
            if (existingRate != newRate) {
                existingPmr.setTimeStamp(LocalDateTime.now());
            }

            existingPmr.setPaperStock(paperMarketRates.getPaperStock());
            existingPmr.setBrand(paperMarketRates.getBrand());
            existingPmr.setMadeIn(paperMarketRates.getMadeIn());
            existingPmr.setGSM(paperMarketRates.getGSM());
            existingPmr.setLength(paperMarketRates.getLength());
            existingPmr.setWidth(paperMarketRates.getWidth());
            existingPmr.setDimension(paperMarketRates.getDimension());
            existingPmr.setQty(paperMarketRates.getQty());
            existingPmr.setKg(paperMarketRates.getKg());
            existingPmr.setRatePkr(paperMarketRates.getRatePkr());
            existingPmr.setVerified(paperMarketRates.getVerified());
            existingPmr.setNotes(paperMarketRates.getNotes());
            existingPmr.setStatus(paperMarketRates.getStatus());
            existingPmr.setRecordType(paperMarketRates.getRecordType());

            existingPmr.setVendor(vendorRepository.findById(paperMarketRates.getVendor())
                    .orElseThrow(() -> new RecordNotFoundException("Vendor not found")).getId());

            if(paperMarketRates.getRecordType() == null){
                existingPmr.setRecordType("manual");
            }

            PaperMarketRates updatedPmr = paperMarketRatesRepository.save(existingPmr);
            return toDto(updatedPmr);
        }
        else {
            throw new RecordNotFoundException(String.format("Paper Market Rate not found for id => %d", id));
        }
    }

    public PaperMarketRatesDto toDto(PaperMarketRates paperMarketRates) {
        return PaperMarketRatesDto.builder()
                .id(paperMarketRates.getId())
                .timeStamp(paperMarketRates.getTimeStamp())
                .paperStock(paperMarketRates.getPaperStock())
                .brand(paperMarketRates.getBrand())
                .madeIn(paperMarketRates.getMadeIn())
                .GSM(paperMarketRates.getGSM())
                .length(paperMarketRates.getLength())
                .width(paperMarketRates.getWidth())
                .dimension(paperMarketRates.getDimension())
                .qty(paperMarketRates.getQty())
                .kg(paperMarketRates.getKg())
                .recordType(paperMarketRates.getRecordType())
                .ratePkr(paperMarketRates.getRatePkr())
                .verified(paperMarketRates.getVerified())
                .notes(paperMarketRates.getNotes())
                .status(paperMarketRates.getStatus())
                .vendor(vendorRepository.findById(paperMarketRates.getVendor())
                        .orElseThrow(() -> new RecordNotFoundException("Vendor not found")))
                .build();
    }

    public PaperMarketRates toEntity(PaperMarketRatesDto paperMarketRatesDto) {
        return PaperMarketRates.builder()
                .id(paperMarketRatesDto.getId())
                .timeStamp(paperMarketRatesDto.getTimeStamp())
                .paperStock(paperMarketRatesDto.getPaperStock())
                .brand(paperMarketRatesDto.getBrand())
                .madeIn(paperMarketRatesDto.getMadeIn())
                .GSM(paperMarketRatesDto.getGSM())
                .length(paperMarketRatesDto.getLength())
                .width(paperMarketRatesDto.getWidth())
                .dimension(paperMarketRatesDto.getDimension())
                .qty(paperMarketRatesDto.getQty())
                .kg(paperMarketRatesDto.getKg())
                .recordType(paperMarketRatesDto.getRecordType())
                .ratePkr(paperMarketRatesDto.getRatePkr())
                .verified(paperMarketRatesDto.getVerified())
                .notes(paperMarketRatesDto.getNotes())
                .status(paperMarketRatesDto.getStatus())
                .vendor(vendorRepository.findById(paperMarketRatesDto.getVendor().getId())
                        .orElseThrow(() -> new RecordNotFoundException("Vendor not found")).getId())
                .build();
    }

}
