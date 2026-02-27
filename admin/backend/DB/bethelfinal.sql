-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 27, 2026 at 09:41 PM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bethelfinal`
--

-- --------------------------------------------------------

--
-- Table structure for table `annualachievements`
--

DROP TABLE IF EXISTS `annualachievements`;
CREATE TABLE IF NOT EXISTS `annualachievements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `year` varchar(250) NOT NULL,
  `summary` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `year` (`year`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `annualachievements`
--

INSERT INTO `annualachievements` (`id`, `year`, `summary`) VALUES
(3, '2002', 'Bethel began as a group of students who praised God every Friday through songs. Later, they transformed into a worship team dedicated to praise and worship'),
(4, '2003', 'Bethel appointed its first leader, named MUSAFIRI Jean de Dieu. That same year, Bethel was asked to become a Chorale, but it declined, preferring to remain <span class =\"goldenSpan\"> Groupe de Louange et Adoration.</span>'),
(5, '2004', '<i>President :  MUSAFIRI</i> did not return to school, so Jean Paul, then a second-year student, became president.'),
(6, '2005', 'Bethel faced challenges, including being prohibited from singing and lacking representation in the church committee. On <span class =\"goldenSpan\"> May 17, 2005 </span>, it was officially allowed to become a Chorale by both the school administration and the church, and was named  <span class =\"goldenSpan\"> Bethel Choir</span> . In 2016, the name was extended to include <span>Family</span>'),
(7, '2008', 'Graduated members decided that their divine calling did not end at G.S.O.B, and they launched a ministry called <Span> Bethel Ministry</Span>. That year, they also established Bethel’s mission: <i>\"Binyuze muritwe Imana yigaragarize abandi\"</i>.'),
(8, '2012', 'The Bethel Choir <a href=\"about.html#B_logo\" class=\"goldenSpan\" >logo</a> was introduced. Bethel celebrated its first anniversary, marking seven years (7-Year B-Anniversary).\r\n                 That same year, a sports division was launched within Bethel, called <span><i>B-Sport</i></span>.'),
(9, '2013', 'A football competition named <span><i>B-CHAMPION</i></span>.was initiated.'),
(10, '2015', 'New uniforms were purchased for the choir.'),
(11, '2016', 'A week of thanksgiving was organized to celebrate Bethel’s journey.'),
(12, '2018-2019', 'We achieved many things but among them we had time to teach members more about having you personal prayer with God,reading the word of God.\r\n                                          We had 2 songs that we recorded. We had many sorties out side of the college. <i>( foursquare Gospel church) </i>'),
(13, '2023-2024', 'We recorded a new audio song titled <span class =\"goldenSpan\"> DUFITIMANIKORA.</span>'),
(14, '2024-2025', 'We organized a fellowship meal for the choir, and we are currently working on creating a website for the choir. In addition, we spread the message in every possible way, which helped many young people grow spiritually and gain a deeper understanding of the Word of God.');

-- --------------------------------------------------------

--
-- Table structure for table `bethelcommitte`
--

DROP TABLE IF EXISTS `bethelcommitte`;
CREATE TABLE IF NOT EXISTS `bethelcommitte` (
  `commit_id` int NOT NULL AUTO_INCREMENT,
  `era` varchar(255) NOT NULL,
  `ecree` text NOT NULL,
  `picture` varchar(255) NOT NULL,
  PRIMARY KEY (`commit_id`),
  UNIQUE KEY `era` (`era`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bethelcommitte`
--

INSERT INTO `bethelcommitte` (`commit_id`, `era`, `ecree`, `picture`) VALUES
(4, '2023-2024', 'Bethel peurtas sa gradus de le cielo,Je suis Bethel', 'media/693960a5b1654_From KlickPin CF 34+ Joker Wallpapers _ Free download _ Best Collection _ Joker wallpapers Joker Joker background.jpg'),
(5, '2024-2025', 'Bethel peurtas sa gradus de le cielo,Je suis Bethel', 'media/6939bfaae4d10_From KlickPin CF 81+ Verdes Wallpapers _ Free download _ Best Collection en 2025 _ Fondos de pantalla verde Fondo de escritorio de ordenador Fondo de pantalla iphone verano.jpg'),
(6, '2022-2023', 'Bethel peurtas sa gradus de le cielo,Je suis Bethel', 'media/6939c0468f1ed_Blue Dark Professional Geometric Business Project Presentation .png');

-- --------------------------------------------------------

--
-- Table structure for table `bethelcommittemember`
--

DROP TABLE IF EXISTS `bethelcommittemember`;
CREATE TABLE IF NOT EXISTS `bethelcommittemember` (
  `id` int NOT NULL AUTO_INCREMENT,
  `commit_id` int NOT NULL,
  `names` varchar(255) NOT NULL,
  `post` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `commit_id` (`commit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bethelcommittemember`
--

INSERT INTO `bethelcommittemember` (`id`, `commit_id`, `names`, `post`) VALUES
(8, 6, 'TRIS', 'Intercessor'),
(9, 6, 'Esperance ', 'Song leader'),
(12, 4, 'EL President', 'Turikumwenayo Moise'),
(13, 4, 'Disciplinary', 'Niyonkuru Cyubahiro'),
(14, 4, 'Song Leader', 'Tambineza Jacques'),
(16, 5, 'Turikumwenayo Moise', 'President'),
(17, 5, 'SHIMO Adelin TRIS', 'IT');

-- --------------------------------------------------------

--
-- Table structure for table `cta`
--

DROP TABLE IF EXISTS `cta`;
CREATE TABLE IF NOT EXISTS `cta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page` varchar(250) NOT NULL,
  `heading` varchar(250) NOT NULL,
  `caption` varchar(250) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page` (`page`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cta`
--

INSERT INTO `cta` (`id`, `page`, `heading`, `caption`) VALUES
(1, 'Home', 'BETHEL FAMILY CHOIR, THE HOLY GATES OF HEAVEN ', 'A Foundation Built on Truth, Love, and Unity.'),
(2, 'Service', 'OUR DEDICATED SERVICES ', 'Serving the community and the fellowship through various gifts and callings. Join us in making an impact! 34'),
(3, 'Gallery', 'Moments of Fellowship', 'A visual record of our worship, outreach events, and community gatherings.'),
(4, 'History', 'Our Journey in Faith and Song', 'Celebrating over two decades of music, ministry, and fellowship.'),
(5, 'About', 'OUR STORY, OUR MISSION Tris', 'A Foundation Built on Faith, Harmony, and Community.');

-- --------------------------------------------------------

--
-- Table structure for table `flyer`
--

DROP TABLE IF EXISTS `flyer`;
CREATE TABLE IF NOT EXISTS `flyer` (
  `id` int NOT NULL,
  `link` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `flyer`
--

INSERT INTO `flyer` (`id`, `link`, `status`) VALUES
(1, 'media/69a1e0056403a_550771073_17902196166251801_902449888223553518_n.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `pictures`
--

DROP TABLE IF EXISTS `pictures`;
CREATE TABLE IF NOT EXISTS `pictures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `caption` varchar(250) NOT NULL,
  `slideshow` tinyint(1) NOT NULL DEFAULT '0',
  `link` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pictures`
--

INSERT INTO `pictures` (`id`, `caption`, `slideshow`, `link`) VALUES
(1, 'ATS', 1, 'media/69394568769ab_Untitled.jpeg'),
(2, 'Bethel visited', 1, 'media/694589ca66068_2100914c-293b-42ad-9824-7773055685e9.png'),
(3, '2024-2025 Committe', 1, 'media/69458a2b239e8_2024_2025 (1).jpeg'),
(4, 'Bethel graduation 2021', 1, 'media/69458a6084ef4_14d40086-59fc-4512-b057-2da8a873a4de copy.png');

-- --------------------------------------------------------

--
-- Table structure for table `presidentsword`
--

DROP TABLE IF EXISTS `presidentsword`;
CREATE TABLE IF NOT EXISTS `presidentsword` (
  `id` int NOT NULL,
  `name` varchar(250) NOT NULL,
  `message` text NOT NULL,
  `image` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `presidentsword`
--

INSERT INTO `presidentsword` (`id`, `name`, `message`, `image`) VALUES
(1, 'kwizera', 'Welcome to the Bethel Choir family, \r\n    a ministry rooted in worship and service to our Lord Jesus Christ. As the Psalmist declares, \r\n    “Sing to the Lord a new song; sing to the Lord, all the earth” (Psalm 96:1), \r\n    we are committed to lifting our voices in praise, spreading the gospel through music, \r\n    and nurturing spiritual growth among our members and community. Guided by Colossians 3:16, \r\n    which reminds us to let the message of Christ dwell richly among us through psalms, hymns, and songs \r\n    from the Spirit, our mission is to glorify God, inspire hearts, and build a fellowship where faith and music unite. \r\n    May this platform be a place of encouragement, joy, \r\n    and a reminder that “Let everything that has breath praise the Lord” (Psalm 150:6).', 'media/IMG-20240411-WA0004.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `scriptureofday`
--

DROP TABLE IF EXISTS `scriptureofday`;
CREATE TABLE IF NOT EXISTS `scriptureofday` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(250) NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `scriptureofday`
--

INSERT INTO `scriptureofday` (`id`, `title`, `content`) VALUES
(1, '2 John 4:2-6', 'Tris Grace be with you, mercy, and peace, from God the Father, and from the Lord Jesus Christ, the Son of the Father, in truth and love. 4 I rejoiced greatly that I found of thy children walking in truth, as we have received a commandment from the Father.');

-- --------------------------------------------------------

--
-- Table structure for table `songs`
--

DROP TABLE IF EXISTS `songs`;
CREATE TABLE IF NOT EXISTS `songs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(250) NOT NULL,
  `link` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `songs`
--

INSERT INTO `songs` (`id`, `title`, `link`) VALUES
(1, 'Musenge by Bethel Family Choir', 'https://www.youtube.com/embed/pv7Ty2y_wMQ?si=MKAkq8k3b_0vN02T'),
(2, 'Umutima wanjye', 'https://www.youtube.com/embed/1BigSTPT9uc?si=FPTrrcFfu4D4QTQe'),
(4, 'IBIHE BIDASANZWE MURI GROUPE PROTESTANT I BUTARE BY BETHEL FAMILY CHOIR', 'https://www.youtube.com/embed/hAftH74PKw0?si=LMiZqRB4eC--eOju');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(250) NOT NULL,
  `passkey` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `passkey`) VALUES
(1, 'bethel@gmail.com', '$2y$10$sB0jAtDp3jNe3lLaBiYUJOvY5//ZVvHbHEQwW9LwUnoZMjerprP8u');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bethelcommittemember`
--
ALTER TABLE `bethelcommittemember`
  ADD CONSTRAINT `bethelcommittemember_ibfk_1` FOREIGN KEY (`commit_id`) REFERENCES `bethelcommitte` (`commit_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
