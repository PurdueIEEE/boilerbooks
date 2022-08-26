SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- Create Database
CREATE DATABASE IF NOT EXISTS `ieee-money-test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `ieee-money-test`;

-- Setup the tables
CREATE TABLE `approval` (
  `approvalID` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL,
  `committee` enum('General IEEE','Aerial Robotics','Computer Society','EMBS','MTT-S','Orbital','Professional','Learning','Racing','ROV','Social','SOGA','GE') NOT NULL,
  `amount` float NOT NULL,
  `category` varchar(255) NOT NULL,
  `privilege_level` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Budget` (
  `budgetid` int(11) NOT NULL,
  `category` varchar(250) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `committee` enum('General IEEE','Aerial Robotics','Computer Society','EMBS','MTT-S','Orbital','Professional','Learning','Racing','ROV','Social','SOGA','GE') NOT NULL,
  `fiscal_year` int(10) UNSIGNED NOT NULL,
  `status` enum('Submitted','Approved') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Dues` (
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `id_hash` varchar(512) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `duesid` int(11) NOT NULL,
  `committee` varchar(255) NOT NULL,
  `fiscal_year` int(10) UNSIGNED NOT NULL,
  `amount` float NOT NULL,
  `status` enum('Paid', 'Unpaid', 'Exempt') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `fiscal_year` (
  `fyid` INT(10) NOT NULL,
  `fiscal_year` CHAR(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Income` (
  `incomeid` int(11) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `source` varchar(250) NOT NULL,
  `type` enum('BOSO','Cash','Discount','SOGA') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `item` varchar(250) NOT NULL,
  `status` enum('Received','Expected','Unreceived') NOT NULL,
  `comments` varchar(10000) DEFAULT NULL,
  `committee` enum('General IEEE','Aerial Robotics','Computer Society','EMBS','MTT-S','Orbital','Professional','Learning','Racing','ROV','Social','SOGA','GE') NOT NULL,
  `addedby` varchar(100) NOT NULL,
  `fiscal_year` int(10) UNSIGNED NOT NULL,
  `refnumber` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Purchases` (
  `purchaseID` int(11) NOT NULL,
  `modifydate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `username` varchar(50) NOT NULL,
  `purchasedate` timestamp NULL DEFAULT NULL,
  `item` varchar(500) NOT NULL,
  `purchasereason` varchar(500) NOT NULL,
  `vendor` varchar(200) NOT NULL,
  `committee` enum('General IEEE','Aerial Robotics','Computer Society','EMBS','MTT-S','Orbital','Professional','Learning','Racing','ROV','Social','SOGA','GE') NOT NULL,
  `category` varchar(250) NOT NULL,
  `receipt` varchar(500) DEFAULT NULL,
  `cost` decimal(10,2) NOT NULL,
  `status` enum('Requested','Approved','Denied','Purchased','Processing Reimbursement','Reimbursed','Expired') NOT NULL,
  `approvedby` varchar(50) DEFAULT NULL,
  `fundsource` enum('BOSO','Cash','SOGA','INSGC') DEFAULT NULL,
  `comments` varchar(500) NOT NULL,
  `check_type` enum('Pick-up', 'Mailed') NOT NULL,
  `fiscal_year` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Users` (
  `userid` int(10) UNSIGNED NOT NULL,
  `first` varchar(100) NOT NULL,
  `last` varchar(100) NOT NULL,
  `email` varchar(200) NOT NULL,
  `address` varchar(200) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(2) NOT NULL,
  `zip` int(5) NOT NULL,
  `cert` varchar(1000) NOT NULL,
  `modifydate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `username` varchar(50) NOT NULL,
  `password` varchar(512) NOT NULL,
  `passwordreset` varchar(512) NOT NULL,
  `resettime` datetime DEFAULT NULL,
  `apikey` varchar(512) NOT NULL,
  `apikeygentime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Add primary key indicies
ALTER TABLE `approval`
  ADD PRIMARY KEY (`approvalID`);

ALTER TABLE `Budget`
  ADD PRIMARY KEY (`budgetid`);

ALTER TABLE `Dues`
  ADD PRIMARY KEY (`duesid`);

ALTER TABLE `fiscal_year`
  ADD PRIMARY KEY (`fyid`);

ALTER TABLE `Income`
  ADD PRIMARY KEY (`incomeid`);

ALTER TABLE `Purchases`
  ADD PRIMARY KEY (`purchaseID`),
  ADD UNIQUE KEY `receipt` (`receipt`);

ALTER TABLE `Users`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `userid` (`userid`);

-- Configure the primary keys
ALTER TABLE `approval`
  MODIFY `approvalID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `Budget`
  MODIFY `budgetid` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `Dues`
  MODIFY `duesid` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `fiscal_year`
  MODIFY `fyid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `Income`
  MODIFY `incomeid` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `Purchases`
  MODIFY `purchaseID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `Users`
  MODIFY `userid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

-- Add foreign keys
ALTER TABLE `approval`
ADD FOREIGN KEY (username) REFERENCES Users(username);

ALTER TABLE `Budget`
ADD FOREIGN KEY (fiscal_year) REFERENCES fiscal_year(fyid);

ALTER TABLE `Dues`
ADD FOREIGN KEY (fiscal_year) REFERENCES fiscal_year(fyid);

ALTER TABLE `Income`
ADD FOREIGN KEY (addedby) REFERENCES Users(username);

ALTER TABLE `Income`
ADD FOREIGN KEY (fiscal_year) REFERENCES fiscal_year(fyid);

ALTER TABLE `Purchases`
ADD FOREIGN KEY (username) REFERENCES Users(username);

ALTER TABLE `Purchases`
ADD FOREIGN KEY (approvedby) REFERENCES Users(username);

ALTER TABLE `Purchases`
ADD FOREIGN KEY (fiscal_year) REFERENCES fiscal_year(fyid);

-- Database setup done
COMMIT;
