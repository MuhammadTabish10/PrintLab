package com.PrintLab.repository;

import com.PrintLab.model.PaperMarketRates;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface PaperMarketRatesRepository extends JpaRepository<PaperMarketRates,Long> {
    PaperMarketRates findByPaperStock(String paperStock);
    @Query("SELECT p FROM PaperMarketRates p WHERE p.paperStock = :paperStock ORDER BY p.timeStamp DESC")
    List<PaperMarketRates> findAllPaperMarketRatesByPaperStockOrderByTimestampDesc(@Param("paperStock") String paperStock);
    @Query("SELECT DISTINCT p.paperStock FROM PaperMarketRates p")
    Set<String> findDistinctPaperStocks();
    @Query("SELECT DISTINCT p.vendor FROM PaperMarketRates p WHERE p.paperStock = :paperStock")
    Set<Long> findDistinctVendorsByPaperStock(@Param("paperStock") String paperStock);
    @Query("SELECT DISTINCT p.brand FROM PaperMarketRates p WHERE p.paperStock = :paperStock AND p.vendor = :vendorId")
    Set<String> findDistinctBrandsByPaperStockAndVendor(@Param("paperStock") String paperStock, @Param("vendorId") Long vendorId);
    @Query("SELECT DISTINCT p.madeIn FROM PaperMarketRates p WHERE p.paperStock = :paperStock AND vendor = :vendorId AND brand = :brand")
    Set<String> findDistinctMadeInByPaperStockAndVendorAndBrand(@Param("paperStock") String paperStock,
                                                                @Param("vendorId") Long vendorId,
                                                                @Param("brand") String brand);

    @Query("SELECT DISTINCT p.dimension FROM PaperMarketRates p WHERE p.paperStock = :paperStock AND vendor = :vendorId AND brand = :brand AND madeIn = :madeIn")
    Set<String> findDistinctDimensionByPaperStockAndVendorAndBrandAndMadeIn(@Param("paperStock") String paperStock,
                                                                            @Param("vendorId") Long vendorId,
                                                                            @Param("brand") String brand,
                                                                            @Param("madeIn") String madeIn);
    @Query("SELECT DISTINCT p.GSM FROM PaperMarketRates p WHERE p.paperStock = :paperStock AND vendor = :vendorId AND brand = :brand AND madeIn = :madeIn And dimension = :dimension")
    Set<String> findDistinctGsmByPaperStockAndVendorAndBrandAndMadeInAndDimension(@Param("paperStock") String paperStock,
                                                                                  @Param("vendorId") Long vendorId,
                                                                                  @Param("brand") String brand,
                                                                                  @Param("madeIn") String madeIn,
                                                                                  @Param("dimension") String dimension);

    @Query("SELECT pmr FROM PaperMarketRates pmr WHERE pmr.paperStock = :paperStock AND pmr.vendor = :vendorId AND pmr.brand = :brand AND pmr.madeIn = :madeIn AND pmr.dimension = :dimension AND pmr.GSM IN :gsm AND pmr.status = 'In Stock'")
    List<PaperMarketRates> findPaperMarketRateByEveryColumn(@Param("paperStock") String paperStock,
                                                      @Param("vendorId") Long vendorId,
                                                      @Param("brand") String brand,
                                                      @Param("madeIn") String madeIn,
                                                      @Param("dimension") String dimension,
                                                      @Param("gsm") List<Integer> gsm);

    PaperMarketRates findByPaperStockAndGSMAndDimension(String paperStock, Integer gsm, String dimension);
    @Query("SELECT pmr FROM PaperMarketRates pmr WHERE pmr.paperStock LIKE %:searchName%")
    List<PaperMarketRates> findPaperMarketRatesByPaperStock(@Param("searchName") String searchName);
    List<PaperMarketRates> findByPaperStockAndGSMOrderByTimeStampDesc(String paperStock, Integer gsm);
    @Query("SELECT DISTINCT pmr.GSM FROM PaperMarketRates pmr WHERE pmr.paperStock = :paperStock")
    List<Integer> findDistinctGSMByPaperStock(@Param("paperStock") String paperStock);
}
