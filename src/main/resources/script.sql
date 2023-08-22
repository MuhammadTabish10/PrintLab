--Data For Database

INSERT INTO `customer` VALUES (1,'Tbcc','2023-08-22','Tabish','Active');

INSERT INTO `orders` VALUES (2,138,45000,'Flyer',_binary '\0',3000,'DL','http',1);

INSERT INTO `paper_market_rates` VALUES (1,128,'2022-06-14','25\"x23\"',25,'Purchased from Abdullah paper mart','Glossy/ArtPaper',500,13600,_binary '\0',36),
                                        (2,113,'2022-06-14','25\"x23\"',25,'Purchased from Abdullah paper mart','Glossy/ArtPaper',500,12000,_binary '\0',36),
                                        (3,48,'2022-05-26','18\"x23\"',18,'Purchased from Abdullah paper mart','Carbonless',500,2750,_binary '\0',23);

INSERT INTO `paper_size` VALUES (1,'18\"x23\"','Active'),
                                (2,'25\"x36\"','Active'),
                                (3,'23\"x36\"','Active'),
                                (4,'8.5\"x12\"','Active');

INSERT INTO `press_machine` VALUES (1,400,400,_binary '\0','SOLNA'),
                                   (2,220,400,_binary '','HEIDELBERG GTO-46'),
                                   (3,220,400,_binary '\0','HEIDELBERG GTO-52');

INSERT INTO `press_machine_size` VALUES (1,2,1,1),(2,4,2,1),(3,4,3,1),(4,1,4,1),
                                        (5,2,1,2),(6,4,2,2),(7,4,3,2),(8,1,4,2),
                                        (9,2,1,3),(10,4,2,3),(11,4,3,3),(12,1,4,3);

INSERT INTO `product_definition` VALUES (1,_binary '','Flyer');

INSERT INTO `product_definition_field` VALUES (1,_binary '',1,3);

INSERT INTO `product_definition_process` VALUES (1,1,2,1);

INSERT INTO `product_definition_selected_values` VALUES (1,'hi',1,1),(2,'hi',1,2);

INSERT INTO `product_field` VALUES (1,'2023-08-21','ProductName',4,'Active','TOGGLE'),
                                   (2,'2023-08-21','PaperStock',2,'Active','DROPDOWN'),
                                   (3,'2023-08-21','JobColor(Front)',3,'Active','DROPDOWN'),
                                   (4,'2023-08-21','JobColor(Back)',4,'Active','DROPDOWN');


INSERT INTO `product_field_values` VALUES (1,'Uncoated','Active',2),(2,'Offset','Active',2),
                                          (3,'ArtPaper','Active',2),(4,'1','Active',3),
                                          (5,'2','Active',3),(6,'3','Active',3),
                                          (7,'4','Active',3),(8,'5','Active',3),
                                          (9,'6','Active',3),(10,'1','Active',4),
                                          (11,'2','Active',4),(12,'3','Active',4),
                                          (13,'4','Active',4),(14,'5','Active',4),
                                          (15,'6','Active',4);

INSERT INTO `product_process` VALUES (1,'Lamination','Active'),(2,'Ctp','Active'),(3,'Slicing','Active');

INSERT INTO `setting` VALUES (1,'cuttingImpression','500'),(2,'cutting','70'),(3,'margin','50'),
                             (4,'setupFee','5000');

INSERT INTO `uping` VALUES (1,'DL'),(2,'LETTER'),(3,'A4'),(4,'A5');

INSERT INTO `uping_paper_size` VALUES (1,4,1,1),(2,8,2,1),(3,8,3,1),(4,1,4,1),(5,4,1,2),(6,8,2,2),
                                      (7,8,3,2),(8,1,4,2),(9,4,1,3),(10,8,2,3),(11,8,3,3),(12,1,4,3),
                                      (13,1,4,4);

INSERT INTO `vendor` VALUES (1,'Gulistan','Contact1','03334215643','2023-02-12','MUTAHIR TRADERS','These are notes');

INSERT INTO `vendor_process` VALUES (1,'MATTE','These are new notesss',2.2,1,1),
                                    (2,'GLOSSY','These are new notesss',1.8,1,1),
                                    (3,'GLOSSY','These are new notesss',1.5,2,1),
                                    (4,'MATTE','These are new notesss',1.8,2,1);




