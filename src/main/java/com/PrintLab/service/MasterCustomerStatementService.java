package com.PrintLab.service;

import com.PrintLab.dto.MasterCustomerStatementDto;
import com.PrintLab.dto.PaginationResponse;

import java.util.List;

public interface MasterCustomerStatementService {
    MasterCustomerStatementDto findById(Long id);

    List<MasterCustomerStatementDto> getAll();

    MasterCustomerStatementDto save(MasterCustomerStatementDto masterCustomerStatementDto);

    void deleteById(Long id);

    MasterCustomerStatementDto updateById(Long id, MasterCustomerStatementDto customerStatementDto);

    PaginationResponse getAllPaginatedStatements(Integer pageNumber, Integer pageSize, MasterCustomerStatementDto masterCustomerStatementDto);
}
