package com.PrintLab.repository;

import com.PrintLab.model.PaperMarketRates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaperMarketRatesRepository extends JpaRepository<PaperMarketRates,Long> {
    PaperMarketRates findByPaperStock(String paperStock);
    PaperMarketRates findByPaperStockAndGSMAndDimension(String paperStock, Integer gsm, String dimension);
    @Query("SELECT pmr FROM PaperMarketRates pmr WHERE pmr.paperStock LIKE %:searchName%")
    List<PaperMarketRates> findPaperMarketRatesByPaperStock(@Param("searchName") String searchName);
    List<PaperMarketRates> findByPaperStockAndGSMOrderByTimeStampDesc(String paperStock, Integer gsm);
    @Query("SELECT DISTINCT pmr.GSM FROM PaperMarketRates pmr WHERE pmr.paperStock = :paperStock")
    List<Integer> findDistinctGSMByPaperStock(@Param("paperStock") String paperStock);
}
