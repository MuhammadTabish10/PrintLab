package com.PrintLab.service.impl;

import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.modal.PaperMarketRates;

import com.PrintLab.repository.PaperMarketRatesRepository;
import com.PrintLab.service.PaperMarketRatesService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PaperMarketRatesServiceImpI implements PaperMarketRatesService
{
    private final PaperMarketRatesRepository paperMarketRatesRepository;

    public PaperMarketRatesServiceImpI(PaperMarketRatesRepository paperMarketRatesRepository) {
        this.paperMarketRatesRepository = paperMarketRatesRepository;
    }

    @Override
    public PaperMarketRatesDto save(PaperMarketRatesDto paperMarketRatesDto) {
        PaperMarketRates paperMarketRates = paperMarketRatesRepository.save(toEntity(paperMarketRatesDto));
        return toDto(paperMarketRates);
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
            existingPmr.setDate(paperMarketRates.getDate());
            existingPmr.setPaperStock(paperMarketRates.getPaperStock());
            existingPmr.setGSM(paperMarketRates.getGSM());
            existingPmr.setLength(paperMarketRates.getLength());
            existingPmr.setWidth(paperMarketRates.getWidth());
            existingPmr.setDimension(paperMarketRates.getDimension());
            existingPmr.setQty(paperMarketRates.getQty());
            existingPmr.setRatePkr(paperMarketRates.getRatePkr());
            existingPmr.setVerified(paperMarketRates.getVerified());
            existingPmr.setNotes(paperMarketRates.getNotes());

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
                .date(paperMarketRates.getDate())
                .paperStock(paperMarketRates.getPaperStock())
                .GSM(paperMarketRates.getGSM())
                .length(paperMarketRates.getLength())
                .width(paperMarketRates.getWidth())
                .dimension(paperMarketRates.getDimension())
                .qty(paperMarketRates.getQty())
                .ratePkr(paperMarketRates.getRatePkr())
                .verified(paperMarketRates.getVerified())
                .notes(paperMarketRates.getNotes())
                .build();
    }

    public PaperMarketRates toEntity(PaperMarketRatesDto paperMarketRatesDto) {
        return PaperMarketRates.builder()
                .id(paperMarketRatesDto.getId())
                .date(paperMarketRatesDto.getDate())
                .paperStock(paperMarketRatesDto.getPaperStock())
                .GSM(paperMarketRatesDto.getGSM())
                .length(paperMarketRatesDto.getLength())
                .width(paperMarketRatesDto.getWidth())
                .dimension(paperMarketRatesDto.getDimension())
                .qty(paperMarketRatesDto.getQty())
                .ratePkr(paperMarketRatesDto.getRatePkr())
                .verified(paperMarketRatesDto.getVerified())
                .notes(paperMarketRatesDto.getNotes())
                .build();
    }

}
