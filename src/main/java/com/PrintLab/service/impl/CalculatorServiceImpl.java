package com.PrintLab.service.impl;

import com.PrintLab.exception.PressMachineIsNotSelected;
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
    public String Calculate(Calculator calculator)
    {
        // CALCULATION OF MOQ
        //Checking provided Uping/ProductSize in database
        Uping uping = upingRepository.findByProductSize(calculator.getSizeValue());
        if (uping == null) {
            throw new RecordNotFoundException("Uping not found for size: " + calculator.getSizeValue());
        }
        logger.info("Uping found for size: " + uping.getProductSize());

        //Checking provided PaperSize/SheetSize in database
        PaperSize paperSize = paperSizeRepository.findByLabel(calculator.getSelectedSheetSizeValue());
        if(paperSize == null){
            throw new RecordNotFoundException("PaperSize not found for size: " + calculator.getSelectedSheetSizeValue());
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
        PressMachine pressMachine = pressMachineRepository.findByName(calculator.getSelectedPressMachine());
        if(pressMachine == null){
            throw new RecordNotFoundException("PressMachine not found for name: " + calculator.getSelectedPressMachine());
        }
        logger.info("PressMachine found for name: " + pressMachine.getName());

        if(!pressMachine.getIs_selected()){
            throw new PressMachineIsNotSelected("The provided PressMachine: " +pressMachine.getName()+" is not selected");
        }
        logger.info("PressMachine is selected");

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
        if(calculator.getSideOptionValue().equalsIgnoreCase("Double Sided") && calculator.getImpositionValue().equalsIgnoreCase("Applied")){
            logger.info("SideOption is DoubleSided and Imposition is Applied");

            // Again divide by 2
            productQty = productQty / 2;
            logger.info("MOQ value: " + productQty);

        } else {
            logger.info("MOQ value: " + productQty);
        }

        // CALCULATION OF SHEETS
        Double sheets = productQty/upingValue;
        logger.info("Sheets value: " + sheets);


        // CALCULATIONS OF PAPER MART
        // Searching Paper Market Rates by PaperStock, GSM and getting the latest Paper Market Rates
        Optional<PaperMarketRates> optionalPaperMarketRates = paperMarketRatesRepository.findByPaperStockAndGSMOrderByDateDesc(calculator.getSelectedPaper(), Integer.valueOf(calculator.getSelectedGsm()))
                                                            .stream().findFirst();
        if(!optionalPaperMarketRates.isPresent()){
            throw new RecordNotFoundException("Paper Market Rates not found for paper: " + calculator.getSelectedPaper());
        }
        logger.info("Paper Market Rates found");

        PaperMarketRates paperMarketRates = optionalPaperMarketRates.get();
        logger.info("date and name and gsm: " + paperMarketRates.getDate() + " " + paperMarketRates.getPaperStock() + " " + paperMarketRates.getGSM());


        // Dividing paper rate with qty and multiplying with sheets
        Double paperMart = paperMarketRates.getRatePkr()/paperMarketRates.getQty();
        paperMart = paperMart * sheets;
        logger.info("PaperMart value: " + paperMart);

        // CALCULATIONS OF SLICING
        // Getting predefined current rates from settings
        Optional<Setting> settingOptionalDefinedRates = Optional.ofNullable(settingRepository.findByKey("cutting"));

        if(!settingOptionalDefinedRates.isPresent()){
            throw new RecordNotFoundException("Predefined cutting rates not found in setting");
        }
        Setting definedCuttingRates = settingOptionalDefinedRates.get();
        logger.info("PreDefined Cutting Rates found");

        // Getting current impression from settings
        Optional<Setting> settingOptionalCuttingImpression = Optional.ofNullable(settingRepository.findByKey("cuttingImpression"));

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



//        // CALCULATION OF CTP
//        Double ctp = 1.0;
//
//        // Checking provided jobColor(Front) in database.
//        Optional<ProductFieldValues> optionalJobColorFront = Optional.ofNullable(productFieldValuesRepository.findByName(calculator.getJobColorsFront()));
//        if(!optionalJobColorFront.isPresent()){
//            throw new RecordNotFoundException("JobColor(Front) not found");
//        }
//        Double jobColorFront = Double.valueOf(optionalJobColorFront.get().getName());
//        logger.info("JobColorFront Found: " + jobColorFront);
//
//        if(calculator.getSideOptionValue().equalsIgnoreCase("Double Sided") && calculator.getImpositionValue().equalsIgnoreCase("Not Applied"))
//        {
//            logger.info("Side Option is Double Sided and Imposition is Not Applied");
//            // Checking provided jobColor(Back) in database.
//            Optional<ProductFieldValues> optionalJobColorBack = Optional.ofNullable(productFieldValuesRepository.findByName(calculator.getJobColorsBack()));
//            if(!optionalJobColorBack.isPresent()){
//                throw new RecordNotFoundException("JobColor(Back) not found");
//            }
//            Double jobColorBack = Double.valueOf(optionalJobColorBack.get().getName());
//            logger.info("JobColorBack Found: " + jobColorBack);
//
//
//            // Get CTP by Adding Front and Back Job color and Multiplying them with selected pressMachine ctp rate.
//            ctp = (jobColorFront + jobColorBack) * pressMachine.getCtp_rate();
//            logger.info("Ctp: " + ctp);
//        }
//        else {
//            logger.info("Side Option is Double Sided and Imposition is Applied OR Side option is Single Sided");
//            // Get CTP by Adding Front Job color and Multiplying it with selected pressMachine ctp rate.
//            ctp = jobColorFront * pressMachine.getCtp_rate();
//            logger.info("Ctp: " + ctp);
//        }

        return  "ProductQty: " + productQty + "\n" +
                "Sheets: " + sheets + "\n" +
                "PaperMart: " + paperMart + "\n" +
                "Slicing: " + slicing;
//                "Ctp: " + ctp;
    }

}