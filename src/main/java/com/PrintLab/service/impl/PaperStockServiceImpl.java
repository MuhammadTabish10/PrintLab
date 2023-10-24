package com.PrintLab.service.impl;

import com.PrintLab.dto.PaperStockDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.Brand;
import com.PrintLab.model.PaperStock;
import com.PrintLab.repository.BrandRepository;
import com.PrintLab.repository.PaperStockRepository;
import com.PrintLab.service.PaperStockService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@Service
public class PaperStockServiceImpl implements PaperStockService {

    private final PaperStockRepository paperStockRepository;
    private final BrandRepository brandRepository;

    public PaperStockServiceImpl(PaperStockRepository paperStockRepository, BrandRepository brandRepository) {
        this.paperStockRepository = paperStockRepository;
        this.brandRepository = brandRepository;
    }

    @Transactional
    @Override
    public PaperStockDto save(PaperStockDto paperStockDto) {
        PaperStock paperStock = toEntity(paperStockDto);
        paperStock.setStatus(true);
        PaperStock createdPaperStock = paperStockRepository.save(paperStock);

        List<Brand> brandList = paperStock.getBrands();
        if(brandList != null && !brandList.isEmpty()){
            for (Brand brand : brandList) {
                brand.setPaperStock(createdPaperStock);
                brand.setStatus(true);
                brandRepository.save(brand);
            }
            createdPaperStock.setBrands(brandList);
            paperStockRepository.save(createdPaperStock);
        }
        return toDto(createdPaperStock);
    }

    @Override
    public List<PaperStockDto> getAll() {
        List<PaperStock> paperStockList = paperStockRepository.findAllByStatusIsTrue();
        List<PaperStockDto> paperStockDtoList = new ArrayList<>();

        for (PaperStock paperStock : paperStockList) {
            PaperStockDto paperStockDto = toDto(paperStock);
            paperStockDtoList.add(paperStockDto);
        }
        return paperStockDtoList;
    }

    @Override
    public PaperStockDto findById(Long id) {
        Optional<PaperStock> optionalPaperStock = paperStockRepository.findById(id);

        if (optionalPaperStock.isPresent()) {
            PaperStock paperStock = optionalPaperStock.get();
            return toDto(paperStock);
        } else {
            throw new RecordNotFoundException(String.format("Paper Stock not found for id => %d", id));
        }
    }

    @Override
    public List<PaperStockDto> searchByName(String name) {
        List<PaperStock> paperStockList = paperStockRepository.findPaperStockByName(name);
        List<PaperStockDto> paperStockDtoList = new ArrayList<>();

        for (PaperStock paperStock : paperStockList) {
            PaperStockDto paperStockDto = toDto(paperStock);
            paperStockDtoList.add(paperStockDto);
        }
        return paperStockDtoList;
    }

    @Transactional
    @Override
    public String deleteById(Long id) {
        Optional<PaperStock> optionalPaperStock = paperStockRepository.findById(id);

        if (optionalPaperStock.isPresent()) {
            PaperStock paperStock = optionalPaperStock.get();
            paperStockRepository.setStatusInactive(id);
        } else {
            throw new RecordNotFoundException(String.format("Paper Stock not found for id => %d", id));
        }
        return null;
    }

    @Transactional
    @Override
    public PaperStockDto updatedPaperStock(Long id, PaperStockDto paperStockDto) {
        int count = 0;
        PaperStock paperStock = toEntity(paperStockDto);
        Optional<PaperStock> optionalPaperStock = paperStockRepository.findById(id);
        if (optionalPaperStock.isPresent()) {
            PaperStock existingPaperStock = optionalPaperStock.get();
            existingPaperStock.setName(paperStockDto.getName());
            existingPaperStock.setStatus(paperStockDto.getStatus());

            List<Brand> existingBrandValues = existingPaperStock.getBrands();
            List<Brand> newBrandValues = paperStock.getBrands();
            List<Brand> newValuesToAdd = new ArrayList<>();

            // Delete brands not present in the new PaperStock
            Iterator<Brand> iterator = existingBrandValues.iterator();
            while (iterator.hasNext()) {
                Brand existingBrand = iterator.next();
                if (newBrandValues.stream().noneMatch(newBrand -> newBrand.getId().equals(existingBrand.getId()))) {
                    // Delete the brand from the database
                    iterator.remove();
                    brandRepository.delete(existingBrand);
                }
            }

            // Update existing brands and add new brands
            for (Brand newValue : newBrandValues) {
                Optional<Brand> existingValue = existingBrandValues.stream()
                        .filter(psValue -> psValue.getId().equals(newValue.getId())).findFirst();
                if (existingValue.isPresent()) {
                    Brand existingBrandValue = existingValue.get();
                    existingBrandValue.setName(newValue.getName());
                    existingBrandValue.setStatus(newValue.getStatus());
                } else {
                    newValue.setPaperStock(existingPaperStock);
                    newValuesToAdd.add(newValue);
                    count++;
                }
            }
            if (count > 0) {
                existingBrandValues.addAll(newValuesToAdd);
            }

            PaperStock updatedPs = paperStockRepository.save(existingPaperStock);
            return toDto(updatedPs);
        } else {
            throw new RecordNotFoundException(String.format("PaperStock not found for id => %d", id));
        }
    }



    @Override
    public void deleteBrandById(Long id, Long psId) {
        Optional<PaperStock> optionalPaperStock = paperStockRepository.findById(id);
        if (optionalPaperStock.isPresent()) {
            PaperStock paperStock = optionalPaperStock.get();

            Optional<Brand> optionalBrand = paperStock.getBrands()
                    .stream()
                    .filter(b -> b.getId().equals(psId))
                    .findFirst();

            if (optionalBrand.isPresent()) {
                Brand BrandToDelete = optionalBrand.get();
                paperStock.getBrands().remove(BrandToDelete);
                brandRepository.delete(BrandToDelete);
                paperStockRepository.save(paperStock);
            } else{
                throw new RecordNotFoundException("Brand not found");
            }
        } else {
            throw new RecordNotFoundException(String.format("Paper Stock not found for id => %d", id));
        }
    }

    public PaperStockDto toDto(PaperStock paperStock) {
        return PaperStockDto.builder()
                .id(paperStock.getId())
                .name(paperStock.getName())
                .status(paperStock.getStatus())
                .brands(paperStock.getBrands())
                .build();
    }

    public PaperStock toEntity(PaperStockDto paperStockDto) {
        return PaperStock.builder()
                .id(paperStockDto.getId())
                .name(paperStockDto.getName())
                .status(paperStockDto.getStatus())
                .brands(paperStockDto.getBrands())
                .build();
    }
}
