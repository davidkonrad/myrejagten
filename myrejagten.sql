-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Vært: localhost
-- Genereringstid: 01. 09 2016 kl. 11:03:43
-- Serverversion: 5.5.49-0ubuntu0.14.04.1
-- PHP-version: 5.5.9-1ubuntu4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `myrejagten`
--

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `eksperiment`
--

CREATE TABLE IF NOT EXISTS `eksperiment` (
  `eksperiment_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `projekt_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `start_tid` timestamp NULL DEFAULT NULL,
  `slut_tid` timestamp NULL DEFAULT NULL,
  `titel` varchar(255) NOT NULL,
  `lokalitet` varchar(100) NOT NULL,
  `lat` varchar(50) NOT NULL,
  `lng` varchar(50) NOT NULL,
  `geometryWkt` text,
  `adresse` varchar(100) DEFAULT NULL,
  `postnr` varchar(10) DEFAULT NULL,
  `by` varchar(50) DEFAULT NULL,
  `kommune` varchar(50) DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  UNIQUE KEY `eksperiment_id` (`eksperiment_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Data dump for tabellen `eksperiment`
--

INSERT INTO `eksperiment` (`eksperiment_id`, `created_timestamp`, `projekt_id`, `user_id`, `start_tid`, `slut_tid`, `titel`, `lokalitet`, `lat`, `lng`, `geometryWkt`, `adresse`, `postnr`, `by`, `kommune`, `region`) VALUES
(1, '0000-00-00 00:00:00', 0, 3, NULL, NULL, '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(2, '0000-00-00 00:00:00', 0, 3, NULL, NULL, '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(3, '0000-00-00 00:00:00', 0, 3, NULL, NULL, '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(4, '0000-00-00 00:00:00', 0, 3, NULL, NULL, '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(5, '0000-00-00 00:00:00', 0, 3, NULL, NULL, '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(6, '0000-00-00 00:00:00', 0, 3, NULL, NULL, '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(7, '0000-00-00 00:00:00', 0, 3, NULL, NULL, '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `projekt`
--

CREATE TABLE IF NOT EXISTS `projekt` (
  `projekt_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `created_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `titel` varchar(255) NOT NULL,
  `lokalitet` varchar(255) NOT NULL,
  `geometryWkt` text,
  `lat` varchar(30) NOT NULL,
  `lng` varchar(30) NOT NULL,
  `start_tid` timestamp NULL DEFAULT NULL,
  `slut_tid` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`projekt_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Data dump for tabellen `projekt`
--

INSERT INTO `projekt` (`projekt_id`, `user_id`, `created_timestamp`, `titel`, `lokalitet`, `geometryWkt`, `lat`, `lng`, `start_tid`, `slut_tid`) VALUES
(1, 0, '2016-08-25 09:17:25', 'test', 'Jammerbugten (Bugt i Skagerrak)', 'POLYGON((501637.63 6335091.6,505604.15 6333496.56,508935.67 6332839.78,511750.33 6332816.15,516833.27 6333516.14,519200.38 6334582.31,522012.98 6334854.75,523810.37 6335502.07,531983.88 6341956.96,537613.02 6350257.36,541168.08 6356483.1,542203.65 6359128.45,543070.64 6359919.37,547678.94 6370778.12,551705.38 6375052.77,553380.56 6377564.9,555872.36 6382650.59,557245.16 6384091.12,557137.03 6384523.26,549438.24 6391024.81,501637.63 6335091.6))', '57.398625857988485', '9.492391808329229', '2016-08-07 22:00:00', NULL),
(2, 0, '2016-08-25 09:24:12', 'dette er en prøve', 'Rønnebak Høje (Gravhøj i Bedsted Thy)', 'MULTIPOINT(468228.58 6296319.54,468263.65 6296278.71)', '56.809480662581244', '8.479935838370825', '2016-07-31 22:00:00', NULL),
(3, 0, '2016-08-25 11:25:32', 'qwerty', 'Åbenrågården (Gård i Galten)', 'POLYGON((558861.97 6227740,558857.46 6227750.25,558838.95 6227742.11,558843.46 6227731.86,558861.97 6227740))', '56.19098812890293', '9.948301332326103', '2016-08-07 22:00:00', NULL),
(4, 0, '2016-08-28 04:31:40', 'hjemme hos david', 'Capellavænget 13, 2620 Albertslund', 'POINT(710479 6174720)', '55.67258628579763', '12.34725721082641', '2016-08-08 22:00:00', NULL),
(5, 0, '2016-08-29 13:02:36', 'test', 'botanisk', NULL, '55.67534706097219', '12.318857903592288', '2016-08-07 22:00:00', NULL),
(6, 0, '2016-08-29 13:11:47', 'azxazxax', 'cap', NULL, '56.80980391650921', '8.476833997992799', '2016-08-07 22:00:00', '2016-08-01 22:00:00');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `confirmed` tinyint(1) DEFAULT NULL,
  `brugernavn` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` int(11) DEFAULT NULL,
  `institution` varchar(100) DEFAULT NULL,
  `fulde_navn` varchar(100) DEFAULT NULL,
  `adresse` varchar(100) DEFAULT NULL,
  `postnr` varchar(10) DEFAULT NULL,
  `by` varchar(50) DEFAULT NULL,
  `kommune` varchar(50) DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Data dump for tabellen `user`
--

INSERT INTO `user` (`user_id`, `email`, `confirmed`, `brugernavn`, `password`, `role`, `institution`, `fulde_navn`, `adresse`, `postnr`, `by`, `kommune`, `region`) VALUES
(1, 'test@ku.dk', NULL, '>>udvikler<<', 'test', 0, 'Askov-Malt Skole (Folkeskole i Vejen)', 'davif konrad', 'Granbakken 8', '3400', 'Hillerød', 'Hillerød', 'Hovedstaden'),
(2, 'dfgdfgdfgdfg', NULL, 'dfgdfg', 'fgfddddfdg', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'a@ku.dk', NULL, 'privat', 'a', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `user_settings`
--

CREATE TABLE IF NOT EXISTS `user_settings` (
  `user_id` int(11) NOT NULL,
  `institutions_navn` varchar(50) NOT NULL,
  `fulde_navn` varchar(50) NOT NULL,
  `adresse` varchar(100) NOT NULL,
  `postnr` varchar(10) NOT NULL,
  `city` varchar(50) NOT NULL,
  `kommune` varchar(50) NOT NULL,
  `region` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
