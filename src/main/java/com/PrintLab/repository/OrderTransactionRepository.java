package com.PrintLab.repository;

import com.PrintLab.model.OrderTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderTransactionRepository extends JpaRepository<OrderTransaction,Long> {
    List<OrderTransaction> findByPlateDimension(String plateDimension);

    @Modifying
    @Query("UPDATE OrderTransaction ot SET ot.status = false WHERE ot.id = :id")
    void setStatusInactive(@Param("id") Long id);

    @Query("SELECT ot FROM OrderTransaction ot WHERE ot.status = true ORDER BY ot.id DESC")
    List<OrderTransaction> findAllInDesOrderByIdAndStatus();

    @Query("SELECT ot FROM OrderTransaction ot WHERE ot.order.id = :orderId AND ot.status = true")
    List<OrderTransaction> findAllByOrderIdAndStatus(Long orderId);


}
