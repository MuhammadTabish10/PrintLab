package com.PrintLab.service.impl;

import com.PrintLab.dto.*;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.*;
import com.PrintLab.repository.*;
import com.PrintLab.service.ProductDefinitionService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductDefinitionServiceImpl implements ProductDefinitionService {
    private final ProductDefinitionRepository productDefinitionRepository;
    private final PressMachineRepository pressMachineRepository;
    private final ProductGsmRepository productGsmRepository;
    private final NewProductRepository newProductRepository;

    public ProductDefinitionServiceImpl(ProductDefinitionRepository productDefinitionRepository, PressMachineRepository pressMachineRepository, ProductGsmRepository productGsmRepository, NewProductRepository newProductRepository) {
        this.productDefinitionRepository = productDefinitionRepository;
        this.pressMachineRepository = pressMachineRepository;
        this.productGsmRepository = productGsmRepository;
        this.newProductRepository = newProductRepository;
    }


    @Transactional
    @Override
    public ProductDefinitionDto save(ProductDefinitionDto productDefinitionDto) {
        ProductDefinition productDefinition = toEntity(productDefinitionDto);
        ProductDefinition createdProductDefinition = productDefinitionRepository.save(productDefinition);

        List<NewProduct> newProductList = createdProductDefinition.getNewProductList();
        for (NewProduct newProduct : createdProductDefinition.getNewProductList()) {
            newProduct.setProductDefinition(createdProductDefinition);

            for(ProductGsm productGsm : newProduct.getProductGsm()){
                productGsm.setNewProduct(newProduct);
            }

        }

        createdProductDefinition.setNewProductList(newProductList);
        ProductDefinition newProductDefinition = productDefinitionRepository.save(createdProductDefinition);

        return toDto(newProductDefinition);
    }

    @Override
    public List<ProductDefinitionDto> getAll() {
        List<ProductDefinition> productDefinitionList = productDefinitionRepository.findByStatus(true);
        List<ProductDefinitionDto> productDefinitionDtoList = new ArrayList<>();

        for (ProductDefinition productDefinition : productDefinitionList) {
            ProductDefinitionDto productDefinitionDto = toDto(productDefinition);
            productDefinitionDtoList.add(productDefinitionDto);
        }
        return productDefinitionDtoList;
    }

    @Override
    public ProductDefinitionDto findById(Long id) {
        Optional<ProductDefinition> optionalProductDefinition = productDefinitionRepository.findById(id);
        if (optionalProductDefinition.isPresent()) {
            ProductDefinition productDefinition = optionalProductDefinition.get();
            return toDto(productDefinition);
        }
        throw new RecordNotFoundException(String.format("Product Definition not found for id => %d", id));
    }

    @Override
    public ProductDefinitionDto findByTitle(String title) {
        Optional<ProductDefinition> productDefinitionOptional = Optional.ofNullable(productDefinitionRepository.findByTitle(title));

        if (productDefinitionOptional.isPresent()) {
            ProductDefinition productDefinition = productDefinitionOptional.get();
            return toDto(productDefinition);
        } else {
            throw new RecordNotFoundException(String.format("ProductDefinition not found at => %s", title));
        }
    }

    @Override
    public List<ProductDefinitionDto> searchByTitle(String title) {
        List<ProductDefinition> productDefinitionList = productDefinitionRepository.findProductDefinitionsByName(title);
        List<ProductDefinitionDto> productDefinitionDtoList = new ArrayList<>();

        for (ProductDefinition productDefinition : productDefinitionList) {
            ProductDefinitionDto productDefinitionDto = toDto(productDefinition);
            productDefinitionDtoList.add(productDefinitionDto);
        }
        return productDefinitionDtoList;
    }

    @Transactional
    @Override
    public ProductDefinitionDto updateProductDefinition(Long id, ProductDefinitionDto productDefinitionDto) {
        ProductDefinition productDefinition = toEntity(productDefinitionDto);
        Optional<ProductDefinition> optionalProductDefinition = productDefinitionRepository.findById(id);
        int countNp = 0;

        if (optionalProductDefinition.isPresent()) {
            ProductDefinition existingProductDefinition = optionalProductDefinition.get();
            existingProductDefinition.setTitle(productDefinition.getTitle());
            existingProductDefinition.setStatus(productDefinition.getStatus());
            existingProductDefinition.setPressMachine(productDefinition.getPressMachine());

            List<NewProduct> existingNpValues = existingProductDefinition.getNewProductList();
            List<NewProduct> newNpValues = productDefinition.getNewProductList();
            List<NewProduct> newValuesOfNpToAdd = new ArrayList<>();

            for (NewProduct newValue : newNpValues) {
                Optional<NewProduct> existingValue = existingNpValues.stream()
                        .filter(value -> value.getId().equals(newValue.getId())).findFirst();
                if (existingValue.isPresent()) {
                    NewProduct existingNpValue = existingValue.get();
                    existingNpValue.setImposition(newValue.getImposition());
                    existingNpValue.setSize(newValue.getSize());
                    existingNpValue.setPaperStock(newValue.getPaperStock());
                    existingNpValue.setQuantity(newValue.getQuantity());
                    existingNpValue.setPrintSide(newValue.getPrintSide());
                    existingNpValue.setJobColorFront(newValue.getJobColorFront());
                    existingNpValue.setJobColorBack(newValue.getJobColorBack());
                    existingNpValue.setIsJobColorBackPublic(newValue.getIsJobColorBackPublic());
                    existingNpValue.setIsJobColorFrontPublic(newValue.getIsJobColorFrontPublic());
                    existingNpValue.setIsPrintSidePublic(newValue.getIsPrintSidePublic());
                    existingNpValue.setIsSizePublic(newValue.getIsSizePublic());
                    existingNpValue.setIsQuantityPublic(newValue.getIsQuantityPublic());
                    existingNpValue.setIsPaperStockPublic(newValue.getIsPaperStockPublic());

                    List<ProductGsm> productGsmList = newValue.getProductGsm();
                    if (productGsmList != null && !productGsmList.isEmpty()) {
                        List<ProductGsm> gsmToAdd = new ArrayList<>();

                        for (ProductGsm productGsm : productGsmList) {
                            Optional<ProductGsm> existingProductGsmOptional = Optional.empty();
                            if (!(productGsm.getId() == null)) {
                                existingProductGsmOptional = productGsmRepository.findById(productGsm.getId());
                            }

                            if (existingProductGsmOptional.isPresent()) {
                                ProductGsm existingProductGsm = existingProductGsmOptional.get();
                                existingProductGsm.setValue(productGsm.getValue());
                                existingProductGsm.setName(productGsm.getName());
                                existingProductGsm.setNewProduct(existingNpValue);
                                gsmToAdd.add(existingProductGsm);
                                productGsmRepository.save(existingProductGsm);
                            } else {
                                ProductGsm newGsmValue = ProductGsm.builder()
                                        .value(productGsm.getValue())
                                        .newProduct(existingNpValue)
                                        .isPublic(productGsm.getIsPublic())
                                        .build();
                                gsmToAdd.add(newGsmValue);
                                productGsmRepository.save(newGsmValue);
                            }
                        }
                        newValue.setProductGsm(gsmToAdd);
                        newProductRepository.save(newValue);
                    }

                } else {
                    newValue.setProductDefinition(existingProductDefinition);
                    newValuesOfNpToAdd.add(newValue);
                    countNp++;
                }
            }

            if (countNp > 0) {
                existingNpValues.addAll(newValuesOfNpToAdd);
            }

            ProductDefinition updatedProductDefinition = productDefinitionRepository.save(existingProductDefinition);
            return toDto(updatedProductDefinition);

        } else {
            throw new RecordNotFoundException(String.format("Product Definition not found for id => %d", id));
        }
    }

    @Transactional
    @Override
    public void deleteProductDefinition(Long id) {
        Optional<ProductDefinition> optionalProductDefinition = productDefinitionRepository.findById(id);
        if (optionalProductDefinition.isPresent()) {
            ProductDefinition productDefinition = optionalProductDefinition.get();
            productDefinitionRepository.setStatusInactive(id);
        } else {
            throw new RecordNotFoundException(String.format("Product Definition not found for id => %d", id));
        }
    }

    @Override
    public void deleteNewProductById(Long id, Long newProductId) {
        Optional<ProductDefinition> optionalProductDefinition = productDefinitionRepository.findById(id);
        if (optionalProductDefinition.isPresent()) {
            ProductDefinition productDefinition = optionalProductDefinition.get();

            Optional<NewProduct> optionalNewProduct = productDefinition.getNewProductList()
                    .stream()
                    .filter(np -> np.getId().equals(newProductId))
                    .findFirst();

            if (optionalNewProduct.isPresent()) {
                NewProduct newProductToDelete = optionalNewProduct.get();
                productDefinition.getNewProductList().remove(newProductToDelete);
                newProductRepository.delete(newProductToDelete);
                productDefinitionRepository.save(productDefinition);
            } else {
                throw new RecordNotFoundException("New Product not found");
            }
        } else {
            throw new RecordNotFoundException(String.format("Product Definition not found for id => %d", id));
        }
    }

    public ProductDefinitionDto toDto(ProductDefinition productDefinition) {
        List<NewProductDto> newProductDtoList = new ArrayList<>();
        for (NewProduct newProduct : productDefinition.getNewProductList()) {

            List<ProductGsmDto> productGsmDtoList = new ArrayList<>();
            for (ProductGsm productGsm : newProduct.getProductGsm()) {
                ProductGsmDto productGsmDto = ProductGsmDto.builder()
                        .id(productGsm.getId())
                        .value(productGsm.getValue())
                        .name(productGsm.getName())
                        .isPublic(productGsm.getIsPublic())
                        .build();

                productGsmDtoList.add(productGsmDto);
            }

            NewProductDto dto = NewProductDto.builder()
                    .id(newProduct.getId())
                    .paperStock(newProduct.getPaperStock())
                    .size(newProduct.getSize())
                    .quantity(newProduct.getQuantity())
                    .printSide(newProduct.getPrintSide())
                    .jobColorFront(newProduct.getJobColorFront())
                    .jobColorBack(newProduct.getJobColorBack())
                    .imposition(newProduct.getImposition())
                    .isPaperStockPublic(newProduct.getIsPaperStockPublic())
                    .isSizePublic(newProduct.getIsSizePublic())
                    .isQuantityPublic(newProduct.getIsQuantityPublic())
                    .isPrintSidePublic(newProduct.getIsPrintSidePublic())
                    .isJobColorFrontPublic(newProduct.getIsJobColorFrontPublic())
                    .isJobColorBackPublic(newProduct.getIsJobColorBackPublic())
                    .productGsm(productGsmDtoList)
                    .build();
            newProductDtoList.add(dto);
        }

        return ProductDefinitionDto.builder()
                .id(productDefinition.getId())
                .title(productDefinition.getTitle())
                .status(productDefinition.getStatus())
                .pressMachine(productDefinition.getPressMachine())
                .newProductList(newProductDtoList)
                .build();
    }


    public ProductDefinition toEntity(ProductDefinitionDto productDefinitionDto) {
        PressMachine pressMachine = pressMachineRepository.findById(productDefinitionDto.getPressMachine().getId())
                .orElseThrow(() -> new RecordNotFoundException("PressMachine not found"));

        ProductDefinition productDefinition = ProductDefinition.builder()
                .id(productDefinitionDto.getId())
                .title(productDefinitionDto.getTitle())
                .status(productDefinitionDto.getStatus())
                .pressMachine(pressMachine)
                .build();

        List<NewProduct> newProductList = new ArrayList<>();
        for (NewProductDto dto : productDefinitionDto.getNewProductList()) {

            List<ProductGsm> productGsmList = new ArrayList<>();
            for (ProductGsmDto productGsmDto : dto.getProductGsm()) {
                ProductGsm newProductGsm = ProductGsm.builder()
                        .id(productGsmDto.getId())
                        .value(productGsmDto.getValue())
                        .isPublic(productGsmDto.getIsPublic())
                        .name(productGsmDto.getName())
                        .build();
                productGsmList.add(newProductGsm);
            }

            NewProduct newProduct = NewProduct.builder()
                    .id(dto.getId())
                    .paperStock(dto.getPaperStock())
                    .size(dto.getSize())
                    .quantity(dto.getQuantity())
                    .printSide(dto.getPrintSide())
                    .jobColorFront(dto.getJobColorFront())
                    .jobColorBack(dto.getJobColorBack())
                    .imposition(dto.getImposition())
                    .isPaperStockPublic(dto.getIsPaperStockPublic())
                    .isSizePublic(dto.getIsSizePublic())
                    .isQuantityPublic(dto.getIsQuantityPublic())
                    .isPrintSidePublic(dto.getIsPrintSidePublic())
                    .isJobColorFrontPublic(dto.getIsJobColorFrontPublic())
                    .isJobColorBackPublic(dto.getIsJobColorBackPublic())
                    .productGsm(productGsmList)
                    .build();
            newProductList.add(newProduct);
        }
        productDefinition.setNewProductList(newProductList);
        return productDefinition;
    }


}
