-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: print_lab
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `paper_market_rates`
--

LOCK TABLES `paper_market_rates` WRITE;
/*!40000 ALTER TABLE `paper_market_rates` DISABLE KEYS */;
INSERT INTO `paper_market_rates` VALUES
(1,250,'2022-08-06','25\"x36\"',25,'Junaid went there to get the rates.','Art card',100,6400,_binary '',36),
(2,300,'2022-08-06','25\"x36\"',25,'Junaid went there to get the rates.','Art card',100,7800,_binary '',36),
(3,350,'2022-08-06','25\"x36\"',25,'Junaid went there to get the rates.','Art card',100,9000,_binary '',36),
(4,250,'2022-08-06','23\"x36\"',23,'Junaid went there to get the rates.','Art card',100,5900,_binary '',36),
(5,300,'2022-08-06','23\"x36\"',23,'Junaid went there to get the rates.','Art card',100,7100,_binary '',36),
(6,350,'2022-08-06','23\"x36\"',23,'Junaid went there to get the rates.','Art card',500,8250,_binary '',36),
(7,90,'2022-09-08','25\"x36\"',25,'Junaid on WhatsApp','Art Paper / Matte',500,10000,_binary '',36),
(8,250,'2022-08-06','25\"x36\"',25,'Junaid went there to get the rates.','Bleach card',100,5700,_binary '',36),
(9,300,'2022-08-06','25\"x36\"',25,'Junaid went there to get the rates.','Bleach card',100,6800,_binary '',36),
(10,350,'2022-08-06','25\"x36\"',25,'Junaid went there to get the rates.','Bleach card',100,7949,_binary '',36),
(11,250,'2022-08-06','23\"x36\"',23,'Junaid went there to get the rates.','Bleach card',100,5210,_binary '',36),
(12,300,'2022-08-06','23\"x36\"',23,'Junaid went there to get the rates.','Bleach card',100,6250,_binary '',36),
(13,350,'2022-08-06','23\"x36\"',23,'Junaid went there to get the rates.','Bleach card',100,7300,_binary '',36),
(14,48,'2022-05-27','18\"x23\"',18,'Purchased from Abdullah paper mart','Carbonless',500,2800,_binary '',23),
(15,48,'2022-05-27','25\"x36\"',25,'','Carbonless',500,5400,_binary '\0',36),
(16,48,'2022-05-26','18\"x23\"',18,'Purchased from Abdullah paper mart','Carbonless',500,2750,_binary '',23),
(17,113,'2022-06-14','25\"x36\"',25,'Abdullah paper mart via call','Glossy/Art Paper',500,12000,_binary '',36),
(18,128,'2022-06-14','25\"x36\"',25,'Abdullah paper mart via call','Glossy/Art Paper',500,13600,_binary '',36),
(20,150,'2022-06-14','25\"x36\"',25,'Abdullah paper mart via call','Glossy/Art Paper',500,16120,_binary '',36),
(21,128,'2022-08-24','23\"x36\"',23,'Wasi called paper mart','Matte Paper',500,13150,_binary '\0',36),
(22,128,'2022-08-24','25\"x36\"',25,'Wasi called paper mart','Matte Paper',500,14150,_binary '\0',36),
(23,113,'2022-06-16','25\"x36\"',25,'Abdullah paper mart via call','Matte Paper',500,12500,_binary '',36),
(24,128,'2022-06-16','25\"x36\"',25,'Abdullah paper mart via call','Matte Paper',500,13150,_binary '',36),
(25,150,'2022-06-16','25\"x36\"',25,'Abdullah paper mart via call','Matte Paper',500,16620,_binary '',36),
(26,48,'2022-08-24','25\"x36\"',25,'Junaid asked from Rafay','News Paper',500,2200,_binary '\0',36),
(27,120,'2022-09-08','25\"x36\"',25,'Junaid went there to get the rates.','Uncoated/Offset',500,12300,_binary '',36),
(28,70,'2022-06-25','25\"x36\"',25,'Junaid went there to get the rates.','Uncoated/Offset',500,8650,_binary '',36),
(29,80,'2022-06-25','25\"x36\"',25,'Junaid went there to get the rates.','Uncoated/Offset',500,9900,_binary '',36),
(30,100,'2022-06-25','25\"x36\"',25,'Junaid went there to get the rates.','Uncoated/Offset',500,12300,_binary '',36),
(31,70,'2022-06-25','23\"x36\"',23,'Junaid went there to get the rates.','Uncoated/Offset',500,8050,_binary '',36),
(32,80,'2022-06-25','23\"x36\"',23,'Junaid went there to get the rates.','Uncoated/Offset',500,9200,_binary '',36),
(33,100,'2022-06-25','23\"x36\"',23,'Junaid went there to get the rates.','Uncoated/Offset',500,11500,_binary '',36),
(34,70,'2022-05-27','25\"x35.5\"',25,'Purchased from Abdullah paper mart','Uncoated/Offset',500,7820,_binary '',35),
(35,100,'2022-09-08','8.5\"x12\"',8.5,'','White Linen',500,3400,_binary '',12),
(36,100,'2022-09-08','17\"x24\"',17,'','Yellow Laid',500,8400,_binary '',24);
/*!40000 ALTER TABLE `paper_market_rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `paper_size`
--

LOCK TABLES `paper_size` WRITE;
/*!40000 ALTER TABLE `paper_size` DISABLE KEYS */;
INSERT INTO `paper_size` VALUES (1,'18\"x23\"','Active'),(2,'17\"x24\"','Active'),(3,'23\"x36\"','Active'),(4,'25\"x36\"','Active'),(5,'8.5\"x12\"','Active'),(6,'20\"x30\"','Active');
/*!40000 ALTER TABLE `paper_size` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `press_machine`
--

LOCK TABLES `press_machine` WRITE;
/*!40000 ALTER TABLE `press_machine` DISABLE KEYS */;
INSERT INTO `press_machine` VALUES (1,220,400,_binary '\0','HEIDELBERG GTO-46'),(2,220,400,_binary '\0','HEIDELBERG GTO-52'),(3,400,400,_binary '\0','SOLNA'),(4,400,0,_binary '\0','SORK'),(5,520,750,_binary '\0','SORM'),(6,220,250,_binary '\0','ROTA(SPOT COLOR)');
/*!40000 ALTER TABLE `press_machine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `press_machine_size`
--

LOCK TABLES `press_machine_size` WRITE;
/*!40000 ALTER TABLE `press_machine_size` DISABLE KEYS */;
INSERT INTO `press_machine_size` VALUES (1,2,1,1),(3,4,3,1),(4,4,4,1),(5,1,5,1),(6,1,6,1),(7,2,1,2),(9,4,3,2),(10,4,4,2),(11,1,5,2),(13,1,1,3),(15,2,3,3),(16,2,4,3),(17,1,5,3),(20,1,1,4),(21,0,4,4),(22,0,3,4),(23,1,5,4),(26,0,3,5),(27,0,4,5),(28,1,1,5),(29,1,5,5),(32,4,3,6),(33,4,4,6),(34,2,1,6),(35,1,5,6);
/*!40000 ALTER TABLE `press_machine_size` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product_definition`
--

LOCK TABLES `product_definition` WRITE;
/*!40000 ALTER TABLE `product_definition` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_definition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product_definition_field`
--

LOCK TABLES `product_definition_field` WRITE;
/*!40000 ALTER TABLE `product_definition_field` DISABLE KEYS */;
INSERT INTO `product_field` VALUES (1,'2023-08-25','Paper Stock',1,'Active','MULTIDROPDOWN'),(2,'2023-08-25','Size',2,'Active','MULTIDROPDOWN'),(3,'2023-08-25','GSM',3,'Active','MULTIDROPDOWN'),(4,'2023-08-25','Quantity',4,'Active','MULTIDROPDOWN'),(5,'2023-08-25','Print Side',5,'Active','MULTIDROPDOWN'),(6,'2023-08-25','JobColor(Front)',6,'Active','MULTIDROPDOWN'),(7,'2023-08-25','JobColor(Back)',7,'Active','MULTIDROPDOWN'),(8,'2023-08-25','Imposition',8,'Active','TOGGLE');
/*!40000 ALTER TABLE `product_definition_field` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product_definition_process`
--

LOCK TABLES `product_definition_process` WRITE;
/*!40000 ALTER TABLE `product_definition_process` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_definition_process` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product_definition_selected_values`
--

LOCK TABLES `product_definition_selected_values` WRITE;
/*!40000 ALTER TABLE `product_definition_selected_values` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_definition_selected_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product_field`
--

LOCK TABLES `product_field` WRITE;
/*!40000 ALTER TABLE `product_field` DISABLE KEYS */;
INSERT INTO `product_field` VALUES (1,'2023-08-22','JobColor(Front)',1,'Active','MULTIDROPDOWN'),(2,'2023-08-22','Paper Stock',3,'Active','MULTIDROPDOWN'),(3,'2023-08-22','Product Size',2,'Active','MULTIDROPDOWN'),(4,'2023-08-22','GSM',4,'Active','MULTIDROPDOWN'),(5,'2023-08-22','Sheet Size',5,'Active','MULTIDROPDOWN'),(6,'2023-08-22','Side Option',6,'Active','MULTIDROPDOWN'),(7,'2023-08-22','Imposition',7,'Active','MULTIDROPDOWN'),(8,'2023-08-22','JobColor(Back)',8,'Active','MULTIDROPDOWN');
/*!40000 ALTER TABLE `product_field` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product_field_values`
--

LOCK TABLES `product_field_values` WRITE;
/*!40000 ALTER TABLE `product_field_values` DISABLE KEYS */;
INSERT INTO `product_field_values` VALUES (1,'Art card','Active',1),(2,'Bleach card','Active',1),(3,'Carbonless','Active',1),(4,'Glossy/Art Paper','Active',1),(5,'Matte Paper','Active',1),(6,'Uncoated/Offset','Active',1),(7,'DL','Active',2),(8,'A5','Active',2),(9,'A4','Active',2),(10,'LETTER','Active',2),(11,'A3','Active',2),(12,'A2','Active',2),(13,'A1','Active',2),(14,'48','Active',3),(15,'128','Active',3),(16,'113','Active',3),(17,'250','Active',3),(18,'300','Active',3),(19,'350','Active',3),(20,'90','Active',3),(21,'70','Active',3),(22,'80','Active',3),(23,'100','Active',3),(24,'1000','Active',4),(25,'2000','Active',4),(26,'3000','Active',4),(27,'4000','Active',4),(28,'5000','Active',4),(29,'SingleSided','Active',5),(30,'DoubleSided','Active',5),(31,'1','Active',6),(32,'2','Active',6),(33,'3','Active',6),(34,'4','Active',6),(35,'5','Active',6),(36,'6','Active',6),(37,'1','Active',7),(38,'2','Active',7),(39,'3','Active',7),(40,'4','Active',7),(41,'5','Active',7),(42,'6','Active',7);
/*!40000 ALTER TABLE `product_field_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product_process`
--

LOCK TABLES `product_process` WRITE;
/*!40000 ALTER TABLE `product_process` DISABLE KEYS */;
INSERT INTO `product_process` VALUES (1,'Lamination','Active'),(2,'Ctp','Active'),(3,'Slicing','Active');
/*!40000 ALTER TABLE `product_process` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `setting`
--

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES (1,'cuttingImpression','500'),(2,'cutting','70'),(3,'margin','50'),(4,'setupFee','5000');
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `uping`
--

LOCK TABLES `uping` WRITE;
/*!40000 ALTER TABLE `uping` DISABLE KEYS */;
INSERT INTO `uping` VALUES (1,'LETTER'),(2,'DL'),(3,'A5'),(4,'A4'),(5,'A3'),(6,'BUSINESS CARD'),(7,'PRESENTATION FOLDER');
/*!40000 ALTER TABLE `uping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `uping_paper_size`
--

LOCK TABLES `uping_paper_size` WRITE;
/*!40000 ALTER TABLE `uping_paper_size` DISABLE KEYS */;
INSERT INTO `uping_paper_size` VALUES (1,4,2,1),(2,8,3,1),(3,8,4,1),(4,4,1,1),(5,1,5,1),(6,1,6,1),(7,12,2,2),(8,24,3,2),(9,24,4,2),(10,12,1,2),(11,0,5,2),(12,1,6,2),(13,8,2,3),(14,16,3,3),(15,16,4,3),(16,8,1,3),(17,0,5,3),(18,4,2,4),(19,8,3,4),(20,8,4,4),(21,4,1,4),(22,1,5,4),(23,2,2,5),(24,4,3,5),(25,4,4,5),(26,2,1,5),(27,0,5,5),(28,96,4,6),(29,4,4,7);
/*!40000 ALTER TABLE `uping_paper_size` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vendor`
--

LOCK TABLES `vendor` WRITE;
/*!40000 ALTER TABLE `vendor` DISABLE KEYS */;
INSERT INTO `vendor` VALUES (1,'Gulistan','Contact1','03334215643','2023-02-12','MUTAHIR TRADERS','These are notes');
/*!40000 ALTER TABLE `vendor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vendor_process`
--

LOCK TABLES `vendor_process` WRITE;
/*!40000 ALTER TABLE `vendor_process` DISABLE KEYS */;
INSERT INTO `vendor_process` VALUES (1,'MATTE','These are new notesss',2.2,1,1),(2,'GLOSSY','These are new notesss',1.8,1,1),(3,'GLOSSY','These are new notesss',1.5,2,1),(4,'MATTE','These are new notesss',1.8,2,1);

/*!40000 ALTER TABLE `vendor_process` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-22 10:47:38
