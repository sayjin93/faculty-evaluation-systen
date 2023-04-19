-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 19, 2023 at 12:57 AM
-- Server version: 5.7.36
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fc2`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic_years`
--

DROP TABLE IF EXISTS `academic_years`;
CREATE TABLE IF NOT EXISTS `academic_years` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `academic_years`
--

INSERT INTO `academic_years` (`id`, `year`, `active`, `createdAt`, `updatedAt`) VALUES
(1, '2022-2023', 1, '2023-04-19 00:06:20', '2023-04-19 00:06:20');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
CREATE TABLE IF NOT EXISTS `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `publication_house` varchar(255) DEFAULT NULL,
  `publication_year` date DEFAULT NULL,
  `authors` varchar(255) DEFAULT NULL,
  `scientific_work_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `scientific_work_id` (`scientific_work_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `publication_house`, `publication_year`, `authors`, `scientific_work_id`, `createdAt`, `updatedAt`) VALUES
(1, 'Book1', 'SHBLSH', '2023-04-12', 'JK', 1, '2023-04-19 00:07:52', '2023-04-19 00:07:52');

-- --------------------------------------------------------

--
-- Table structure for table `community_services`
--

DROP TABLE IF EXISTS `community_services`;
CREATE TABLE IF NOT EXISTS `community_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event` varchar(255) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `external` tinyint(1) DEFAULT NULL,
  `academic_year_id` int(11) DEFAULT NULL,
  `professor_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `academic_year_id` (`academic_year_id`),
  KEY `professor_id` (`professor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `community_services`
--

INSERT INTO `community_services` (`id`, `event`, `time`, `description`, `external`, `academic_year_id`, `professor_id`, `createdAt`, `updatedAt`) VALUES
(1, 'CS1', '2023-04-05 02:35:55', 'desc1', 1, 1, 1, '2023-04-19 00:35:55', '2023-04-19 00:35:55');

-- --------------------------------------------------------

--
-- Table structure for table `conferences`
--

DROP TABLE IF EXISTS `conferences`;
CREATE TABLE IF NOT EXISTS `conferences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `present_title` varchar(255) DEFAULT NULL,
  `authors` varchar(255) DEFAULT NULL,
  `dates` varchar(255) DEFAULT NULL,
  `scientific_work_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `scientific_work_id` (`scientific_work_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `conferences`
--

INSERT INTO `conferences` (`id`, `name`, `location`, `present_title`, `authors`, `dates`, `scientific_work_id`, `createdAt`, `updatedAt`) VALUES
(1, 'Conference1', 'Tirane', 'Title', 'Authors', '20-25 Shtator', 1, '2023-04-19 00:17:12', '2023-04-19 00:17:12');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
CREATE TABLE IF NOT EXISTS `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `number` varchar(255) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `week_hours` int(11) DEFAULT NULL,
  `program` enum('Bachelor','Master') DEFAULT NULL,
  `academic_year_id` int(11) DEFAULT NULL,
  `professor_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `academic_year_id` (`academic_year_id`),
  KEY `professor_id` (`professor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `name`, `number`, `semester`, `week_hours`, `program`, `academic_year_id`, `professor_id`, `createdAt`, `updatedAt`) VALUES
(1, 'Course 1', 'C1', 1, 5, 'Bachelor', 1, 1, '2023-04-19 00:08:33', '2023-04-19 00:08:33');

-- --------------------------------------------------------

--
-- Table structure for table `papers`
--

DROP TABLE IF EXISTS `papers`;
CREATE TABLE IF NOT EXISTS `papers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `journal` varchar(255) DEFAULT NULL,
  `publication` datetime DEFAULT NULL,
  `scientific_work_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `scientific_work_id` (`scientific_work_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `papers`
--

INSERT INTO `papers` (`id`, `title`, `journal`, `publication`, `scientific_work_id`, `createdAt`, `updatedAt`) VALUES
(1, 'Paper1', 'Journal1', '2023-04-19 00:09:03', 1, '2023-04-19 00:09:03', '2023-04-19 00:09:03');

-- --------------------------------------------------------

--
-- Table structure for table `professors`
--

DROP TABLE IF EXISTS `professors`;
CREATE TABLE IF NOT EXISTS `professors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `gender` enum('m','f') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `professors`
--

INSERT INTO `professors` (`id`, `first_name`, `last_name`, `gender`, `createdAt`, `updatedAt`) VALUES
(1, 'Firstname', 'Lastname', 'm', '2023-04-18 01:44:43', '2023-04-18 01:44:49');

-- --------------------------------------------------------

--
-- Table structure for table `scientific_works`
--

DROP TABLE IF EXISTS `scientific_works`;
CREATE TABLE IF NOT EXISTS `scientific_works` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `academic_year_id` int(11) DEFAULT NULL,
  `professor_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `academic_year_id` (`academic_year_id`),
  KEY `professor_id` (`professor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `scientific_works`
--

INSERT INTO `scientific_works` (`id`, `academic_year_id`, `professor_id`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2023-04-19 00:07:25', '2023-04-19 00:07:25');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `username_3` (`username`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `username_4` (`username`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `username_5` (`username`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `username_6` (`username`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `username_7` (`username`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `username_8` (`username`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `username_9` (`username`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `username_10` (`username`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `username_11` (`username`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `username_12` (`username`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `username_13` (`username`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `username_14` (`username`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `username_15` (`username`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `username_16` (`username`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `username_17` (`username`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `username_18` (`username`),
  UNIQUE KEY `email_18` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `password`, `email`, `isAdmin`, `createdAt`, `updatedAt`) VALUES
(1, 'Jurgen', 'Kruja', 'admin', 'admin', 'jurgen-kruja@live.com', 1, '2023-04-17 22:29:22', '2023-04-17 22:29:22');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`scientific_work_id`) REFERENCES `scientific_works` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `community_services`
--
ALTER TABLE `community_services`
  ADD CONSTRAINT `community_services_ibfk_7` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `community_services_ibfk_8` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `conferences`
--
ALTER TABLE `conferences`
  ADD CONSTRAINT `conferences_ibfk_1` FOREIGN KEY (`scientific_work_id`) REFERENCES `scientific_works` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_37` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `courses_ibfk_38` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `papers`
--
ALTER TABLE `papers`
  ADD CONSTRAINT `papers_ibfk_1` FOREIGN KEY (`scientific_work_id`) REFERENCES `scientific_works` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `scientific_works`
--
ALTER TABLE `scientific_works`
  ADD CONSTRAINT `scientific_works_ibfk_37` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `scientific_works_ibfk_38` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
