package com.PrintLab.service.impl;

import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.modal.*;
import com.PrintLab.repository.*;
import com.PrintLab.service.CalculatorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CalculatorServiceImpl implements CalculatorService {

    private static final String DOUBLE_SIDED = "Double Sided";
    private static final String SINGLE_SIDED = "Single Sided";
    private static final String IMPOSITION_APPLIED = "Applied";
    private static final String IMPOSITION_NOT_APPLIED = "Not Applied";
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

    private static final Logger logger = LoggerFactory.getLogger(CalculatorServiceImpl.class);

    public CalculatorServiceImpl(PressMachineRepository pressMachineRepository, UpingRepository upingRepository, PaperSizeRepository paperSizeRepository, PaperMarketRatesRepository paperMarketRatesRepository, SettingRepository settingRepository, ProductFieldRepository productFieldRepository, ProductFieldValuesRepository productFieldValuesRepository) {
        this.pressMachineRepository = pressMachineRepository;
        this.upingRepository = upingRepository;
        this.paperSizeRepository = paperSizeRepository;
        this.paperMarketRatesRepository = paperMarketRatesRepository;
        this.settingRepository = settingRepository;
        this.productFieldRepository = productFieldRepository;
        this.productFieldValuesRepository = productFieldValuesRepository;
    }

    @Override
    public Double CalculateMoq(Calculator calculator)
    {
        // CALCULATION OF ProductQty
        //Checking provided Uping/ProductSize in database
        Uping uping = upingRepository.findByProductSize(calculator.getSizeValue());
        if (uping == null) {
            throw new RecordNotFoundException("Uping not found for size: " + calculator.getSizeValue());
        }
        logger.info("Uping found for size: " + uping.getProductSize());

        //Checking provided PaperSize/SheetSize in database
        PaperSize paperSize = paperSizeRepository.findByLabel(calculator.getSheetSizeValue());
        if(paperSize == null){
            throw new RecordNotFoundException("PaperSize not found for size: " + calculator.getSheetSizeValue());
        }
        logger.info("PaperSize found for size: " + paperSize.getLabel());

        // Check if the provided PaperSize is available in the Uping
        Boolean isPaperSizeAvailableInUping = uping.getUpingPaperSize().stream()
                .anyMatch(ps -> ps.getPaperSize().getLabel().equalsIgnoreCase(paperSize.getLabel()));

        if(!isPaperSizeAvailableInUping){
            throw new RecordNotFoundException("PaperSize: " +paperSize.getLabel()+ " is not available in uping");
        }
        logger.info("PaperSize: " +paperSize.getLabel()+ " is available in uping");

        // Now Getting the value of UpingPaperSize
        Double upingValue = Double.valueOf(uping.getUpingPaperSize().stream()
                .filter(ps -> ps.getPaperSize().getLabel().equalsIgnoreCase(paperSize.getLabel()))
                .findFirst()
                .map(UpingPaperSize::getValue)
                .orElse(null));
        logger.info("PaperSize value: " + upingValue);


        // Now checking if the provided PressMachine is present in database
        PressMachine pressMachine = pressMachineRepository.findSelectedPressMachine();
        if(pressMachine == null){
            throw new RecordNotFoundException("PressMachine not found. Please Select a Press Machine.");
        }
        logger.info("PressMachine found for name: " + pressMachine.getName());

        // Check if the provided PaperSize is available in the PressMachine
        Boolean isPaperSizeAvailableInPressMachine = pressMachine.getPressMachineSize().stream()
                .anyMatch(ps -> ps.getPaperSize().getLabel().equalsIgnoreCase(paperSize.getLabel()));

        if(!isPaperSizeAvailableInPressMachine){
            throw new RecordNotFoundException("PaperSize: " +paperSize.getLabel()+ " is not available in press machine");
        }
        logger.info("PaperSize: " +paperSize.getLabel()+ " is available in PressMachine");

        // Now Getting the value of PressMachineSize
        Double pressMachineValue = Double.valueOf(pressMachine.getPressMachineSize().stream()
                .filter(pm -> pm.getPaperSize().getLabel().equalsIgnoreCase(paperSize.getLabel()))
                .findFirst()
                .map(PressMachineSize::getValue)
                .orElse(null));
        logger.info("PressMachine value: " + pressMachineValue);

        // Now dividing Extracted Uping value with Extracted PressMachine value then multiplying it with 1000
        Double productQty = upingValue / pressMachineValue;
        productQty = productQty * 1000;

        // If Side Option is double-sided and imposition is applied
        if(calculator.getSideOptionValue().equalsIgnoreCase(DOUBLE_SIDED) && calculator.getImpositionValue().equalsIgnoreCase(IMPOSITION_APPLIED)){
            logger.info("SideOption is DoubleSided and Imposition is Applied");

            // Again divide by 2
            productQty = productQty / 2;
            logger.info("Product Qty value: " + productQty);

        }
        else if ((calculator.getSideOptionValue().equalsIgnoreCase(DOUBLE_SIDED) && calculator.getImpositionValue().equalsIgnoreCase(IMPOSITION_NOT_APPLIED)) || calculator.getSideOptionValue().equalsIgnoreCase(SINGLE_SIDED))
        {
            logger.info("Product Qty Value: " + productQty);
        }
        else{
            throw new RecordNotFoundException("Please Enter Correct Side Option");
        }

        // CALCULATION OF SHEETS
        Double sheets = productQty/upingValue;
        logger.info("Sheets value: " + sheets);

        // CALCULATIONS OF PAPER MART
        // Searching Paper Market Rates by PaperStock, GSM and Dimension and getting the latest Paper Market Rates
        Optional<PaperMarketRates> optionalPaperMarketRates = paperMarketRatesRepository.findByPaperStockAndGSMAndDimensionOrderByDateDesc(calculator.getPaper(), Double.valueOf(String.valueOf(calculator.getGsm())), calculator.getSheetSizeValue())
                                                            .stream().findFirst();
        if(!optionalPaperMarketRates.isPresent()){
            throw new RecordNotFoundException("Paper Market Rates not found for paper, gsm, sheetsize: " + calculator.getPaper() + ", " + calculator.getGsm() + ", " + calculator.getSheetSizeValue());
        }
        logger.info("Paper Market Rates found");

        PaperMarketRates paperMarketRates = optionalPaperMarketRates.get();
        logger.info("date and name and gsm and sheetsize: " + paperMarketRates.getDate() + " " + paperMarketRates.getPaperStock() + " " + paperMarketRates.getGSM() + " " + paperMarketRates.getDimension());


        // Dividing paper rate with qty and multiplying with sheets
        Double paperMart = paperMarketRates.getRatePkr()/paperMarketRates.getQty();
        paperMart = paperMart * sheets;
        logger.info("PaperMart value: " + paperMart);

        // CALCULATIONS OF SLICING
        // Getting predefined current rates from settings
        Optional<Setting> settingOptionalDefinedRates = Optional.ofNullable(settingRepository.findByKey(PREDEFINED_CUTTING_RATES_IN_SETTINGS));

        if(!settingOptionalDefinedRates.isPresent()){
            throw new RecordNotFoundException("Predefined cutting rates not found in setting");
        }
        Setting definedCuttingRates = settingOptionalDefinedRates.get();
        logger.info("PreDefined Cutting Rates found");

        // Getting current impression from settings
        Optional<Setting> settingOptionalCuttingImpression = Optional.ofNullable(settingRepository.findByKey(PREDEFINED_CUTTING_IMPRESSION_IN_SETTINGS));

        if(!settingOptionalCuttingImpression.isPresent()){
            throw new RecordNotFoundException("Cutting Impression not found in setting");
        }
        Setting cuttingImpression = settingOptionalCuttingImpression.get();
        logger.info("Cutting Impression found");

        //Ceiling sheets value with currentImpression and multiplying it with cuttingRates
        Double cuttingImpressionValue = Double.parseDouble(cuttingImpression.getValue());
        Double cuttingRates = Double.parseDouble(definedCuttingRates.getValue());
        Double sheetCeil = Math.ceil(sheets/cuttingImpressionValue);
        Double slicing = sheetCeil * cuttingRates;
        logger.info("Slicing value: " + slicing);


        // CALCULATION OF CTP AND PRESS
        Double ctp = 1.0;
        Double press = 1.0;

        // Checking provided jobColor(Front) in database.
        Optional<ProductField> optionalJobColorFront = Optional.ofNullable(productFieldRepository.findByName(JOB_COLOR_FRONT));
        if(!optionalJobColorFront.isPresent()){
            throw new RecordNotFoundException("JobColor(Front) not found");
        }
        logger.info("JobColorFront Found");
        ProductField jobColorFrontProductField = optionalJobColorFront.get();

        Optional<ProductFieldValues> optionalJobColorFrontValue = Optional.ofNullable(productFieldValuesRepository.findByProductFieldAndName(jobColorFrontProductField, String.valueOf(calculator.getJobColorsFront())));
        if(!optionalJobColorFrontValue.isPresent()){
            throw new RecordNotFoundException("JobColor(Front) value not found");
        }
        Double jobColorFront = Double.valueOf(optionalJobColorFrontValue.get().getName());
        logger.info("JobColorFront Vaklue Found: " + jobColorFront);

        if(calculator.getSideOptionValue().equalsIgnoreCase(DOUBLE_SIDED) && calculator.getImpositionValue().equalsIgnoreCase(IMPOSITION_NOT_APPLIED))
        {
            logger.info("Side Option is Double Sided and Imposition is Not Applied");
            // Checking provided jobColor(Back) in database.
            Optional<ProductField> optionalJobColorBack = Optional.ofNullable(productFieldRepository.findByName(JOB_COLOR_BACK));
            if(!optionalJobColorBack.isPresent()){
                throw new RecordNotFoundException("JobColor(Back) not found");
            }
            logger.info("JobColorBack Found");
            ProductField jobColorBackProductField = optionalJobColorBack.get();

            Optional<ProductFieldValues> optionalJobColorBackValue = Optional.ofNullable(productFieldValuesRepository.findByProductFieldAndName(jobColorBackProductField, String.valueOf(calculator.getJobColorsBack())));
            if(!optionalJobColorBackValue.isPresent()){
                throw new RecordNotFoundException("JobColor(Back) Value not found");
            }
            Double jobColorBack = Double.valueOf(optionalJobColorBackValue.get().getName());
            logger.info("JobColorBack Value Found: " + jobColorBack);


            // Get CTP by Adding Front and Back Job color and Multiplying them with selected pressMachine ctp rate.
            ctp = (jobColorFront + jobColorBack) * pressMachine.getCtp_rate();
            logger.info("Ctp: " + ctp);

            // Get Press by Adding Front and Back Job color and Multiplying them with selected pressMachine impression rate.
            press = (jobColorFront + jobColorBack) * pressMachine.getImpression_1000_rate();
            logger.info("Press: " + press);
        }
        else if ((calculator.getSideOptionValue().equalsIgnoreCase(DOUBLE_SIDED) && calculator.getImpositionValue().equalsIgnoreCase(IMPOSITION_APPLIED)) || calculator.getSideOptionValue().equalsIgnoreCase(SINGLE_SIDED)) {
            logger.info("Side Option is Double Sided and Imposition is Applied OR Side option is Single Sided");
            // Get CTP by Adding Front Job color and Multiplying it with selected pressMachine ctp rate.
            ctp = jobColorFront * pressMachine.getCtp_rate();
            logger.info("Ctp: " + ctp);

            // Get Press by Adding Front Job color and Multiplying it with selected pressMachine impression.
            press = jobColorFront * pressMachine.getImpression_1000_rate();
            logger.info("Press: " + press);
        }

        // CALCULATION OF FIXED COST
        Double fixedCost = paperMart + slicing + ctp + press;

        // CALCULATION OF PRICE PER QTY
        // Getting predefined margin rates from settings
        Optional<Setting> settingOptionalDefinedMargin = Optional.ofNullable(settingRepository.findByKey(PREDEFINED_MARGIN_IN_SETTINGS));

        if(!settingOptionalDefinedMargin.isPresent()){
            throw new RecordNotFoundException("Margin not found in setting");
        }
        Double definedMargin = Double.valueOf(settingOptionalDefinedMargin.get().getValue());
        logger.info("Margin found: " + definedMargin);

        // Getting predefined setup fee from settings
        Optional<Setting> settingOptionalDefinedSetupFee = Optional.ofNullable(settingRepository.findByKey(PREDEFINED_SETUP_FEE_IN_SETTINGS));

        if(!settingOptionalDefinedSetupFee.isPresent()){
            throw new RecordNotFoundException("Setup Fee not found in setting");
        }
        Double definedSetupFee = Double.valueOf(settingOptionalDefinedSetupFee.get().getValue());
        logger.info("SetupFee found: " + definedSetupFee);

        Double pricePerQty = (fixedCost * definedMargin/100) + (fixedCost + definedSetupFee);
        logger.info("SetupFee: " + definedSetupFee);

        // CALCULATION OF PRICE PER UNIT
        Double pricePerUnit = pricePerQty/productQty;
        logger.info("PricePerUnit: " + pricePerUnit);

        // CALCULATION OF TOTAL PROFIT
        Double totalProfit = pricePerQty - fixedCost;
        logger.info("TotalPrice: " + totalProfit);

        logger.info("Final Result: \n" +
                "ProductQty: " + productQty + "\n" +
                "Sheets: " + sheets + "\n" +
                "PaperMart: " + paperMart + "\n" +
                "Slicing: " + slicing + "\n" +
                "Ctp: " + ctp + "\n" +
                "Press: " + press + "\n" +
                "Fixed Cost: " + fixedCost + "\n" +
                "PricePerQty: " + pricePerQty + "\n" +
                "PricePerUnit: " + pricePerUnit + "\n" +
                "TotalProfit: " + totalProfit);

        return totalProfit;
    }
}