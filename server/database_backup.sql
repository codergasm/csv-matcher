-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Lip 14, 2023 at 08:57 AM
-- Wersja serwera: 10.4.28-MariaDB
-- Wersja PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `csv-matcher`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `add_to_team_users_requests`
--

CREATE TABLE `add_to_team_users_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `created_datetime` datetime NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `add_to_team_users_requests`
--

INSERT INTO `add_to_team_users_requests` (`id`, `user_id`, `team_id`, `created_datetime`, `status`) VALUES
(2, 3, 82, '2023-06-29 09:19:09', 'accept');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `automatic_match_operations_registry`
--

CREATE TABLE `automatic_match_operations_registry` (
  `id` int(11) NOT NULL,
  `create_datetime` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `automatic_matched_rows_value` int(11) NOT NULL,
  `analyzed_row_count_sheet1` int(11) NOT NULL,
  `analyzed_row_count_sheet2` int(11) NOT NULL,
  `matched_rows` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `correlation_jobs`
--

CREATE TABLE `correlation_jobs` (
  `id` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `creation_datetime` datetime DEFAULT NULL,
  `rowCount` int(11) NOT NULL,
  `totalRows` int(11) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `correlation_jobs`
--

INSERT INTO `correlation_jobs` (`id`, `user_id`, `creation_datetime`, `rowCount`, `totalRows`, `status`) VALUES
('0BGw1ZGDPxgXcCf5GiD092WZC9JdkOZOfUIGrlI34qYSBtz6XIxYFAw6mDrEMcYY', 2, '2023-07-12 14:18:00', 386, 386, 'finished'),
('22LfnuFq8Jodjlr2d8lMOXrVm4CUnspnROFqxYrkk7dSImJVkKcflyBl4AR3T3wB', 1, '2023-07-12 21:02:48', 3, 3, 'finished'),
('3GZGuf3PcLY1VEFsRyt90TiUDDoEcZihaRjHUvKCbLGzUhxrUo9C3GGRLF73ebzN', 2, '2023-07-06 13:31:54', 386, 386, 'finished'),
('3HPOaQwtfgGre98zld8c6uoEFSRNhdmE7HYTdZLmovXFp7YKp9bJjGstBD2QtYa6', 2, '2023-07-12 14:21:51', 386, 386, 'finished'),
('3Q1iHoRRddKi2Z2uFF1VX15Ru344EGvqUSTKgZ65Wj1nYq6PWK90YxrCQuYVXVpp', 1, '2023-07-12 20:21:57', 3, 3, 'finished'),
('4c6V7LlAGcUK52Hs0BF5SmXRUibEEDfk4kdkqyiwXQhsg65GrJlZUh9VnwDbvcBV', 1, '2023-07-07 15:18:03', 3971, 3971, 'finished'),
('6flJioaqFy3KDaVW6GBw02mlLxmwxMwRlqr3YRuLpJDe4RYZHUOrtdZ18nf3D9xq', 2, '2023-07-13 16:31:08', 386, 386, 'finished'),
('7w2Pnfl4Htln6Mn7DTrlP8uja0t5BVTslDYcJYYzN5ajr7JUVaxn0REF8eZ0sX7L', 1, '2023-07-12 20:43:54', 3, 3, 'finished'),
('87c4SP8lBvh43xzu9UUziYxdKiTnBC0kcMaa2vold0hcQIte8eCifCjnGCl1IHt5', 1, '2023-07-07 15:54:10', 1200, 3971, 'running'),
('9AXCHXUPwO3hEygUxbevbGzJwikED7vlS0Ptw7HanzblVC8Y2iaD3Bjw3S61cntM', 1, '2023-07-12 20:25:14', 3, 3, 'finished'),
('9Dc3lXF2dytIiLPuAfUzcEHqfEeqXZ9BdyyLjja5bKiU2vJP2S71ikMXeISXfA7y', 1, '2023-07-07 13:14:40', 45, 45, 'finished'),
('a4RZY47DpNkTme6H0SnY8H0GipAdgBjeYcRK0cCIs8mtewt1DjrThOlUkyfTc3vW', 2, '2023-07-12 21:08:42', 3971, 3971, 'finished'),
('AAGjzVjKNE6DzrGDwSqfqHGfQCu3rr1IrymPlfjqtDPEvUxWvcpo0f35a6uTyJq7', 1, '2023-07-07 18:27:03', 1980, 3971, 'running'),
('aAqogQXXxN84H4nTRU2YBDWa28PyLG68BPFlq0NZQrY6ABmrYMkGNsGbwd7jhrvy', 1, '2023-07-07 13:12:49', 45, 45, 'finished'),
('aLSbtOZPueLaNnOdGdwLWnkADi1QUZ4l3x3XCuvalkekZi6n6rb3oM9gBVpfyEQP', 1, '2023-07-07 14:44:25', 3971, 3971, 'finished'),
('aoZqWz54EFx3RwKV03V8HuxiOCgTvTChXnAvfqB6VM3qE4rmzTBjqyI4kfvOTuwL', 1, '2023-07-07 18:21:06', 3971, 3971, 'finished'),
('B44HWSwZ5BCm7YaOhEGqqAXXjx5aFmGeTwClsuNuEjfErkpylDHq43sPbCSoUr1m', 1, '2023-07-12 20:42:22', 3, 3, 'finished'),
('b9MyLqvp1wQR2fTshJ8FKiFLHS31YYBPzyAe9THaa2Irb774TzNEeDKwQhk8Jy89', 2, '2023-07-12 20:07:59', 3971, 3971, 'finished'),
('bhVlIwgj1XfvKzNzDiQ2gvAUYGG0gSyWQIZlYH8qCKpb9zSERXjJr7cyNKpFtZ3H', 1, '2023-07-12 20:19:00', 3, 3, 'finished'),
('bJZQDkIIGTxCZQSrmM1VEwEXEMZI95XkEzIb13aePxxFn6Q1DMFk91atWUfP0NG2', 1, '2023-07-07 18:28:19', 3971, 3971, 'finished'),
('c02nfFegXpqnbPsGIDNLX8yoE0b9hVl8bu2ndYB9C7cQ10NHoCLZBpfbRKxrqjFE', 1, '2023-07-07 18:40:27', 3971, 3971, 'finished'),
('C42gV03PsEQ3w2hYJa40qmSIPAIl3Is0llN37oZdVxBjxhxEn2MQOHXSobaDCTff', 2, '2023-07-12 19:44:40', 3971, 3971, 'finished'),
('C7Lc6rpMr0CynDN4aTf2OFDZsSgbtPirY7p2iNvk3MoVZkG5Jd3rAV0dRqkXepip', 1, '2023-07-07 14:40:05', 3971, 3971, 'finished'),
('CzlzUE9FGkoAfnZ0iM1E7jpC9dL0URlWQSGZMKsy8AkndR7NT2m6f22FAQfk2iAL', 1, '2023-07-12 20:37:52', 3, 3, 'finished'),
('dA2JnbdpLH4zyZymaThtMIazHlNOvvOqDfzQKN9taBX4pVPds7sEXBJJF9xBWlC7', 2, '2023-07-06 13:36:37', 386, 386, 'finished'),
('DQtYoLiVogB65S34r8zdvsOuD9hmAuNprxOvMiUOJCgxzoNoswPtlCqTYrmGPNWx', 1, '2023-07-12 20:00:30', 3, 3, 'finished'),
('EbTMgYQb1Z3efKUd6W5GSvz02mqIBnqSqmZlUwEwsMYTSRMPGEFYOL9KLdOTmul8', 2, '2023-07-12 20:12:09', 3971, 3971, 'finished'),
('EenW6Pc4LHjqQzZqp7eS3dXFNtCKuwDsYKVXFhIOSjjf5zEnk98taitmYhbpMloK', 1, '2023-07-07 18:30:58', 3971, 3971, 'finished'),
('EgC335HiqxF9dlFqkLcLsFwWQfMpT4FtUYkkL9SnUhbt265oouP146sQC9OFSbEr', 2, '2023-07-12 19:28:04', 3971, 3971, 'finished'),
('fV1XOk961YmGGSsw56PTxZDMatxjbrsi50RcH8QqNWNbnPwx1PaMLZsbzyFVDMv8', 1, '2023-07-07 13:39:45', 45, 45, 'finished'),
('g1F2lG3gZX0bzM33e6B2283u83UTeUcAczus2bzdjjCZtcdRVVDzkVpE6aHuBVCH', 2, '2023-07-12 21:07:41', 3971, 3971, 'finished'),
('ggGPs7y7jtL3D1APGsD8eBV39QgkCmp5GtWuVjAa5InjJY4xMbK5BaXbN3KpkE5o', 1, '2023-07-07 13:16:06', 45, 45, 'finished'),
('gS9rJ4LfRxcXeADAyk087sYJTS8BsSTHClODeriWvScqpUXKZuTbcsXWo9gVQQng', 1, '2023-07-07 13:11:53', 45, 45, 'finished'),
('H0tp7wz9xm2voZzixGI6aTWTF0NmYPWLnw1o3XFZ9BrDYkCSPR2mqH2n2vZZ24kH', 1, '2023-07-07 14:54:00', 10, 3971, 'running'),
('HA03p5rKg5UlEsNcrzWZGxUJ3NJHlxUis4kmXcoEbg82s5yR3e4IKCsgWoYOfjZO', 1, '2023-07-07 13:42:38', 45, 45, 'finished'),
('I5Ejyi2Dz5ZRvQtbfJpztIrSywsc6ZI4EdMwiI94ZzxMdw3GNcVXYUuSzck9ffcK', 1, '2023-07-07 16:20:21', 3971, 3971, 'finished'),
('IStMeE3L64aZPVnZjmYsXjSOjsXxrE7Y0o2Ripendr3s2DRxgJNeYVbox9fAxgWc', 1, '2023-07-07 15:37:52', 4, 4, 'finished'),
('JqWEEolwWk9fPCP1cvnE4KKE7auFnr7caGItbJeImqLxKIO1hoR9q3OnACtNImXH', 1, '2023-07-07 15:08:36', 120, 3971, 'running'),
('K3twDowpRL2340IXAH3Tt0xy8hgE1ZRdLfM44WOoLrP1NbWYvyIqPzLkgIX1XoaG', 2, '2023-07-13 16:38:09', 386, 386, 'finished'),
('kaDFLPJFfaSoTF86PGSB8VIdPJhZFIIrjDxDaAr1T1QinhWr0HLNvISIv0DC9T81', 1, '2023-07-12 20:25:57', 3, 3, 'finished'),
('kfnUNqnjJAWZuxqIQRZVkDyG0WzCn6rQuP5DxsWoKnXngi0Ugu3h7z7LrkRCdxEO', 1, '2023-07-07 13:41:31', 45, 45, 'finished'),
('Kmsi5va7njk1e0nBmoBXoZx6JUByMG6tiXm59sH9BdySIAR89TXwBhydyC7Znxuf', 2, '2023-07-13 14:25:55', 386, 386, 'finished'),
('lAA4W164MG4244eFHIo7rkyVBkMTeWhBKwImJMa8evWUyq5R7bPxeXhm2bi9JSkC', 2, '2023-07-12 20:06:28', 3971, 3971, 'finished'),
('LBsRsPnsiGAOAwbXjQRzwJX2nJ5dHmkgrh26B33QgamhKApkYhyLmCcKPqNsys0I', 1, '2023-07-07 15:14:41', 3971, 3971, 'finished'),
('lDInvHLiaSppYaGRVc120NqAk7mrWmZbYosvcZFjoUqROn7TGgntzYjRd9iMCdRk', 1, '2023-07-07 18:16:24', 3971, 3971, 'finished'),
('LPE0EPXiKKLa6su3BWrLK57EnOUJi8DhhcMZOsx1tzpkZDN9JnFQ9g8KQU5LQ2xx', 1, '2023-07-12 20:36:16', 3, 3, 'finished'),
('LukWqU0DZMdnwsYXkxi3qPUizzMs5SDXp2gZL5s1qKoKavsD5t3d58ab4fztECuL', 1, '2023-07-07 15:37:44', 4, 4, 'finished'),
('LXMY0CE1hGvwjsN41JUi3FCcYXfQ55rjsCiDhOjOtltbhQEg950KuZ1L0wukrWmm', 1, '2023-07-12 20:36:31', 3, 3, 'finished'),
('M7a2mZAIPWwv2anAIV1E4UUFDj0IzaPR0oHB7tGwFJ9slX2GbyvnFj8N4OKS71H0', 2, '2023-07-06 12:01:30', 3971, 3971, 'finished'),
('mR62kWGQFP1XyKBPqEUy3CpJpTzF0ZuDTRtY99S2Di0fYGJ4hmd5LyS7CJZDbS4h', 1, '2023-07-07 18:25:02', 3971, 3971, 'finished'),
('Ms92uLmU1sA2fJuSuSQ6EmhLIyqzxtdMq0IoLTYUCPj8LUnOKEWKIB9zWxnucZ8N', 1, '2023-07-12 20:41:04', 3, 3, 'finished'),
('MZagVAcKc4OSGEJDIFiu48djfhOFdvlaHprBi0oBhpyrN2s0XnjP4KJPR2sfnU5n', 1, '2023-07-07 14:59:44', 3971, 3971, 'finished'),
('OtkXzg4SXDUA7rZ9Wk640GCypx13j2uqdVsJGvvuVk8XUGkfhULNh3ojIlZlheOa', 1, '2023-07-12 19:27:29', 3971, 3971, 'finished'),
('PaMvXCTVqAKUknFuFesVKfXLlOvkCwCzpN4TPIYXvabm781FOUm7KJB6Mn3k4rfN', 1, '2023-07-07 16:13:11', 130, 3971, 'running'),
('PoE2M6TkucbQUMNtbleJIKZK136mrwdJuMJoBZxyRUxLTdAg0bqcUvMIVhRHXfiX', 1, '2023-07-12 21:03:18', 3, 3, 'finished'),
('qHpYkSmz2M29vlVcL7U4d4LWWgXrOyg6uuBtNyFuyBx7g18KkWJDuu772QMhddFV', 1, '2023-07-07 14:51:28', 0, 3971, 'running'),
('QjTL2T3gGVOINKtzSq9U4fh9uleS2e4txNofvwRsNpIomJUJ6U8rqe8ge3f5pwIj', 1, '2023-07-07 18:33:30', 1980, 3971, 'running'),
('QsiQl7unxHPG2acs9LOKXkrCYebkC6VlWeGXpH1QjBD1SXVrJwF54zYbGfBCCR4k', 1, '2023-07-07 13:11:23', 45, 45, 'finished'),
('R6kEORx9Xtc6xyhGvhRr6t1mII18UTozRUgFqKtEa0LhMxpJeZPzCc0YIYYAUGAE', 2, '2023-07-12 19:47:42', 3971, 3971, 'finished'),
('RM6JAF8cc1zHvhbReOxy2sGSN24qpsDqQ9WFEKdMNrQ3lTmJaA01kikKFXc9NSMk', 1, '2023-07-12 19:41:51', 10, 3971, 'running'),
('s5Oxbp9eP4nFO8QrlVCkLLiJcPigWhCMfAXPGeXsFNt4uWdsgBBP1GqguZfS9y9e', 7, '2023-07-07 18:53:01', 3971, 3971, 'finished'),
('SisCWeOQXJSzNiMFHcoag1aw11JfuQhRx8alTkBZHqpDybigeIKJBZrKUoBrhYOa', 1, '2023-07-07 13:27:52', 45, 45, 'finished'),
('U6GAWVOutodl28r44IqQTm1rRaC1DnohXboVfP7CLODmTBpufFHyqo6MkZ809hbr', 1, '2023-07-12 20:44:36', 3, 3, 'finished'),
('uC75Y9R0CZe6pUGPcGaAusVGh6U5vJar4pBD0RcZxrxZR2ymZNYXVzcBoXg4clwd', 1, '2023-07-12 19:34:51', 670, 3971, 'running'),
('UcgVPSqvuqAiWTblpcqz6lH9USAhdMJFquJgltPiffLYFgtqBzmFkIjlBab39vte', 1, '2023-07-12 20:59:37', 3, 3, 'finished'),
('USn81YI2CLwImtGCR5sroL9sbw2syvly8ddIe6vyaNaWVjDYOXM3a2gP58fdZ0ty', 1, '2023-07-07 14:48:44', 60, 3971, 'running'),
('v9EcoP031paL77WLN3IrDpSyJXNLR87uTcMpmwwTdQeBuzYyqlyA0mR1BV69DSzo', 1, '2023-07-12 20:19:27', 3, 3, 'finished'),
('VaUX7XIbErvQ75Pl23oEzFU7M53AgotXsMA9ESh3sF5jvO68EDSh4C8eUPpsCYfG', 1, '2023-07-07 18:49:13', 3971, 3971, 'finished'),
('vxeFRFAFl47o4cX6EQoXiNmBHiCmIYJvKjMopL7xvYewYimcJQGSDRmMkhuP6n70', 1, '2023-07-12 20:40:14', 3, 3, 'finished'),
('W0g2lZIlLY6U5s7el7oiibYsDQjXj2e0NQ0Q3wbMHrg87UXBpRbRnDU7ToA6LPTM', 1, '2023-07-07 13:13:04', 45, 45, 'finished'),
('w3nTcolAjMf6DYUyFNUPOCqhiDA7Su6Zr0MAaFDCttMSaIkrIpaA1DNj3WGtB2Nt', 2, '2023-07-12 14:17:18', 386, 386, 'finished'),
('wL5zb1NIOlFgvjny9e4sqN0TI8KdUaWFECpT0UjA40WTAYujo1kA4VBRsntTaiXo', 1, '2023-07-12 20:02:38', 3, 3, 'finished'),
('WsaCnzCnuSCWzLdpYvl7pN693LStURrG5GedtYHYmzColUQXuUOsPJymBW1W7n8i', 2, '2023-07-12 14:20:13', 386, 386, 'finished'),
('Wwm1hfqgq1lvKNL9BkNsSsvXPH80ijmhk3BNKeChzpiRo8TJCteFolcvFj0LAaFM', 1, '2023-07-07 15:36:49', 4, 4, 'finished'),
('XCm2OHC8986C6m3aHX1lbdtPAO8tuUhTzLPiKnunudy1A3bCHTYAW3F4JGY9m3jT', 1, '2023-07-07 15:23:23', 3971, 3971, 'finished'),
('XEO8l4rYTYjj2pqQw1xUIKRAsyfVZBZpU5YVeVNqP32vb9kQbwdQoSPMglfMXfkU', 1, '2023-07-07 14:37:33', 637, 637, 'finished'),
('Xm3X8zc0vEvsUfM1SAj6PKvIYdRjOdOtzeybyny1H2qbJimdrhg4nnCaCfXUjtuw', 1, '2023-07-07 15:38:54', 4, 4, 'finished'),
('zh04g5hM64itOf5WUzAgUdIr317UOhGt2mpltI7507W1q4vCOyFEDwwwoNM2QUlg', 1, '2023-07-12 18:58:50', 3971, 3971, 'finished'),
('ZpXOiZIoilP6rDOni88h18TsM6SE9o6aGAgAzTtqqMYOdoBUWXuxYDjfHAvF9wv3', 2, '2023-07-12 20:13:29', 3971, 3971, 'finished');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `filesize` int(11) NOT NULL,
  `row_count` int(11) NOT NULL,
  `owner_user_id` int(11) DEFAULT NULL,
  `owner_team_id` int(11) DEFAULT NULL,
  `created_datetime` datetime NOT NULL,
  `filename` text NOT NULL,
  `filepath` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `filesize`, `row_count`, `owner_user_id`, `owner_team_id`, `created_datetime`, `filename`, `filepath`) VALUES
(102, 1018, 45, NULL, 200, '2023-07-04 15:20:54', 'produkty 1', './uploads/null/produkty-1688606781157.csv'),
(103, 1018, 45, 1, NULL, '2023-07-04 15:21:13', 'produkty.csv', './uploads/null/produkty-1689193965101.csv'),
(105, 1018, 45, 1, NULL, '2023-07-05 20:25:32', 'file.csv', './uploads/200/file-1689448326185.csv'),
(106, 1018, 45, 1, NULL, '2023-07-05 20:25:45', 'file.csv', './uploads/200/file-1688732901765.csv'),
(107, 1018, 45, 1, NULL, '2023-07-05 20:34:10', 'file.csv', './uploads/200/file-1689161709357.csv'),
(108, 1018, 45, 1, NULL, '2023-07-05 20:34:36', 'file.csv', './uploads/200/file-1689332238842.csv'),
(109, 1018, 45, 1, NULL, '2023-07-05 20:35:17', 'file.csv', './uploads/200/file-1688598986806.csv'),
(114, 1018, 45, 1, NULL, '2023-07-05 20:39:43', 'file.csv', './uploads/200/file-1688850253953.csv'),
(115, 1018, 45, 1, NULL, '2023-07-05 20:39:58', 'file.csv', './uploads/200/file-1689088421623.csv'),
(116, 1018, 45, 1, NULL, '2023-07-05 20:41:53', 'file.csv', './uploads/200/file-1689460110817.csv'),
(117, 1018, 45, 1, NULL, '2023-07-05 20:43:14', 'file.csv', './uploads/200/file-1688835430769.csv'),
(118, 1018, 45, 1, NULL, '2023-07-05 20:44:55', 'file.csv', './uploads/200/file-1688966540757.csv'),
(119, 1018, 45, 1, NULL, '2023-07-05 20:45:40', 'file.csv', './uploads/200/file-1688764938653.csv'),
(120, 1018, 45, 1, NULL, '2023-07-05 20:46:03', 'file.csv', './uploads/200/file-1688888784260.csv'),
(130, 12810097, 3971, 2, NULL, '2023-07-06 12:00:10', 'sraka idosellowa', './uploads/null/zrzut towarow z idosell-1689127023097.csv'),
(131, 59129, 386, 2, NULL, '2023-07-06 12:00:13', 'triplemenks', './uploads/null/triplex bez naglowka-1689526032274.csv'),
(132, 59129, 386, 1, NULL, '2023-07-07 14:37:05', 'triplex bez naglowka.csv', './uploads/200/triplex bez naglowka-1688919899087.csv'),
(133, 604832, 637, 1, NULL, '2023-07-07 14:37:06', 'zrzut towarow z idosell_okrojony.csv', './uploads/200/zrzut towarow z idosell_okrojony-1688964837470.csv'),
(134, 59129, 386, 1, NULL, '2023-07-07 14:39:32', 'triplex bez naglowka.csv', './uploads/200/triplex bez naglowka-1689332231132.csv'),
(135, 12810097, 3971, 1, NULL, '2023-07-07 14:39:36', 'zrzut towarow z idosell.csv', './uploads/200/zrzut towarow z idosell-1688889786021.csv'),
(136, 5718, 1, 1, NULL, '2023-07-07 15:29:17', 'zrzut_towarow_1.csv', './uploads/200/zrzut_towarow_1-1689456239684.csv'),
(137, 7959, 2, 1, NULL, '2023-07-07 15:30:09', 'zrzut_towarow_1.csv', './uploads/200/zrzut_towarow_1-1689232623196.csv'),
(138, 7958, 4, 1, NULL, '2023-07-07 15:35:47', 'zrzut_towarow_1.csv', './uploads/200/zrzut_towarow_1-1689293376609.csv'),
(139, 59129, 386, 1, NULL, '2023-07-07 18:06:24', 'data_sheet.csv', './uploads/200/data_sheet-1688883004352.csv'),
(141, 59129, 386, 1, NULL, '2023-07-07 18:16:16', 'data_sheet.csv', './uploads/200/data_sheet-1689631199277.csv'),
(142, 12810097, 3971, 1, NULL, '2023-07-07 18:16:18', 'relation_sheet.csv', './uploads/200/relation_sheet-1688917409281.csv'),
(143, 59129, 386, 1, NULL, '2023-07-07 18:26:53', 'data_sheet.csv', './uploads/200/data_sheet-1689110079501.csv'),
(144, 12810097, 3971, 1, NULL, '2023-07-07 18:26:56', 'relation_sheet.csv', './uploads/200/relation_sheet-1689468364008.csv'),
(145, 59129, 386, 1, NULL, '2023-07-07 18:28:09', 'data_sheet.csv', './uploads/200/data_sheet-1689731469733.csv'),
(146, 12810097, 3971, 1, NULL, '2023-07-07 18:28:12', 'relation_sheet.csv', './uploads/200/relation_sheet-1689047921830.csv'),
(147, 59129, 386, 1, NULL, '2023-07-07 18:30:36', 'data_sheet.csv', './uploads/200/data_sheet-1689530549851.csv'),
(148, 59129, 386, 1, NULL, '2023-07-07 18:30:47', 'data_sheet.csv', './uploads/200/data_sheet-1689382680169.csv'),
(149, 12810097, 3971, 1, NULL, '2023-07-07 18:30:49', 'relation_sheet.csv', './uploads/200/relation_sheet-1689208261196.csv'),
(150, 59129, 386, 1, NULL, '2023-07-07 18:33:19', 'data_sheet.csv', './uploads/200/data_sheet-1689261690985.csv'),
(151, 12810097, 3971, 1, NULL, '2023-07-07 18:33:21', 'relation_sheet.csv', './uploads/200/relation_sheet-1689543420903.csv'),
(152, 59129, 386, 1, NULL, '2023-07-07 18:40:19', 'data_sheet.csv', './uploads/200/data_sheet-1688821028312.csv'),
(153, 12810097, 3971, 1, NULL, '2023-07-07 18:40:20', 'relation_sheet.csv', './uploads/200/relation_sheet-1688795712939.csv'),
(155, 59129, 386, 1, NULL, '2023-07-07 18:48:27', 'triplex bez naglowka.csv', './uploads/200/triplex bez naglowka-1689070685598.csv'),
(156, 12810097, 3971, 1, NULL, '2023-07-07 18:48:28', 'zrzut towarow z idosell.csv', './uploads/200/zrzut towarow z idosell-1689482615518.csv'),
(157, 59129, 386, 7, NULL, '2023-07-07 18:52:57', 'data_sheet.csv', './uploads/null/data_sheet-1689735706907.csv'),
(158, 12810097, 3971, 7, NULL, '2023-07-07 18:52:58', 'relation_sheet.csv', './uploads/null/relation_sheet-1689561927042.csv'),
(159, 1018, 45, NULL, NULL, '2023-07-07 18:55:14', 'nowa_nazwa_enter', './uploads/null/file-1689621433044.csv'),
(160, 1018, 45, NULL, NULL, '2023-07-07 18:55:38', 'nowa_nazwa_enter', './uploads/null/file-1688837166568.csv'),
(161, 1018, 45, NULL, 200, '2023-07-07 18:57:10', 'nowa_nazwa_enter', './uploads/200/file-1689538870584.csv'),
(163, 59129, 386, 1, NULL, '2023-07-12 18:58:28', 'triplex bez naglowka.csv', './uploads/200/triplex bez naglowka-1689506816137.csv'),
(164, 12810097, 3971, 1, NULL, '2023-07-12 18:58:29', 'zrzut towarow z idosell.csv', './uploads/200/zrzut towarow z idosell-1689187520794.csv'),
(165, 59129, 386, 1, NULL, '2023-07-12 19:26:53', 'triplex bez naglowka.csv', './uploads/200/triplex bez naglowka-1689824376484.csv'),
(166, 12810097, 3971, 1, NULL, '2023-07-12 19:26:55', 'zrzut towarow z idosell.csv', './uploads/200/zrzut towarow z idosell-1689491091075.csv'),
(167, 59129, 386, 2, NULL, '2023-07-12 19:27:37', 'triplex bez naglowka.csv', './uploads/null/triplex bez naglowka-1689522775863.csv'),
(168, 12810097, 3971, 2, NULL, '2023-07-12 19:27:38', 'zrzut towarow z idosell.csv', './uploads/null/zrzut towarow z idosell-1689619808343.csv'),
(169, 59129, 386, 1, NULL, '2023-07-12 19:34:25', 'triplex bez naglowka.csv', './uploads/200/triplex bez naglowka-1689948216286.csv'),
(170, 12810097, 3971, 1, NULL, '2023-07-12 19:34:27', 'zrzut towarow z idosell.csv', './uploads/200/zrzut towarow z idosell-1689636481674.csv'),
(171, 59129, 386, 2, NULL, '2023-07-12 19:43:57', 'triplex bez naglowka.csv', './uploads/null/triplex bez naglowka-1690172306107.csv'),
(172, 12810097, 3971, 2, NULL, '2023-07-12 19:43:58', 'zrzut towarow z idosell.csv', './uploads/null/zrzut towarow z idosell-1689319794561.csv'),
(173, 59129, 386, 1, NULL, '2023-07-12 19:57:32', 'triplex bez naglowka.csv', './uploads/200/triplex bez naglowka-1689626939827.csv'),
(174, 16204, 50, 1, NULL, '2023-07-12 19:57:33', 'test.csv', './uploads/200/test-1689206708098.csv'),
(175, 59129, 386, 1, NULL, '2023-07-12 20:00:00', 'triplex bez naglowka.csv', './uploads/200/triplex bez naglowka-1689558386467.csv'),
(176, 19643, 3, 1, NULL, '2023-07-12 20:00:00', 'test.csv', './uploads/200/test-1690127266661.csv'),
(177, 59129, 386, 2, NULL, '2023-07-12 21:07:17', 'triplex bez naglowka.csv', './uploads/null/triplex bez naglowka-1689222763901.csv'),
(178, 12810097, 3971, 2, NULL, '2023-07-12 21:07:18', 'zrzut towarow z idosell.csv', './uploads/null/zrzut towarow z idosell-1689442751343.csv');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `match_schemas`
--

CREATE TABLE `match_schemas` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `owner_user_id` int(11) DEFAULT NULL,
  `owner_team_id` int(11) DEFAULT NULL,
  `created_datetime` datetime NOT NULL,
  `matched_strings_array` text NOT NULL,
  `automatic_matcher_settings_object` text NOT NULL,
  `columns_settings_object` text DEFAULT NULL,
  `match_type` int(11) NOT NULL,
  `match_function` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `match_schemas`
--

INSERT INTO `match_schemas` (`id`, `name`, `owner_user_id`, `owner_team_id`, `created_datetime`, `matched_strings_array`, `automatic_matcher_settings_object`, `columns_settings_object`, `match_type`, `match_function`) VALUES
(18, 'nowy 1', 2, NULL, '2023-07-12 14:21:00', '[[\"1910;PLN;;;0;markaniezd;0;Kategoriat;0;\",\"TXB058;49S12BATER;BATERIA;21;249;00z;249;00zhttpsww\"],[\"1413;PLN;;;1308137279;Triplex;0;Kategoriat;0;\",\"TXB810;100S1BATER;BATERIA;21;342;00z;342;00zhttpsww\"],[\"178;PLN;;;1308137279;Triplex;1214553944;Zimneognie;0;\",\"TXF428D;ZIMNEOGNIE;ZIMNEOGNIE;501;8;96z;8;96zhttpsww\"],[\"3129;PLN;;;1308137279;Triplex;1214553944;Zimneognie;0;\",\"TXF428A;ZIMNEOGNIE;ZIMNEOGNIE;501;8;96z;8;96zhttpsww\"]]', '[{\"conditions\":[{\"dataSheet\":\"/description/name[pol]\",\"relationSheet\":\"Kod\"}],\"logicalOperators\":[]}]', '{\"showInSelectMenuColumnsDataSheet\":[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],\"outputSheetExportColumns\":[false,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,false,1,1,1,1,1,1,1,1],\"dataSheetColumnsVisibility\":[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],\"relationSheetColumnsVisibility\":[false,true,true,false,false,false,false,false,false],\"outputSheetColumnsVisibility\":[]}', 0, 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `match_schemas_sheets`
--

CREATE TABLE `match_schemas_sheets` (
  `id` int(11) NOT NULL,
  `data_sheet` int(11) NOT NULL,
  `relation_sheet` int(11) NOT NULL,
  `match_schema` int(11) NOT NULL,
  `number_of_matched_rows` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `match_schemas_sheets`
--

INSERT INTO `match_schemas_sheets` (`id`, `data_sheet`, `relation_sheet`, `match_schema`, `number_of_matched_rows`) VALUES
(20, 130, 131, 18, 4);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `subscriptions_types`
--

CREATE TABLE `subscriptions_types` (
  `is_default_and_free` tinyint(1) NOT NULL,
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `price_pln` float NOT NULL,
  `price_eur` float NOT NULL,
  `price_usd` float NOT NULL,
  `users_per_team` int(11) NOT NULL,
  `files_per_team` int(11) NOT NULL,
  `rows_per_file` int(11) NOT NULL,
  `columns_per_file` int(11) NOT NULL,
  `size_per_file` int(11) NOT NULL,
  `size_per_team` int(11) NOT NULL,
  `schemas_per_team` int(11) NOT NULL,
  `matches_per_month` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `creator_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `team_url` varchar(512) NOT NULL,
  `current_subscription_plan_id` int(11) DEFAULT NULL,
  `current_subscription_plan_deadline` datetime DEFAULT NULL,
  `subscription_renewal` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `creator_id`, `name`, `owner_id`, `team_url`, `current_subscription_plan_id`, `current_subscription_plan_deadline`, `subscription_renewal`) VALUES
(200, 1, 'wuje', 1, 'wuje.rowmatcher.com', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `teams_current_subscriptions_plans_migrations_registry`
--

CREATE TABLE `teams_current_subscriptions_plans_migrations_registry` (
  `id` int(11) NOT NULL,
  `current_datetime` datetime NOT NULL,
  `team_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `trasactions`
--

CREATE TABLE `trasactions` (
  `id` int(11) NOT NULL,
  `create_datetime` datetime NOT NULL,
  `status` varchar(128) NOT NULL,
  `payment_operator_token` text NOT NULL,
  `invoice_row_id` int(11) NOT NULL,
  `payment_operator_name` varchar(512) DEFAULT NULL,
  `payment_operator_unit_id` int(11) DEFAULT NULL,
  `is_invoice_applicable` tinyint(1) NOT NULL,
  `invoice_number` text NOT NULL,
  `invoice_buyer_name` text NOT NULL,
  `invoice_nip` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `team_id` int(11) DEFAULT NULL,
  `show_user_files` tinyint(4) NOT NULL,
  `show_user_match_schemas` tinyint(4) NOT NULL,
  `can_edit_team_match_schemas` tinyint(4) NOT NULL,
  `can_delete_team_match_schemas` tinyint(4) NOT NULL,
  `can_edit_team_files` tinyint(4) NOT NULL,
  `can_delete_team_files` tinyint(4) NOT NULL,
  `active` tinyint(4) NOT NULL DEFAULT 0,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `password`, `team_id`, `show_user_files`, `show_user_match_schemas`, `can_edit_team_match_schemas`, `can_delete_team_match_schemas`, `can_edit_team_files`, `can_delete_team_files`, `active`, `email`) VALUES
(1, '6ab6b629c45db2cb7aa88eb5f04db6e617fbe87b81ec6a6e1ad2d97e8066d841', 200, 0, 0, 1, 1, 1, 1, 1, 'sajmon0031@gmail.com'),
(2, '6ab6b629c45db2cb7aa88eb5f04db6e617fbe87b81ec6a6e1ad2d97e8066d841', NULL, 0, 0, 1, 1, 1, 1, 1, 'bartosz.ambrozkiewicz@gmail.com'),
(3, '6ab6b629c45db2cb7aa88eb5f04db6e617fbe87b81ec6a6e1ad2d97e8066d841', NULL, 0, 0, 1, 1, 1, 1, 1, 'bartosz.ambrozkiewicz@gmail.com'),
(4, '6ab6b629c45db2cb7aa88eb5f04db6e617fbe87b81ec6a6e1ad2d97e8066d841', NULL, 0, 0, 1, 1, 1, 1, 1, 'szymon.burak0031@gmail.com'),
(7, '6ab6b629c45db2cb7aa88eb5f04db6e617fbe87b81ec6a6e1ad2d97e8066d841', 200, 1, 1, 1, 1, 1, 1, 1, 'new_account@gmail.com'),
(11, '6ab6b629c45db2cb7aa88eb5f04db6e617fbe87b81ec6a6e1ad2d97e8066d841', NULL, 0, 0, 0, 0, 0, 0, 0, 'NaTFOI8ATy@example.com'),
(12, '6ab6b629c45db2cb7aa88eb5f04db6e617fbe87b81ec6a6e1ad2d97e8066d841', NULL, 0, 0, 0, 0, 0, 0, 0, 'NAQmYlcA8x@example.com'),
(13, '6ab6b629c45db2cb7aa88eb5f04db6e617fbe87b81ec6a6e1ad2d97e8066d841', NULL, 0, 0, 0, 0, 0, 0, 0, 'wVx6xTfIcd@example.com'),
(14, '6ab6b629c45db2cb7aa88eb5f04db6e617fbe87b81ec6a6e1ad2d97e8066d841', NULL, 0, 0, 0, 0, 0, 0, 0, '0g5LPj3E5I@example.com');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users_verification`
--

CREATE TABLE `users_verification` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expire_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_verification`
--

INSERT INTO `users_verification` (`email`, `token`, `expire_date`) VALUES
('0g5LPj3E5I@example.com', '3a90ad83-6e31-492e-97a1-154389c47233', '0000-00-00 00:00:00'),
('9hhhQ0q1Nq@example.com', '5f776931-d0d5-40b6-86a3-7b07ad5040b7', '0000-00-00 00:00:00'),
('bartosz.ambrozkiewicz@gmail.com', '9cbbe4ac-dc52-4780-9aef-9d396d636647', '0000-00-00 00:00:00'),
('bartosz@ambrozkiewicz.pl', '7d38a794-6126-4415-9b82-2de0938b64b5', '0000-00-00 00:00:00'),
('bXL11zYtNz@example.com', 'f2e515af-6be1-4ec4-9b0b-a12656b664fe', '0000-00-00 00:00:00'),
('J6PmPM69fl@example.com', 'b4105afb-e81a-48c7-82f3-ab9243b18f7c', '0000-00-00 00:00:00'),
('NAQmYlcA8x@example.com', 'a55514b3-acde-4d9d-9ae9-570bb9f9aa7a', '0000-00-00 00:00:00'),
('NaTFOI8ATy@example.com', '04001576-9456-431b-98e5-85e03d209276', '0000-00-00 00:00:00'),
('new_account@gmail.com', '24986bc7-39b6-484e-9345-68637e007747', '0000-00-00 00:00:00'),
('sajmon0031@gmail.com', '5811acaa-1ebb-4f0d-9dc5-0ea849a2c7ec', '0000-00-00 00:00:00'),
('wVx6xTfIcd@example.com', 'e025361e-ce31-460a-827f-0479816031d9', '0000-00-00 00:00:00');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `add_to_team_users_requests`
--
ALTER TABLE `add_to_team_users_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `automatic_match_operations_registry`
--
ALTER TABLE `automatic_match_operations_registry`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `correlation_jobs`
--
ALTER TABLE `correlation_jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `match_schemas`
--
ALTER TABLE `match_schemas`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `match_schemas_sheets`
--
ALTER TABLE `match_schemas_sheets`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `subscriptions_types`
--
ALTER TABLE `subscriptions_types`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `teams_current_subscriptions_plans_migrations_registry`
--
ALTER TABLE `teams_current_subscriptions_plans_migrations_registry`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `trasactions`
--
ALTER TABLE `trasactions`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `users_verification`
--
ALTER TABLE `users_verification`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `add_to_team_users_requests`
--
ALTER TABLE `add_to_team_users_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `automatic_match_operations_registry`
--
ALTER TABLE `automatic_match_operations_registry`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=179;

--
-- AUTO_INCREMENT for table `match_schemas`
--
ALTER TABLE `match_schemas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `match_schemas_sheets`
--
ALTER TABLE `match_schemas_sheets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `subscriptions_types`
--
ALTER TABLE `subscriptions_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teams_current_subscriptions_plans_migrations_registry`
--
ALTER TABLE `teams_current_subscriptions_plans_migrations_registry`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trasactions`
--
ALTER TABLE `trasactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
