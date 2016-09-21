-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Vært: localhost
-- Genereringstid: 21. 09 2016 kl. 13:09:31
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
-- Struktur-dump for tabellen `data`
--

CREATE TABLE IF NOT EXISTS `data` (
  `data_id` int(11) NOT NULL AUTO_INCREMENT,
  `eksperiment_id` int(11) NOT NULL,
  `madding` varchar(50) NOT NULL,
  `myrer_indsamlet` int(11) DEFAULT NULL,
  `myrer_frysning` int(11) DEFAULT NULL,
  `maden_stjaalet` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`data_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=223 ;

--
-- Data dump for tabellen `data`
--

INSERT INTO `data` (`data_id`, `eksperiment_id`, `madding`, `myrer_indsamlet`, `myrer_frysning`, `maden_stjaalet`) VALUES
(25, 13, 'Vand', 0, 0, 0),
(26, 13, 'Saltvand', 0, 0, 0),
(27, 13, 'Sukkervand', 0, 0, 0),
(28, 13, 'Olie', 0, 0, 0),
(29, 13, 'Protein', 0, 0, 0),
(30, 13, 'Kammerjunker', 0, 0, 0),
(31, 14, 'Vand', 0, 0, NULL),
(32, 14, 'Saltvand', 0, 0, NULL),
(33, 14, 'Olie', 0, 0, NULL),
(34, 14, 'Sukkervand', 0, 0, NULL),
(35, 14, 'Protein', 0, 0, NULL),
(36, 14, 'Kammerjunker', 0, 0, NULL),
(67, 20, 'Vand', 0, 0, NULL),
(68, 20, 'Saltvand', 0, 0, NULL),
(69, 20, 'Sukkervand', 0, 0, NULL),
(70, 20, 'Olie', 0, 0, NULL),
(71, 20, 'Protein', 0, 0, NULL),
(72, 20, 'Kammerjunker', 0, 0, NULL),
(73, 21, 'Vand', 0, 0, NULL),
(74, 21, 'Saltvand', 0, 0, NULL),
(75, 21, 'Sukkervand', 0, 0, NULL),
(76, 21, 'Olie', 0, 0, NULL),
(77, 21, 'Protein', 0, 0, NULL),
(78, 21, 'Kammerjunker', 0, 0, NULL),
(85, 23, 'Vand', 0, 0, NULL),
(86, 23, 'Saltvand', 0, 0, NULL),
(87, 23, 'Sukkervand', 0, 0, NULL),
(88, 23, 'Olie', 0, 0, NULL),
(89, 23, 'Protein', 0, 0, NULL),
(90, 23, 'Kammerjunker', 0, 0, NULL),
(91, 24, 'Vand', 0, 0, NULL),
(92, 24, 'Saltvand', 0, 0, NULL),
(93, 24, 'Sukkervand', 0, 0, NULL),
(94, 24, 'Olie', 0, 0, NULL),
(95, 24, 'Protein', 0, 0, NULL),
(96, 24, 'Kammerjunker', 0, 0, NULL),
(97, 25, 'Vand', 0, 0, NULL),
(98, 25, 'Saltvand', 0, 0, NULL),
(99, 25, 'Sukkervand', 0, 0, NULL),
(100, 25, 'Olie', 0, 0, NULL),
(101, 25, 'Protein', 0, 0, NULL),
(102, 25, 'Kammerjunker', 0, 0, NULL),
(103, 26, 'Vand', 0, 0, 0),
(104, 26, 'Saltvand', 67, 0, 0),
(105, 26, 'Sukkervand', 0, 0, 0),
(106, 26, 'Olie', 0, 0, 0),
(107, 26, 'Protein', 0, 0, 0),
(108, 26, 'Kammerjunker', 0, 0, 0),
(109, 27, 'Vand', 0, 0, NULL),
(110, 27, 'Protein', 0, 0, NULL),
(111, 27, 'Olie', 0, 0, NULL),
(112, 27, 'Kammerjunker', 0, 0, NULL),
(113, 27, 'Saltvand', 0, 0, NULL),
(114, 27, 'Sukkervand', 0, 0, NULL),
(115, 28, 'Vand', 0, 0, NULL),
(116, 28, 'Sukkervand', 0, 0, NULL),
(117, 28, 'Protein', 0, 0, NULL),
(118, 28, 'Olie', 0, 0, NULL),
(119, 28, 'Saltvand', 0, 0, NULL),
(120, 28, 'Kammerjunker', 0, 0, NULL),
(133, 31, 'Vand', 0, 0, NULL),
(134, 31, 'Sukkervand', 0, 0, NULL),
(135, 31, 'Protein', 0, 0, NULL),
(136, 31, 'Olie', 0, 0, NULL),
(137, 31, 'Kammerjunker', 0, 0, NULL),
(138, 31, 'Saltvand', 0, 0, NULL),
(139, 32, 'Vand', 0, 0, NULL),
(140, 32, 'Saltvand', 0, 0, NULL),
(141, 32, 'Sukkervand', 0, 0, NULL),
(142, 32, 'Olie', 0, 0, NULL),
(143, 32, 'Protein', 0, 0, NULL),
(144, 32, 'Kammerjunker', 0, 0, NULL),
(145, 33, 'Vand', 0, 0, NULL),
(146, 33, 'Saltvand', 0, 0, NULL),
(147, 33, 'Sukkervand', 0, 0, NULL),
(148, 33, 'Olie', 0, 0, NULL),
(149, 33, 'Protein', 0, 0, NULL),
(150, 33, 'Kammerjunker', 0, 0, NULL),
(151, 34, 'Vand', 0, 0, 0),
(152, 34, 'Saltvand', 0, 0, 0),
(153, 34, 'Sukkervand', 0, 0, 0),
(154, 34, 'Olie', 0, 0, 0),
(155, 34, 'Protein', 0, 0, 0),
(156, 34, 'Kammerjunker', 0, 0, 0),
(157, 35, 'Vand', 77, 6, 0),
(158, 35, 'Saltvand', 77, 7, 0),
(159, 35, 'Sukkervand', NULL, 57, 0),
(160, 35, 'Olie', 5, 567, 0),
(161, 35, 'Protein', NULL, NULL, 0),
(162, 35, 'Kammerjunker', NULL, NULL, 0),
(169, 37, 'Vand', NULL, NULL, NULL),
(170, 37, 'Saltvand', NULL, NULL, NULL),
(171, 37, 'Sukkervand', NULL, NULL, NULL),
(172, 37, 'Olie', NULL, NULL, NULL),
(173, 37, 'Protein', NULL, NULL, NULL),
(174, 37, 'Kammerjunker', NULL, NULL, NULL),
(175, 38, 'Vand', NULL, NULL, NULL),
(176, 38, 'Saltvand', NULL, NULL, NULL),
(177, 38, 'Sukkervand', NULL, NULL, NULL),
(178, 38, 'Olie', NULL, NULL, NULL),
(179, 38, 'Protein', NULL, NULL, NULL),
(180, 38, 'Kammerjunker', NULL, NULL, NULL),
(181, 39, 'Vand', NULL, NULL, NULL),
(182, 39, 'Saltvand', NULL, NULL, NULL),
(183, 39, 'Sukkervand', NULL, NULL, NULL),
(184, 39, 'Olie', NULL, NULL, NULL),
(185, 39, 'Protein', NULL, NULL, NULL),
(186, 39, 'Kammerjunker', NULL, NULL, NULL),
(187, 40, 'Vand', NULL, NULL, NULL),
(188, 40, 'Saltvand', NULL, NULL, NULL),
(189, 40, 'Sukkervand', NULL, NULL, NULL),
(190, 40, 'Olie', NULL, NULL, NULL),
(191, 40, 'Protein', NULL, NULL, NULL),
(192, 40, 'Kammerjunker', NULL, NULL, NULL),
(193, 41, 'Vand', NULL, NULL, NULL),
(194, 41, 'Saltvand', NULL, NULL, NULL),
(195, 41, 'Sukkervand', NULL, NULL, NULL),
(196, 41, 'Olie', NULL, NULL, NULL),
(197, 41, 'Protein', NULL, NULL, NULL),
(198, 41, 'Kammerjunker', NULL, NULL, NULL),
(199, 42, 'Vand', NULL, NULL, NULL),
(200, 42, 'Saltvand', NULL, NULL, NULL),
(201, 42, 'Sukkervand', NULL, NULL, NULL),
(202, 42, 'Olie', NULL, NULL, NULL),
(203, 42, 'Protein', NULL, NULL, NULL),
(204, 42, 'Kammerjunker', NULL, NULL, NULL),
(205, 43, 'Vand', NULL, NULL, NULL),
(206, 43, 'Saltvand', NULL, NULL, NULL),
(207, 43, 'Sukkervand', NULL, NULL, NULL),
(208, 43, 'Olie', NULL, NULL, NULL),
(209, 43, 'Protein', NULL, NULL, NULL),
(210, 43, 'Kammerjunker', NULL, NULL, NULL),
(211, 44, 'Vand', NULL, NULL, NULL),
(212, 44, 'Saltvand', NULL, NULL, NULL),
(213, 44, 'Sukkervand', NULL, NULL, NULL),
(214, 44, 'Olie', NULL, NULL, NULL),
(215, 44, 'Protein', NULL, NULL, NULL),
(216, 44, 'Kammerjunker', NULL, NULL, NULL),
(217, 45, 'Vand', NULL, NULL, NULL),
(218, 45, 'Saltvand', NULL, NULL, NULL),
(219, 45, 'Sukkervand', NULL, NULL, NULL),
(220, 45, 'Olie', NULL, NULL, NULL),
(221, 45, 'Protein', NULL, NULL, NULL),
(222, 45, 'Kammerjunker', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `eksperiment`
--

CREATE TABLE IF NOT EXISTS `eksperiment` (
  `eksperiment_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `projekt_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `myrejagt_id` varchar(50) NOT NULL,
  `dato` datetime DEFAULT NULL,
  `start_tid` time DEFAULT NULL,
  `slut_tid` time DEFAULT NULL,
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
  `temp` int(11) NOT NULL DEFAULT '0',
  `vejr` varchar(50) DEFAULT NULL,
  `sol` varchar(50) DEFAULT NULL,
  `vind` varchar(50) DEFAULT NULL,
  UNIQUE KEY `eksperiment_id` (`eksperiment_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=46 ;

--
-- Data dump for tabellen `eksperiment`
--

INSERT INTO `eksperiment` (`eksperiment_id`, `created_timestamp`, `projekt_id`, `user_id`, `myrejagt_id`, `dato`, `start_tid`, `slut_tid`, `titel`, `lokalitet`, `lat`, `lng`, `geometryWkt`, `adresse`, `postnr`, `by`, `kommune`, `region`, `temp`, `vejr`, `sol`, `vind`) VALUES
(13, '2016-09-08 04:15:58', 0, 3, 'MJ-003-000-0013', '2016-09-12 22:00:00', '07:09:00', '20:00:00', 'aaa', '', '55.672588', '12.347263', 'POINT(12.347263 55.672588)', 'Capellavænget 13', '2620', 'Albertslund', 'Albertslund', 'Hovedstaden', 0, 'Halvt overskuet', 'Delvis skygge', 'Næsten stille'),
(14, '2016-09-08 08:07:39', 0, 5, 'MJ-005-000-0014', '2016-09-07 22:00:00', '10:07:00', '17:07:00', 'Myrejagt #1', '', '55.606296193620715', '12.386989858719794', 'POINT(12.347263 55.672588)', 'Arken, Skovvej 100', '2635', 'Ishøj', 'Ishøj Kommune', 'Hovedstaden', 0, '0', '0', '0'),
(20, '2016-09-08 14:46:29', 0, 3, 'MJ-003-000-0020', '2016-09-04 22:00:00', '10:59:00', '10:59:00', 'tstest', '', '55.606296193620715', '12.386989858719794', '', 'Arken, Skovvej 100', '2635', 'Ishøj', 'Ishøj Kommune', 'Hovedstaden', 0, '0', '0', '0'),
(21, '2016-09-08 14:46:31', 0, 3, 'MJ-003-000-0021', NULL, NULL, NULL, 'Myrejagt #3', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '0', '0'),
(23, '2016-09-09 13:26:43', 0, 8, 'MJ-008-000-0023', NULL, NULL, NULL, 'Myrejagt #1', '', '55.685755809346645', '12.569500697323031', 'POINT(11.756695 55.373627)', 'Botanisk Have, Gothersgade 153', '1123', 'København K', 'Københavns Kommune', 'Hovedstaden', 0, '0', '0', '0'),
(24, '2016-09-09 13:37:31', 0, 8, 'MJ-008-000-0024', NULL, NULL, NULL, 'Myrejagt #2', '', '55.719584', '9.613463', 'POINT(9.613463 55.719584)', 'Tueager 4', '7120', 'Vejle Øst', 'Vejle', 'Syddanmark', 0, '0', '0', '0'),
(25, '2016-09-10 12:25:50', 0, 3, 'MJ-003-000-0025', '2016-09-05 22:00:00', '19:34:00', '19:34:00', 'Myrejagt #4', '', '55.462861', '9.887868', 'POINT(9.887868 55.462861)', 'Kløvermarken 5', '5580', 'Nørre Aaby', 'Middelfart', 'Syddanmark', 0, '0', '0', '0'),
(26, '2016-09-10 12:28:30', 0, 3, 'MJ-003-000-0026', '2016-09-05 22:00:00', '19:23:00', '19:23:00', 'Myrejagt #5', '', '55.722728', '8.535862', 'POINT(8.535862 55.722728)', 'Habrehøjvej 4', '6800', 'Varde', 'Varde', 'Syddanmark', 0, '0', '0', '0'),
(27, '2016-09-16 09:43:47', 3, 3, 'MJ-003-003-0027', NULL, NULL, NULL, 'Myrejagt #1', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '0', '0'),
(28, '2016-09-19 02:23:15', 1, 1, 'MJ-001-001-0028', '2016-09-19 22:00:00', '07:18:00', '07:18:00', 'Myrejagt #1', '', '55.879053114755536', '9.916243552142987', 'POLYGON((9.91673189587876 55.8790265442345,9.91673189587876 55.8796861331386,9.91746185138027 55.8796861331386,9.91746185138027 55.8790265442345,9.91673189587876 55.8790265442345))', 'Gabelsvej', '8700', 'Horsens', 'Horsens', 'Midtjylland', 0, '0', '0', '0'),
(31, '2016-09-19 15:33:36', 1, 1, 'MJ-001-001-0031', NULL, NULL, NULL, 'Myrejagt #2', '', '55.941082354841825', '9.567870050668716', '', '', '', '', '', '', 0, NULL, NULL, NULL),
(32, '2016-09-21 01:51:12', 0, 3, 'MJ-0003-00-32', NULL, NULL, NULL, 'Myrejagt #6', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(33, '2016-09-21 01:52:35', 0, 3, 'MJ-0003-00-33', NULL, NULL, NULL, 'Myrejagt #7', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(34, '2016-09-21 01:52:48', 0, 3, 'MJ-0003-00-34', NULL, NULL, NULL, 'Myrejagt #8', '', '55.832287', '9.851016', 'POINT(9.851016 55.832287)', 'Jadevej 5', '8700', 'Horsens', 'Horsens', 'Midtjylland', 0, 'Regnvejr', NULL, NULL),
(35, '2016-09-21 02:44:09', 0, 3, 'MJ-0003-00-35', '2016-08-31 22:00:00', '04:44:00', '04:44:00', 'Myrejagt #9', '', '56.1455927293008', '10.183901786294882', 'POLYGON((10.1860690816658 56.1449569767238,10.1860690816658 56.1454431479008,10.1866801325346 56.1454431479008,10.1866801325346 56.1449569767238,10.1860690816658 56.1449569767238))', 'Haderslevgade', '8000', 'Aarhus C', 'Aarhus', 'Midtjylland', 0, NULL, NULL, NULL),
(37, '2016-09-21 04:54:16', 2, 1, 'MJ-0001-02-37', '2016-09-20 22:00:00', '04:01:00', '00:00:00', 'Myrejagt #1', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(38, '2016-09-21 04:59:02', 1, 1, 'MJ-0001-01-38', '2016-09-21 04:59:02', '06:00:00', '11:00:00', 'Myrejagt #3', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(39, '2016-09-21 05:04:36', 3, 1, 'MJ-0001-03-39', '2016-09-21 05:04:37', '07:00:00', '12:00:00', 'Myrejagt #1', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(40, '2016-09-21 05:17:09', 3, 1, 'MJ-0001-03-40', '2016-09-21 05:17:10', '07:00:00', '12:00:00', 'Myrejagt #3', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(41, '2016-09-21 05:17:55', 1, 1, 'MJ-0001-01-41', '2016-09-21 05:17:55', '07:00:00', '12:00:00', 'Myrejagt #4', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(42, '2016-09-21 05:18:09', 7, 1, 'MJ-0001-07-42', '2016-09-21 05:18:09', '07:00:00', '12:00:00', 'Myrejagt #1', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(43, '2016-09-21 05:18:12', 7, 1, 'MJ-0001-07-43', '2016-09-21 05:18:12', '07:00:00', '12:00:00', 'Myrejagt #2', '', '56.227937761402934', '8.736114500934491', 'POLYGON((8.73729759527117 56.2281291083834,8.73729759527117 56.230859560395,8.75001391169931 56.230859560395,8.75001391169931 56.2281291083834,8.73729759527117 56.2281291083834))', 'Gabsvej', '7490', 'Aulum', 'Herning', 'Midtjylland', 0, NULL, NULL, NULL),
(44, '2016-09-21 05:18:20', 6, 1, 'MJ-0001-06-44', '2016-09-21 05:18:20', '07:00:00', '12:00:00', 'Myrejagt #1', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(45, '2016-09-21 05:18:28', 3, 1, 'MJ-0001-03-45', '2016-09-21 05:18:28', '07:00:00', '12:00:00', 'Myrejagt #4', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Data dump for tabellen `projekt`
--

INSERT INTO `projekt` (`projekt_id`, `user_id`, `created_timestamp`, `titel`, `lokalitet`, `geometryWkt`, `lat`, `lng`, `start_tid`, `slut_tid`) VALUES
(1, 1, '2016-08-25 09:17:25', 'test', 'Jammerbugten (Bugt i Skagerrak)', 'POLYGON((501637.63 6335091.6,505604.15 6333496.56,508935.67 6332839.78,511750.33 6332816.15,516833.27 6333516.14,519200.38 6334582.31,522012.98 6334854.75,523810.37 6335502.07,531983.88 6341956.96,537613.02 6350257.36,541168.08 6356483.1,542203.65 6359128.45,543070.64 6359919.37,547678.94 6370778.12,551705.38 6375052.77,553380.56 6377564.9,555872.36 6382650.59,557245.16 6384091.12,557137.03 6384523.26,549438.24 6391024.81,501637.63 6335091.6))', '57.398625857988485', '9.492391808329229', '2016-08-07 22:00:00', NULL),
(2, 1, '2016-08-25 09:24:12', 'dette er en prøve', 'Rønnebak Høje (Gravhøj i Bedsted Thy)', 'MULTIPOINT(468228.58 6296319.54,468263.65 6296278.71)', '56.809480662581244', '8.479935838370825', '2016-07-31 22:00:00', NULL),
(3, 1, '2016-08-25 11:25:32', 'qwerty', 'Åbenrågården (Gård i Galten)', 'POLYGON((558861.97 6227740,558857.46 6227750.25,558838.95 6227742.11,558843.46 6227731.86,558861.97 6227740))', '56.19098812890293', '9.948301332326103', '2016-08-07 22:00:00', NULL),
(4, 1, '2016-08-28 04:31:40', 'hjemme hos david', 'Capellavænget 13, 2620 Albertslund', 'POINT(710479 6174720)', '55.67258628579763', '12.34725721082641', '2016-08-08 22:00:00', NULL),
(5, 1, '2016-08-29 13:02:36', 'test', 'botanisk', NULL, '55.67534706097219', '12.318857903592288', '2016-08-07 22:00:00', NULL),
(6, 1, '2016-08-29 13:11:47', 'azxazxax', 'cap', NULL, '56.80980391650921', '8.476833997992799', '2016-08-07 22:00:00', '2016-08-01 22:00:00'),
(7, 1, '2016-09-08 09:21:17', 'wsfdf', 'Asavej (3700 Rønne)', 'POLYGON((864917.57 6120320.87,864917.57 6120509.23,865346.9 6120509.23,865346.9 6120320.87,864917.57 6120320.87))', '55.09563936032407', '14.724910761793248', '2016-09-05 22:00:00', '2016-09-12 22:00:00');

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
  `image` varchar(100) DEFAULT NULL,
  `institution` varchar(100) DEFAULT NULL,
  `fulde_navn` varchar(100) DEFAULT NULL,
  `adresse` varchar(100) DEFAULT NULL,
  `postnr` varchar(10) DEFAULT NULL,
  `by` varchar(50) DEFAULT NULL,
  `kommune` varchar(50) DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Data dump for tabellen `user`
--

INSERT INTO `user` (`user_id`, `email`, `confirmed`, `brugernavn`, `password`, `role`, `image`, `institution`, `fulde_navn`, `adresse`, `postnr`, `by`, `kommune`, `region`) VALUES
(1, 'test@ku.dk', NULL, '>>udvikler<<', 'test', 0, NULL, 'Askov-Malt Skole (Folkeskole i Vejen)', 'davif konrad', 'Granbakken 8', '3400', 'Hillerød', 'Hillerød', 'Hovedstaden'),
(2, 'dfgdfgdfgdfg', NULL, 'dfgdfg', 'fgfddddfdg', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'a@ku.dk', NULL, 'privat', 'a', 1, NULL, NULL, 'aa', 'asdasd', '', '', 'Albertslund', 'Hovedstaden'),
(4, 's@ku.dk', NULL, 'sss', 'sss', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'n@n.dk', NULL, 'nnn', 'nnn', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'h@h.dk', NULL, 'hhh', 'hhh', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 'o@o.dk', NULL, 'ooo', 'ooo', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 'j@ku.dk', NULL, 'jjj', 'jjj', 1, NULL, NULL, 'xdfzfxdfd', 'Dadelstien 3', '2791', 'Dragør', 'Dragør', 'Hovedstaden');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
