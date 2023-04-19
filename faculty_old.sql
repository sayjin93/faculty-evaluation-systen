-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 02, 2023 at 12:16 AM
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
-- Database: `faculty`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic_year`
--

DROP TABLE IF EXISTS `academic_year`;
CREATE TABLE IF NOT EXISTS `academic_year` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `academic_year`
--

INSERT INTO `academic_year` (`id`, `year`, `active`) VALUES
(1, '2019-2020', 0),
(2, '2020-2021', 0),
(3, '2021-2022', 0),
(4, '2022-2023', 1);

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
CREATE TABLE IF NOT EXISTS `book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `publication_house` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `publication_year` year(4) DEFAULT NULL,
  `authors` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `scientific_work_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `scientific_work_id` (`scientific_work_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`id`, `title`, `publication_house`, `publication_year`, `authors`, `scientific_work_id`) VALUES
(1, 'Technology in Albania', 'Pegi', 2019, 'Petraq Papajorgji', 1),
(2, 'In: Handbook of Modern Dairy Science and Technology.DOI: 10.5772/intecopen.85532. IntechOpen', 'Pegi', 2019, 'R. Zemel, S. Gan Choudhuri, A. Gere, H. Upreti, Y. Deite, P. Papajorgji and H. Moskowitz.', 2);

-- --------------------------------------------------------

--
-- Table structure for table `community_services`
--

DROP TABLE IF EXISTS `community_services`;
CREATE TABLE IF NOT EXISTS `community_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `time` date DEFAULT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `academic_year_id` int(11) DEFAULT NULL,
  `professor_id` int(11) DEFAULT NULL,
  `eternal` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `academic_year_id` (`academic_year_id`),
  KEY `professor_id` (`professor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `community_services`
--

INSERT INTO `community_services` (`id`, `event`, `time`, `description`, `academic_year_id`, `professor_id`, `eternal`) VALUES
(1, 'Charity', '2020-03-30', 'Volunteering', 1, 2, 0),
(2, 'Editor in Chief:International Journal of Agricultural and Environmental Information Systems (IJAEIS)', NULL, 'Event description', 1, 1, 0),
(3, 'Member of the Mediterranean Advisory Board (meconet.me)', NULL, 'Event description', 1, 1, 0),
(4, 'Associate Editor of Journal of Biomedical Data Mining', NULL, 'Event Description', 1, 1, 0),
(5, 'Associate Editor of Iberoamerican Journal of Applied Computing', NULL, 'Event Description', 1, 1, 0),
(6, 'Advisory Board Member of Caspian Journal of Mathematics', NULL, 'Event Description', 1, 1, 0),
(7, 'Courtesy Faculty', NULL, 'Event Description', 1, 1, 0),
(8, 'Courtesy Faculty: University of Ponta Grossa, Ponta Grossa, Parana, Brazil', NULL, 'Event Description', 1, 1, 0),
(9, 'Courtesy Faculty: Center for Applied Optimization, University of Florida, Gainesville, Florida, USA', NULL, 'Event Description', 1, 2, 0),
(10, 'Member of National Advisory Board of Innovation, Ministry of Innovation, Albania', NULL, 'Event Description', 1, 1, 0),
(11, 'Honorary Citizen of Berat, Albania', NULL, 'Event Description', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `conference`
--

DROP TABLE IF EXISTS `conference`;
CREATE TABLE IF NOT EXISTS `conference` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `present_title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `authors` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dates` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `scientific_work_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `scientific_work_id` (`scientific_work_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `conference`
--

INSERT INTO `conference` (`id`, `name`, `location`, `present_title`, `authors`, `dates`, `scientific_work_id`) VALUES
(1, 'First Conference', 'Durres', 'Technology impact', 'Petraq Papajorgji', '2019', 1),
(2, 'Second Conference', 'Tirana', 'Programming', 'Petraq Papajorgji', '2020', 1),
(3, '15 TH INTERNATIONAL STRATEGIC MANAGEMENT CONFERENCE', 'Poznan, Poland.', 'Using Mind Genomics to Understand the Specifics of a Customer’s Mind', 'O. Ilollari, P. Papajorgji, A. Gere, R. Zemel. H. Moscowitz', 'June 27-29, 2019', 1),
(4, '1 st UNICART, INTERDISCIPLINARY INTERNATIONAL CONFERENCE ON TOURISM, MANAGEMENT AND DEVELOPMENT OF TERRITORY', 'Bari, Italy.', 'Using Mind Genomics to advertise tourism in Albania.', 'O. Ilollari, P. Papajorgji, A. Civici.', NULL, 1),
(5, 'UNICART2, International Conference, Academic Research &amp; Tourism', 'Dubrovnik, Croatia', 'Understanding client’s feelings about mobile banking in Albania.', 'O. Ilollari, L. Sholla, A. Civici.', '6-7 April, 2020', 2),
(6, '15 TH INTERNATIONAL STRATEGIC MANAGEMENT CONFERENCE', 'Poznan, Poland', 'Using Mind Genomics to Understand the Specifics of a Customer’s Mind.', 'O. Ilollari, L. Sholla, A. Gere, R. Zemel. H. Moscowitz', 'June 27-29, 2019', 2);

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
CREATE TABLE IF NOT EXISTS `course` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `number` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `week_hours` int(11) DEFAULT NULL,
  `program` enum('Bachelor','Master') COLLATE utf8_unicode_ci NOT NULL,
  `academic_year_id` int(11) DEFAULT NULL,
  `professor_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `academic_year_id` (`academic_year_id`),
  KEY `professor_id` (`professor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`id`, `name`, `number`, `semester`, `week_hours`, `program`, `academic_year_id`, `professor_id`) VALUES
(1, 'Java Advanced Programming', 'c2', 1, 4, 'Master', 1, 1),
(2, 'Java programming', 'c2', 2, 4, 'Bachelor', 1, 1),
(3, 'Java Advanced', 'c3', 1, 4, 'Master', 1, 2),
(4, 'Java', 'c4', 1, 4, 'Bachelor', 1, 1),
(5, 'Data Structures', 'c4', 1, 4, 'Master', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `paper`
--

DROP TABLE IF EXISTS `paper`;
CREATE TABLE IF NOT EXISTS `paper` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `journal` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `publication` year(4) DEFAULT NULL,
  `scientific_work_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `scientific_work_id` (`scientific_work_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `paper`
--

INSERT INTO `paper` (`id`, `title`, `journal`, `publication`, `scientific_work_id`) VALUES
(1, 'Global Warning', 'Forbes', 2020, 1),
(2, 'A serious paper', 'News', 2020, 1),
(3, 'Sample', 'Paper', 2020, 1),
(4, 'Paper', 'Advances in Nutrition and Food Science, Volume 2019, Issue 05.', 2019, 2),
(5, 'Using a Rule Developing Experimentation Approach to Study Social Problems: The Case of Corruption in Education.', 'International Journal of Political Activism and Engagement Volume 6 • Issue 3 • July-September 2019.', 2019, 2);

-- --------------------------------------------------------

--
-- Table structure for table `professor`
--

DROP TABLE IF EXISTS `professor`;
CREATE TABLE IF NOT EXISTS `professor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `gender` enum('m','f') COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `professor`
--

INSERT INTO `professor` (`id`, `first_name`, `last_name`, `gender`) VALUES
(1, 'Petraq', 'Papajorgji', 'm'),
(2, 'Liseta', 'Sholla', 'f');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'administrator'),
(2, 'user');

-- --------------------------------------------------------

--
-- Table structure for table `scientific_work`
--

DROP TABLE IF EXISTS `scientific_work`;
CREATE TABLE IF NOT EXISTS `scientific_work` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `academic_year_id` int(11) DEFAULT NULL,
  `professor_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `academic_year_id` (`academic_year_id`),
  KEY `professor_id` (`professor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `scientific_work`
--

INSERT INTO `scientific_work` (`id`, `academic_year_id`, `professor_id`) VALUES
(1, 1, 1),
(2, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `username` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `password`, `email`, `role_id`) VALUES
(1, 'Petraq', 'Papajorgji', 'admin', 'admin', 'petraqpapajorgji@uet.edu.al', 1),
(2, 'Jurgen', 'Kruja', 'user', 'user', 'jurgen-kruja@live.com', 2);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `book`
--
ALTER TABLE `book`
  ADD CONSTRAINT `book_ibfk_1` FOREIGN KEY (`scientific_work_id`) REFERENCES `scientific_work` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `community_services`
--
ALTER TABLE `community_services`
  ADD CONSTRAINT `community_services_ibfk_1` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_year` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `community_services_ibfk_2` FOREIGN KEY (`professor_id`) REFERENCES `professor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `conference`
--
ALTER TABLE `conference`
  ADD CONSTRAINT `conference_ibfk_1` FOREIGN KEY (`scientific_work_id`) REFERENCES `scientific_work` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `course_ibfk_1` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_year` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `course_ibfk_2` FOREIGN KEY (`professor_id`) REFERENCES `professor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `paper`
--
ALTER TABLE `paper`
  ADD CONSTRAINT `paper_ibfk_1` FOREIGN KEY (`scientific_work_id`) REFERENCES `scientific_work` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `scientific_work`
--
ALTER TABLE `scientific_work`
  ADD CONSTRAINT `scientific_work_ibfk_1` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_year` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `scientific_work_ibfk_2` FOREIGN KEY (`professor_id`) REFERENCES `professor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
