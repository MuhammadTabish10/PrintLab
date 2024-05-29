package com.PrintLab.service.impl;

import com.PrintLab.Mapper.MasterCustomerStatementMapper;
import com.PrintLab.dto.MasterCustomerStatementDto;
import com.PrintLab.model.MasterCustomerStatement;
import com.PrintLab.repository.MasterCustomerStatementRepository;
import com.PrintLab.service.MasterCustomerStatementService;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MasterCustomerStatementServiceImpl implements MasterCustomerStatementService {

    private final MasterCustomerStatementRepository masterCustomerStatementRepository;
    private final MasterCustomerStatementMapper masterCustomerStatementMapper;

    public MasterCustomerStatementServiceImpl(MasterCustomerStatementRepository masterCustomerStatementRepository, MasterCustomerStatementMapper masterCustomerStatementMapper) {
        this.masterCustomerStatementRepository = masterCustomerStatementRepository;
        this.masterCustomerStatementMapper = masterCustomerStatementMapper;
    }

    @Override
    public MasterCustomerStatementDto findById(Long id) {
        Optional<MasterCustomerStatement> paymentHistoryOptional = masterCustomerStatementRepository.findById(id);
        return paymentHistoryOptional.map(masterCustomerStatementMapper::toDto).orElse(null);
    }

    @Override
    public List<MasterCustomerStatementDto> getAll() {
        List<MasterCustomerStatement> paymentHistories = masterCustomerStatementRepository.findAll();
        Set<Long> seenId = new LinkedHashSet<>();
        return paymentHistories.stream()
                .filter(masterCustomerStatement -> seenId.add(masterCustomerStatement.getId()))
                .map(masterCustomerStatementMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public MasterCustomerStatementDto save(MasterCustomerStatementDto masterCustomerStatementDto) {
        MasterCustomerStatement customerStatement = masterCustomerStatementMapper.toEntity(masterCustomerStatementDto);
        MasterCustomerStatement saved = masterCustomerStatementRepository.save(customerStatement);
        return masterCustomerStatementMapper.toDto(saved);
    }

    @Override
    public void deleteById(Long id) {
        masterCustomerStatementRepository.deleteById(id);
    }

    @Override
    public MasterCustomerStatementDto updateById(Long id, MasterCustomerStatementDto customerStatementDto) {
        Optional<MasterCustomerStatement> customerStatement = masterCustomerStatementRepository.findById(id);
        if (customerStatement.isPresent()) {
            MasterCustomerStatement masterCustomerStatement = customerStatement.get();
            masterCustomerStatement.setDebit(customerStatementDto.getDebit());
            masterCustomerStatement.setCredit(customerStatementDto.getCredit());
            masterCustomerStatement.setDescription(customerStatementDto.getDescription());
            masterCustomerStatement.setAmount(customerStatementDto.getAmount());

            MasterCustomerStatement updatedCustomerStatement = masterCustomerStatementRepository.save(masterCustomerStatement);
            return masterCustomerStatementMapper.toDto(updatedCustomerStatement);
        }
        return null;
    }
}
