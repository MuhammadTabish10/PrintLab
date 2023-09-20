package com.PrintLab.service.impl;

import com.PrintLab.dto.Calculator;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.modal.*;
import com.PrintLab.repository.*;
import com.PrintLab.service.CalculatorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class CalculatorServiceImpl implements CalculatorService {

    private static final String DOUBLE_SIDED = "DOUBLE_SIDED";
    private static final String SINGLE_SIDED = "SINGLE_SIDED";
    private static final String PREDEFINED_CUTTING_RATES_IN_SETTINGS = "cutting";
    private static final String PREDEFINED_CUTTING_IMPRESSION_IN_SETTINGS = "cuttingImpression";
    private static final String PREDEFINED_MARGIN_IN_SETTINGS = "margin";
    private static final String PREDEFINED_SETUP_FEE_IN_SETTINGS = "setupFee";
    private static final String JOB_COLOR_FRONT = "JobColor(Front)";
    private static final String JOB_COLOR_BACK = "JobColor(Back)";

    private final PressMachineRepository pressMachineRepository;
    private final UpingRepository upingRepository;
    private final PaperSizeRepository paperSizeRepository;
    private final PaperMarketRatesRepository paperMarketRatesRepository;
    private final SettingRepository settingRepository;
    private final ProductFieldRepository productFieldRepository;
    private final ProductFieldValuesRepository productFieldValuesRepository;
    private final ProductDefinitionRepository productDefinitionRepository;

    private static final Logger logger = LoggerFactory.getLogger(CalculatorServiceImpl.class);

    public CalculatorServiceImpl(PressMachineRepository pressMachineRepository, UpingRepository upingRepository,
                                 PaperSizeRepository paperSizeRepository, PaperMarketRatesRepository paperMarketRatesRepository,
                                 SettingRepository settingRepository, ProductFieldRepository productFieldRepository,
                                 ProductFieldValuesRepository productFieldValuesRepository, ProductDefinitionRepository productDefinitionRepository) {

        this.pressMachineRepository = pressMachineRepository;
        this.upingRepository = upingRepository;
        this.paperSizeRepository = paperSizeRepository;
        this.paperMarketRatesRepository = paperMarketRatesRepository;
        this.settingRepository = settingRepository;
        this.productFieldRepository = productFieldRepository;
        this.productFieldValuesRepository = productFieldValuesRepository;
        this.productDefinitionRepository = productDefinitionRepository;
    }

    @Override
    public Map<String, Double> CalculateMoq(Calculator calculator) {
        Map<String, Double> resultMap = new LinkedHashMap<>();

        if (calculator.getSideOptionValue() == null) {
            calculator.setSideOptionValue(SINGLE_SIDED);
        }
        if(calculator.getQuantity() == null){
            calculator.setQuantity(1000.0);
        }

        ProductDefinition productDefinition = null;
        if(calculator.getProductValue() != null){
            productDefinition = productDefinitionRepository.findByTitle(calculator.getProductValue());
            if(productDefinition == null){
                throw new RecordNotFoundException("Product " + calculator.getProductValue() + " not Found");
            }
        }

        PaperMarketRates foundPaperMarketRates = null;
        if(calculator.getSheetSizeValue() == null){
            Optional<PaperMarketRates> optionalPaperMarketRates = paperMarketRatesRepository.findByPaperStockAndGSMOrderByTimeStampDesc(calculator.getPaper(), calculator.getGsm())
                    .stream().findFirst();
            if (!optionalPaperMarketRates.isPresent()) {
                throw new RecordNotFoundException("Paper Market Rates not found for paper, gsm: " + calculator.getPaper() + ", " + calculator.getGsm());
            }
            logger.info("Paper Market Rates found");

            PaperMarketRates paperMarketRates = optionalPaperMarketRates.get();
            logger.info("date and name and gsm and sheetsize: " + paperMarketRates.getTimeStamp() + " " + paperMarketRates.getPaperStock() + " " + paperMarketRates.getGSM() + " " + paperMarketRates.getDimension());

            LocalDate currentDate = LocalDate.now();
            LocalDate databaseDate = LocalDate.from(paperMarketRates.getTimeStamp());

            // Calculate the difference between the current date and the database date
            long daysDifference = ChronoUnit.DAYS.between(databaseDate, currentDate);

            if (daysDifference > 10) {
                throw new RecordNotFoundException("Please update your paper as the database date exceeds 10 days from the current date.");
            }
            calculator.setSheetSizeValue(paperMarketRates.getDimension());
            foundPaperMarketRates = paperMarketRates;
        }

        // CALCULATION OF ProductQty
        //Checking provided Uping/ProductSize in database
        Uping uping = upingRepository.findByProductSize(calculator.getSizeValue());
        if (uping == null) {
            throw new RecordNotFoundException("Uping not found for size: " + calculator.getSheetSizeValue());
        }
        logger.info("Uping found for size: " + uping.getProductSize());

        //Checking provided PaperSize/SheetSize in database
        PaperSize paperSize = paperSizeRepository.findByLabel(calculator.getSheetSizeValue());
        if (paperSize == null) {
            throw new RecordNotFoundException("PaperSize not found for size: " +  calculator.getSheetSizeValue());
        }
        logger.info("PaperSize found for size: " + paperSize.getLabel());

        // Check if the provided PaperSize is available in the Uping
        boolean isPaperSizeAvailableInUping = uping.getUpingPaperSize().stream()
                .anyMatch(ps -> ps.getPaperSize().getLabel().equalsIgnoreCase(paperSize.getLabel()));

        if (!isPaperSizeAvailableInUping) {
            throw new RecordNotFoundException("PaperSize: " + paperSize.getLabel() + " is not available in uping");
        }
        logger.info("PaperSize: " + paperSize.getLabel() + " is available in uping");

        // Now Getting the value of UpingPaperSize
        Double upingValue = Double.valueOf(uping.getUpingPaperSize().stream()
                .filter(ps -> ps.getPaperSize().getLabel().equalsIgnoreCase(paperSize.getLabel()))
                .findFirst()
                .map(UpingPaperSize::getValue)
                .orElse(null));
        logger.info("PaperSize value: " + upingValue);


        // Now checking if the provided PressMachine is present in database
        PressMachine pressMachine = null;
        if(calculator.getPressMachineId() == null){
            pressMachine = pressMachineRepository.findById(productDefinition.getPressMachine().getId())
                    .orElseThrow(() -> new RecordNotFoundException("PressMachine not found in product"));
        }
        else{
            Optional<PressMachine> optionalPressMachine = pressMachineRepository.findById(calculator.getPressMachineId());
            if (!optionalPressMachine.isPresent()) {
                throw new RecordNotFoundException("PressMachine not found.");
            }
            pressMachine = optionalPressMachine.get();
        }
        logger.info("PressMachine found for name: " + pressMachine.getName());

        // Check if the provided PaperSize is available in the PressMachine
        boolean isPaperSizeAvailableInPressMachine = pressMachine.getPressMachineSize().stream()
                .anyMatch(ps -> ps.getPaperSize().getLabel().equalsIgnoreCase(paperSize.getLabel()));

        if (!isPaperSizeAvailableInPressMachine) {
            throw new RecordNotFoundException("PaperSize: " + paperSize.getLabel() + " is not available in press machine");
        }
        logger.info("PaperSize: " + paperSize.getLabel() + " is available in PressMachine");

        // Now Getting the value of PressMachineSize
        Double pressMachineValue = Double.valueOf(pressMachine.getPressMachineSize().stream()
                .filter(pm -> pm.getPaperSize().getLabel().equalsIgnoreCase(paperSize.getLabel()))
                .findFirst()
                .map(PressMachineSize::getValue)
                .orElse(null));
        logger.info("PressMachine value: " + pressMachineValue);


        Double productQty = calculateProductQty(calculator, upingValue, pressMachineValue);
        Double sheets = calculateSheets(productQty, upingValue);
        Double paperMart = calculatePaperMart(calculator, sheets, foundPaperMarketRates);
        Double slicing = calculateSlicing(calculator, sheets);
        List<Double> ctpAndPress = calculateCtpAndPress(calculator, pressMachine);
        Double ctp = ctpAndPress.get(0);
        Double press = ctpAndPress.get(1);
        Double fixedCost = calculateFixedCost(paperMart, slicing, ctp, press);
        Double pricePerQty = calculatePricePerQty(calculator, fixedCost);
        Double pricePerUnit = calculatePricePerUnit(pricePerQty, productQty);
        Double totalProfit = calculateTotalProfit(pricePerQty, fixedCost);

        resultMap.put("ProductQty", productQty);
        resultMap.put("Sheets", sheets);
        resultMap.put("PaperMart", paperMart);
        resultMap.put("Slicing", slicing);
        resultMap.put("Ctp", ctp);
        resultMap.put("Press", press);
        resultMap.put("FixedCost", fixedCost);
        resultMap.put("PricePerQty", pricePerQty);
        resultMap.put("PricePerUnit", pricePerUnit);
        resultMap.put("TotalProfit", totalProfit);

        return resultMap;
    }

    // Separate methods for different calculations
    private Double calculateProductQty(Calculator calculator, Double upingValue, Double pressMachineValue) {
        // Calculation logic for product quantity

        // Now dividing Extracted Uping value with Extracted PressMachine value then multiplying it with 1000
        Double productQty = upingValue / pressMachineValue;
        productQty = productQty * calculator.getQuantity();

        // If Side Option is double-sided and imposition is applied
        if (calculator.getSideOptionValue().equalsIgnoreCase(DOUBLE_SIDED) && calculator.getImpositionValue().equals(true)) {
            logger.info("SideOption is DoubleSided and Imposition is Applied");

            // Again divide by 2
            productQty = productQty / 2;
            logger.info("Product Qty value: " + productQty);

        } else if ((calculator.getSideOptionValue().equalsIgnoreCase(DOUBLE_SIDED) && calculator.getImpositionValue().equals(false)) || calculator.getSideOptionValue().equalsIgnoreCase(SINGLE_SIDED)) {
            logger.info("Product Qty Value: " + productQty);
        } else {
            throw new RecordNotFoundException("Please Enter Correct Side Option");
        }
        return productQty;
    }

    private Double calculateSheets(Double productQty, Double upingValue) {
        // Calculation logic for sheets
        Double sheets = productQty / upingValue;
        logger.info("Sheets value: " + sheets);
        return sheets;
    }

    private Double calculatePaperMart(Calculator calculator, Double sheets, PaperMarketRates paperMarketRates) {
        // Calculation logic for paper mart
        // Dividing paper rate with qty and multiplying with sheets
        if(paperMarketRates == null){
            Optional<PaperMarketRates> optionalPaperMarketRates = paperMarketRatesRepository.findByPaperStockAndGSMOrderByTimeStampDesc(calculator.getPaper(), calculator.getGsm())
                    .stream().findFirst();
            if (!optionalPaperMarketRates.isPresent()) {
                throw new RecordNotFoundException("Paper Market Rates not found for paper, gsm: " + calculator.getPaper() + ", " + calculator.getGsm());
            }
            logger.info("Paper Market Rates found");

            paperMarketRates = optionalPaperMarketRates.get();
            logger.info("date and name and gsm and sheetsize: " + paperMarketRates.getTimeStamp() + " " + paperMarketRates.getPaperStock() + " " + paperMarketRates.getGSM() + " " + paperMarketRates.getDimension());

            LocalDate currentDate = LocalDate.now();
            LocalDate databaseDate = LocalDate.from(paperMarketRates.getTimeStamp());

            // Calculate the difference between the current date and the database date
            long daysDifference = ChronoUnit.DAYS.between(databaseDate, currentDate);

            if (daysDifference > 10) {
                throw new RecordNotFoundException("Please update your paper as the database date exceeds 10 days from the current date.");
            }
        }


        Double paperMart = paperMarketRates.getRatePkr() / paperMarketRates.getQty();
        paperMart = paperMart * sheets;
        logger.info("PaperMart value: " + paperMart);
        return paperMart;
    }

    private Double calculateSlicing(Calculator calculator, Double sheets) {
        // Calculation logic for slicing

        // Definitions and initializations of variables
        Double cuttingRates = null;
        Double cuttingImpressionValue = null;

        // Getting predefined current rates from settings
        if (calculator.getCutting() == null) {
            Optional<Setting> settingOptionalDefinedRates = Optional.ofNullable(settingRepository.findByKey(PREDEFINED_CUTTING_RATES_IN_SETTINGS));
            if (!settingOptionalDefinedRates.isPresent()) {
                throw new RecordNotFoundException("Predefined cutting rates not found in setting");
            }
            Setting definedCuttingRates = settingOptionalDefinedRates.get();
            cuttingRates = Double.parseDouble(definedCuttingRates.getValue());
            logger.info("PreDefined Cutting Rates found");
        } else {
            cuttingRates = calculator.getCutting();
        }

        if (calculator.getCuttingImpression() == null) {
            // Getting current impression from settings
            Optional<Setting> settingOptionalCuttingImpression = Optional.ofNullable(settingRepository.findByKey(PREDEFINED_CUTTING_IMPRESSION_IN_SETTINGS));

            if (!settingOptionalCuttingImpression.isPresent()) {
                throw new RecordNotFoundException("Cutting Impression not found in setting");
            }
            Setting cuttingImpressionSetting = settingOptionalCuttingImpression.get();
            cuttingImpressionValue = Double.parseDouble(cuttingImpressionSetting.getValue());
            logger.info("Cutting Impression found");
        } else {
            cuttingImpressionValue = calculator.getCuttingImpression();
        }

        // Rest of your calculations using cuttingImpressionValue and cuttingRates
        Double sheetCeil = Math.ceil(sheets / cuttingImpressionValue);
        Double slicing = sheetCeil * cuttingRates;
        logger.info("Slicing value: " + slicing);
        return slicing;
    }

    private List<Double> calculateCtpAndPress(Calculator calculator, PressMachine pressMachine) {
        // Calculation logic for CTP and press
        // CALCULATION OF CTP AND PRESS
        Double ctp = null;
        Double press = null;

        // Checking provided jobColor(Front) in database.
        Long jobColorFront = null;
        if (calculator.getJobColorsFront() != null) {
            Optional<ProductField> optionalJobColorFront = Optional.ofNullable(productFieldRepository.findByName(JOB_COLOR_FRONT));
            if (!optionalJobColorFront.isPresent()) {
                throw new RecordNotFoundException("JobColor(Front) not found");
            }
            logger.info("JobColorFront Found");
            ProductField jobColorFrontProductField = optionalJobColorFront.get();

            Optional<ProductFieldValues> optionalJobColorFrontValue = Optional.ofNullable(productFieldValuesRepository.findByProductFieldAndName(jobColorFrontProductField, String.valueOf(calculator.getJobColorsFront())));
            if (!optionalJobColorFrontValue.isPresent()) {
                throw new RecordNotFoundException("JobColor(Front) value not found");
            }
            jobColorFront = Long.valueOf(optionalJobColorFrontValue.get().getName());
            logger.info("JobColorFront Value Found: " + jobColorFront);
        } else {
            jobColorFront = 1L;
        }


        if (calculator.getSideOptionValue().equalsIgnoreCase(DOUBLE_SIDED) && calculator.getImpositionValue().equals(false)) {
            logger.info("Side Option is Double Sided and Imposition is Not Applied");
            // Checking provided jobColor(Back) in database.
            Long jobColorBack = null;
            if (calculator.getJobColorsBack() != null) {
                Optional<ProductField> optionalJobColorBack = Optional.ofNullable(productFieldRepository.findByName(JOB_COLOR_BACK));
                if (!optionalJobColorBack.isPresent()) {
                    throw new RecordNotFoundException("JobColor(Back) not found");
                }
                logger.info("JobColorBack Found");
                ProductField jobColorBackProductField = optionalJobColorBack.get();

                Optional<ProductFieldValues> optionalJobColorBackValue = Optional.ofNullable(productFieldValuesRepository.findByProductFieldAndName(jobColorBackProductField, String.valueOf(calculator.getJobColorsBack())));
                if (!optionalJobColorBackValue.isPresent()) {
                    throw new RecordNotFoundException("JobColor(Back) Value not found");
                }
                jobColorBack = Long.valueOf(optionalJobColorBackValue.get().getName());
                logger.info("JobColorBack Value Found: " + jobColorBack);
            } else {
                jobColorBack = 1L;
            }

            // Get CTP by Adding Front and Back Job color and Multiplying them with selected pressMachine ctp rate.
            ctp = (jobColorFront + jobColorBack) * pressMachine.getCtp_rate();
            logger.info("Ctp: " + ctp);

            // Get Press by Adding Front and Back Job color and Multiplying them with selected pressMachine impression rate.
            press = (jobColorFront + jobColorBack) * pressMachine.getImpression_1000_rate();
            logger.info("Press: " + press);

        } else if ((calculator.getSideOptionValue().equalsIgnoreCase(DOUBLE_SIDED) && calculator.getImpositionValue().equals(true)) || calculator.getSideOptionValue().equalsIgnoreCase(SINGLE_SIDED)) {
            logger.info("Side Option is Double Sided and Imposition is Applied OR Side option is Single Sided");
            // Get CTP by Adding Front Job color and Multiplying it with selected pressMachine ctp rate.
            ctp = jobColorFront * pressMachine.getCtp_rate();
            logger.info("Ctp: " + ctp);

            // Get Press by Adding Front Job color and Multiplying it with selected pressMachine impression.
            press = jobColorFront * pressMachine.getImpression_1000_rate();
            logger.info("Press: " + press);
        }

        List<Double> ctpAndPress = new ArrayList<>();
        ctpAndPress.add(ctp);
        ctpAndPress.add(press);

        return ctpAndPress;
    }

    private Double calculateFixedCost(Double paperMart, Double slicing, Double ctp, Double press) {
        // Calculation logic for fixed cost
        return paperMart + slicing + ctp + press;
    }

    private Double calculatePricePerQty(Calculator calculator, Double fixedCost) {
        // Calculation logic for price per quantity
        // Getting predefined margin rates from settings
        Double definedMargin = null;
        Double definedSetupFee = null;

        if (calculator.getMargin() == null) {
            Optional<Setting> settingOptionalDefinedMargin = Optional.ofNullable(settingRepository.findByKey(PREDEFINED_MARGIN_IN_SETTINGS));

            if (!settingOptionalDefinedMargin.isPresent()) {
                throw new RecordNotFoundException("Margin not found in setting");
            }
            definedMargin = Double.valueOf(settingOptionalDefinedMargin.get().getValue());
            logger.info("Margin found: " + definedMargin);

        } else {
            definedMargin = calculator.getMargin();
        }

        if (calculator.getSetupFee() == null) {
            // Getting predefined setup fee from settings
            Optional<Setting> settingOptionalDefinedSetupFee = Optional.ofNullable(settingRepository.findByKey(PREDEFINED_SETUP_FEE_IN_SETTINGS));

            if (!settingOptionalDefinedSetupFee.isPresent()) {
                throw new RecordNotFoundException("Setup Fee not found in setting");
            }
            definedSetupFee = Double.valueOf(settingOptionalDefinedSetupFee.get().getValue());
            logger.info("SetupFee found: " + definedSetupFee);

        } else {
            definedSetupFee = calculator.getSetupFee();
        }

        Double pricePerQty = (fixedCost * definedMargin / 100) + (fixedCost + definedSetupFee);
        logger.info("SetupFee: " + definedSetupFee);
        return pricePerQty;
    }

    private Double calculatePricePerUnit(Double pricePerQty, Double productQty) {
        // Calculation logic for price per unit
        Double pricePerUnit = pricePerQty / productQty;
        logger.info("PricePerUnit: " + pricePerUnit);
        return pricePerUnit;
    }

    private Double calculateTotalProfit(Double pricePerQty, Double fixedCost) {
        // Calculation logic for total profit
        Double totalProfit = pricePerQty - fixedCost;
        logger.info("TotalPrice: " + totalProfit);
        return totalProfit;
    }
}