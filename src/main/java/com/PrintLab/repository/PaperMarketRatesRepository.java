package com.PrintLab.repository;

import com.PrintLab.modal.PaperMarketRates;
import com.PrintLab.modal.PressMachine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaperMarketRatesRepository extends JpaRepository<PaperMarketRates,Long> {
    PaperMarketRates findByPaperStock(String paperStock);
    @Query("SELECT pmr FROM PaperMarketRates pmr WHERE pmr.paperStock LIKE %:searchName%")
    List<PaperMarketRates> findPaperMarketRatesByPaperStock(@Param("searchName") String searchName);
    List<PaperMarketRates> findByPaperStockAndGSMAndDimensionOrderByDateDesc(String paperStock, Integer gsm, String dimension);
}
