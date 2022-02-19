SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `ieee-money` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `ieee-money`;

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
  `year` enum('2015-2016','2016-2017','2017-2018','2018-2019','2019-2020','2020-2021','2021-2022','') NOT NULL DEFAULT '2021-2022',
  `status` enum('Submitted','Approved') NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `Dues` (
  `Name` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `id_hash` varchar(512) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `duesid` int(11) NOT NULL,
  `Committee` varchar(255) NOT NULL,
  `Fiscal_Year` enum('2016-2017','2017-2018','2018-2019','2019-2020','2020-2021','2021-2022','') NOT NULL DEFAULT '2021-2022',
  `Amount` int(11) NOT NULL DEFAULT '0'
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
  `fiscalyear` enum('2016-2017','2017-2018','2018-2019','2019-2020','2020-2021','2021-2022','') NOT NULL DEFAULT '2021-2022',
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
  `fundsource` enum('BOSO','Cash','SOGA') DEFAULT NULL,
  `comments` varchar(500) NOT NULL,
  `fiscalyear` enum('2016-2017','2017-2018','2018-2019','2019-2020','2020-2021','2021-2022','') NOT NULL DEFAULT '2021-2022'
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

ALTER TABLE `approval`
  ADD PRIMARY KEY (`approvalID`);

ALTER TABLE `Budget`
  ADD PRIMARY KEY (`budgetid`);

ALTER TABLE `Dues`
  ADD PRIMARY KEY (`duesid`),
  ADD UNIQUE KEY `index_2` (`duesid`),
  ADD KEY `index` (`duesid`);

ALTER TABLE `Income`
  ADD PRIMARY KEY (`incomeid`);

ALTER TABLE `Purchases`
  ADD PRIMARY KEY (`purchaseID`),
  ADD UNIQUE KEY `receipt` (`receipt`);

ALTER TABLE `Users`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `userid` (`userid`);

ALTER TABLE `approval`
  MODIFY `approvalID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `Budget`
  MODIFY `budgetid` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `Dues`
  MODIFY `duesid` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `Income`
  MODIFY `incomeid` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `Purchases`
  MODIFY `purchaseID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `Users`
  MODIFY `userid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;
