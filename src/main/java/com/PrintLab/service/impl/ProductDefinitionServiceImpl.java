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

        // Ensure that the newProduct is properly associated with the productDefinition
        NewProduct newProduct = productDefinition.getNewProduct();
        if (newProduct != null) {
            newProduct.setProductDefinition(createdProductDefinition); // Set the relationship

            List<ProductGsm> productGsmList = new ArrayList<>();
            for (ProductGsm productGsm : newProduct.getProductGsm())
            {
                productGsm.setNewProduct(newProduct);
                productGsmList.add(productGsm);
            }
            newProduct.setProductGsm(productGsmList);

            // Ensure that the newProduct is set in the productDefinition
            createdProductDefinition.setNewProduct(newProduct); // Set the relationship
        }

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
        // Retrieve the existing ProductDefinition entity from the repository
        Optional<ProductDefinition> optionalProductDefinition = productDefinitionRepository.findById(id);

        if (optionalProductDefinition.isPresent()) {
            ProductDefinition existingProductDefinition = optionalProductDefinition.get();

            // Update the fields of the existing ProductDefinition entity with the new data
            existingProductDefinition.setTitle(productDefinitionDto.getTitle());
            existingProductDefinition.setStatus(productDefinitionDto.getStatus());

            // Update the association with PressMachine
            existingProductDefinition.setPressMachine(productDefinitionDto.getPressMachine());

            // Retrieve the existing NewProduct entity associated with the existing ProductDefinition
            NewProduct existingNewProduct = existingProductDefinition.getNewProduct();

            // Update the fields of the existing NewProduct entity with the new data
            NewProductDto updatedNewProductDto = productDefinitionDto.getNewProduct();
            existingNewProduct.setPaperStock(updatedNewProductDto.getPaperStock());
            existingNewProduct.setSize(updatedNewProductDto.getSize());
            existingNewProduct.setQuantity(updatedNewProductDto.getQuantity());
            existingNewProduct.setPrintSide(updatedNewProductDto.getPrintSide());
            existingNewProduct.setJobColorFront(updatedNewProductDto.getJobColorFront());
            existingNewProduct.setJobColorBack(updatedNewProductDto.getJobColorBack());
            existingNewProduct.setImposition(updatedNewProductDto.getImposition());
            existingNewProduct.setIsPaperStockPublic(updatedNewProductDto.getIsPaperStockPublic());
            existingNewProduct.setIsSizePublic(updatedNewProductDto.getIsSizePublic());
            existingNewProduct.setIsQuantityPublic(updatedNewProductDto.getIsQuantityPublic());
            existingNewProduct.setIsPrintSidePublic(updatedNewProductDto.getIsPrintSidePublic());
            existingNewProduct.setIsJobColorFrontPublic(updatedNewProductDto.getIsJobColorFrontPublic());
            existingNewProduct.setIsJobColorBackPublic(updatedNewProductDto.getIsJobColorBackPublic());

            // Update the ProductGsm entities associated with the existing NewProduct
            List<ProductGsmDto> updatedProductGsmListDto = updatedNewProductDto.getProductGsm();
            List<ProductGsm> updatedProductGsmList = new ArrayList<>();
            for (ProductGsmDto productGsmDto : updatedProductGsmListDto) {
                ProductGsm existingProductGsm = findOrCreateProductGsm(existingNewProduct, productGsmDto);
                existingProductGsm.setValue(productGsmDto.getValue());
                existingProductGsm.setName(productGsmDto.getName());
                existingProductGsm.setIsPublic(productGsmDto.getIsPublic());
                updatedProductGsmList.add(existingProductGsm);
            }
            existingNewProduct.setProductGsm(updatedProductGsmList);

            // Update the association between ProductDefinition and NewProduct
            existingProductDefinition.setNewProduct(existingNewProduct);

            // Save the updated ProductDefinition entity
            ProductDefinition updatedProductDefinition = productDefinitionRepository.save(existingProductDefinition);

            // You can return a DTO representation of the updated entity if needed
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

            NewProduct newProductToDelete = productDefinition.getNewProduct();

            if (newProductToDelete != null && newProductToDelete.getId().equals(newProductId)) {
                // Remove the association with the ProductDefinition
                productDefinition.setNewProduct(null);
                productDefinitionRepository.save(productDefinition);

                // Delete the NewProduct entity from the repository
                newProductRepository.delete(newProductToDelete);
            } else {
                throw new RecordNotFoundException("New Product not found");
            }
        } else {
            throw new RecordNotFoundException(String.format("Product Definition not found for id => %d", id));
        }
    }

    @Override
    public void deleteProductGsmById(Long productDefinitionId, Long newProductId, Long productGsmId) {
        Optional<ProductDefinition> optionalProductDefinition = productDefinitionRepository.findById(productDefinitionId);
        if (optionalProductDefinition.isPresent()) {
            ProductDefinition productDefinition = optionalProductDefinition.get();

            // Find the NewProduct by ID in the productDefinition
            NewProduct newProduct = productDefinition.getNewProduct();

            if (newProduct != null && newProduct.getId().equals(newProductId)) {
                // Find the ProductGsm by ID in the newProduct's associated ProductGsm list
                Optional<ProductGsm> optionalProductGsm = newProduct.getProductGsm()
                        .stream()
                        .filter(productGsm -> productGsm.getId().equals(productGsmId))
                        .findFirst();

                if (optionalProductGsm.isPresent()) {
                    ProductGsm productGsmToDelete = optionalProductGsm.get();

                    // Remove the ProductGsm from the list and save the NewProduct
                    newProduct.getProductGsm().remove(productGsmToDelete);
                    newProductRepository.save(newProduct);

                    // Delete the ProductGsm entity from the repository
                    productGsmRepository.delete(productGsmToDelete);
                } else {
                    throw new RecordNotFoundException("ProductGsm not found");
                }
            } else {
                throw new RecordNotFoundException("New Product not found");
            }
        } else {
            throw new RecordNotFoundException(String.format("Product Definition not found for id => %d", productDefinitionId));
        }
    }


    private ProductGsm findOrCreateProductGsm(NewProduct newProduct, ProductGsmDto productGsmDto) {
        // Find the existing ProductGsm entity by name, if it exists
        ProductGsm existingProductGsm = newProduct.getProductGsm().stream()
                .filter(gsm -> gsm.getName().equals(productGsmDto.getName()))
                .findFirst()
                .orElse(null);

        // If the existing ProductGsm entity doesn't exist, create a new one
        if (existingProductGsm == null) {
            existingProductGsm = new ProductGsm();
            existingProductGsm.setName(productGsmDto.getName());
            existingProductGsm.setNewProduct(newProduct);
            newProduct.getProductGsm().add(existingProductGsm);
        }

        return existingProductGsm;
    }

    public ProductDefinitionDto toDto(ProductDefinition productDefinition) {
        NewProduct newProduct = productDefinition.getNewProduct();
        List<ProductGsmDto> productGsmDtoList = new ArrayList<>();

        if (newProduct != null) {
            for (ProductGsm productGsm : newProduct.getProductGsm()) {
                ProductGsmDto productGsmDto = ProductGsmDto.builder()
                        .id(productGsm.getId())
                        .value(productGsm.getValue())
                        .name(productGsm.getName())
                        .isPublic(productGsm.getIsPublic())
                        .build();
                productGsmDtoList.add(productGsmDto);
            }
        }

        assert newProduct != null;
        return ProductDefinitionDto.builder()
                .id(productDefinition.getId())
                .title(productDefinition.getTitle())
                .status(productDefinition.getStatus())
                .pressMachine(productDefinition.getPressMachine())
                .newProduct(NewProductDto.builder()
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
                        .build())
                .build();
    }



    public ProductDefinition toEntity(ProductDefinitionDto productDefinitionDto) {
        PressMachine pressMachine = pressMachineRepository.findById(productDefinitionDto.getPressMachine().getId())
                .orElseThrow(() -> new RecordNotFoundException("PressMachine not found"));

        NewProductDto newProductDto = productDefinitionDto.getNewProduct();
        List<ProductGsm> productGsmList = new ArrayList<>();

        if (newProductDto != null) {
            for (ProductGsmDto productGsmDto : newProductDto.getProductGsm()) {
                ProductGsm newProductGsm = ProductGsm.builder()
                        .id(productGsmDto.getId())
                        .value(productGsmDto.getValue())
                        .isPublic(productGsmDto.getIsPublic())
                        .name(productGsmDto.getName())
                        .build();
                productGsmList.add(newProductGsm);
            }
        }

        assert newProductDto != null;
        NewProduct newProduct = NewProduct.builder()
                .id(newProductDto.getId())
                .paperStock(newProductDto.getPaperStock())
                .size(newProductDto.getSize())
                .quantity(newProductDto.getQuantity())
                .printSide(newProductDto.getPrintSide())
                .jobColorFront(newProductDto.getJobColorFront())
                .jobColorBack(newProductDto.getJobColorBack())
                .imposition(newProductDto.getImposition())
                .isPaperStockPublic(newProductDto.getIsPaperStockPublic())
                .isSizePublic(newProductDto.getIsSizePublic())
                .isQuantityPublic(newProductDto.getIsQuantityPublic())
                .isPrintSidePublic(newProductDto.getIsPrintSidePublic())
                .isJobColorFrontPublic(newProductDto.getIsJobColorFrontPublic())
                .isJobColorBackPublic(newProductDto.getIsJobColorBackPublic())
                .productGsm(productGsmList)
                .build();

        return ProductDefinition.builder()
                .id(productDefinitionDto.getId())
                .title(productDefinitionDto.getTitle())
                .status(productDefinitionDto.getStatus())
                .pressMachine(pressMachine)
                .newProduct(newProduct)
                .build();
    }
}
