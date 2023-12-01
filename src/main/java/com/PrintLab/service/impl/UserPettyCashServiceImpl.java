package com.PrintLab.service.impl;

import com.PrintLab.dto.UserPettyCashDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.UserPettyCash;
import com.PrintLab.repository.OrderRepository;
import com.PrintLab.repository.UserPettyCashRepository;
import com.PrintLab.repository.UserRepository;
import com.PrintLab.service.UserPettyCashService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserPettyCashServiceImpl implements UserPettyCashService {
    private final UserPettyCashRepository userPettyCashRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public UserPettyCashServiceImpl(UserPettyCashRepository userPettyCashRepository, UserRepository userRepository, OrderRepository orderRepository) {
        this.userPettyCashRepository = userPettyCashRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }


    @Override
    @Transactional
    public UserPettyCashDto save(UserPettyCashDto userPettyCashDto) {
        UserPettyCash userPettyCash = toEntity(userPettyCashDto);
        userPettyCash.setStatus(true);

        userPettyCash.setUser(userRepository.findById(userPettyCash.getUser().getId())
                .orElseThrow(() -> new RecordNotFoundException(String.format("UserPettyCash not found for id => %d", userPettyCash.getUser().getId()))));

        if (userPettyCash.getOrder() != null) {
            userPettyCash.setOrder(orderRepository.findById(userPettyCash.getOrder().getId())
                    .orElseThrow(() -> new RecordNotFoundException(String.format("Order not found for id => %d", userPettyCash.getOrder().getId()))));
        }

        UserPettyCash savedUserPettyCash = userPettyCashRepository.save(userPettyCash);
        return toDto(savedUserPettyCash);
    }

    @Override
    public List<UserPettyCashDto> getAll() {
        List<UserPettyCash> userPettyCashList = userPettyCashRepository.findAllInDesOrderByIdAndStatus();
        List<UserPettyCashDto> userPettyCashDtoList = new ArrayList<>();

        for (UserPettyCash userPettyCash : userPettyCashList) {
            UserPettyCashDto userPettyCashDto = toDto(userPettyCash);
            userPettyCashDtoList.add(userPettyCashDto);
        }
        return userPettyCashDtoList;
    }

    @Override
    public UserPettyCashDto findById(Long id) {
        UserPettyCash userPettyCash = userPettyCashRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(String.format("UserPettyCash not found for id => %d", id)));
        return toDto(userPettyCash);
    }

    @Override
    public List<UserPettyCashDto> findByUser(Long userId) {
        List<UserPettyCash> userPettyCashList = userPettyCashRepository.findByUserIdAndStatus(userId);
        List<UserPettyCashDto> userPettyCashDtoList = new ArrayList<>();

        for (UserPettyCash userPettyCash : userPettyCashList) {
            UserPettyCashDto userPettyCashDto = toDto(userPettyCash);
            userPettyCashDtoList.add(userPettyCashDto);
        }
        return userPettyCashDtoList;
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        UserPettyCash userPettyCash = userPettyCashRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(String.format("UserPettyCash not found for id => %d", id)));
        userPettyCashRepository.setStatusInactive(userPettyCash.getId());
    }

    @Override
    @Transactional
    public UserPettyCashDto update(Long id, UserPettyCashDto userPettyCashDto) {
        UserPettyCash existingUserPettyCash = userPettyCashRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(String.format("UserPettyCash not found for id => %d", id)));

        existingUserPettyCash.setDebit(userPettyCashDto.getDebit());
        existingUserPettyCash.setCredit(userPettyCashDto.getCredit());

        existingUserPettyCash.setUser(userRepository.findById(userPettyCashDto.getUser().getId())
                .orElseThrow(() -> new RecordNotFoundException(String.format("UserPettyCash not found for id => %d", userPettyCashDto.getUser().getId()))));

        if (userPettyCashDto.getOrder() != null) {
            existingUserPettyCash.setOrder(orderRepository.findById(userPettyCashDto.getOrder().getId())
                    .orElseThrow(() -> new RecordNotFoundException(String.format("Order not found for id => %d", userPettyCashDto.getOrder().getId()))));
        }

        UserPettyCash updatedUserPettyCash = userPettyCashRepository.save(existingUserPettyCash);
        return toDto(updatedUserPettyCash);
    }


    public UserPettyCashDto toDto(UserPettyCash userPettyCash) {
        return UserPettyCashDto.builder()
                .id(userPettyCash.getId())
                .dateAndTime(userPettyCash.getDateAndTime())
                .debit(userPettyCash.getDebit())
                .credit(userPettyCash.getCredit())
                .user(userPettyCash.getUser())
                .order(userPettyCash.getOrder())
                .status(userPettyCash.getStatus())
                .build();
    }

    public UserPettyCash toEntity(UserPettyCashDto userPettyCashDto) {
        return UserPettyCash.builder()
                .id(userPettyCashDto.getId())
                .dateAndTime(userPettyCashDto.getDateAndTime())
                .debit(userPettyCashDto.getDebit())
                .credit(userPettyCashDto.getCredit())
                .user(userPettyCashDto.getUser())
                .order(userPettyCashDto.getOrder())
                .status(userPettyCashDto.getStatus())
                .build();
    }

}
