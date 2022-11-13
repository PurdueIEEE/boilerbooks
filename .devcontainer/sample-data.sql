-- MariaDB dump 10.19  Distrib 10.5.15-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: ieee-money
-- ------------------------------------------------------
-- Server version	10.5.15-MariaDB-0+deb11u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `Budget`
--

LOCK TABLES `Budget` WRITE;
/*!40000 ALTER TABLE `Budget` DISABLE KEYS */;
INSERT INTO `Budget` VALUES (1,'General Items',100.00,'General IEEE',8,'Approved'),(2,'Specific Items',100.00,'General IEEE',8,'Approved'),(3,'General Items',100.00,'Aerial Robotics',8,'Approved'),(4,'Specific Items',100.00,'Aerial Robotics',8,'Approved'),(5,'General Items',100.00,'Computer Society',8,'Approved'),(6,'Specific Items',100.00,'Computer Society',8,'Approved'),(7,'General Items',100.00,'EMBS',8,'Approved'),(8,'Specific Items ',100.00,'EMBS',8,'Approved'),(11,'General Items',100.00,'Racing',8,'Submitted'),(12,'Specific Items',100.00,'Racing',8,'Submitted'),(15,'General Items',100.00,'ROV',8,'Submitted'),(16,'Specific Items ',100.00,'ROV',8,'Submitted'),(17,'General Items',100.00,'MTT-S',8,'Submitted'),(18,'Specific Items',100.00,'MTT-S',8,'Submitted');
/*!40000 ALTER TABLE `Budget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Dues`
--

LOCK TABLES `Dues` WRITE;
/*!40000 ALTER TABLE `Dues` DISABLE KEYS */;
INSERT INTO `Dues` VALUES ('Purdue IEEE','ieee-infrastructure@purdueieee.org','','2022-11-13 06:23:39',1,'Aerial Robotics,Computer Society,EMBS,Growth & Engagement,MTT-S,Racing,Learning,Software Saturdays,Social,ROV',8,0,'Unpaid'),('Purdue Pete','pp@localhost','','2022-11-13 06:23:57',2,'None',8,15,'Paid'),('Boilermaker Express','trainboi@localhost','','2022-11-13 06:24:14',3,'Aerial Robotics',8,10,'Paid'),('Mitch Daniels','mdma@localhost','','2022-11-13 06:24:25',4,'Computer Society',8,0,'Exempt'),('ECE Department','pain@localhost','','2022-11-13 06:25:45',5,'Aerial Robotics,Computer Society,EMBS,Growth & Engagement,MTT-S,Learning,Racing,Software Saturdays,Social,ROV',8,0,'Exempt');
/*!40000 ALTER TABLE `Dues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Income`
--

LOCK TABLES `Income` WRITE;
/*!40000 ALTER TABLE `Income` DISABLE KEYS */;
INSERT INTO `Income` VALUES (1,'2022-11-13 06:18:58','Income Source','BOSO',10.00,'','Expected','','Aerial Robotics','trainboi',8,''),(2,'2022-11-13 06:20:16','Large Sponsor','Cash',500.00,'','Received','Income was received as a pile of cash.','Computer Society','mdma',8,''),(3,'2022-11-13 06:20:49','Purdue University','Item',10.00,'Computer Monitors','Received','','Computer Society','mdma',8,''),(4,'2022-11-13 06:21:46','Famous Company','BOSO',1000.00,'','Received','','EMBS','pain',8,'ref num'),(5,'2022-11-13 06:22:36','Grant Organization','INSGC',850.00,'','Credit','','Aerial Robotics','pain',8,'');
/*!40000 ALTER TABLE `Income` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Purchases`
--

LOCK TABLES `Purchases` WRITE;
/*!40000 ALTER TABLE `Purchases` DISABLE KEYS */;
INSERT INTO `Purchases` VALUES (1,'2022-11-13 06:18:00','pp',NULL,'Test Item 1','General Reason Given','Some Vendor','General IEEE','General Items',NULL,20.00,'Denied',NULL,NULL,'','Pick-up',8),(2,'2022-11-13 06:07:27','pp',NULL,'Test Item 2','Specific Reason Given','A different vendor','General IEEE','Specific Items',NULL,4.60,'Requested',NULL,NULL,'','Mailed',8),(3,'2022-11-13 06:30:00','pp',NULL,'Technical Items','Creating project components','Another vendor','Aerial Robotics','General Items',NULL,43.23,'Approved','trainboi','Cash','Approver changed funding source','Pick-up',8),(4,'2022-11-13 06:30:31','pp','2022-11-13 00:00:00','Challenging Supplies','Future Preparedness, changed by approver','One more vendor','Computer Society','Specific Items','/receipts/Computer_Society_pp_Challenging_Supplies_4.jpg',10.00,'Purchased','mdma','BOSO','https://www.youtube.com/watch?v=dQw4w9WgXcQ','Mailed',8),(5,'2022-11-13 06:28:28','mdma',NULL,'Paper Products','Supplies for Events','Big Box Store','Computer Society','General Items',NULL,30.00,'Denied','mdma','BOSO','','Mailed',8);
/*!40000 ALTER TABLE `Purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (2,'Purdue','Pete','pp@localhost','John R Wooden Dr','West Lafayette','IN',47907,'','2022-11-13 06:23:06','pp','$2b$10$RIivtNfuvWIcPpEX31fk8.1bGUmDIwSVAY0q3kb9bVQnmi1MPQHEG','$2b$10$8TiXGDwbnZ/PrGjgrPM9yuGnINJ5CopV.hLVZVknyQ9aWtqcAS52y','2022-11-13 06:15:21','1af1eef2-a469-47fc-875d-229009d904a0','2022-11-13 06:30:07',''),(4,'Boilermaker','Express','trainboi@localhost','101 N Grant St','West Lafayette','IN',47906,'','2022-11-12 05:28:32','trainboi','$2b$10$jNbAIcEonbIsE.ci3c65.OhrIUqm9k1DzSc70sgrgZg9zE4LcpIzi','',NULL,'79d01aac-0c3a-4645-b306-fcd09cdadacf','2022-11-13 06:29:36',''),(5,'Mitch','Daniels','mdma@localhost','610 Purdue Mall','West Lafayette','IN',47907,'','2022-11-12 05:29:50','mdma','$2b$10$36fiDGqX66pyo.IR/2LRReoGTg8bWq7xIQlZTGWyme1FNx8FFXRQK','',NULL,'810dbfb6-c1da-4014-a533-375211cc238a','2022-11-13 06:26:33',''),(6,'ECE','Department','pain@localhost','465 Northwestern Avenue','West Lafayette','IN',47907,'','2022-11-12 05:30:34','pain','$2b$10$SymYEB61FhibsE2aP2aaLubxaeu5TvNlWtTT692.sjdCPygGuTYQi','',NULL,'75debc18-d847-4822-b143-8e8b624a6c40','2022-11-13 06:23:13','');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `approval`
--

LOCK TABLES `approval` WRITE;
/*!40000 ALTER TABLE `approval` DISABLE KEYS */;
INSERT INTO `approval` VALUES (2,'pain','Treasurer','General IEEE',1000000,'*',6),(3,'pain','Treasurer','Aerial Robotics',0,'*',6),(4,'pain','Treasurer','Computer Society',0,'*',6),(5,'pain','Treasurer','EMBS',0,'*',6),(6,'pain','Treasurer','MTT-S',0,'*',6),(7,'pain','Treasurer','Racing',0,'*',6),(8,'pain','Treasurer','ROV',0,'*',6),(9,'pain','Treasurer','SOGA',0,'*',6),(10,'mdma','Committee Chair','Computer Society',1000000,'*',4),(11,'trainboi','Project Lead','Aerial Robotics',100,'*',2);
/*!40000 ALTER TABLE `approval` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `fiscal_year`
--

LOCK TABLES `fiscal_year` WRITE;
/*!40000 ALTER TABLE `fiscal_year` DISABLE KEYS */;
INSERT INTO `fiscal_year` VALUES (1,'2015-2016'),(2,'2016-2017'),(3,'2017-2018'),(4,'2018-2019'),(5,'2019-2020'),(6,'2020-2021'),(7,'2021-2022'),(8,'2022-2023');
/*!40000 ALTER TABLE `fiscal_year` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-13  6:32:22
