package com.PrintLab.service.impl;

import com.PrintLab.dto.*;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.*;
import com.PrintLab.repository.LeadsAddressRepository;
import com.PrintLab.repository.LeadsContactRepository;
import com.PrintLab.repository.LeadsRepository;
import com.PrintLab.service.LeadService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeadServiceImpl implements LeadService {

    private final LeadsRepository leadsRepository;
    private final LeadsAddressRepository leadsAddressRepository;
    private final LeadsContactRepository leadsContactRepository;
    private final EntityManager entityManager;

    public LeadServiceImpl(
            LeadsRepository leadsRepository,
            LeadsAddressRepository leadsAddressRepository,
            LeadsContactRepository leadsContactRepository,
            EntityManager entityManager) {
        this.leadsRepository = leadsRepository;
        this.leadsAddressRepository = leadsAddressRepository;
        this.leadsContactRepository = leadsContactRepository;
        this.entityManager = entityManager;
    }

    @Override
    public LeadDto save(LeadDto leadDto) {
        Leads leads = toEntity(leadDto);
        leads.setStatus(true);
        leads.setLeadStatusType("NEW_LEAD");
        ZonedDateTime zonedDateTime = ZonedDateTime.of(LocalDateTime.now(), ZoneOffset.UTC);
        LocalDateTime timeStampUtc = zonedDateTime.toLocalDateTime();
        leads.setCreatedAt(timeStampUtc);
        Leads savedLead = saveLeads(leads);
        saveLeadAddress(savedLead);
        saveLeadsContact(savedLead);
        return toDto(savedLead);
    }

    private Leads saveLeads(Leads leads) {
        return leadsRepository.save(leads);
    }

    private void saveLeadAddress(Leads savedLead) {
        List<LeadsAddress> leadsAddressList = savedLead.getLeadAddress();
        if (leadsAddressList != null) {
            leadsAddressList.forEach(address -> {
                address.setLeads(savedLead);
                leadsAddressRepository.save(address);
            });
        }
    }

    private void saveLeadsContact(Leads savedLead) {
        List<LeadsContact> leadContactList = savedLead.getContact();
        if (leadContactList != null) {
            leadContactList.forEach(leadsContact -> {
                leadsContact.setLeads(savedLead);
                leadsContactRepository.save(leadsContact);
            });
        }
    }


//    @Override
//    public List<LeadDto> findAll() {
//        List<Leads> leadsList = leadsRepository.findAllByStatusIsTrue();
//
//        return leadsList.stream()
//                .map(this::toDto)
//                .sorted(Comparator.comparing(LeadDto::getCreatedAt).reversed())
//                .collect(Collectors.toList());
//    }

    @Override
    public LeadDto findById(Long id) {
        return leadsRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RecordNotFoundException(String.format("Lead not found for id => %d", id)));
    }

    @Transactional
    @Override
    public void deleteById(Long id) {
        if (!leadsRepository.existsById(id)) {
            throw new RecordNotFoundException(String.format("Leads not found for id => %d", id));
        }
        leadsRepository.setStatusFalse(id);
    }

    @Transactional
    @Override
    public LeadDto updateLead(Long id, LeadDto leadDto) {
        Leads leads = toEntity(leadDto);
        Optional<Leads> optionalLeads = leadsRepository.findById(id);

        if (optionalLeads.isPresent()) {
            Leads existingLeads = optionalLeads.get();

            existingLeads.setCompanyName(leads.getCompanyName());
            existingLeads.setContactName(leads.getContactName());
            existingLeads.setLeadStatusType(leads.getLeadStatusType());
            existingLeads.setAbout(leads.getAbout());

            List<LeadsAddress> existingAddressValues = existingLeads.getLeadAddress();
            List<LeadsAddress> newAddressValues = leads.getLeadAddress();
            List<LeadsAddress> newValuesToAdd = new ArrayList<>();
            List<LeadsAddress> valuesToRemove = new ArrayList<>();

            List<LeadsContact> existingContactValues = existingLeads.getContact();
            List<LeadsContact> newContactValues = leads.getContact();
            List<LeadsContact> newContactValuesToAdd = new ArrayList<>();
            List<LeadsContact> contactValuesToRemove = new ArrayList<>();


            for (LeadsAddress existingAddValue : existingAddressValues) {
                if (!newAddressValues.contains(existingAddValue)) {
                    valuesToRemove.add(existingAddValue);
                }
            }

            for (LeadsContact existingContactValue : existingContactValues) {
                if (!newContactValues.contains(existingContactValue)) {
                    contactValuesToRemove.add(existingContactValue);
                }
            }


            for (LeadsAddress valueToRemove : valuesToRemove) {
                leadsAddressRepository.delete(valueToRemove);
            }


            existingAddressValues.removeAll(valuesToRemove);


            for (LeadsContact contactToRemove : contactValuesToRemove) {
                leadsContactRepository.delete(contactToRemove);
            }

            existingContactValues.removeAll(contactValuesToRemove);

            for (LeadsAddress newValue : newAddressValues) {
                Optional<LeadsAddress> existingValue = existingAddressValues.stream()
                        .filter(prValue -> prValue.getId().equals(newValue.getId())).findFirst();
                if (existingValue.isPresent()) {
                    LeadsAddress existingAdrValue = existingValue.get();
                    existingAdrValue.setAddress(newValue.getAddress());
                    existingAdrValue.setType(newValue.getType());
                    existingAdrValue.setCity(newValue.getCity());
                    existingAdrValue.setCountry(newValue.getCountry());
                    existingAdrValue.setPostalCode(newValue.getPostalCode());
                    existingAdrValue.setState(newValue.getState());
                } else {
                    newValue.setLeads(existingLeads);
                    newValuesToAdd.add(newValue);
                }
            }

            for (LeadsContact newContactValue : newContactValues) {
                Optional<LeadsContact> existingValue = existingContactValues.stream()
                        .filter(prValue -> prValue.getId().equals(newContactValue.getId())).findFirst();
                if (existingValue.isPresent()) {
                    LeadsContact existingCoValue = existingValue.get();
                    existingCoValue.setName(newContactValue.getName());
                    existingCoValue.setJobTitle(newContactValue.getJobTitle());
                    existingCoValue.setLandLine(newContactValue.getLandLine());
                    existingCoValue.setMobile(newContactValue.getMobile());
                    existingCoValue.setWebsite(newContactValue.getWebsite());
                    existingCoValue.setEmail(newContactValue.getEmail());
                    existingCoValue.setRole(newContactValue.getRole());
                } else {
                    newContactValue.setLeads(existingLeads);
                    newContactValuesToAdd.add(newContactValue);
                }
            }

            existingAddressValues.addAll(newValuesToAdd);
            existingContactValues.addAll(newContactValues);

            Leads updatedLeads = leadsRepository.save(existingLeads);

            return toDto(updatedLeads);
        } else {
            throw new RecordNotFoundException(String.format("Leads not found for id => %d", id));
        }
    }

    @Override
    public Map<String, String> findAllDistinctValues() {
        return leadsRepository.findAllDistinctValues();
    }


    @Override
    public List<LeadDto> searchByContactNameAndCompanyName(String contactName, String companyName) {
        List<Leads> leadsList = leadsRepository.
                findLeadsByContactNameContainingAndCompanyNameContainingAndStatusIsTrue(
                        contactName,
                        companyName
                );

        return leadsList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PaginationResponse getAllPaginatedLeads(Integer pageNumber, Integer pageSize, LeadDto searchCriteria) {
        Pageable page = PageRequest.of(pageNumber, pageSize);
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Leads> cq = criteriaBuilder.createQuery(Leads.class);
        Root<Leads> leadsRoot = cq.from(Leads.class);

        List<Predicate> predicates = buildPredicates(criteriaBuilder, leadsRoot, searchCriteria);

        cq.where(predicates.toArray(new Predicate[0]));
        TypedQuery<Leads> query = entityManager.createQuery(cq);

        int firstResult = pageNumber * pageSize;
        query.setFirstResult(firstResult);
        query.setMaxResults(pageSize);

        List<Leads> resultList = query.getResultList();

        Long totalElements = countTotalElements(criteriaBuilder, searchCriteria);

        List<LeadDto> dtoList = mapToDto(resultList);

        PaginationResponse paginationResponse = new PaginationResponse();
        paginationResponse.setContent(dtoList);
        paginationResponse.setPageNumber(pageNumber);
        paginationResponse.setPageSize(pageSize);
        paginationResponse.setTotalElements(totalElements.intValue());
        paginationResponse.setTotalPages((int) Math.ceil((double) totalElements / pageSize));
        paginationResponse.setLastPage(pageNumber >= (Math.ceil((double) totalElements / pageSize) - 1));

        return paginationResponse;
    }

    private List<LeadDto> mapToDto(List<Leads> leadsList) {
        return leadsList.stream()
                .map(this::toDto)
                .sorted(Comparator.comparing(LeadDto::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    private Long countTotalElements(CriteriaBuilder criteriaBuilder, LeadDto searchCriteria) {
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Leads> root = countQuery.from(Leads.class);
        countQuery.select(criteriaBuilder.count(root));

        List<Predicate> predicates = buildPredicates(criteriaBuilder, root, searchCriteria);
        countQuery.where(predicates.toArray(new Predicate[0]));

        return entityManager.createQuery(countQuery).getSingleResult();
    }


    private List<Predicate> buildPredicates(CriteriaBuilder criteriaBuilder, Root<Leads> leadsRoot, LeadDto searchCriteria) {
        List<Predicate> predicates = new ArrayList<>();

        if (searchCriteria.getCompanyName() != null && !searchCriteria.getCompanyName().isEmpty()) {
            predicates.add(criteriaBuilder.like(leadsRoot.get("companyName"), "%" + searchCriteria.getCompanyName() + "%"));
        }

        if (searchCriteria.getLeadStatusType() != null && !searchCriteria.getLeadStatusType().isEmpty()) {
            predicates.add(criteriaBuilder.like(leadsRoot.get("leadStatusType"), "%" + searchCriteria.getLeadStatusType() + "%"));
        }

        predicates.add(criteriaBuilder.isTrue(leadsRoot.get("status")));

        return predicates;
    }

    @Override
    public List<LeadDto> searchByCompanyName(String companyName) {
        List<Leads> leadsList = leadsRepository.
                findLeadsByCompanyNameContainingAndStatusIsTrue(
                        companyName
                );

        return leadsList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    public LeadDto toDto(Leads leads) {
        List<LeadAddressDto> leadAddressDtoList = leads.getLeadAddress().stream()
                .map(this::mapAddress)
                .collect(Collectors.toList());

        List<LeadContactDto> leadContactDtoList = leads.getContact().stream()
                .map(this::mapContact)
                .collect(Collectors.toList());

        LeadAboutDto leadAboutDto = null;
        if (leads.getAbout() != null) {
            leadAboutDto = LeadAboutDto.builder()
                    .description(leads.getAbout().getDescription())
                    .source(leads.getAbout().getSource())
                    .build();
        }

        return LeadDto.builder()
                .id(leads.getId())
                .companyName(leads.getCompanyName())
                .contactName(leads.getContactName())
                .createdAt(leads.getCreatedAt())
                .about(leadAboutDto)
                .status(leads.isStatus())
                .leadStatusType(leads.getLeadStatusType())
                .leadAddress(leadAddressDtoList)
                .contact(leadContactDtoList)
                .build();
    }

    private LeadAddressDto mapAddress(LeadsAddress address) {
        return LeadAddressDto.builder()
                .id(address.getId())
                .address(address.getAddress())
                .type(address.getType())
                .city(address.getCity())
                .state(address.getState())
                .postalCode(address.getPostalCode())
                .country(address.getCountry())
                .build();
    }

    private LeadContactDto mapContact(LeadsContact contact) {
        return LeadContactDto.builder()
                .id(contact.getId())
                .name(contact.getName())
                .jobTitle(contact.getJobTitle())
                .role(contact.getRole())
                .landLine(contact.getLandLine())
                .mobile(contact.getMobile())
                .website(contact.getWebsite())
                .email(contact.getEmail())
                .build();
    }


    public Leads toEntity(LeadDto leadDto) {
        List<LeadsAddress> leadAddressList = leadDto.getLeadAddress().stream()
                .map(this::mapAddressDto)
                .collect(Collectors.toList());

        List<LeadsContact> leadContactList = leadDto.getContact().stream()
                .map(this::mapContactDto)
                .collect(Collectors.toList());
        LeadsAbout leadsAbout = null;
        if (leadDto.getAbout() != null) {
            leadsAbout = LeadsAbout.builder()
                    .description(leadDto.getAbout().getDescription())
                    .source(leadDto.getAbout().getSource())
                    .build();
        }
        return Leads.builder()
                .id(leadDto.getId())
                .companyName(leadDto.getCompanyName())
                .contactName(leadDto.getContactName())
                .createdAt(leadDto.getCreatedAt())
                .status(leadDto.isStatus())
                .leadStatusType(leadDto.getLeadStatusType())
                .leadAddress(leadAddressList)
                .about(leadsAbout)
                .contact(leadContactList)
                .build();
    }

    private LeadsAddress mapAddressDto(LeadAddressDto addressDto) {
        return LeadsAddress.builder()
                .id(addressDto.getId())
                .address(addressDto.getAddress())
                .type(addressDto.getType())
                .city(addressDto.getCity())
                .state(addressDto.getState())
                .postalCode(addressDto.getPostalCode())
                .country(addressDto.getCountry())
                .build();
    }

    private LeadsContact mapContactDto(LeadContactDto contactDto) {
        return LeadsContact.builder()
                .id(contactDto.getId())
                .name(contactDto.getName())
                .jobTitle(contactDto.getJobTitle())
                .role(contactDto.getRole())
                .landLine(contactDto.getLandLine())
                .mobile(contactDto.getMobile())
                .website(contactDto.getWebsite())
                .email(contactDto.getEmail())
                .build();
    }

}
