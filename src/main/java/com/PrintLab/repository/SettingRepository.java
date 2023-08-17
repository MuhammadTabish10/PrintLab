package com.PrintLab.repository;

import com.PrintLab.modal.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettingRepository extends JpaRepository<Setting,Long> {
    Setting findByKey(String key);
}
