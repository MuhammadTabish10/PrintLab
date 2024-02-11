package com.PrintLab.service.impl;

import com.PrintLab.dto.LeadAboutDto;
import com.PrintLab.dto.LeadAddressDto;
import com.PrintLab.dto.LeadContactDto;
import com.PrintLab.dto.LeadDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.Leads;
import com.PrintLab.model.LeadsAbout;
import com.PrintLab.model.LeadsAddress;
import com.PrintLab.model.LeadsContact;
import com.PrintLab.repository.LeadsAddressRepository;
import com.PrintLab.repository.LeadsContactRepository;
import com.PrintLab.repository.LeadsRepository;
import com.PrintLab.service.LeadService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LeadServiceImpl implements LeadService {

    private final LeadsRepository leadsRepository;
    private final LeadsAddressRepository leadsAddressRepository;
    private final LeadsContactRepository leadsContactRepository;

    public LeadServiceImpl(
            LeadsRepository leadsRepository,
            LeadsAddressRepository leadsAddressRepository,
            LeadsContactRepository leadsContactRepository
    ) {
        this.leadsRepository = leadsRepository;
        this.leadsAddressRepository = leadsAddressRepository;
        this.leadsContactRepository = leadsContactRepository;
    }

    @Override
    public LeadDto save(LeadDto leadDto) {
        Leads leads = toEntity(leadDto);
        leads.setStatus(true);
        leads.setCreatedAt(LocalDateTime.now());
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


    @Override
    public List<LeadDto> findAll() {
        List<Leads> leadsList = leadsRepository.findAllByStatusIsTrue();

        return leadsList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

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
