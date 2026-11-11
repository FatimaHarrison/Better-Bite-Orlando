-- MySQL dump 10.13  Distrib 8.0.44, for macos15 (arm64)
--
-- Host: localhost    Database: BetterBiteOrlando
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
-- Table structure for table `food_locations`
--

DROP TABLE IF EXISTS `food_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_locations` (
  `locationID` int NOT NULL AUTO_INCREMENT,
  `sourceProvider` varchar(50) NOT NULL,
  `locationType` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text,
  `address` varchar(255) DEFAULT NULL,
  `URL` varchar(255) DEFAULT NULL,
  `organization` varchar(150) DEFAULT NULL,
  `hours` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`locationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_locations`
--

LOCK TABLES `food_locations` WRITE;
/*!40000 ALTER TABLE `food_locations` DISABLE KEYS */;
/*!40000 ALTER TABLE `food_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `healthy_restaurants`
--

DROP TABLE IF EXISTS `healthy_restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `healthy_restaurants` (
  `restaurantID` int NOT NULL AUTO_INCREMENT,
  `sourceProvider` varchar(50) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `formattedAddress` varchar(255) DEFAULT NULL,
  `hours` text,
  `website` varchar(255) DEFAULT NULL,
  `cuisineType` varchar(100) DEFAULT NULL,
  `dietOptions` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`restaurantID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `healthy_restaurants`
--

LOCK TABLES `healthy_restaurants` WRITE;
/*!40000 ALTER TABLE `healthy_restaurants` DISABLE KEYS */;
/*!40000 ALTER TABLE `healthy_restaurants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipes` (
  `recipeID` int NOT NULL AUTO_INCREMENT,
  `spoonacularID` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `imageURL` varchar(255) DEFAULT NULL,
  `readyInMinutes` int DEFAULT NULL,
  `sourceURL` varchar(255) DEFAULT NULL,
  `healthScore` decimal(5,2) DEFAULT NULL,
  `calories` decimal(8,2) DEFAULT NULL,
  `fatGrams` decimal(8,2) DEFAULT NULL,
  `saturatedFatGrams` decimal(8,2) DEFAULT NULL,
  `sugarGrams` decimal(8,2) DEFAULT NULL,
  `instructions` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`recipeID`),
  UNIQUE KEY `spoonacularID` (`spoonacularID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_favorites`
--

DROP TABLE IF EXISTS `user_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_favorites` (
  `favoriteID` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `itemType` enum('food_location','restaurant','recipe') NOT NULL,
  `itemID` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`favoriteID`),
  KEY `userID` (`userID`),
  CONSTRAINT `user_favorites_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_favorites`
--

LOCK TABLES `user_favorites` WRITE;
/*!40000 ALTER TABLE `user_favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_preferences`
--

DROP TABLE IF EXISTS `user_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_preferences` (
  `preferenceID` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `isVegetarian` tinyint(1) DEFAULT '0',
  `isVegan` tinyint(1) DEFAULT '0',
  `isGlutenFree` tinyint(1) DEFAULT '0',
  `isDairyFree` tinyint(1) DEFAULT '0',
  `isLowSodium` tinyint(1) DEFAULT '0',
  `isHighProtein` tinyint(1) DEFAULT '0',
  `emailNotifications` tinyint(1) DEFAULT '1',
  `recipeRecommendations` tinyint(1) DEFAULT '1',
  `newResources` tinyint(1) DEFAULT '1',
  `marketingPromotions` tinyint(1) DEFAULT '0',
  `pushNotifications` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`preferenceID`),
  KEY `userID` (`userID`),
  CONSTRAINT `user_preferences_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_preferences`
--

LOCK TABLES `user_preferences` WRITE;
/*!40000 ALTER TABLE `user_preferences` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `defaultZipCode` varchar(10) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `passwordResetToken` varchar(64) DEFAULT NULL,
  `passwordResetExpires` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email` (`email`)
  UNIQUE KEY `usersPasswordResetTokenKey` (`passwordResetToken`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-10 16:07:05
