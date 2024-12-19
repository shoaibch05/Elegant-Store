-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 19, 2024 at 11:03 AM
-- Server version: 10.1.29-MariaDB
-- PHP Version: 7.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `salesys`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `Name`, `Email`, `Password`) VALUES
(1, 'Shoaib', 'shoaib@admin.com', 'abc123');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`) VALUES
(11, 2, 1, 1),
(12, 2, 1, 1),
(13, 2, 2, 1),
(14, 2, 2, 1),
(15, 2, 2, 1),
(16, 2, 3, 1),
(19, 2, 1, NULL),
(20, 2, 2, NULL),
(22, 2, 4, NULL),
(24, 4, 2, NULL),
(25, 4, 4, NULL),
(26, 4, 4, NULL),
(27, 4, 1, NULL),
(41, 1, 1, 2),
(42, 1, 3, 1),
(43, 1, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(50) NOT NULL,
  `Name` varchar(20) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `Price` int(11) NOT NULL,
  `Supplier_id` int(11) NOT NULL,
  `stock` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `Name`, `Description`, `Price`, `Supplier_id`, `stock`) VALUES
(1, 'T-shirt', '100% cotton, available in all sizes', 1500, 1, 29),
(2, 'Leather Bag', 'Handmade leather bag, durable design', 2500, 3, 63),
(3, 'Wall Clock', 'Modern design wall clock', 1200, 2, 67),
(4, 'Prayer Mat', 'Soft and comfortable prayer mat', 1800, 2, 192),
(5, 'Perfume', 'Long-lasting fragrance', 2200, 1, 22),
(6, 'Dodge challenger', 'very fast speed car for car lover specially designed heroic car', 50000, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`) VALUES
(1, 1, 'photos/download (12).jpeg'),
(2, 2, 'photos/download (13).jpeg'),
(3, 3, 'photos/download (14).jpeg'),
(4, 4, 'photos/download (15).jpeg'),
(5, 5, 'photos/download (16).jpeg'),
(6, 1, 'photos/T shirt 1.jpg'),
(7, 1, 'photos/tshirt2.jpg'),
(8, 1, 'photos/tshirt3.jpg'),
(9, 3, 'photos/wallclock1.jpg'),
(10, 3, 'photos/walclock2.jpg'),
(11, 3, 'photos/wallclock3.jpg'),
(12, 2, 'photos/leatherbag1.jpg'),
(13, 2, 'photos/lethebag2.jpg'),
(14, 2, 'photos/leatherbag3.jpg'),
(15, 4, 'photos/Prayer mat 1.jpg'),
(16, 4, 'photos/Prayer mat 2.jpg'),
(17, 4, 'photos/Prayer mat 3.jpg'),
(18, 5, 'photos/perfume1.jpg'),
(19, 5, 'photos/perfume2.jpg'),
(20, 5, 'photos/perfume3.jpg'),
(21, 6, 'photos/1733476197011.jpg'),
(22, 6, 'photos/1733476197240.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `variant_type` varchar(255) NOT NULL,
  `variant_value` varchar(255) NOT NULL,
  `Size` varchar(80) NOT NULL,
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `variant_type`, `variant_value`, `Size`, `stock`) VALUES
(1, 1, 'Color', 'red', '45', 35),
(2, 1, 'Color', 'grey', '36', 7),
(3, 1, 'Color', 'blue', '38', 3);

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` int(11) NOT NULL,
  `total_price` int(11) NOT NULL,
  `purchase_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`id`, `supplier_id`, `product_id`, `quantity`, `unit_price`, `total_price`, `purchase_date`, `notes`) VALUES
(2, 2, 1, 5, 300, 1500, '2024-11-05 08:12:27', 'Regular delivery.'),
(3, 3, 2, 20, 100, 2000, '2024-11-05 08:12:27', 'Check quality before delivery.'),
(9, 3, 1, 15, 200, 3000, '2024-11-04 19:00:00', 'as soon as possible'),
(10, 2, 3, 15, 4, 60, '2024-11-04 19:00:00', 'as soon as possible'),
(11, 2, 3, 15, 4, 60, '2024-11-04 19:00:00', 'as soon as possible'),
(12, 2, 2, 45, 13, 585, '2024-11-10 19:00:00', 'jaldi delivery chahiye mujhy'),
(13, 2, 3, 185, 15, 2775, '2024-11-12 14:48:10', ''),
(14, 3, 1, 15, 49, 735, '2024-11-24 19:00:00', '');

-- --------------------------------------------------------

--
-- Table structure for table `sale`
--

CREATE TABLE `sale` (
  `id` int(11) NOT NULL,
  `transaction_id` varchar(36) NOT NULL,
  `User_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `sale_date_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `quantity` int(11) NOT NULL DEFAULT '1',
  `variant` varchar(50) NOT NULL,
  `Size` varchar(50) NOT NULL,
  `Price` int(50) NOT NULL,
  `address` varchar(255) NOT NULL,
  `payment_method` enum('cashOnDelivery','creditCard') NOT NULL,
  `card_details` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sale`
--

INSERT INTO `sale` (`id`, `transaction_id`, `User_id`, `product_id`, `sale_date_time`, `quantity`, `variant`, `Size`, `Price`, `address`, `payment_method`, `card_details`) VALUES
(123, '0b17a92f-ec40-4e3e-b710-ba895fdfd818', 4, 1, '2024-11-04 13:26:20.883287', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(124, '0b17a92f-ec40-4e3e-b710-ba895fdfd818', 4, 2, '2024-11-04 13:26:20.883287', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(125, '0b17a92f-ec40-4e3e-b710-ba895fdfd818', 4, 4, '2024-11-04 13:26:20.883287', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(126, '0b17a92f-ec40-4e3e-b710-ba895fdfd818', 4, 4, '2024-11-04 13:26:20.883287', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(130, 'c6042ce1-3940-41c0-ae07-e9dc6eebb69d', 3, 1, '2024-11-05 06:22:00.989419', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(131, 'c6042ce1-3940-41c0-ae07-e9dc6eebb69d', 3, 1, '2024-11-05 06:22:00.989419', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(132, 'c6042ce1-3940-41c0-ae07-e9dc6eebb69d', 3, 2, '2024-11-05 06:22:00.989419', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(133, 'c6042ce1-3940-41c0-ae07-e9dc6eebb69d', 3, 2, '2024-11-05 06:22:00.989419', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(134, 'c6042ce1-3940-41c0-ae07-e9dc6eebb69d', 3, 3, '2024-11-05 06:22:00.989419', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(135, 'c6042ce1-3940-41c0-ae07-e9dc6eebb69d', 3, 4, '2024-11-05 06:22:00.989419', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(139, '3742dd3a-e297-4877-80b9-a2248d9d1329', 3, 1, '2024-11-05 06:43:50.583219', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(140, '3742dd3a-e297-4877-80b9-a2248d9d1329', 3, 1, '2024-11-05 06:43:50.583219', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(141, '3742dd3a-e297-4877-80b9-a2248d9d1329', 3, 2, '2024-11-05 06:43:50.583219', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(142, '3742dd3a-e297-4877-80b9-a2248d9d1329', 3, 2, '2024-11-05 06:43:50.583219', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(143, '3742dd3a-e297-4877-80b9-a2248d9d1329', 3, 3, '2024-11-05 06:43:50.583219', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(144, '3742dd3a-e297-4877-80b9-a2248d9d1329', 3, 4, '2024-11-05 06:43:50.583219', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(148, 'd03ca0bd-86b8-483e-9202-f53235648761', 3, 1, '2024-11-05 06:45:37.198751', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(149, 'd03ca0bd-86b8-483e-9202-f53235648761', 3, 1, '2024-11-05 06:45:37.198751', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(150, 'd03ca0bd-86b8-483e-9202-f53235648761', 3, 2, '2024-11-05 06:45:37.198751', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(151, 'd03ca0bd-86b8-483e-9202-f53235648761', 3, 2, '2024-11-05 06:45:37.198751', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(152, 'd03ca0bd-86b8-483e-9202-f53235648761', 3, 3, '2024-11-05 06:45:37.198751', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(153, 'd03ca0bd-86b8-483e-9202-f53235648761', 3, 4, '2024-11-05 06:45:37.198751', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(157, '', 3, 2, '2024-11-05 13:25:36.011462', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(160, 'e062eba6-35b9-4812-a0fc-421628cfeefc', 1, 1, '2024-11-10 15:17:21.199481', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(161, 'e062eba6-35b9-4812-a0fc-421628cfeefc', 1, 2, '2024-11-10 15:17:21.199481', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(162, 'e062eba6-35b9-4812-a0fc-421628cfeefc', 1, 3, '2024-11-10 15:17:21.199481', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(164, 'c2ac140e-a9ba-4842-b8a1-f2edd1db8e39', 1, 3, '2024-11-20 18:32:55.456671', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(166, '5d157bf1-1a5f-47d4-a2b5-d6d01fc4731e', 1, 3, '2024-11-20 18:33:04.905017', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(168, '', 1, 4, '2024-12-03 08:49:53.106278', 1, '', '', 0, '123 Elm Street, Springfield', 'cashOnDelivery', 'null'),
(169, '', 1, 4, '2024-12-03 08:50:39.801936', 5, '', '', 0, '123 Elm Street, Springfield', 'creditCard', '{\"cardNumber\":\"454545454545454\",\"expiryDate\":\"545464646\",\"cvv\":\"45545\"}'),
(170, '66198fed-0b1c-4d92-8ea3-d64f9a89f24c', 1, 4, '2024-12-03 09:06:35.187555', 7, '', '', 0, '123 Elm Street, Springfield', 'cashOnDelivery', 'null'),
(171, 'd9958305-3af0-4be8-81a6-4442bbf6c1ec', 1, 4, '2024-12-03 09:10:54.973439', 5, '', '', 0, '123 Elm Street, Springfield', 'cashOnDelivery', 'null'),
(172, 'b9ffb144-6f96-47e9-8672-22dfdee0b071', 1, 3, '2024-12-03 09:40:36.455707', 15, '', '', 27000, '123 Elm Street, Springfield', 'cashOnDelivery', 'null'),
(173, '4fa78610-463f-4e8f-8fed-4136a12901a2', 1, 2, '2024-12-04 12:03:41.715897', 2, '', '', 2400, 'bharakahy, afdgf, dgdgdf', 'cashOnDelivery', 'null'),
(174, '39bef700-c40c-4729-a003-740131d6fb98', 1, 2, '2024-12-04 12:10:06.865764', 2, '', '', 2400, '123 Elm Street', 'cashOnDelivery', 'null'),
(175, '3cd3bf57-06fe-4f3e-beb9-74a550e9f6d5', 1, 2, '2024-12-04 17:37:21.392816', 3, '', '', 3600, 'Bharakahu', 'cashOnDelivery', 'null'),
(176, 'ae5c19d3-1406-41b0-b23f-52cb8fa7f29b', 1, 1, '2024-12-15 17:24:57.200841', 2, 'red', '45', 3000, '123 Elm Street, Springfield', 'creditCard', '{\"cardNumber\":\"4741613506242078\",\"expiryDate\":\"0425\",\"cvc\":\"792\"}'),
(177, '4039d596-3c46-41c1-a3d6-1ead37883555', 1, 1, '2024-12-15 17:24:59.931088', 2, 'red', '45', 3000, '123 Elm Street, Springfield', 'creditCard', '{\"cardNumber\":\"4741613506242078\",\"expiryDate\":\"0425\",\"cvc\":\"792\"}'),
(178, '81ba9bcc-f2b0-41f7-9fbd-b92c16251dbb', 1, 1, '2024-12-15 17:28:00.048043', 2, 'red', '45', 3000, '123 Elm Street, Springfield', 'creditCard', '{\"cardNumber\":\"4741613506242078\",\"expiryDate\":\"0425\",\"cvc\":\"792\"}'),
(179, '465f29e6-61ae-4bd4-9e9e-fb133ebdc9c7', 1, 1, '2024-12-15 17:28:06.739514', 2, 'red', '45', 3000, '123 Elm Street, Springfield', 'creditCard', '{\"cardNumber\":\"4741613506242078\",\"expiryDate\":\"0425\",\"cvc\":\"792\"}'),
(180, '65730cc2-41aa-4787-bebf-49ffdeb96464', 1, 1, '2024-12-15 17:47:37.445166', 1, 'red', '45', 1500, '123 Elm Street, Springfield', 'creditCard', '{\"cardNumber\":\"4741613506242078\",\"expiryDate\":\"0425\"}'),
(181, '3b4c7a39-cf82-4e60-bc7b-9288d103f6ae', 1, 1, '2024-12-15 17:50:42.848199', 1, 'red', '45', 1500, '123 Elm Street, Springfield', 'creditCard', '{\"cardNumber\":\"4741613506242078\",\"expiryDate\":\"0425\",\"cvv\":\"792\"}'),
(182, '985f645c-6c4a-43ea-a4ba-3050a4527d53', 1, 1, '2024-12-15 17:50:49.990846', 1, 'red', '45', 1500, '123 Elm Street, Springfield', 'creditCard', '{}'),
(183, '2d8224d2-e444-415b-8db1-e85b8b442a92', 1, 1, '2024-12-15 18:05:06.712975', 1, 'red', '45', 1500, '123 Elm Street, Springfield', 'creditCard', '[]'),
(184, 'e05d3a8f-e8da-4831-8def-ee513707b770', 1, 1, '2024-12-15 18:05:21.915820', 1, 'red', '45', 1500, '123 Elm Street, Springfield', 'creditCard', '{\"cardNumber\":\"4716608809163295\",\"expiryDate\":\"0426\",\"cvv\":\"803\"}'),
(185, 'cf1cbc2a-31d7-40ca-a6d2-21758cefdfb0', 1, 2, '2024-12-16 16:50:15.281710', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(186, 'cf1cbc2a-31d7-40ca-a6d2-21758cefdfb0', 1, 1, '2024-12-16 16:50:15.281710', 1, '', '', 0, '', 'cashOnDelivery', NULL),
(187, '8bcbed8a-49a8-450f-a307-4f54af9faf06', 1, 1, '2024-12-16 16:51:25.669809', 2, 'red', '45', 3000, '123 Elm Street, Springfield', 'cashOnDelivery', 'null');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `contact_info` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `name`, `contact_info`, `address`) VALUES
(1, 'Supplier A', '123-456-7890', '123 Supplier St, City A'),
(2, 'Supplier B', '987-654-3210', '456 Supplier Ave, City B'),
(3, 'Supplier C', '555-555-5555', '789 Supplier Blvd, City C'),
(4, 'Shoaib Shamrez', '789456123', 'bharakahu islamabad'),
(5, 'abc def ', '123-456-789', 'qwert yuiop asdf ghjk l;\' zxc ');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Email` varchar(30) NOT NULL,
  `Password` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `Name`, `Email`, `Password`) VALUES
(1, 'John Doe', 'john@example.com', 123456789),
(2, 'Jane Smith', 'jane@example.com', 987654321),
(3, 'Ali Khan', 'ali@example.com', 135792468),
(4, 'Sara Ahmed', 'sana@example.com', 246813579),
(5, 'Michael Brown', 'brown@example.com', 112233445);

-- --------------------------------------------------------

--
-- Table structure for table `user_addresses`
--

CREATE TABLE `user_addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `is_default` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_addresses`
--

INSERT INTO `user_addresses` (`id`, `user_id`, `address`, `is_default`) VALUES
(1, 1, '123 Elm Street, Springfield', 1),
(2, 2, '456 Oak Avenue, Metropolis', 1),
(3, 3, '789 Cedar Road, Islamabad', 1),
(4, 4, '12 Maple Lane, Rawalpindi', 1),
(5, 5, '345 Pine Blvd, Gotham', 1),
(6, 1, 'Bharakahu', 0),
(7, 1, 'Horizon Tech Services, NSTP, Islamabad', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Supplier_id` (`Supplier_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `sale`
--
ALTER TABLE `sale`
  ADD PRIMARY KEY (`id`),
  ADD KEY `User_id` (`User_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `sale`
--
ALTER TABLE `sale`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=188;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_addresses`
--
ALTER TABLE `user_addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`Supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  ADD CONSTRAINT `purchases_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sale`
--
ALTER TABLE `sale`
  ADD CONSTRAINT `sale_ibfk_1` FOREIGN KEY (`User_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sale_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD CONSTRAINT `user_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
