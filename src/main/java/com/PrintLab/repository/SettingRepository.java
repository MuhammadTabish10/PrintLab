package com.PrintLab.repository;

import com.PrintLab.modal.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingRepository extends JpaRepository<Setting,Long> {
}
