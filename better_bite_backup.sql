-- MySQL dump 10.13  Distrib 8.0.44, for macos15 (arm64)
--
-- Host: localhost    Database: BetterBiteData
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
-- Table structure for table `Location`
--

DROP TABLE IF EXISTS `Location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Location` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(255) NOT NULL,
  `lat` double NOT NULL,
  `lon` double NOT NULL,
  `distance_miles` double NOT NULL,
  `mealId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Location_mealId_key` (`mealId`),
  CONSTRAINT `Location_mealId_fkey` FOREIGN KEY (`mealId`) REFERENCES `Meal` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Location`
--

LOCK TABLES `Location` WRITE;
/*!40000 ALTER TABLE `Location` DISABLE KEYS */;
INSERT INTO `Location` VALUES (1,'2855 S Orange Ave, Orlando, FL 32806',28.5109,-81.3758,2.5,1),(2,'12711 Narcoossee Rd, Orlando, FL 32832',28.3755,-81.2464,5,2);
/*!40000 ALTER TABLE `Location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Meal`
--

DROP TABLE IF EXISTS `Meal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Meal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `dietary` json NOT NULL,
  `category` varchar(255) NOT NULL,
  `rating` double NOT NULL,
  `restaurantId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Meal_restaurantId_fkey` (`restaurantId`),
  CONSTRAINT `Meal_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurant` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Meal`
--

LOCK TABLES `Meal` WRITE;
/*!40000 ALTER TABLE `Meal` DISABLE KEYS */;
INSERT INTO `Meal` VALUES (1,'Grilled Rosemary Chicken Bowl',14.05,'[\"High Protein\", \"Low Carb\"]','Lunch/Dinner',4.5,1),(2,'Miso Glazed Tofu Bowl',11.95,'[\"Vegetarian\"]','Lunch/Dinner',4.5,2);
/*!40000 ALTER TABLE `Meal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Nutrition`
--

DROP TABLE IF EXISTS `Nutrition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Nutrition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `calories` int NOT NULL,
  `protein` double NOT NULL,
  `carbs` double NOT NULL,
  `fat` double NOT NULL,
  `mealId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Nutrition_mealId_key` (`mealId`),
  CONSTRAINT `Nutrition_mealId_fkey` FOREIGN KEY (`mealId`) REFERENCES `Meal` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Nutrition`
--

LOCK TABLES `Nutrition` WRITE;
/*!40000 ALTER TABLE `Nutrition` DISABLE KEYS */;
INSERT INTO `Nutrition` VALUES (1,100,52,2,20,1),(2,410,19,50,10,2);
/*!40000 ALTER TABLE `Nutrition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Recipe`
--

DROP TABLE IF EXISTS `Recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Recipe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `ingredients` text NOT NULL,
  `instructions` text NOT NULL,
  `better_bite_tips` text,
  `why_its_a_better_bite` text,
  `quick_tips` text,
  `nutrition_facts` text,
  `mealId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Recipe_mealId_key` (`mealId`),
  CONSTRAINT `Recipe_mealId_fkey` FOREIGN KEY (`mealId`) REFERENCES `Meal` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Recipe`
--

LOCK TABLES `Recipe` WRITE;
/*!40000 ALTER TABLE `Recipe` DISABLE KEYS */;
INSERT INTO `Recipe` VALUES (1,'Grilled Rosemary Chicken Bowl','Tender grilled chicken with fresh rosemary, quinoa, roasted vegetables, and a light lemon dressing.','1 lb boneless chicken breasts, 2 tbsp olive oil, 1 tsp garlic...','1. Marinate the chicken... 2. Cook the chicken... 3. Cook the quinoa...','Try it with avocado or hummus for extra healthy fats.','High in protein to keep you full longer.','Use rotisserie chicken to save time!','Calories - 520, Protein - 42g, Carbs - 48g, Fat - 18g',1),(2,'Miso Glazed Tofu Bowl','Crispy tofu coated in a savory miso glaze, served over brown rice with fresh vegetables.','14 oz firm tofu, 2 tbsp cornstarch, 1 tbsp olive oil...','1. Prepare the tofu... 2. Cook the tofu... 3. Make the miso glaze...','Use fresh, seasonal vegetables for the best flavor.','Plant based protein to keep you full and energized.','For extra flavor, add a dash of chili flakes.','Calories - 420, Protein - 22g, Carbs - 62g, Fat - 12g',2);
/*!40000 ALTER TABLE `Recipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Restaurant`
--

DROP TABLE IF EXISTS `Restaurant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Restaurant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Restaurant`
--

LOCK TABLES `Restaurant` WRITE;
/*!40000 ALTER TABLE `Restaurant` DISABLE KEYS */;
INSERT INTO `Restaurant` VALUES (1,'Fresh Kitchen'),(2,'Bolay');
/*!40000 ALTER TABLE `Restaurant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `isVegan` tinyint(1) NOT NULL DEFAULT '0',
  `isVegetarian` tinyint(1) NOT NULL DEFAULT '0',
  `isLowCarb` tinyint(1) NOT NULL DEFAULT '0',
  `isHighProtein` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_Favorite_Meal`
--

DROP TABLE IF EXISTS `User_Favorite_Meal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User_Favorite_Meal` (
  `user_id` int NOT NULL,
  `meal_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`meal_id`),
  KEY `meal_id` (`meal_id`),
  CONSTRAINT `user_favorite_meal_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_favorite_meal_ibfk_2` FOREIGN KEY (`meal_id`) REFERENCES `Meal` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_Favorite_Meal`
--

LOCK TABLES `User_Favorite_Meal` WRITE;
/*!40000 ALTER TABLE `User_Favorite_Meal` DISABLE KEYS */;
/*!40000 ALTER TABLE `User_Favorite_Meal` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-09 20:05:10
