package com.PrintLab.repository;

import com.PrintLab.modal.PaperMarketRates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaperMarketRatesRepository extends JpaRepository<PaperMarketRates,Long> {
    PaperMarketRates findByPaperStock(String paperStock);
    List<PaperMarketRates> findByPaperStockAndGSMAndDimensionOrderByDateDesc(String paperStock, Integer gsm, String dimension);
}
