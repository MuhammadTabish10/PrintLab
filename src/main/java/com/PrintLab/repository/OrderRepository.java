package com.PrintLab.repository;

import com.PrintLab.model.Order;
import com.PrintLab.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {

    @Query("SELECT o FROM Order o ORDER BY o.id DESC")
    List<Order> findAllInDescendingOrderById();

    @Query("SELECT o FROM Order o WHERE o.product LIKE %:searchName%")
    List<Order> findOrderByProduct(@Param("searchName") String searchName);

    @Query("SELECT count(*) FROM Order")
    Long getAllOrderCount();

    List<Order> findByProduction(User user);
    List<Order> findByDesigner(User user);
    List<Order> findByPlateSetter(User user);
}
