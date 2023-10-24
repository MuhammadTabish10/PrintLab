package com.PrintLab.repository;

import com.PrintLab.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Long> {
    List<Customer> findByStatus(String status);
    @Query("SELECT c FROM Customer c WHERE c.name LIKE %:searchName%")
    List<Customer> findCustomerByName(@Param("searchName") String searchName);
    @Query("SELECT count(*) FROM Customer")
    Long getAllCustomersCount();
    @Modifying
    @Query("UPDATE Customer c SET c.status = 'inActive' WHERE c.id = :id")
    void setStatusInactive(@Param("id") Long id);
}
