package com.PrintLab.repository;

import com.PrintLab.model.OrderPaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderPaymentHistoryRepository extends JpaRepository<OrderPaymentHistory, Long> {
    List<OrderPaymentHistory> findByBusinessBusinessName(String businessName);
}
