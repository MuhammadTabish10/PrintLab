package com.PrintLab.repository;

import com.PrintLab.modal.PaperMarketRates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaperMarketRatesRepository extends JpaRepository<PaperMarketRates,Long> {
}
