-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Vært: localhost
-- Genereringstid: 10. 10 2016 kl. 11:25:23
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `hash` varchar(20) NOT NULL,
  `is_admin` tinyint(1) DEFAULT NULL,
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Data dump for tabellen `user`
--

INSERT INTO `user` (`user_id`, `hash`, `is_admin`, `email`, `confirmed`, `brugernavn`, `password`, `role`, `image`, `institution`, `fulde_navn`, `adresse`, `postnr`, `by`, `kommune`, `region`) VALUES
(1, '123456789abcbdbefghi', 1, 'admin@ku.dk', 1, 'admin', 'Kelager%666', 1, NULL, NULL, 'admin admin', 'BM', '0000', 'BM', 'BM', 'BM');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
