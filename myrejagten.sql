-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Vært: localhost
-- Genereringstid: 06. 10 2016 kl. 12:38:08
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
  `myrer_indsamlet` float DEFAULT NULL,
  `myrer_frysning` int(11) DEFAULT NULL,
  `madding_stjaalet` tinyint(1) DEFAULT NULL,
  `proeve_modtaget` date DEFAULT NULL,
  `proeve_analyseret` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`data_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=271 ;

--
-- Data dump for tabellen `data`
--

INSERT INTO `data` (`data_id`, `eksperiment_id`, `madding`, `myrer_indsamlet`, `myrer_frysning`, `madding_stjaalet`, `proeve_modtaget`, `proeve_analyseret`) VALUES
(25, 13, 'Vand', 0, 0, 0, NULL, NULL),
(26, 13, 'Saltvand', 0, 0, 0, '0000-00-00', 1),
(27, 13, 'Sukkervand', 0, 0, 0, NULL, NULL),
(28, 13, 'Olie', 0, 0, 0, '2016-10-09', 1),
(29, 13, 'Protein', 0, 0, 0, NULL, NULL),
(30, 13, 'Kammerjunker', 0, 0, 0, '2016-01-09', 1),
(31, 14, 'Vand', 0, 0, NULL, '2016-09-09', 1),
(32, 14, 'Saltvand', 0, 0, NULL, NULL, NULL),
(33, 14, 'Olie', 0, 0, NULL, NULL, NULL),
(34, 14, 'Sukkervand', 0, 0, NULL, NULL, NULL),
(35, 14, 'Protein', 0, 0, NULL, NULL, NULL),
(36, 14, 'Kammerjunker', 0, 0, NULL, '0000-00-00', 1),
(67, 20, 'Vand', 5, 7, 1, NULL, NULL),
(68, 20, 'Saltvand', 5, 7, 1, NULL, 1),
(69, 20, 'Sukkervand', 5, 7, 1, NULL, NULL),
(70, 20, 'Olie', 7, 7, 1, NULL, NULL),
(71, 20, 'Protein', 77, 7, 0, NULL, NULL),
(72, 20, 'Kammerjunker', 77, 7, 0, '0000-00-00', 1),
(73, 21, 'Vand', 0, 0, 0, NULL, 1),
(74, 21, 'Saltvand', 0, 0, 0, NULL, NULL),
(75, 21, 'Sukkervand', 0, 0, 0, NULL, NULL),
(76, 21, 'Olie', 0, 0, 0, NULL, NULL),
(77, 21, 'Protein', 0, 0, 0, NULL, NULL),
(78, 21, 'Kammerjunker', 0, 0, 0, NULL, NULL),
(85, 23, 'Vand', 0, 0, NULL, '0000-00-00', 0),
(86, 23, 'Saltvand', 0, 0, NULL, NULL, 1),
(87, 23, 'Sukkervand', 0, 0, NULL, '0000-00-00', 0),
(88, 23, 'Olie', 0, 0, NULL, NULL, 1),
(89, 23, 'Protein', 0, 0, NULL, '0000-00-00', 0),
(90, 23, 'Kammerjunker', 0, 0, NULL, '0000-00-00', 1),
(91, 24, 'Vand', 0, 0, NULL, '0000-00-00', 0),
(92, 24, 'Saltvand', 0, 0, NULL, '0000-00-00', 0),
(93, 24, 'Sukkervand', 0, 0, NULL, '0000-00-00', 0),
(94, 24, 'Olie', 0, 0, NULL, '0000-00-00', 1),
(95, 24, 'Protein', 0, 0, NULL, NULL, 0),
(96, 24, 'Kammerjunker', 0, 0, NULL, '0000-00-00', 1),
(97, 25, 'Vand', 0, 0, 0, NULL, 1),
(98, 25, 'Saltvand', 0, 0, 0, NULL, NULL),
(99, 25, 'Sukkervand', 0, 0, 0, NULL, NULL),
(100, 25, 'Olie', 0, 0, 0, NULL, NULL),
(101, 25, 'Protein', 0, 0, 0, NULL, NULL),
(102, 25, 'Kammerjunker', 0, 0, 0, NULL, NULL),
(103, 26, 'Vand', 1, 1, 0, NULL, NULL),
(104, 26, 'Saltvand', 67, 1, 1, NULL, NULL),
(105, 26, 'Sukkervand', 1, 1, 1, NULL, NULL),
(106, 26, 'Olie', 1, 1, 1, NULL, NULL),
(107, 26, 'Protein', 1, 1, 0, NULL, NULL),
(108, 26, 'Kammerjunker', 1, 1, 0, NULL, NULL),
(109, 27, 'Vand', 0, 0, NULL, NULL, NULL),
(110, 27, 'Protein', 0, 0, NULL, NULL, NULL),
(111, 27, 'Olie', 0, 0, NULL, NULL, NULL),
(112, 27, 'Kammerjunker', 0, 0, NULL, NULL, NULL),
(113, 27, 'Saltvand', 0, 0, NULL, NULL, NULL),
(114, 27, 'Sukkervand', 0, 0, NULL, NULL, NULL),
(115, 28, 'Vand', 45, 45, 0, NULL, NULL),
(116, 28, 'Sukkervand', 45, 45, 1, NULL, NULL),
(117, 28, 'Protein', 5, 45, 1, NULL, NULL),
(118, 28, 'Olie', 0, 0, 1, NULL, NULL),
(119, 28, 'Saltvand', 0, 0, 0, NULL, NULL),
(120, 28, 'Kammerjunker', 0, 0, 0, NULL, NULL),
(133, 31, 'Vand', 0, 4545, 0, NULL, NULL),
(134, 31, 'Sukkervand', 45, 0, 0, NULL, NULL),
(135, 31, 'Protein', 0, 0, 0, NULL, NULL),
(136, 31, 'Olie', 0, 4545, 0, NULL, NULL),
(137, 31, 'Kammerjunker', 545, 45, 0, NULL, NULL),
(138, 31, 'Saltvand', 4545, 454, 0, NULL, NULL),
(139, 32, 'Vand', 4, 4, 1, NULL, NULL),
(140, 32, 'Saltvand', 4, 4, 1, NULL, NULL),
(141, 32, 'Sukkervand', 234, 434, 1, NULL, NULL),
(142, 32, 'Olie', 0, 0, 0, NULL, NULL),
(143, 32, 'Protein', 0, 0, 0, NULL, NULL),
(144, 32, 'Kammerjunker', 0, 0, 0, NULL, NULL),
(145, 33, 'Vand', 45, 12, 1, NULL, NULL),
(146, 33, 'Saltvand', 45, 12, 1, NULL, NULL),
(147, 33, 'Sukkervand', 45, 12, 1, NULL, NULL),
(148, 33, 'Olie', 1, 0, 0, NULL, NULL),
(149, 33, 'Protein', 1, 1, 0, NULL, NULL),
(150, 33, 'Kammerjunker', 1, 1, 0, NULL, NULL),
(151, 34, 'Vand', 0, 0, 0, '0000-00-00', 1),
(152, 34, 'Saltvand', 0, 0, 0, NULL, NULL),
(153, 34, 'Sukkervand', 0, 0, 0, NULL, NULL),
(154, 34, 'Olie', 0, 0, 0, NULL, NULL),
(155, 34, 'Protein', 0, 0, 0, NULL, NULL),
(156, 34, 'Kammerjunker', 0, 0, 0, '0000-00-00', 1),
(157, 35, 'Vand', 77, 6, 0, NULL, NULL),
(158, 35, 'Saltvand', 77, 7, 0, NULL, NULL),
(159, 35, 'Sukkervand', NULL, 57, 0, NULL, NULL),
(160, 35, 'Olie', 5, 567, 0, NULL, NULL),
(161, 35, 'Protein', NULL, NULL, 0, NULL, NULL),
(162, 35, 'Kammerjunker', NULL, NULL, 0, NULL, NULL),
(169, 37, 'Vand', NULL, NULL, 0, NULL, NULL),
(170, 37, 'Saltvand', NULL, NULL, 0, NULL, NULL),
(171, 37, 'Sukkervand', NULL, NULL, 0, NULL, NULL),
(172, 37, 'Olie', 54, 54, 0, '0000-00-00', 0),
(173, 37, 'Protein', 54, 54, 1, NULL, NULL),
(174, 37, 'Kammerjunker', 54, 54, 1, NULL, NULL),
(175, 38, 'Vand', NULL, NULL, 0, '0000-00-00', 1),
(176, 38, 'Saltvand', 545, 45, 1, '0000-00-00', 1),
(177, 38, 'Sukkervand', 45, 45, 1, '0000-00-00', 0),
(178, 38, 'Olie', NULL, NULL, 0, '0000-00-00', 1),
(179, 38, 'Protein', NULL, NULL, 0, '0000-00-00', 1),
(180, 38, 'Kammerjunker', NULL, NULL, 0, '0000-00-00', 0),
(181, 39, 'Vand', 34, 345, 1, NULL, NULL),
(182, 39, 'Saltvand', 34, 55, 1, NULL, NULL),
(183, 39, 'Sukkervand', 34, 55, 1, NULL, NULL),
(184, 39, 'Olie', NULL, NULL, 0, NULL, NULL),
(185, 39, 'Protein', NULL, NULL, 0, NULL, NULL),
(186, 39, 'Kammerjunker', NULL, NULL, 0, NULL, NULL),
(187, 40, 'Vand', NULL, NULL, NULL, NULL, NULL),
(188, 40, 'Saltvand', NULL, NULL, NULL, NULL, NULL),
(189, 40, 'Sukkervand', NULL, NULL, NULL, NULL, NULL),
(190, 40, 'Olie', NULL, NULL, NULL, NULL, NULL),
(191, 40, 'Protein', NULL, NULL, NULL, NULL, NULL),
(192, 40, 'Kammerjunker', NULL, NULL, NULL, NULL, NULL),
(193, 41, 'Vand', NULL, NULL, NULL, NULL, NULL),
(194, 41, 'Saltvand', NULL, NULL, NULL, '0000-00-00', 1),
(195, 41, 'Sukkervand', NULL, NULL, NULL, NULL, NULL),
(196, 41, 'Olie', NULL, NULL, NULL, NULL, NULL),
(197, 41, 'Protein', NULL, NULL, NULL, NULL, NULL),
(198, 41, 'Kammerjunker', NULL, NULL, NULL, NULL, NULL),
(199, 42, 'Vand', NULL, NULL, NULL, NULL, NULL),
(200, 42, 'Saltvand', NULL, NULL, NULL, NULL, NULL),
(201, 42, 'Sukkervand', NULL, NULL, NULL, NULL, NULL),
(202, 42, 'Olie', NULL, NULL, NULL, NULL, NULL),
(203, 42, 'Protein', NULL, NULL, NULL, NULL, NULL),
(204, 42, 'Kammerjunker', NULL, NULL, NULL, NULL, NULL),
(205, 43, 'Vand', 34, 4, 1, NULL, NULL),
(206, 43, 'Saltvand', 34, 4, 1, NULL, NULL),
(207, 43, 'Sukkervand', 34, 4, 1, NULL, NULL),
(208, 43, 'Olie', NULL, NULL, 0, NULL, NULL),
(209, 43, 'Protein', NULL, NULL, 0, NULL, NULL),
(210, 43, 'Kammerjunker', NULL, NULL, 0, NULL, NULL),
(211, 44, 'Vand', NULL, NULL, NULL, NULL, NULL),
(212, 44, 'Saltvand', NULL, NULL, NULL, NULL, NULL),
(213, 44, 'Sukkervand', NULL, NULL, NULL, NULL, NULL),
(214, 44, 'Olie', NULL, NULL, NULL, NULL, NULL),
(215, 44, 'Protein', NULL, NULL, NULL, NULL, NULL),
(216, 44, 'Kammerjunker', NULL, NULL, NULL, NULL, NULL),
(217, 45, 'Vand', NULL, NULL, NULL, NULL, NULL),
(218, 45, 'Saltvand', NULL, NULL, NULL, NULL, NULL),
(219, 45, 'Sukkervand', NULL, NULL, NULL, NULL, NULL),
(220, 45, 'Olie', NULL, NULL, NULL, NULL, NULL),
(221, 45, 'Protein', NULL, NULL, NULL, NULL, NULL),
(222, 45, 'Kammerjunker', NULL, NULL, NULL, NULL, NULL),
(223, 46, 'Vand', 67, 0, 1, NULL, NULL),
(224, 46, 'Saltvand', 67, 0, 1, NULL, NULL),
(225, 46, 'Sukkervand', 0, 0, 0, NULL, NULL),
(226, 46, 'Olie', 0, 0, 0, NULL, NULL),
(227, 46, 'Protein', 0, 0, 1, NULL, NULL),
(228, 46, 'Kammerjunker', 0, 0, 1, NULL, NULL),
(229, 47, 'Vand', 23424, 67, 1, NULL, NULL),
(230, 47, 'Saltvand', 56, 43, 1, NULL, NULL),
(231, 47, 'Sukkervand', 56, 7, 1, NULL, NULL),
(232, 47, 'Olie', 0, 7, 0, NULL, NULL),
(233, 47, 'Protein', 56, 56, 1, NULL, NULL),
(234, 47, 'Kammerjunker', 1, 1, 1, NULL, NULL),
(235, 48, 'Vand', NULL, NULL, NULL, NULL, NULL),
(236, 48, 'Saltvand', NULL, NULL, NULL, NULL, NULL),
(237, 48, 'Sukkervand', NULL, NULL, NULL, NULL, NULL),
(238, 48, 'Olie', NULL, NULL, NULL, NULL, NULL),
(239, 48, 'Protein', NULL, NULL, NULL, NULL, NULL),
(240, 48, 'Kammerjunker', NULL, NULL, NULL, NULL, NULL),
(241, 49, 'Vand', 34, 34, 1, NULL, NULL),
(242, 49, 'Saltvand', 34, 34, 1, NULL, NULL),
(243, 49, 'Olie', 34, 34, 1, NULL, NULL),
(244, 49, 'Sukkervand', NULL, NULL, 0, NULL, NULL),
(245, 49, 'Protein', NULL, NULL, 0, NULL, NULL),
(246, 49, 'Kammerjunker', NULL, NULL, 0, NULL, NULL),
(247, 50, 'Vand', NULL, NULL, NULL, NULL, NULL),
(248, 50, 'Saltvand', NULL, NULL, NULL, NULL, NULL),
(249, 50, 'Sukkervand', NULL, NULL, NULL, NULL, NULL),
(250, 50, 'Olie', NULL, NULL, NULL, NULL, NULL),
(251, 50, 'Protein', NULL, NULL, NULL, NULL, NULL),
(252, 50, 'Kammerjunker', NULL, NULL, NULL, NULL, NULL),
(253, 51, 'Vand', NULL, NULL, NULL, NULL, NULL),
(254, 51, 'Saltvand', NULL, NULL, NULL, NULL, NULL),
(255, 51, 'Sukkervand', NULL, NULL, NULL, NULL, NULL),
(256, 51, 'Olie', NULL, NULL, NULL, NULL, NULL),
(257, 51, 'Protein', NULL, NULL, NULL, NULL, NULL),
(258, 51, 'Kammerjunker', NULL, NULL, NULL, NULL, NULL),
(259, 52, 'Vand', NULL, NULL, NULL, NULL, NULL),
(260, 52, 'Saltvand', NULL, NULL, NULL, NULL, NULL),
(261, 52, 'Olie', NULL, NULL, NULL, NULL, NULL),
(262, 52, 'Sukkervand', NULL, NULL, NULL, NULL, NULL),
(263, 52, 'Protein', NULL, NULL, NULL, NULL, NULL),
(264, 52, 'Kammerjunker', NULL, NULL, NULL, NULL, NULL),
(265, 53, 'Vand', 1, NULL, 0, NULL, NULL),
(266, 53, 'Sukkervand', 2, NULL, 0, NULL, NULL),
(267, 53, 'Saltvand', 1.89, NULL, 0, NULL, NULL),
(268, 53, 'Olie', NULL, NULL, 0, NULL, NULL),
(269, 53, 'Protein', NULL, NULL, 0, NULL, NULL),
(270, 53, 'Kammerjunker', NULL, NULL, 0, NULL, NULL);

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
  `upload_billede` varchar(255) DEFAULT NULL,
  `upload_video` varchar(255) DEFAULT NULL,
  `temp` int(11) DEFAULT NULL,
  `vejr` varchar(50) DEFAULT NULL,
  `sol` varchar(50) DEFAULT NULL,
  `vind` varchar(50) DEFAULT NULL,
  `kommentar` text,
  UNIQUE KEY `eksperiment_id` (`eksperiment_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=54 ;

--
-- Data dump for tabellen `eksperiment`
--

INSERT INTO `eksperiment` (`eksperiment_id`, `created_timestamp`, `projekt_id`, `user_id`, `myrejagt_id`, `dato`, `start_tid`, `slut_tid`, `titel`, `lokalitet`, `lat`, `lng`, `geometryWkt`, `adresse`, `postnr`, `by`, `kommune`, `region`, `upload_billede`, `upload_video`, `temp`, `vejr`, `sol`, `vind`, `kommentar`) VALUES
(13, '2016-09-08 04:15:58', 0, 3, 'MJ-003-000-0013', '2016-09-12 22:00:00', '07:09:00', '20:00:00', 'aaa', '', '55.672588', '12.347263', 'POINT(12.347263 55.672588)', 'Capellavænget 13', '2620', 'Albertslund', 'Albertslund', 'Hovedstaden', NULL, NULL, 4, 'Halvt overskuet', 'Delvis skygge', 'Næsten stille', NULL),
(14, '2016-09-08 08:07:39', 0, 5, 'MJ-005-000-0014', '2016-09-07 22:00:00', '10:07:00', '17:07:00', 'Myrejagt #1', '', '55.606296193620715', '12.386989858719794', 'POINT(12.347263 55.672588)', 'Arken, Skovvej 100', '2635', 'Ishøj', 'Ishøj Kommune', 'Hovedstaden', NULL, NULL, 0, '0', '0', '0', NULL),
(20, '2016-09-08 14:46:29', 0, 3, 'MJ-003-000-0020', '2016-09-04 22:00:00', '10:59:00', '10:59:00', 'tstest', '', '55.606296193620715', '12.386989858719794', '', 'Arken, Skovvej 100', '2635', 'Ishøj', 'Ishøj Kommune', 'Hovedstaden', NULL, NULL, 0, 'solskin', 'Skygge', 'Frisk vind', NULL),
(21, '2016-09-08 14:46:31', 0, 3, 'MJ-003-000-0021', '2016-09-12 22:00:00', '09:58:00', '09:58:00', 'Myrejagt #3', '', '55.17442390366061', '10.693740843707928', 'POINT(10.693671 55.174528)', 'Galdbjergvej 12', '5884', 'Gudme', 'Svendborg', 'Syddanmark', NULL, NULL, 21, 'Fuldt overskyet', 'Skygge', 'Jævn vind', NULL),
(23, '2016-09-09 13:26:43', 0, 8, 'MJ-008-000-0023', NULL, NULL, NULL, 'Myrejagt #1', '', '55.685755809346645', '12.569500697323031', 'POINT(11.756695 55.373627)', 'Botanisk Have, Gothersgade 153', '1123', 'København K', 'Københavns Kommune', 'Hovedstaden', NULL, NULL, 0, '0', '0', '0', NULL),
(24, '2016-09-09 13:37:31', 0, 8, 'MJ-008-000-0024', NULL, NULL, NULL, 'Myrejagt #2', '', '55.719584', '9.613463', 'POINT(9.613463 55.719584)', 'Tueager 4', '7120', 'Vejle Øst', 'Vejle', 'Syddanmark', NULL, NULL, 0, '0', '0', '0', NULL),
(25, '2016-09-10 12:25:50', 0, 3, 'MJ-003-000-0025', '2016-09-05 22:00:00', '19:34:00', '19:34:00', 'Myrejagt #4', '', '55.462861', '9.887868', 'POINT(9.887868 55.462861)', 'Kløvermarken 5', '5580', 'Nørre Aaby', 'Middelfart', 'Syddanmark', NULL, NULL, 0, 'Halvt overskuet', 'Skygge', 'Frisk vind', NULL),
(26, '2016-09-10 12:28:30', 0, 3, 'MJ-003-000-0026', '2016-09-05 22:00:00', '19:23:00', '19:23:00', 'QWERTY', '', '55.722728', '8.535862', 'POINT(8.535862 55.722728)', 'Habrehøjvej 4', '6800', 'Varde', 'Varde', 'Syddanmark', NULL, NULL, 13, 'Fuldt overskyet', 'Skygge', 'Frisk vind', NULL),
(27, '2016-09-16 09:43:47', 3, 3, 'MJ-003-003-0027', NULL, NULL, NULL, 'Myrejagt #1', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '0', '0', NULL),
(28, '2016-09-19 02:23:15', 1, 1, 'MJ-001-001-0028', '2016-09-19 22:00:00', '07:18:00', '07:18:00', 'Myrejagt #1', '', '55.879053114755536', '9.916243552142987', 'POLYGON((9.91673189587876 55.8790265442345,9.91673189587876 55.8796861331386,9.91746185138027 55.8796861331386,9.91746185138027 55.8790265442345,9.91673189587876 55.8790265442345))', 'Gabelsvej', '8700', 'Horsens', 'Horsens', 'Midtjylland', '/uploads/5077850d65fa7275f9eac45a136b7471.png', NULL, 0, 'Halvt overskuet', 'Skygge', 'Næsten stille', NULL),
(31, '2016-09-19 15:33:36', 1, 1, 'MJ-001-001-0031', '2016-09-19 22:00:00', '05:27:00', '05:27:00', 'Myrejagt #2', '', '55.941082354841825', '9.567870050668716', '', '', '', '', '', '', NULL, NULL, 13, 'Regnvejr', 'Andet', 'Let vind', NULL),
(32, '2016-09-21 01:51:12', 0, 3, 'MJ-0003-00-32', '2016-09-20 22:00:00', '05:14:00', '05:14:00', 'Myrejagt #6', '', '54.97612098245033', '9.55137729542912', 'POINT(9.551082 54.975904)', 'Gadekær 4', '6200', 'Aabenraa', 'Aabenraa', 'Syddanmark', '/uploads/2c9003e511f68855d73d697acf9c67ff.png', NULL, 23, 'Halvt overskuet', 'Delvis skygge', 'Næsten stille', NULL),
(33, '2016-09-21 01:52:35', 0, 3, 'MJ-0003-00-33', '2016-09-04 22:00:00', '09:50:00', '09:50:00', 'min egen myrejagt', '', '55.685372759010384', '12.571544646198163', 'POINT(12.570956 55.685126)', 'Gothersgade 141', '1123', 'København K', 'København', 'Hovedstaden', NULL, NULL, 13, 'Halvt overskuet', 'Skygge', 'Let vind', NULL),
(34, '2016-09-21 01:52:48', 0, 3, 'MJ-0003-00-34', NULL, NULL, NULL, 'Myrejagt #8', '', '55.832287', '9.851016', 'POINT(9.851016 55.832287)', 'Jadevej 5', '8700', 'Horsens', 'Horsens', 'Midtjylland', NULL, NULL, 0, 'Regnvejr', NULL, NULL, NULL),
(35, '2016-09-21 02:44:09', 0, 3, 'MJ-0003-00-35', '2016-08-31 22:00:00', '04:44:00', '04:44:00', 'I en ukendt baggård', '', '56.1455927293008', '10.183901786294882', 'POLYGON((10.1860690816658 56.1449569767238,10.1860690816658 56.1454431479008,10.1866801325346 56.1454431479008,10.1866801325346 56.1449569767238,10.1860690816658 56.1449569767238))', 'Haderslevgade', '8000', 'Aarhus C', 'Aarhus', 'Midtjylland', '/uploads/8db5503929fa9626a87f0157c2a6522f.png', NULL, 9, 'Fuldt overskyet', 'Skygge', 'Let vind', NULL),
(37, '2016-09-21 04:54:16', 2, 1, 'MJ-0001-02-37', '2016-09-20 22:00:00', '04:01:00', '00:00:00', 'Myrejagt #1', '', '55.672567124509705', '12.347311972553143', 'POINT(12.347263 55.672588)', 'Capellavænget 13', '2620', 'Albertslund', 'Albertslund', 'Hovedstaden', NULL, NULL, 13, 'Halvt overskuet', 'Delvis skygge', 'Frisk vind', NULL),
(38, '2016-09-21 04:59:02', 1, 1, 'MJ-0001-01-38', '2016-09-21 04:59:02', '06:00:00', '11:00:00', 'Myrejagt #3', '', '55.49186940533177', '12.18635797398747', 'POINT(12.187077 55.491867)', 'Rønnevej 16', '4600', 'Køge', 'Køge', 'Sjælland', NULL, NULL, 11, 'Halvt overskuet', 'Andet', 'Let vind', NULL),
(39, '2016-09-21 05:04:36', 3, 1, 'MJ-0001-03-39', '2016-09-21 05:04:37', '07:00:00', '12:00:00', 'Myrejagt #1', '', '56.53309624177439', '10.030248164111981', 'POINT(10.029907 56.532959)', 'Mads Egelundsvej 12', '8981', 'Spentrup', 'Randers', 'Midtjylland', '/uploads/7af81c66b2f2594aa3b3520e3731c599.png', NULL, 33, 'Andet', 'Skygge', 'Svag vind', NULL),
(40, '2016-09-21 05:17:09', 3, 1, 'MJ-0001-03-40', '2016-09-21 05:17:10', '07:00:00', '12:00:00', 'Myrejagt #3', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL),
(41, '2016-09-21 05:17:55', 1, 1, 'MJ-0001-01-41', '2016-09-21 05:17:55', '07:00:00', '12:00:00', 'Myrejagt #4', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL),
(42, '2016-09-21 05:18:09', 7, 1, 'MJ-0001-07-42', '2016-09-20 22:00:00', '07:00:00', '12:00:00', 'Tur til Frederikshavn', '', '57.45045810373033', '10.533323286945233', 'POINT(10.533074 57.450363)', 'Gl. Skagensvej 25C', '9900', 'Frederikshavn', 'Frederikshavn', 'Nordjylland', NULL, NULL, 0, NULL, NULL, NULL, NULL),
(43, '2016-09-21 05:18:12', 7, 1, 'MJ-0001-07-43', '2016-09-21 05:18:12', '07:00:00', '12:00:00', 'Myrejagt #2', '', '56.227937761402934', '8.736114500934491', 'POLYGON((8.73729759527117 56.2281291083834,8.73729759527117 56.230859560395,8.75001391169931 56.230859560395,8.75001391169931 56.2281291083834,8.73729759527117 56.2281291083834))', 'Gabsvej', '7490', 'Aulum', 'Herning', 'Midtjylland', NULL, NULL, 0, 'Halvt overskuet', 'Delvis skygge', 'Hård kuling', NULL),
(44, '2016-09-21 05:18:20', 6, 1, 'MJ-0001-06-44', '2016-09-21 05:18:20', '07:00:00', '12:00:00', 'Myrejagt #1', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL),
(45, '2016-09-21 05:18:28', 3, 1, 'MJ-0001-03-45', '2016-09-21 05:18:28', '07:00:00', '12:00:00', 'Myrejagt #4', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL),
(46, '2016-09-21 12:13:52', 0, 3, 'MJ-0003-00-46', '2016-09-21 12:13:52', '14:00:00', '19:00:00', 'Myrejagt #13', '', '55.672565864169954', '12.347118853504071', 'POINT(12.347263 55.672588)', 'Capellavænget 13', '2620', 'Albertslund', 'Albertslund', 'Hovedstaden', '/uploads/bb2f372f7d42fd45a840ea1ae6109796.png', NULL, 0, 'Halvt overskuet', 'Skygge', 'Frisk vind', NULL),
(47, '2016-09-21 12:17:36', 0, 3, 'MJ-0003-00-47', '2016-09-21 12:17:36', '14:00:00', '19:00:00', 'Myrejagt #14', '', '55.6883241893679', '11.94989442723454', 'POINT(11.949973 55.688456)', 'Granbakken 3', '4070', 'Kirke Hyllinge', 'Lejre', 'Sjælland', '/uploads/7d0397c1bf64b05cb8252464f0f7f6ed.png', NULL, 18, 'Halvt overskuet', 'Skygge', 'Let vind', NULL),
(48, '2016-09-21 12:37:41', 2, 1, 'MJ-0001-02-48', '2016-09-21 12:37:41', '14:00:00', '19:00:00', 'Myrejagt #2', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL),
(49, '2016-09-21 16:55:09', 3, 1, 'MJ-0001-03-49', '2016-09-21 16:55:10', '18:00:00', '23:00:00', 'Myrejagt #5', '', '55.78264279505222', '12.163784502918134', 'POINT(12.164755 55.782451)', 'Jadevej 32', '3650', 'Ølstykke', 'Egedal', 'Hovedstaden', NULL, NULL, 0, 'Regnvejr', 'Delvis skygge', 'Jævn vind', NULL),
(50, '2016-09-21 18:35:46', 1, 1, 'MJ-0001-01-50', '2016-09-21 18:35:46', '20:00:00', '25:00:00', 'Myrejagt #5', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL),
(51, '2016-09-21 18:35:51', 1, 1, 'MJ-0001-01-51', '2016-09-21 18:35:51', '20:00:00', '25:00:00', 'Myrejagt #6', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 'uploads/9cfa924ceebc2fd977aa71dc2ad88bdc.png', NULL, 0, NULL, NULL, NULL, NULL),
(52, '2016-10-03 15:31:12', 0, 3, 'MJ-0003-00-52', '2016-10-03 15:31:12', '17:00:00', '22:00:00', 'Myrejagt #15', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL),
(53, '2016-10-03 15:35:46', 0, 3, 'MJ-0003-00-53', '2016-10-03 15:35:46', '17:00:00', '22:00:00', 'Myrejagt #16', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

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
(7, 1, '2016-09-08 09:21:17', 'wsfdf', 'Asavej (3700 Rønne)', 'POLYGON((864917.57 6120320.87,864917.57 6120509.23,865346.9 6120509.23,865346.9 6120320.87,864917.57 6120320.87))', '55.09563936032407', '14.724910761793248', '2016-09-05 22:00:00', '2016-09-12 22:00:00'),
(8, 0, '2016-09-30 03:44:22', 'sdfsdf', 'Rønnebjerg (Bakke i Faaborg)', 'POLYGON((589168.05 6108103.1,589169.85 6108096.24,589178.59 6108093.16,589193.8 6108094.39,589208.31 6108100.34,589220.95 6108108.96,589228.55 6108117.62,589236 6108126.82,589236.55 6108138.45,589234.24 6108147.6,589225.95 6108151.5,589218.55 6108148.12,589206.32 6108141.94,589198.19 6108136.65,589185.4 6108128.44,589175.35 6108120.14,589169.24 6108112.86,589168.05 6108103.1))', '55.111771292921546', '10.398408911808637', '2016-09-05 22:00:00', '2016-09-06 22:00:00'),
(9, 0, '2016-09-30 03:44:30', 'sdfsdf', 'Rønnebjerg (Bakke i Faaborg)', 'POLYGON((589168.05 6108103.1,589169.85 6108096.24,589178.59 6108093.16,589193.8 6108094.39,589208.31 6108100.34,589220.95 6108108.96,589228.55 6108117.62,589236 6108126.82,589236.55 6108138.45,589234.24 6108147.6,589225.95 6108151.5,589218.55 6108148.12,589206.32 6108141.94,589198.19 6108136.65,589185.4 6108128.44,589175.35 6108120.14,589169.24 6108112.86,589168.05 6108103.1))', '55.111771292921546', '10.398408911808637', '2016-09-05 22:00:00', '2016-09-06 22:00:00'),
(10, 0, '2016-09-30 03:44:31', 'sdfsdf', 'Rønnebjerg (Bakke i Faaborg)', 'POLYGON((589168.05 6108103.1,589169.85 6108096.24,589178.59 6108093.16,589193.8 6108094.39,589208.31 6108100.34,589220.95 6108108.96,589228.55 6108117.62,589236 6108126.82,589236.55 6108138.45,589234.24 6108147.6,589225.95 6108151.5,589218.55 6108148.12,589206.32 6108141.94,589198.19 6108136.65,589185.4 6108128.44,589175.35 6108120.14,589169.24 6108112.86,589168.05 6108103.1))', '55.111771292921546', '10.398408911808637', '2016-09-05 22:00:00', '2016-09-06 22:00:00'),
(11, 0, '2016-09-30 03:44:31', 'sdfsdf', 'Rønnebjerg (Bakke i Faaborg)', 'POLYGON((589168.05 6108103.1,589169.85 6108096.24,589178.59 6108093.16,589193.8 6108094.39,589208.31 6108100.34,589220.95 6108108.96,589228.55 6108117.62,589236 6108126.82,589236.55 6108138.45,589234.24 6108147.6,589225.95 6108151.5,589218.55 6108148.12,589206.32 6108141.94,589198.19 6108136.65,589185.4 6108128.44,589175.35 6108120.14,589169.24 6108112.86,589168.05 6108103.1))', '55.111771292921546', '10.398408911808637', '2016-09-05 22:00:00', '2016-09-06 22:00:00'),
(12, 0, '2016-09-30 03:44:32', 'sdfsdf', 'Rønnebjerg (Bakke i Faaborg)', 'POLYGON((589168.05 6108103.1,589169.85 6108096.24,589178.59 6108093.16,589193.8 6108094.39,589208.31 6108100.34,589220.95 6108108.96,589228.55 6108117.62,589236 6108126.82,589236.55 6108138.45,589234.24 6108147.6,589225.95 6108151.5,589218.55 6108148.12,589206.32 6108141.94,589198.19 6108136.65,589185.4 6108128.44,589175.35 6108120.14,589169.24 6108112.86,589168.05 6108103.1))', '55.111771292921546', '10.398408911808637', '2016-09-05 22:00:00', '2016-09-06 22:00:00');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `resultat`
--

CREATE TABLE IF NOT EXISTS `resultat` (
  `resultat_id` int(11) NOT NULL AUTO_INCREMENT,
  `data_id` int(11) NOT NULL,
  `antal` int(11) NOT NULL,
  `navn_videnskabeligt` varchar(50) DEFAULT NULL,
  `navn_dk` varchar(50) DEFAULT NULL,
  `genus` varchar(50) NOT NULL,
  `specie` varchar(50) NOT NULL,
  `kommentar` text,
  UNIQUE KEY `resultat_id` (`resultat_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=32 ;

--
-- Data dump for tabellen `resultat`
--

INSERT INTO `resultat` (`resultat_id`, `data_id`, `antal`, `navn_videnskabeligt`, `navn_dk`, `genus`, `specie`, `kommentar`) VALUES
(1, 176, 0, 'andreas', 'kelager', '', '', NULL),
(2, 176, 0, 'wasd', NULL, '', '', NULL),
(4, 176, 0, NULL, NULL, '', '', NULL),
(8, 178, 0, NULL, NULL, '', '', NULL),
(9, 179, 0, NULL, NULL, '', '', NULL),
(11, 177, 56, 'Sagartiogeton viduatus', 'Myrenymfetæge', '', '', 'ertert'),
(13, 153, 0, 'Fallopia dumetorum', NULL, '', '', NULL),
(14, 175, 0, 'Gammarus duebeni', NULL, '', '', NULL),
(15, 112, 0, NULL, 'Sandhyttespinder', '', '', NULL),
(16, 30, 0, NULL, 'Herkulesmyre', '', '', NULL),
(17, 90, 0, NULL, 'Garver', '', '', NULL),
(18, 86, 0, NULL, NULL, '', '', NULL),
(19, 86, 0, NULL, NULL, '', '', NULL),
(20, 178, 0, NULL, NULL, '', '', NULL),
(21, 161, 0, NULL, NULL, '', '', NULL),
(22, 161, 0, NULL, NULL, '', '', NULL),
(23, 27, 0, NULL, NULL, '', '', NULL),
(24, 27, 0, NULL, NULL, '', '', NULL),
(25, 96, 0, NULL, NULL, '', '', NULL),
(26, 265, 0, NULL, NULL, '', '', NULL),
(27, 265, 0, NULL, NULL, '', '', NULL),
(28, 26, 0, NULL, 'Grå klitmyre', '', '', NULL),
(29, 31, 0, 'Formica cinerea', 'Parasitbarkmyre', '', '', NULL),
(30, 28, 0, 'Formica cunicularia', 'Nordlig skovmyre', '', '', NULL),
(31, 36, 0, 'Formica cunicularia', NULL, '', '', NULL);

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
(3, 'a@ku.dk', NULL, 'ssssssssssss', 'a', 1, NULL, NULL, 'aa', 'asdasd', '', '', 'Albertslund', 'Hovedstaden'),
(4, 's@ku.dk', NULL, 'sss', 'sss', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'n@n.dk', NULL, 'nnn', 'nnn', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'h@h.dk', NULL, 'hhh', 'hhh', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 'o@o.dk', NULL, 'ooo', 'ooo', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 'j@ku.dk', NULL, 'jjj', 'jjj', 1, NULL, NULL, 'xdfzfxdfd', 'Dadelstien 3', '2791', 'Dragør', 'Dragør', 'Hovedstaden');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
