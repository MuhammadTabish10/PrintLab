package com.PrintLab.repository;

import com.PrintLab.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByName(String username);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName And u.status = true")
    List<User> findByRole(@Param("roleName") String roleName);
    @Modifying
    @Query("UPDATE User u SET u.status = false WHERE u.id = :id")
    void setStatusInactive(@Param("id") Long id);

    List<User> findAllByStatusIsTrue();

    User findByEmailAndStatusIsTrue(String email);

}

