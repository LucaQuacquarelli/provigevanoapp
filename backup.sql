-- MySQL dump 10.13  Distrib 8.0.44, for macos12.7 (arm64)
--
-- Host: 127.0.0.1    Database: pro
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `languages` (
  `id` char(2) NOT NULL,
  `name` char(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` VALUES ('en','English'),('es','Español'),('it','Italiano');
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `levels`
--

DROP TABLE IF EXISTS `levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `levels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` char(20) NOT NULL,
  `percentage` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `levels`
--

LOCK TABLES `levels` WRITE;
/*!40000 ALTER TABLE `levels` DISABLE KEYS */;
INSERT INTO `levels` VALUES (1,'basso',1),(2,'medio-basso',2),(3,'medio',3),(4,'medio-alto',4),(5,'alto',5);
/*!40000 ALTER TABLE `levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `players`
--

DROP TABLE IF EXISTS `players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `players` (
  `id` int NOT NULL,
  `name` char(50) NOT NULL,
  `surname` char(50) DEFAULT NULL,
  `nick_name` char(50) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `goalkeeper_provisory` tinyint(1) NOT NULL DEFAULT '0',
  `level_id` int NOT NULL,
  `role_id` int NOT NULL,
  `language_id` char(2) NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT '0',
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `nick_name` (`nick_name`),
  KEY `level_id` (`level_id`),
  KEY `role_id` (`role_id`),
  KEY `language_id` (`language_id`),
  CONSTRAINT `players_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `players_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `players_ibfk_3` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `players`
--

LOCK TABLES `players` WRITE;
/*!40000 ALTER TABLE `players` DISABLE KEYS */;
INSERT INTO `players` VALUES (1,'Alfredo','Chanta','Alfre','1995-06-15',0,3,1,'es',1,'2022-10-20 00:00:00','2025-12-23 13:51:49'),(2,'David','','David','2000-01-31',0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-23 13:51:41'),(3,'Antonio','Marrujo','Toño','1983-12-27',0,3,1,'es',1,'2022-10-20 00:00:00','2025-12-23 13:52:01'),(4,'Juan','Paredes','Cabezòn',NULL,0,3,2,'es',1,'2022-10-20 00:00:00','2026-03-10 19:24:46'),(5,'Jason','Farfàn','Chucky',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-16 23:21:22'),(6,'Alex','Anticona','Alex',NULL,0,2,1,'es',1,'2022-10-20 00:00:00','2025-12-23 13:51:57'),(7,'Anthony Mandujano','Cognome','Chico',NULL,0,5,1,'es',0,'2022-10-20 00:00:00','2025-12-16 23:21:23'),(8,'Miguel','Cognome','El Causa',NULL,0,3,1,'es',1,'2022-10-20 00:00:00','2026-03-10 19:22:17'),(9,'Danny Anticona','Cognome','Danny',NULL,0,3,2,'es',1,'2022-10-20 00:00:00','2025-12-23 13:52:23'),(10,'Roger Medina','Cognome','Di Maria',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-16 23:21:23'),(11,'Edson','Cognome','Mudo',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-16 23:21:23'),(12,'Geovanny','Cognome','Geova',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-16 23:21:23'),(13,'Jefferson Yepez','Cognome','Jeff',NULL,0,3,1,'es',1,'2022-10-20 00:00:00','2025-12-23 13:52:32'),(14,'Jesus','Cognome','Jechu',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-23 13:51:42'),(15,'Jhayr','Cognome','Tornillo',NULL,0,4,1,'es',0,'2022-10-20 00:00:00','2025-12-23 13:51:42'),(16,'Jorge Castillo','Cognome','Mandarina',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-16 23:21:24'),(17,'Leo','Cognome','Gato',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-16 23:21:24'),(18,'Remberto Medina','Cognome','N16',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-16 23:21:25'),(19,'Richard','Cognome','Ricky',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-16 23:21:25'),(20,'Nestor','Cognome','Chivo',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-16 23:21:25'),(21,'Ricardo','Cognome','Grandote',NULL,0,3,2,'es',1,'2022-10-20 00:00:00','2026-03-10 19:24:40'),(22,'Marco','Cognome','Zurdo',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-16 23:21:25'),(23,'Karles Leòn','Cognome','Karles',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-16 23:21:25'),(24,'Ian','Cognome','Ian',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-16 23:21:25'),(25,'Joao','Cognome','Joao',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-16 23:21:26'),(26,'Erick','Cognome','Chato Erick',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-16 23:21:26'),(27,'Alexander Fernandez','Cognome','Gringo',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2022-10-20 00:00:00'),(28,'Johnny','Cognome','Gordo Johnny',NULL,0,3,2,'es',1,'2022-10-20 00:00:00','2026-03-10 19:22:17'),(29,'Fernando','Cognome','Nando',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2022-10-20 00:00:00'),(30,'Alex','Cognome','Tio Alex',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2022-10-20 00:00:00'),(31,'Fernando','Cognome','Calaca',NULL,0,2,1,'es',1,'2022-10-20 00:00:00','2025-12-23 13:51:52'),(32,'Mono','Cognome','Mono',NULL,0,4,1,'es',1,'2022-10-20 00:00:00','2025-12-23 13:52:12'),(33,'Guillermo','Cognome','Zurdo Malo',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2022-10-20 00:00:00'),(34,'Steven','Cognome','Steven',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2022-10-20 00:00:00'),(35,'Messi','Cognome','Messi',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2022-10-20 00:00:00'),(36,'Primo de Cabezon','Cognome','Primo de Cabezon',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2022-10-20 00:00:00'),(37,'Renato','Cognome','Renato',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2022-10-20 00:00:00'),(38,'Patinho','Cognome','Patinho',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2022-10-20 00:00:00'),(39,'Fabrizio','Cognome','Hijo de Patinho',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2022-10-20 00:00:00'),(40,'Elvis','Cognome','Elvis',NULL,0,3,2,'es',1,'2022-10-20 00:00:00','2026-03-10 19:24:38'),(41,'Lio',NULL,'Lio',NULL,0,2,1,'es',0,'2025-12-19 00:00:00','2025-12-23 13:51:42'),(42,'Aldayr',NULL,'Aldayr',NULL,0,2,1,'es',0,'2025-12-19 00:00:00','2025-12-23 13:51:43'),(43,'Miguel',NULL,'Carapulcra',NULL,0,2,1,'es',0,'2025-12-19 00:00:00','2025-12-23 13:51:43'),(44,'Abel',NULL,'Abel',NULL,0,3,1,'es',0,'2025-12-19 00:00:00','2025-12-23 13:51:43'),(45,'Arturo',NULL,'Arturo',NULL,0,3,1,'es',1,'2025-12-19 00:00:00','2025-12-23 13:52:07'),(46,'Nilton',NULL,'Nilton',NULL,0,3,1,'es',0,'2025-12-19 00:00:00','2025-12-23 13:51:43'),(47,'Yuca',NULL,'Yuca',NULL,0,3,1,'es',0,'2025-12-19 00:00:00','2025-12-23 13:51:43'),(48,'Marlon',NULL,'Marlon',NULL,0,3,1,'es',0,'2025-12-19 00:00:00','2025-12-23 13:51:44'),(49,'Diego',NULL,'Mero Loco',NULL,0,3,1,'es',0,'2022-10-20 00:00:00','2025-12-23 13:51:44'),(50,'Dominick',NULL,'Chicho',NULL,0,4,1,'es',1,'2022-10-20 00:00:00','2025-12-23 13:53:19');
/*!40000 ALTER TABLE `players` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` char(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'player'),(2,'goalkeeper');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20221006151047-all-migrations.js'),('20221007080059-update-players-id-column.js'),('20221007082403-update-type-players-id.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-14  9:37:06
