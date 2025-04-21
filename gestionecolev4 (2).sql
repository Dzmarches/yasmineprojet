-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3307
-- Généré le :  sam. 12 avr. 2025 à 10:55
-- Version du serveur :  10.3.9-MariaDB
-- Version de PHP :  7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `gestionecolev4`
--

-- --------------------------------------------------------

--
-- Structure de la table `anneescolaire`
--

DROP TABLE IF EXISTS `anneescolaire`;
CREATE TABLE IF NOT EXISTS `anneescolaire` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `titre_ar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datedebut` datetime DEFAULT NULL,
  `datefin` datetime DEFAULT NULL,
  `archiver` int(11) DEFAULT 0
) ;

-- --------------------------------------------------------

--
-- Structure de la table `attestations`
--

DROP TABLE IF EXISTS `attestations`;
CREATE TABLE IF NOT EXISTS `attestations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modeleTexte` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ecoleId` int(11) NOT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`),
  KEY `ecoleeId` (`ecoleeId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `attestations`
--

INSERT INTO `attestations` (`id`, `nom`, `description`, `modeleTexte`, `module`, `ecoleId`, `ecoleeId`, `archiver`, `createdAt`, `updatedAt`) VALUES
(2, 'recu paiement inscription', '', '<p>[logoecoleP] &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [dateToday] : </p><p style=\"text-align: right;\">Numero du recu:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </p><p style=\"text-align: center;\"><br></p><h2 style=\"text-align: center;\"><strong>Recu de paiement&nbsp;</strong> </h2><p>  \n\n	\n	\n	\n	\n	\n	\n	<br></p><table style=\"border-collapse:collapse;width: 100%;\"><tbody>\n<tr>\n	<td style=\"width: 20%;\">Nom et prénom elève<br></td>\n	<td style=\"width: 20%;\">Nom et prénom parent<br></td>\n	<td style=\"width: 20%;\">Mode Paiement<br></td>\n	<td style=\"width: 20%;\">Détails<br></td>\n	<td style=\"width: 20%;\">Montant\n<br></td></tr>\n<tr>\n	<td style=\"width: 20%;\">[nom][prenom]<br></td>\n	<td style=\"width: 20%;\">[nomparent][prenomparent]<br></td>\n	<td style=\"width: 20%;\">[modepaiement]<br></td>\n	<td style=\"width: 20%;\"><br></td>\n	<td style=\"width: 20%;\">[montant]<br></td></tr></tbody></table><p style=\"text-align: right;\">Total:&nbsp;[montant]</p><p style=\"text-align: right;\"><br></p><p style=\"text-align: right;\"><br></p><p style=\"text-align: right;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\">Signateur :&nbsp;</p>', 'eleve', 1, NULL, 0, '2025-03-26 07:59:34', '2025-03-26 07:59:34'),
(4, 'ATTESTATION DE TRAVAIL                          ', 'test', '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<br></p><h4>\n<br>\n<br><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<u><strong><em>&nbsp; ATTESTATION&nbsp; DE TRAVAIL</em></strong></u></span><br></h4><p><br></p>\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp;</span><br><strong><span style=\"font-family: Tahoma; font-weight: bold;\">Réf&nbsp;:/DRH/[dateToday]</span></strong></p>\n\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><span style=\"font-family: Tahoma;\">&nbsp;</span><br></p>\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><span style=\"font-family: Tahoma;\">&nbsp;</span><br></p>\n<p class=\"MsoNormal\" align=\"right\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: right;\"><strong><span style=\"font-family: Tahoma; font-weight: bold;\">Ecole [nomecoleP] </span></strong></p>\n\n\n\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><br></p>\n\n\n\n\n\n\n\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify;\"><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp;</span><br></p>\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify;\"><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp;</span><br></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">Nous soussignés, Société</span><strong><span style=\"font-family: Tahoma; font-weight: bold;\">&nbsp;[nomecoleP] ,[nomecole]</span></strong><span style=\"font-family: Tahoma;\">&nbsp;</span><span style=\"font-family: Tahoma;\">&nbsp;attestons par la présente que: Mr/Mlle/Mme[nom][prenom]</span><span style=\"font-family: Tahoma;\"> né le[datenaiss]</span><span style=\"font-family: Tahoma;\">&nbsp;à[Lieunais]</span><strong><span style=\"font-family: Tahoma; font-weight: bold;\">,</span></strong><span style=\"font-family: Tahoma;\">&nbsp;exerce au sein de notre société depuis le [daterecru]</span><span style=\"font-family: Tahoma;\">, et occupe actuellement la fonction de[poste]&nbsp;à ce jour</span><span style=\"font-family: Tahoma;\">.</span></p><p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\"><br></span></p>\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">En foi de quoi, la présente attestation est délivrée, sur demande de l\'intéressé pour servir et valoir ce que de droit.</span></p>\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><br></p>\n', 'employe', 1, 1, 0, '2025-03-27 08:56:59', '2025-04-11 15:14:10'),
(8, 'CERTIFICAT DE TRAVAIL', '', '<h4 align=\"center\" style=\"break-after: avoid; font-family: &quot;Times New Roman&quot;; font-weight: bold; text-align: center;\"><u>CERTIFICAT DE TRAVAIL</u></h4>\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp;</span><br></p>\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp;</span><br></p>\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><strong><span style=\"font-family: Tahoma; font-weight: bold;\">Réf&nbsp;: N°/DRH/</span></strong></p><p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><strong><span style=\"font-family: Tahoma; font-weight: bold;\">Ecole:[nomecoleP]</span></strong><br></p>\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><br></p>\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify;\"><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp;</span><br></p>\n\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify;\"><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp;</span><br></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">Je, soussigné Mr/Mlle/Mme. </span><strong><span style=\"font-family: Tahoma; font-weight: bold;\">....</span></strong><span style=\"font-family: Tahoma;\">, agissant en qualité de </span><strong><span style=\"font-family: Tahoma; font-weight: bold;\">Gérant</span></strong><span style=\"font-family: Tahoma;\">&nbsp;de la Société</span><strong><span style=\"font-family: Tahoma; font-weight: bold;\">&nbsp;[nomecoleP]</span></strong><span style=\"font-family: Tahoma;\">&nbsp;.</span></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">&nbsp;</span><br></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">Déclare et certifie que Mr/Mlle/Mme [nom][prenom]</span><strong><span style=\"font-family: Tahoma; font-weight: bold;\">,</span></strong><span style=\"font-family: Tahoma;\">&nbsp;né le[datenaiss]</span><span style=\"font-family: Tahoma;\">&nbsp;à [Lieunais]</span><span style=\"font-family: Tahoma;\">&nbsp;</span><span style=\"font-family: Tahoma;\">, a exercé au sein de la société du [daterecru]</span><span style=\"font-family: Tahoma;\">&nbsp;</span><span style=\"font-family: Tahoma;\">&nbsp;en qualité de [poste]</span><span style=\"font-family: Tahoma;\">.</span></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><br></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">Mr/Mlle/Mme </span><strong><span style=\"font-family: Tahoma; font-weight: bold;\">[nom][prenom]&nbsp;</span></strong><span style=\"font-family: Tahoma;\">nous quitte libre de tout engagement. </span></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">&nbsp;</span><br></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">Ce certificat est délivré pour servir et valoir ce que de droit.</span></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">&nbsp;</span><br></p>\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><br></p>\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify;\"><span style=\"font-family: Tahoma;\">&nbsp;</span><br></p>', 'employe', 1, NULL, 0, '2025-04-11 15:21:56', '2025-04-11 15:21:56');

-- --------------------------------------------------------

--
-- Structure de la table `congeabsences`
--

DROP TABLE IF EXISTS `congeabsences`;
CREATE TABLE IF NOT EXISTS `congeabsences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_demande` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statut` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'En attente',
  `dateDebut` datetime DEFAULT NULL,
  `dateFin` datetime DEFAULT NULL,
  `commentaire` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motif` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jour_congeMois` float DEFAULT 0,
  `jour_consomme` float DEFAULT 0,
  `jour_restant` float DEFAULT 0,
  `archiver` int(11) DEFAULT 0,
  `fichier` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employe_id` int(11) DEFAULT NULL,
  `ecoleId` int(11) NOT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employe_id` (`employe_id`),
  KEY `ecoleId` (`ecoleId`),
  KEY `ecoleeId` (`ecoleeId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `congeabsences`
--

INSERT INTO `congeabsences` (`id`, `type_demande`, `statut`, `dateDebut`, `dateFin`, `commentaire`, `motif`, `jour_congeMois`, `jour_consomme`, `jour_restant`, `archiver`, `fichier`, `employe_id`, `ecoleId`, `ecoleeId`, `createdAt`, `updatedAt`) VALUES
(10, 'Congé Annuel', 'Refusé', '2025-04-01 00:00:00', '2025-04-04 00:00:00', '', 'vous avez le droit de 2.5 de jours de  congé  seulement', 2.5, 0, 2.5, 0, '/conges/employes/10/E10_Congé_Annuel_2025-04-11T14-40-27.png', 10, 1, NULL, '2025-04-11 14:40:27', '2025-04-11 14:47:33'),
(11, 'Congé Annuel', 'Accepté', '2025-04-01 00:00:00', '2025-04-02 00:00:00', '', '', 2.5, 2, 0.5, 0, NULL, 10, 1, NULL, '2025-04-11 14:48:21', '2025-04-11 14:48:35');

-- --------------------------------------------------------

--
-- Structure de la table `congeannuels`
--

DROP TABLE IF EXISTS `congeannuels`;
CREATE TABLE IF NOT EXISTS `congeannuels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ecoleId` int(11) NOT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `dateDebut` date DEFAULT NULL,
  `dateFin` date DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`),
  KEY `ecoleeId` (`ecoleeId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `congeannuels`
--

INSERT INTO `congeannuels` (`id`, `ecoleId`, `ecoleeId`, `dateDebut`, `dateFin`, `archiver`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2025-03-01', '2025-03-30', 0, '2025-03-17 13:07:29', '2025-03-17 13:07:29'),
(2, 1, NULL, '2025-03-01', '2025-04-30', 0, '2025-04-02 18:01:31', '2025-04-02 18:01:31');

-- --------------------------------------------------------

--
-- Structure de la table `cyclescolaires`
--

DROP TABLE IF EXISTS `cyclescolaires`;
CREATE TABLE IF NOT EXISTS `cyclescolaires` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomCycle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomCycleArabe` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `classement` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `demandeautorisations`
--

DROP TABLE IF EXISTS `demandeautorisations`;
CREATE TABLE IF NOT EXISTS `demandeautorisations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_demande` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'En attente',
  `dateDebut` datetime NOT NULL,
  `dateFin` datetime NOT NULL,
  `commentaire` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motif` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RaisonA` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `eleve_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ecoleannescolaires`
--

DROP TABLE IF EXISTS `ecoleannescolaires`;
CREATE TABLE IF NOT EXISTS `ecoleannescolaires` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ecoleId` int(11) DEFAULT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `anneescolaireId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `EcoleAnneScolaires_anneescolaireId_ecoleId_unique` (`ecoleId`,`anneescolaireId`),
  UNIQUE KEY `EcoleAnneScolaires_anneescolaireId_ecoleeId_unique` (`ecoleeId`),
  KEY `anneescolaireId` (`anneescolaireId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ecolematieres`
--

DROP TABLE IF EXISTS `ecolematieres`;
CREATE TABLE IF NOT EXISTS `ecolematieres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ecoleId` int(11) DEFAULT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `matiereId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `EcoleMatieres_matiereId_ecoleId_unique` (`ecoleId`,`matiereId`),
  UNIQUE KEY `EcoleMatieres_matiereId_ecoleeId_unique` (`ecoleeId`),
  KEY `matiereId` (`matiereId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecolematieres`
--

INSERT INTO `ecolematieres` (`id`, `ecoleId`, `ecoleeId`, `matiereId`) VALUES
(1, 1, NULL, 1),
(2, 1, NULL, 2);

-- --------------------------------------------------------

--
-- Structure de la table `ecoleniveaus`
--

DROP TABLE IF EXISTS `ecoleniveaus`;
CREATE TABLE IF NOT EXISTS `ecoleniveaus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ecoleId` int(11) DEFAULT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `niveauId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `niveauId` (`niveauId`),
  KEY `EcoleNiveaus_niveauId_ecoleId_unique` (`ecoleId`,`niveauId`) USING BTREE,
  KEY `EcoleNiveaus_niveauId_ecoleeId_unique` (`ecoleeId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecoleniveaus`
--

INSERT INTO `ecoleniveaus` (`id`, `ecoleId`, `ecoleeId`, `niveauId`, `archiver`) VALUES
(1, 1, NULL, 3, 0),
(2, 1, NULL, 4, 0);

-- --------------------------------------------------------

--
-- Structure de la table `ecoleprincipals`
--

DROP TABLE IF EXISTS `ecoleprincipals`;
CREATE TABLE IF NOT EXISTS `ecoleprincipals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomecole` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_arecole` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emailecole` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephoneecole` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `maps` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fix` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `facebook` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insta` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkdin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rc` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rib` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nif` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numerodagrimo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateFinDagrimo` datetime NOT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecoleprincipals`
--

INSERT INTO `ecoleprincipals` (`id`, `nomecole`, `nom_arecole`, `logo`, `adresse`, `emailecole`, `telephoneecole`, `maps`, `fix`, `facebook`, `insta`, `linkdin`, `rc`, `rib`, `nif`, `numerodagrimo`, `dateFinDagrimo`, `archiver`) VALUES
(1, 'ecoleA', 'ecoleA', '/images/Ecole/1742901299296-settings.png', 'ecoleA', 'ecoleA@gmail.com', '01234567', '[[36.75418037666703,5.06051119941993],[36.75412450230599,5.060833016497997],[36.7540385416711,5.060779380318299],[36.75403424363685,5.060457563240273]]', '999999', 'fb', 'insta', 'lnkdn', '6666666', '999999', '55555', '1', '2025-03-05 00:00:00', 0),
(4, 'ecoleB', 'ecoleB', '/images/Ecole/1742901327691-settings.png', 'ecoleB', 'ecoleB@gmail.com', '0123456777', '[[36.7536509788938,5.062717795372009],[36.75375413216521,5.0627338886260995],[36.75375413216521,5.062986016273499],[36.75363808472513,5.062986016273499]]', '99999988', 'fb', 'insta', 'lnkdn', '6666666', '999999', '55555', '1', '2025-03-05 00:00:00', 0);

-- --------------------------------------------------------

--
-- Structure de la table `ecoles`
--

DROP TABLE IF EXISTS `ecoles`;
CREATE TABLE IF NOT EXISTS `ecoles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomecole` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_arecole` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emailecole` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephoneecole` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `maps` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fix` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `facebook` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insta` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkdin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rc` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rib` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `siegesocial` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nif` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cycle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ecoleId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecoles`
--

INSERT INTO `ecoles` (`id`, `nomecole`, `nom_arecole`, `adresse`, `emailecole`, `telephoneecole`, `maps`, `fix`, `facebook`, `insta`, `linkdin`, `rc`, `rib`, `siegesocial`, `nif`, `cycle`, `ecoleId`, `archiver`) VALUES
(1, 'sousEcoleA', 'مدرسة', 'bejaia', 'sousEcoleA@gmail.com', '012345678', '[[36.752421792226485,5.056806206703186],[36.75243038847544,5.056929588317872],[36.75234012781318,5.056934952735902],[36.752297146508106,5.056849122047424]]', '12121212', 'fb', 'insta', 'lnkdn', '7777', '5555', NULL, '4444', 'Primaire', 1, 0),
(2, 'sousecoleB', 'sousecoleB', 'bejaia', 'sousecoleB@gmail.com', '123456789', '[[36.76544830215984,5.061843395233154],[36.76554714217752,5.062084794044495],[36.76547408652457,5.062095522880555],[36.76534516461428,5.061913132667542]]', '5555', 'fb', 'insta', 'lnkdn', '78788', '099999', NULL, '555555', 'CEM', 4, 0);

-- --------------------------------------------------------

--
-- Structure de la table `ecolesections`
--

DROP TABLE IF EXISTS `ecolesections`;
CREATE TABLE IF NOT EXISTS `ecolesections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ecoleId` int(11) DEFAULT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `sectionId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`),
  KEY `ecoleeId` (`ecoleeId`),
  KEY `sectionId` (`sectionId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecolesections`
--

INSERT INTO `ecolesections` (`id`, `ecoleId`, `ecoleeId`, `sectionId`) VALUES
(1, 1, NULL, 4),
(2, 1, NULL, 5),
(3, 1, NULL, 6),
(4, 1, NULL, 7);

-- --------------------------------------------------------

--
-- Structure de la table `ecole_secole_postes`
--

DROP TABLE IF EXISTS `ecole_secole_postes`;
CREATE TABLE IF NOT EXISTS `ecole_secole_postes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ecoleId` int(11) NOT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `posteId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `posteId` (`posteId`),
  KEY `ecole__s_ecole__postes_ecole_id_ecolee_id_poste_id` (`ecoleId`,`ecoleeId`,`posteId`),
  KEY `Ecole_SEcole_Postes_posteId_ecoleId_unique` (`ecoleId`) USING BTREE,
  KEY `Ecole_SEcole_Postes_posteId_ecoleeId_unique` (`ecoleeId`,`posteId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecole_secole_postes`
--

INSERT INTO `ecole_secole_postes` (`id`, `ecoleId`, `ecoleeId`, `posteId`, `createdAt`, `updatedAt`) VALUES
(1, 1, NULL, 1, '2025-03-17 12:33:03', '2025-03-17 12:33:03'),
(2, 1, NULL, 2, '2025-03-17 12:33:29', '2025-03-17 12:33:29'),
(3, 4, NULL, 3, '2025-03-29 11:24:41', '2025-03-29 11:24:41'),
(4, 1, NULL, 4, '2025-04-03 07:17:23', '2025-04-03 07:17:23'),
(5, 1, NULL, 5, '2025-04-03 07:29:06', '2025-04-03 07:29:06'),
(6, 1, NULL, 6, '2025-04-03 07:36:46', '2025-04-03 07:36:46'),
(7, 1, 1, 7, '2025-04-11 16:03:19', '2025-04-11 16:03:19');

-- --------------------------------------------------------

--
-- Structure de la table `ecole_secole_roles`
--

DROP TABLE IF EXISTS `ecole_secole_roles`;
CREATE TABLE IF NOT EXISTS `ecole_secole_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ecoleId` int(11) NOT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `roleId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roleId` (`roleId`),
  KEY `ecole__s_ecole__roles_ecole_id_ecolee_id_role_id` (`ecoleId`,`ecoleeId`,`roleId`),
  KEY `Ecole_SEcole_Roles_roleId_ecoleId_unique` (`ecoleId`) USING BTREE,
  KEY `Ecole_SEcole_Roles_roleId_ecoleeId_unique` (`ecoleeId`,`roleId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecole_secole_roles`
--

INSERT INTO `ecole_secole_roles` (`id`, `ecoleId`, `ecoleeId`, `roleId`, `createdAt`, `updatedAt`) VALUES
(3, 1, 1, 4, '2025-03-19 11:56:03', '2025-03-19 11:56:03'),
(4, 1, 1, 5, '2025-03-19 11:56:03', '2025-03-19 11:56:03'),
(5, 1, NULL, 3, '2025-03-19 13:03:19', '2025-03-19 13:03:19'),
(6, 4, NULL, 3, '2025-03-19 13:06:12', '2025-03-19 13:06:12'),
(7, 1, 1, 6, '2025-03-19 14:17:00', '2025-03-19 14:17:00'),
(8, 1, NULL, 7, '2025-03-23 14:02:02', '2025-03-23 14:02:02'),
(9, 1, NULL, 9, '2025-03-23 14:02:02', '2025-03-23 14:02:02'),
(13, 4, NULL, 5, '2025-03-29 11:26:14', '2025-03-29 11:26:14'),
(14, 1, NULL, 5, '2025-04-03 07:32:09', '2025-04-03 07:32:09');

-- --------------------------------------------------------

--
-- Structure de la table `ecole_secole_services`
--

DROP TABLE IF EXISTS `ecole_secole_services`;
CREATE TABLE IF NOT EXISTS `ecole_secole_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ecoleId` int(11) NOT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `serviceId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `serviceId` (`serviceId`),
  KEY `ecole__s_ecole__services_ecole_id_ecolee_id_service_id` (`ecoleId`,`ecoleeId`,`serviceId`),
  KEY `Ecole_SEcole_Services_serviceId_ecoleId_unique` (`ecoleId`) USING BTREE,
  KEY `Ecole_SEcole_Services_serviceId_ecoleeId_unique` (`ecoleeId`,`serviceId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecole_secole_services`
--

INSERT INTO `ecole_secole_services` (`id`, `ecoleId`, `ecoleeId`, `serviceId`, `createdAt`, `updatedAt`) VALUES
(1, 1, NULL, 1, '2025-03-17 12:33:15', '2025-03-17 12:33:15'),
(2, 1, 1, 2, '2025-03-17 12:46:40', '2025-03-17 12:46:40'),
(3, 1, 1, 3, '2025-03-17 12:51:21', '2025-03-17 12:51:21'),
(4, 4, NULL, 4, '2025-03-29 11:24:49', '2025-03-29 11:24:49'),
(5, 1, 1, 5, '2025-04-11 16:03:32', '2025-04-11 16:03:32');

-- --------------------------------------------------------

--
-- Structure de la table `eleveparents`
--

DROP TABLE IF EXISTS `eleveparents`;
CREATE TABLE IF NOT EXISTS `eleveparents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `EleveId` int(11) NOT NULL,
  `ParentId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `EleveParents_ParentId_EleveId_unique` (`EleveId`,`ParentId`),
  KEY `ParentId` (`ParentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `eleves`
--

DROP TABLE IF EXISTS `eleves`;
CREATE TABLE IF NOT EXISTS `eleves` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nactnaiss` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `etat_social` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `antecedents` enum('Oui','Non') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `antecedentsDetails` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `suiviMedical` enum('Oui','Non') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `suiviMedicalDetails` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `natureTraitement` enum('Oui','Non') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `natureTraitementDetails` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crises` enum('Oui','Non') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crisesDetails` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `conduiteTenir` enum('Oui','Non') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `conduiteTenirDetails` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operationChirurgical` enum('Oui','Non') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operationChirurgicalDetails` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `maladieChronique` enum('Oui','Non') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `maladieChroniqueDetails` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dateInscription` datetime DEFAULT NULL,
  `autreecole` enum('Oui','Non') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nomecole` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redoublant` enum('Oui','Non') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `niveauredoublant` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orphelin` enum('orpholinepère','orpholinemère','orpholinelesdeux','vivant') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `niveaueleve` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numinscription` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numidentnational` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `datedinscriptionEncour` datetime NOT NULL,
  `fraixinscription` decimal(10,2) NOT NULL DEFAULT 0.00,
  `groupeSanguin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cycle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `niveauId` int(11) NOT NULL,
  `classeId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numidentnational` (`numidentnational`),
  KEY `niveauId` (`niveauId`),
  KEY `classeId` (`classeId`),
  KEY `userId` (`userId`),
  KEY `groupeSanguin` (`groupeSanguin`) USING BTREE,
  KEY `numinscription` (`numinscription`) USING BTREE,
  KEY `niveaueleve` (`niveaueleve`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `eleves`
--

INSERT INTO `eleves` (`id`, `nactnaiss`, `etat_social`, `antecedents`, `antecedentsDetails`, `suiviMedical`, `suiviMedicalDetails`, `natureTraitement`, `natureTraitementDetails`, `crises`, `crisesDetails`, `conduiteTenir`, `conduiteTenirDetails`, `operationChirurgical`, `operationChirurgicalDetails`, `maladieChronique`, `maladieChroniqueDetails`, `dateInscription`, `autreecole`, `nomecole`, `redoublant`, `niveauredoublant`, `orphelin`, `niveaueleve`, `numinscription`, `numidentnational`, `datedinscriptionEncour`, `fraixinscription`, `groupeSanguin`, `photo`, `cycle`, `niveauId`, `classeId`, `archiver`, `userId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(49, '12465354', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', '2024-08-20 00:00:00', 'Non', '', 'Non', '', 'vivant', 'excellent', '0949499', '004995595959', '2024-09-02 00:00:00', '0.00', 'A-', '/images/Eleve/1742729341679-authorization.png', 'primaire', 3, NULL, 0, 49, '2025-03-23 11:29:02', '2025-03-23 11:29:02', NULL),
(72, '2874675', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', '2024-08-20 00:00:00', 'Non', '', 'Non', '', 'vivant', 'moyenne', '765627656309685', '67376498549234567', '2024-09-02 00:00:00', '0.00', 'AB+', '/images/Eleve/1742802421968-teamwork.png', 'primaire', 4, 5, 0, 72, '2025-03-24 07:47:02', '2025-03-30 09:37:58', NULL),
(85, '1246535234', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', '2022-08-20 00:00:00', 'Non', '', 'Non', '', 'vivant', 'excellent', '694124895817306', '004995595001', '2024-09-08 00:00:00', '30000.00', 'O+', '/images/Eleve/1742991276609-teamwork.png', 'primaire', 4, 5, 0, 85, '2025-03-25 09:13:53', '2025-03-30 10:51:08', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `emploidutemps`
--

DROP TABLE IF EXISTS `emploidutemps`;
CREATE TABLE IF NOT EXISTS `emploidutemps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jour` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `heure` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duree` int(11) NOT NULL,
  `niveauId` int(11) NOT NULL,
  `sectionId` int(11) NOT NULL,
  `matiereId` int(11) NOT NULL,
  `enseignantId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `niveauId` (`niveauId`),
  KEY `sectionId` (`sectionId`),
  KEY `matiereId` (`matiereId`),
  KEY `enseignantId` (`enseignantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `employes`
--

DROP TABLE IF EXISTS `employes`;
CREATE TABLE IF NOT EXISTS `employes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sitfamiliale` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nbrenfant` int(11) DEFAULT NULL,
  `TypePI` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NumPI` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NumPC` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NumAS` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `poste` int(11) DEFAULT NULL,
  `service` int(11) DEFAULT NULL,
  `daterecru` datetime NOT NULL,
  `NVTetudes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Experience` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SalairNeg` decimal(10,2) DEFAULT NULL,
  `TypeContrat` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DateFinContrat` datetime DEFAULT NULL,
  `Remarque` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `HeureEM` time NOT NULL,
  `HeureSM` time NOT NULL,
  `HeureEAM` time NOT NULL,
  `HeureSAM` time NOT NULL,
  `nbrJourTravail` int(11) NOT NULL,
  `nbrHeureLegale` decimal(8,2) NOT NULL,
  `Typepai` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Numpai` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CE` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `poste` (`poste`),
  KEY `service` (`service`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `employes`
--

INSERT INTO `employes` (`id`, `sitfamiliale`, `nbrenfant`, `TypePI`, `NumPI`, `NumPC`, `NumAS`, `poste`, `service`, `daterecru`, `NVTetudes`, `Experience`, `SalairNeg`, `TypeContrat`, `DateFinContrat`, `Remarque`, `HeureEM`, `HeureSM`, `HeureEAM`, `HeureSAM`, `nbrJourTravail`, `nbrHeureLegale`, `Typepai`, `Numpai`, `CE`, `archiver`, `photo`, `userId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(8, 'Marié', 5, 'Carte d\'identité nationale', '0898999999999', '5556444', '1234567', 1, 1, '2025-02-17 00:00:00', 'master2', '5', '50000.00', 'CDD', '2025-03-20 00:00:00', 'test', '08:00:00', '12:00:00', '13:00:00', '16:30:00', 22, '173.33', 'virement bancaire', '5555', 'Employe_EcoleP_A', 0, '/images/employes/zahra_zahra_2025-03-05_.png', 8, '2025-03-17 12:35:28', '2025-04-09 07:15:00', NULL),
(9, 'Marié', 6, 'Carte d\'identité nationale', '987643355', '8888866', '6544888', 2, 2, '2025-01-17 00:00:00', 'M2', '3', '30000.00', 'CDI', '2025-04-05 00:00:00', 'ajouter par sous ecoleA', '08:00:00', '12:00:00', '13:00:00', '16:30:00', 22, '173.33', 'CCP', '98988', 'EmployeSousEA', 0, '/images/employes/amina_amina_2025-03-12_.png', 9, '2025-03-17 12:49:22', '2025-04-12 09:36:20', NULL),
(10, 'Marié', 3, 'Carte d\'identité nationale', '78788788', '565666666', '9876555', 1, 3, '2025-03-01 00:00:00', 'master2', '4', '97000.00', 'CDI', '2025-03-28 00:00:00', 'ajouter par la sous ecole', '08:00:00', '12:00:00', '13:00:00', '16:30:00', 22, '173.33', 'CCP', '65666', 'CFFD', 0, '/images/employes/mohend_mohend_2025-03-14_.png', 10, '2025-03-17 12:53:20', '2025-04-03 09:27:51', NULL),
(14, 'Marié', 5, 'Carte d\'identité nationale', '234567', '6666', '887888', 1, 1, '2023-01-02 00:00:00', 'master2', '5ans', '70965.00', 'CDD', '2025-03-12 00:00:00', 'test', '08:00:00', '12:00:00', '13:00:00', '16:30:00', 22, '173.33', '', '999888 67', 'EMPLOYE88', 0, '/images/employes/amir_amir_1997-01-23_.png', 14, '2025-03-23 19:41:34', '2025-04-11 15:48:39', NULL),
(21, 'Célibataire', 0, 'Carte d\'identité nationale', '234567', '777', '99', 1, 2, '2025-03-13 00:00:00', 'M22', '5ans', '50000.00', 'cdi', '2025-03-04 00:00:00', 'testt ', '19:43:00', '10:46:00', '10:47:00', '10:47:00', 22, '173.33', 'virement bancaire', '5555555', '565666', 0, NULL, 21, '2025-03-24 10:00:53', '2025-03-24 10:00:53', NULL),
(22, '', 0, 'Carte d\'identité nationale', '777777777', '', '', 2, 2, '2025-03-15 00:00:00', 'master2', '5', '45800.30', 'CDD', '2025-03-13 00:00:00', '', '14:20:00', '14:20:00', '14:20:00', '17:16:00', 22, '173.33', '', 'T6---999', '666666', 0, NULL, 22, '2025-03-24 13:17:07', '2025-04-08 07:53:03', NULL),
(110, '', 0, 'Carte d\'identité nationale', '898999', '', '', 3, 4, '2025-03-01 00:00:00', 'master2', '5ans', '30000.00', 'CDD', '2025-03-13 00:00:00', '', '08:00:00', '12:00:00', '13:00:00', '17:00:00', 22, '173.33', 'virement bancaire', '999888 67', '89899', 0, NULL, 110, '2025-03-29 11:26:14', '2025-03-29 11:26:14', NULL),
(111, '', 0, '', '', '', '', 5, 2, '2025-04-12 00:00:00', '', '', '97000.00', '', '2025-04-17 00:00:00', '', '13:31:00', '11:31:00', '11:32:00', '12:32:00', 22, '173.33', '', '', '', 0, NULL, 111, '2025-04-03 07:32:09', '2025-04-03 07:32:09', NULL),
(112, 'Divorcé', 6, 'Carte d\'identité nationale', '77777', '55555', '554554', 6, 1, '2025-04-03 00:00:00', 'master2', '6ans', '25000.00', 'CDD', '2025-04-25 00:00:00', 'test', '08:00:00', '12:00:00', '13:00:00', '16:30:00', 22, '173.33', 'virement bancaire', '555555', 'T666', 0, NULL, 112, '2025-04-03 07:40:02', '2025-04-10 10:23:50', NULL),
(114, 'Marié', 5, '', '', '', '', 7, 5, '2024-12-02 00:00:00', '', '', '600000.00', '', '2025-04-30 00:00:00', '', '08:00:00', '12:00:00', '13:00:00', '16:30:00', 22, '173.33', '', '', '56566', 0, NULL, 114, '2025-04-11 16:04:33', '2025-04-11 16:04:33', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `enseignantclasse`
--

DROP TABLE IF EXISTS `enseignantclasse`;
CREATE TABLE IF NOT EXISTS `enseignantclasse` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `enseignantId` int(11) NOT NULL,
  `matiereId` int(11) NOT NULL,
  `classeId` int(11) NOT NULL,
  `niveauId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `EnseignantClasse_niveauId_enseignantId_unique` (`enseignantId`,`niveauId`),
  UNIQUE KEY `EnseignantClasse_matiereId_enseignantId_unique` (`matiereId`),
  UNIQUE KEY `EnseignantClasse_classeId_enseignantId_unique` (`classeId`),
  KEY `niveauId` (`niveauId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `enseignants`
--

DROP TABLE IF EXISTS `enseignants`;
CREATE TABLE IF NOT EXISTS `enseignants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `npe` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pfe` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ddn` datetime DEFAULT NULL,
  `ninn` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `employe_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `disponibilites` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{\r\n  "lundi": {"disponible": false, "heures": []},\r\n  "mardi": {"disponible": false, "heures": []},\r\n  "mercredi": {"disponible": false, "heures": []},\r\n  "jeudi": {"disponible": false, "heures": []},\r\n  "vendredi": {"disponible": false, "heures": []},\r\n  "samedi": {"disponible": false, "heures": []},\r\n  "dimanche": {"disponible": false, "heures": []}\r\n}',
  PRIMARY KEY (`id`),
  KEY `employe_id` (`employe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `enseignants`
--

INSERT INTO `enseignants` (`id`, `npe`, `pfe`, `ddn`, `ninn`, `archiver`, `employe_id`, `createdAt`, `updatedAt`, `deletedAt`, `disponibilites`) VALUES
(9, '', '', '2025-03-01 00:00:00', '44-LJ_7', 0, 9, '2025-03-17 12:49:22', '2025-04-12 09:36:20', NULL, '{\"lundi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"12:00\"}]},\"mardi\":{\"disponible\":false,\"heures\":[]},\"mercredi\":{\"disponible\":false,\"heures\":[]},\"jeudi\":{\"disponible\":false,\"heures\":[]},\"vendredi\":{\"disponible\":false,\"heures\":[]},\"samedi\":{\"disponible\":false,\"heures\":[]},\"dimanche\":{\"disponible\":false,\"heures\":[]}}'),
(10, '', '', '2025-04-08 00:00:00', '66666', 0, 22, '2025-04-08 07:53:03', '2025-04-08 07:53:03', NULL, '{\r\n  \"lundi\": {\"disponible\": false, \"heures\": []},\r\n  \"mardi\": {\"disponible\": false, \"heures\": []},\r\n  \"mercredi\": {\"disponible\": false, \"heures\": []},\r\n  \"jeudi\": {\"disponible\": false, \"heures\": []},\r\n  \"vendredi\": {\"disponible\": false, \"heures\": []},\r\n  \"samedi\": {\"disponible\": false, \"heures\": []},\r\n  \"dimanche\": {\"disponible\": false, \"heures\": []}\r\n}');

-- --------------------------------------------------------

--
-- Structure de la table `heuressups`
--

DROP TABLE IF EXISTS `heuressups`;
CREATE TABLE IF NOT EXISTS `heuressups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `taux` float NOT NULL,
  `ecoleId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `heuressups`
--

INSERT INTO `heuressups` (`id`, `nom`, `taux`, `ecoleId`, `archiver`, `createdAt`, `updatedAt`) VALUES
(1, 'heure supplémentaire weekend', 1, 1, 0, '2025-03-24 20:15:03', '2025-03-24 20:21:27'),
(2, 'heures supplémentaires semaine', 0.5, 1, 0, '2025-03-24 20:24:53', '2025-03-24 20:24:53'),
(3, 'heure supplémentaire aid', 1, 1, 0, '2025-03-24 20:25:56', '2025-03-24 20:25:56'),
(4, 'heure aide', 0.6, 1, 1, '2025-04-02 10:05:17', '2025-04-10 15:19:37');

-- --------------------------------------------------------

--
-- Structure de la table `irgs`
--

DROP TABLE IF EXISTS `irgs`;
CREATE TABLE IF NOT EXISTS `irgs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pays` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `annee_fiscale` int(11) NOT NULL,
  `tranche_min` decimal(10,2) DEFAULT NULL,
  `tranche_max` decimal(10,2) DEFAULT NULL,
  `taux_imposition` decimal(5,2) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `irgs`
--

INSERT INTO `irgs` (`id`, `pays`, `annee_fiscale`, `tranche_min`, `tranche_max`, `taux_imposition`, `archiver`, `createdAt`, `updatedAt`) VALUES
(1, 'DZ', 2025, '0.00', '20000.00', '0.00', 0, '2025-03-17 12:25:22', '2025-04-08 09:32:55'),
(2, 'DZ', 2025, '20000.00', '40000.00', '0.23', 0, '2025-03-17 12:25:57', '2025-03-17 12:25:57'),
(3, 'DZ', 2025, '40000.00', '80000.00', '0.27', 0, '2025-03-17 12:26:46', '2025-03-17 13:57:53'),
(4, 'DZ', 2025, '80000.00', '160000.00', '0.30', 0, '2025-03-17 12:27:26', '2025-03-17 14:04:29'),
(5, 'DZ', 2025, '160000.00', '320000.00', '0.33', 0, '2025-03-17 14:02:47', '2025-03-17 14:09:51'),
(6, 'DZ', 2025, '320000.00', '99999999.00', '0.35', 0, '2025-03-17 14:11:06', '2025-03-17 14:11:06');

-- --------------------------------------------------------

--
-- Structure de la table `journalpaie`
--

DROP TABLE IF EXISTS `journalpaie`;
CREATE TABLE IF NOT EXISTS `journalpaie` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `periodePaieId` int(11) NOT NULL,
  `nom_prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idEmploye` int(11) NOT NULL,
  `salaireBase` decimal(10,2) DEFAULT 0.00,
  `NVSBaseAbsences` decimal(10,2) DEFAULT 0.00,
  `nbrJrTrvMois` decimal(10,2) NOT NULL,
  `joursAbsence` decimal(10,2) DEFAULT 0.00,
  `nbrHRetard` decimal(10,2) DEFAULT 0.00,
  `salaireNet` decimal(10,2) DEFAULT 0.00,
  `salaireBrut` decimal(10,2) DEFAULT 0.00,
  `cotisations` decimal(10,2) DEFAULT 0.00,
  `SalaireImposable` decimal(10,2) DEFAULT 0.00,
  `RetenueIRG` decimal(10,2) DEFAULT 0.00,
  `RetenueSS` decimal(10,2) DEFAULT 0.00,
  `AutreRetenues` decimal(10,2) DEFAULT 0.00,
  `AbsenceRetenues` decimal(10,2) DEFAULT 0.00,
  `NomAutreRetenues` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime NOT NULL,
  `heuresSup` decimal(10,2) DEFAULT 0.00,
  `GeinheuresSup` decimal(10,2) DEFAULT 0.00,
  `Geins` decimal(10,2) DEFAULT 0.00,
  `Retenues` decimal(10,2) DEFAULT 0.00,
  `statut` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'non publier',
  `bulletin_html` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `JournalPaie_periodePaieId_idEmploye_unique` (`periodePaieId`,`idEmploye`),
  KEY `idEmploye` (`idEmploye`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `journalpaie`
--

INSERT INTO `journalpaie` (`id`, `periodePaieId`, `nom_prenom`, `idEmploye`, `salaireBase`, `NVSBaseAbsences`, `nbrJrTrvMois`, `joursAbsence`, `nbrHRetard`, `salaireNet`, `salaireBrut`, `cotisations`, `SalaireImposable`, `RetenueIRG`, `RetenueSS`, `AutreRetenues`, `AbsenceRetenues`, `NomAutreRetenues`, `date`, `heuresSup`, `GeinheuresSup`, `Geins`, `Retenues`, `statut`, `bulletin_html`, `archiver`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'mohend mohend', 10, '97000.00', '71383.18', '16.20', '5.00', '0.81', '73930.47', '92152.34', '92152.34', '65289.47', '9928.16', '8293.71', '0.00', '0.00', '', '2025-04-10 11:26:08', '0.00', '0.00', '0.00', '0.00', 'non publier', '\n     <html>\n      <head>\n        <title>Bulletin de Paie</title>\n        <style>\n          @page { \n            size: A4; \n            margin: 15px;\n          }\n          body { \n            font-family: Arial, sans-serif; \n            text-align: center;\n          }\n          .container { \n            width: 90%;\n            max-width: 800px; \n            margin: 0 auto;\n            text-align: left;\n            box-sizing: border-box;\n          }\n          .border { \n            border: 1px solid #000; \n            padding: 10px; \n            margin-bottom: 10px; \n          }\n          .text-end { text-align: right; }\n          .table { \n            width: 100%; \n            border-collapse: collapse; \n          }\n          .table th { \n            border: 1px solid #000; \n            padding: 8px; \n            background-color: #f2f2f2;\n          }\n         \n          /* Bordures verticales uniquement */\n          .table td, .table th {\n              border-left: 1px solid black;\n              border-right: 1px solid black;\n              padding: 5px;\n          }\n\n          /* Suppression des bordures horizontales */\n          .table tr:not(:first-child) td {\n              border-top: none;\n          }\n\n          .table tr:not(:last-child) td {\n              border-bottom: none;\n          }\n\n          /* Garder la bordure pour l\'en-tête */\n          .table tr:first-child th {\n              border-top: 1px solid black;\n          }\n\n          /* Garder la bordure pour la dernière ligne */\n          .table tr:last-child td {\n              border-bottom: 1px solid black;\n          }\n          \n          .header { \n            display: flex; \n            justify-content: center; /* Centrage horizontal */\n            align-items: center; /* Centrage vertical */\n            text-align: center;\n          }\n          .info-section { \n            display: flex; \n            justify-content: space-between; \n          }\n          .col { \n            width: 48%; \n          }\n          .no-border {\n            border: none !important;\n          }\n          .dual-container {\n            display: flex;\n            justify-content: space-between;\n           \n          }\n          .dual-box {\n            width: 48%;\n            border: 1px solid #000;\n            padding: 10px;\n          }\n          .logo-placeholder {\n            width: 100px;\n            height: 100px;\n            border: 1px dashed #ccc;\n            margin: 0 auto 10px auto;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            background-color: #f9f9f9;\n          }\n        </style>\n      </head>\n      <body>\n        <div class=\"container\">\n          <!-- Deux cadres séparés pour école et période de paie -->\n          <div class=\"dual-container\">\n            <!-- Cadre des informations de l\'école -->\n            <div class=\"dual-box\">\n              <p><strong>Ecole</strong> ecoleA</p>\n              <p><strong>Adresse :</strong> ecoleA</p>\n            </div>\n            <!-- Cadre de la période de paie -->\n            <div class=\"dual-box\">\n          <div class=\"logo-placeholder\">\n             <img src=\"http://localhost:5000/images/Ecole/1742901299296-settings.png\" alt=\"Logo de l\'école\" style=\"max-width: 100px; max-height: 100px;\">\n          </div>\n            </div>\n          </div>\n\n          <div class=\"header border text-center p-2\">\n            <h5 class=\"fw-bold text-uppercase \">BULLETIN DE PAIE \n             AVRIL -\n             AVRIL\n             2025\n            </h5>\n          </div>\n\n          <div class=\"border p-3\">\n            <div class=\"info-section\">\n              <div class=\"col\">\n                <p><strong>Employé :</strong> mohend mohend</p>\n              <p><strong>Code employé :</strong> CFFD</p>\n                <p><strong>Situation familiale :</strong> Marié</p>\n                <p><strong>N° SS :</strong> 9876555</p>\n                <p><strong>Date de recrutement :</strong> 01-03-2025</p>\n              </div>\n              <div class=\"col\">\n                <p><strong>Service :</strong> RH</p>\n                <p><strong>Poste :</strong> responsable</p>\n                <p><strong>N°Compte :</strong> 65666</p>\n                <p><strong>Nombre de jours de travail:</strong>22</p>\n                <p><strong>Salaire de base :</strong>97000.00</p>\n              </div>\n            </div>\n          </div>\n          <table class=\"table\">\n            <thead>\n              <tr>\n                <th>Code</th>\n                <th>Libellé</th>\n                <th>Qte/Base</th>\n                <th>Montant</th>\n                <th>Gain</th>\n                <th>Retenue</th>\n              </tr>\n            </thead>\n            <tbody>\n              <tr>\n                <td>R1000</td>\n                <td>Salaire de base</td>\n                <td>16.2</td>\n                <td>4409.09</td>\n                <td>71383.18</td>\n                <td></td>\n              </tr>\n              \n                  \n      \n        \n              \n                <tr>\n                  <td>R30900</td>\n                  <td>Prime de responsabilité</td>\n\n                 <td>\n                 15000.00\n                 </td>\n\n                 <td>\n  15000.00\n</td>\n\n              <td>\n                15000.00\n                </td>\n                  <td></td>\n                </tr>\n              \n                <tr>\n                  <td>test</td>\n                  <td>test</td>\n\n                 <td>\n                 22\n                 </td>\n\n                 <td>\n  2200.00\n</td>\n\n              <td>\n                2200.00\n                </td>\n                  <td></td>\n                </tr>\n              \n                <tr>\n                  <td>23600</td>\n                  <td>primePerf.coll.MEN(RVC)B</td>\n\n                 <td>\n                 0.05\n                 </td>\n\n                 <td>\n  3569.16\n</td>\n\n              <td>\n                3569.16\n                </td>\n                  <td></td>\n                </tr>\n              \n              <tr>\n                <td>I50010</td>\n                <td>Retenue Sécurité Sociale Mois</td>\n                <td>0.09</td>\n                <td>92152.34</td>\n                <td></td>\n                <td>8293.71</td>\n              </tr>\n              \n                <tr>\n                  <td>R504</td>\n                  <td>panier</td>\n                 <td>\n                      16.2\n                 </td>\n\n                 <td>\n                    194400.00\n                 </td>\n\n                  <td>\n                      194400.00\n                    </td>\n\n                  <td></td>\n                </tr>\n              \n                <tr>\n                  <td>R1000</td>\n                  <td>Transport</td>\n                 <td>\n                      16.2\n                 </td>\n\n                 <td>\n                    64800.00\n                 </td>\n\n                  <td>\n                      64800.00\n                    </td>\n\n                  <td></td>\n                </tr>\n              \n              <tr>\n                <td>R80008</td>\n                <td>Retenue IRG du Mois</td>\n                <td>1</td>\n                <td>65289.47</td>\n                <td></td>\n                <td>9928.16</td>\n              </tr>\n              \n              \n            </tbody>\n            <tfoot>\n              <tr>\n                <td colSpan=\"4\" class=\"text-end\"><strong>Total</strong></td>\n                <td><strong>92152.34</strong></td>\n                <td><strong>18221.87</strong></td>\n              </tr>\n            </tfoot>\n          </table>\n          <h4 class=\"text-end mt-3\"><strong>Net à payer : 73930.47 DZD</strong></h4>\n        </div>\n      </body>\n    </html>\n\n    ', 0, '2025-04-10 11:13:05', '2025-04-11 14:28:10'),
(2, 1, 'chafik amine', 112, '25000.00', '25000.00', '22.00', '0.00', '0.00', '22750.00', '25000.00', '25000.00', '22750.00', '0.00', '2250.00', '0.00', '0.00', '', '2025-04-10 11:26:43', '0.00', '0.00', '0.00', '0.00', 'non publier', '\n     <html>\n      <head>\n        <title>Bulletin de Paie</title>\n        <style>\n          @page { \n            size: A4; \n            margin: 15px;\n          }\n          body { \n            font-family: Arial, sans-serif; \n            text-align: center;\n          }\n          .container { \n            width: 90%;\n            max-width: 800px; \n            margin: 0 auto;\n            text-align: left;\n            box-sizing: border-box;\n          }\n          .border { \n            border: 1px solid #000; \n            padding: 10px; \n            margin-bottom: 10px; \n          }\n          .text-end { text-align: right; }\n          .table { \n            width: 100%; \n            border-collapse: collapse; \n          }\n          .table th { \n            border: 1px solid #000; \n            padding: 8px; \n            background-color: #f2f2f2;\n          }\n         \n          /* Bordures verticales uniquement */\n          .table td, .table th {\n              border-left: 1px solid black;\n              border-right: 1px solid black;\n              padding: 5px;\n          }\n\n          /* Suppression des bordures horizontales */\n          .table tr:not(:first-child) td {\n              border-top: none;\n          }\n\n          .table tr:not(:last-child) td {\n              border-bottom: none;\n          }\n\n          /* Garder la bordure pour l\'en-tête */\n          .table tr:first-child th {\n              border-top: 1px solid black;\n          }\n\n          /* Garder la bordure pour la dernière ligne */\n          .table tr:last-child td {\n              border-bottom: 1px solid black;\n          }\n          \n          .header { \n            display: flex; \n            justify-content: center; /* Centrage horizontal */\n            align-items: center; /* Centrage vertical */\n            text-align: center;\n          }\n          .info-section { \n            display: flex; \n            justify-content: space-between; \n          }\n          .col { \n            width: 48%; \n          }\n          .no-border {\n            border: none !important;\n          }\n          .dual-container {\n            display: flex;\n            justify-content: space-between;\n           \n          }\n          .dual-box {\n            width: 48%;\n            border: 1px solid #000;\n            padding: 10px;\n          }\n          .logo-placeholder {\n            width: 100px;\n            height: 100px;\n            border: 1px dashed #ccc;\n            margin: 0 auto 10px auto;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            background-color: #f9f9f9;\n          }\n        </style>\n      </head>\n      <body>\n        <div class=\"container\">\n          <!-- Deux cadres séparés pour école et période de paie -->\n          <div class=\"dual-container\">\n            <!-- Cadre des informations de l\'école -->\n            <div class=\"dual-box\">\n              <p><strong>Ecole</strong> ecoleA</p>\n              <p><strong>Adresse :</strong> ecoleA</p>\n            </div>\n            <!-- Cadre de la période de paie -->\n            <div class=\"dual-box\">\n          <div class=\"logo-placeholder\">\n             <img src=\"http://localhost:5000/images/Ecole/1742901299296-settings.png\" alt=\"Logo de l\'école\" style=\"max-width: 100px; max-height: 100px;\">\n          </div>\n            </div>\n          </div>\n\n          <div class=\"header border text-center p-2\">\n            <h5 class=\"fw-bold text-uppercase \">BULLETIN DE PAIE \n             AVRIL -\n             AVRIL\n             2025\n            </h5>\n          </div>\n\n          <div class=\"border p-3\">\n            <div class=\"info-section\">\n              <div class=\"col\">\n                <p><strong>Employé :</strong> chafik amine</p>\n              <p><strong>Code employé :</strong> T666</p>\n                <p><strong>Situation familiale :</strong> Divorcé</p>\n                <p><strong>N° SS :</strong> 554554</p>\n                <p><strong>Date de recrutement :</strong> 03-04-2025</p>\n              </div>\n              <div class=\"col\">\n                <p><strong>Service :</strong> comptabilité</p>\n                <p><strong>Poste :</strong> CHAUFFEUR</p>\n                <p><strong>N°Compte :</strong> 555555</p>\n                <p><strong>Nombre de jours de travail:</strong>22</p>\n                <p><strong>Salaire de base :</strong>25000.00</p>\n              </div>\n            </div>\n          </div>\n          <table class=\"table\">\n            <thead>\n              <tr>\n                <th>Code</th>\n                <th>Libellé</th>\n                <th>Qte/Base</th>\n                <th>Montant</th>\n                <th>Gain</th>\n                <th>Retenue</th>\n              </tr>\n            </thead>\n            <tbody>\n              <tr>\n                <td>R1000</td>\n                <td>Salaire de base</td>\n                <td>22.0</td>\n                <td>1136.36</td>\n                <td>25000.00</td>\n                <td></td>\n              </tr>\n              \n                  \n      \n        \n              \n              <tr>\n                <td>I50010</td>\n                <td>Retenue Sécurité Sociale Mois</td>\n                <td>0.09</td>\n                <td>25000.00</td>\n                <td></td>\n                <td>2250.00</td>\n              </tr>\n              \n              <tr>\n                <td>R80008</td>\n                <td>Retenue IRG du Mois</td>\n                <td>1</td>\n                <td>22750.00</td>\n                <td></td>\n                <td>0.00</td>\n              </tr>\n              \n              \n            </tbody>\n            <tfoot>\n              <tr>\n                <td colSpan=\"4\" class=\"text-end\"><strong>Total</strong></td>\n                <td><strong>25000.00</strong></td>\n                <td><strong>2250.00</strong></td>\n              </tr>\n            </tfoot>\n          </table>\n          <h4 class=\"text-end mt-3\"><strong>Net à payer : 22750.00 DZD</strong></h4>\n        </div>\n      </body>\n    </html>\n\n    ', 0, '2025-04-10 11:13:16', '2025-04-11 14:28:10'),
(3, 1, 'amina amina', 9, '30000.00', '1363.64', '1.00', '0.00', '0.00', '34127.17', '32623.26', '16623.26', '16127.17', '0.00', '1496.09', '1000.00', '0.00', 'retenues pour l\'association', '2025-04-10 12:13:58', '1.00', '259.62', '0.00', '0.00', 'non publier', '\n     <html>\n      <head>\n        <title>Bulletin de Paie</title>\n        <style>\n          @page { \n            size: A4; \n            margin: 15px;\n          }\n          body { \n            font-family: Arial, sans-serif; \n            text-align: center;\n          }\n          .container { \n            width: 90%;\n            max-width: 800px; \n            margin: 0 auto;\n            text-align: left;\n            box-sizing: border-box;\n          }\n          .border { \n            border: 1px solid #000; \n            padding: 10px; \n            margin-bottom: 10px; \n          }\n          .text-end { text-align: right; }\n          .table { \n            width: 100%; \n            border-collapse: collapse; \n          }\n          .table th { \n            border: 1px solid #000; \n            padding: 8px; \n            background-color: #f2f2f2;\n          }\n         \n          /* Bordures verticales uniquement */\n          .table td, .table th {\n              border-left: 1px solid black;\n              border-right: 1px solid black;\n              padding: 5px;\n          }\n\n          /* Suppression des bordures horizontales */\n          .table tr:not(:first-child) td {\n              border-top: none;\n          }\n\n          .table tr:not(:last-child) td {\n              border-bottom: none;\n          }\n\n          /* Garder la bordure pour l\'en-tête */\n          .table tr:first-child th {\n              border-top: 1px solid black;\n          }\n\n          /* Garder la bordure pour la dernière ligne */\n          .table tr:last-child td {\n              border-bottom: 1px solid black;\n          }\n          \n          .header { \n            display: flex; \n            justify-content: center; /* Centrage horizontal */\n            align-items: center; /* Centrage vertical */\n            text-align: center;\n          }\n          .info-section { \n            display: flex; \n            justify-content: space-between; \n          }\n          .col { \n            width: 48%; \n          }\n          .no-border {\n            border: none !important;\n          }\n          .dual-container {\n            display: flex;\n            justify-content: space-between;\n           \n          }\n          .dual-box {\n            width: 48%;\n            border: 1px solid #000;\n            padding: 10px;\n          }\n          .logo-placeholder {\n            width: 100px;\n            height: 100px;\n            border: 1px dashed #ccc;\n            margin: 0 auto 10px auto;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            background-color: #f9f9f9;\n          }\n        </style>\n      </head>\n      <body>\n        <div class=\"container\">\n          <!-- Deux cadres séparés pour école et période de paie -->\n          <div class=\"dual-container\">\n            <!-- Cadre des informations de l\'école -->\n            <div class=\"dual-box\">\n              <p><strong>Ecole</strong> ecoleA</p>\n              <p><strong>Adresse :</strong> ecoleA</p>\n            </div>\n            <!-- Cadre de la période de paie -->\n            <div class=\"dual-box\">\n          <div class=\"logo-placeholder\">\n             <img src=\"http://localhost:5000/images/Ecole/1742901299296-settings.png\" alt=\"Logo de l\'école\" style=\"max-width: 100px; max-height: 100px;\">\n          </div>\n            </div>\n          </div>\n\n          <div class=\"header border text-center p-2\">\n            <h5 class=\"fw-bold text-uppercase \">BULLETIN DE PAIE \n             AVRIL -\n             AVRIL\n             2025\n            </h5>\n          </div>\n\n          <div class=\"border p-3\">\n            <div class=\"info-section\">\n              <div class=\"col\">\n                <p><strong>Employé :</strong> amina amina</p>\n              <p><strong>Code employé :</strong> EmployeSousEA</p>\n                <p><strong>Situation familiale :</strong> Marié</p>\n                <p><strong>N° SS :</strong> 6544888</p>\n                <p><strong>Date de recrutement :</strong> 17-01-2025</p>\n              </div>\n              <div class=\"col\">\n                <p><strong>Service :</strong> A</p>\n                <p><strong>Poste :</strong> Enseignant</p>\n                <p><strong>N°Compte :</strong> 98988</p>\n                <p><strong>Nombre de jours de travail:</strong>22</p>\n                <p><strong>Salaire de base :</strong>30000.00</p>\n              </div>\n            </div>\n          </div>\n          <table class=\"table\">\n            <thead>\n              <tr>\n                <th>Code</th>\n                <th>Libellé</th>\n                <th>Qte/Base</th>\n                <th>Montant</th>\n                <th>Gain</th>\n                <th>Retenue</th>\n              </tr>\n            </thead>\n            <tbody>\n              <tr>\n                <td>R1000</td>\n                <td>Salaire de base</td>\n                <td>1.0</td>\n                <td>1363.64</td>\n                <td>1363.64</td>\n                <td></td>\n              </tr>\n              \n                  \n      \n        \n                                <tr>\n                                  <td>R6000</td>\n                                  <td>heures Supplimentaires</td>\n                                  <td>1</td>\n                                  <td>259.62</td>\n                                  <td>259.62</td>\n                                  <td></td>\n                                </tr>\n                                    </tr>\n                                  \n              \n                <tr>\n                  <td>R30900</td>\n                  <td>Prime de responsabilité</td>\n\n                 <td>\n                 15000.00\n                 </td>\n\n                 <td>\n  15000.00\n</td>\n\n              <td>\n                15000.00\n                </td>\n                  <td></td>\n                </tr>\n              \n              <tr>\n                <td>I50010</td>\n                <td>Retenue Sécurité Sociale Mois</td>\n                <td>0.09</td>\n                <td>16623.26</td>\n                <td></td>\n                <td>1496.09</td>\n              </tr>\n              \n                <tr>\n                  <td>R1000</td>\n                  <td>Transport</td>\n                 <td>\n                      1\n                 </td>\n\n                 <td>\n                    4000.00\n                 </td>\n\n                  <td>\n                      4000.00\n                    </td>\n\n                  <td></td>\n                </tr>\n              \n                <tr>\n                  <td>R504</td>\n                  <td>panier</td>\n                 <td>\n                      1\n                 </td>\n\n                 <td>\n                    12000.00\n                 </td>\n\n                  <td>\n                      12000.00\n                    </td>\n\n                  <td></td>\n                </tr>\n              \n              <tr>\n                <td>R80008</td>\n                <td>Retenue IRG du Mois</td>\n                <td>1</td>\n                <td>16127.17</td>\n                <td></td>\n                <td>0.00</td>\n              </tr>\n              \n                <tr>\n                  <td>R900</td>\n                  <td>prime de scolarité</td>\n                  <td>1</td>\n                  <td>4000.00</td>\n                  <td>4000.00</td>\n                  <td></td>\n                </tr>\n              \n              \n                <tr>\n                  <td>R90000</td>\n                  <td>retenues pour l\'association</td>\n                  <td>1</td>\n                  <td>1000</td>\n                  <td></td>\n                  <td>1000</td>\n                </tr>\n              \n            </tbody>\n            <tfoot>\n              <tr>\n                <td colSpan=\"4\" class=\"text-end\"><strong>Total</strong></td>\n                <td><strong>36623.26</strong></td>\n                <td><strong>2496.09</strong></td>\n              </tr>\n            </tfoot>\n          </table>\n          <h4 class=\"text-end mt-3\"><strong>Net à payer : 34127.17 DZD</strong></h4>\n        </div>\n      </body>\n    </html>\n\n    ', 0, '2025-04-10 11:13:24', '2025-04-11 14:28:10');

-- --------------------------------------------------------

--
-- Structure de la table `matieres`
--

DROP TABLE IF EXISTS `matieres`;
CREATE TABLE IF NOT EXISTS `matieres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomarabe` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `matieres`
--

INSERT INTO `matieres` (`id`, `nom`, `nomarabe`, `image`, `archiver`, `createdAt`, `updatedAt`) VALUES
(1, 'arabe', 'اللغة العربية', 'image-1742683503905-670993760.png', 0, '2025-03-22 13:51:20', '2025-03-22 22:45:03'),
(2, 'math', 'الرياضيات', 'image-1742732844716-851009332.png', 0, '2025-03-23 12:27:24', '2025-03-23 12:27:24');

-- --------------------------------------------------------

--
-- Structure de la table `niveauxes`
--

DROP TABLE IF EXISTS `niveauxes`;
CREATE TABLE IF NOT EXISTS `niveauxes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomniveau` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomniveuarab` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statutInscription` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cycle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `niveauxes`
--

INSERT INTO `niveauxes` (`id`, `nomniveau`, `nomniveuarab`, `notion`, `statutInscription`, `cycle`, `archiver`) VALUES
(3, '5 émeee', 'الخامسة إبتدائي', '87675', 'valide', 'primaire', 0),
(4, '4 éme', 'الرابعة إبتدائي', '37666', 'valide', 'primaire', 0);

-- --------------------------------------------------------

--
-- Structure de la table `niveauxmatieres`
--

DROP TABLE IF EXISTS `niveauxmatieres`;
CREATE TABLE IF NOT EXISTS `niveauxmatieres` (
  `niveauId` int(11) NOT NULL,
  `matiereId` int(11) NOT NULL,
  PRIMARY KEY (`niveauId`,`matiereId`),
  KEY `matiereId` (`matiereId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `niveauxmatieres`
--

INSERT INTO `niveauxmatieres` (`niveauId`, `matiereId`) VALUES
(3, 1),
(4, 1),
(4, 2);

-- --------------------------------------------------------

--
-- Structure de la table `parametereretards`
--

DROP TABLE IF EXISTS `parametereretards`;
CREATE TABLE IF NOT EXISTS `parametereretards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Rmax` time NOT NULL,
  `Rmin` time NOT NULL,
  `HE` time DEFAULT NULL,
  `statut` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ecoleId` int(11) NOT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `parametereretards`
--

INSERT INTO `parametereretards` (`id`, `Rmax`, `Rmin`, `HE`, `statut`, `ecoleId`, `archiver`, `createdAt`, `updatedAt`) VALUES
(1, '00:30:00', '00:00:00', NULL, 'autorisé', 1, 0, '2025-04-08 13:42:53', '2025-04-08 13:42:53'),
(2, '01:00:00', '00:30:00', '02:00:00', 'autre', 1, 0, '2025-04-08 13:44:40', '2025-04-08 13:44:40'),
(3, '03:30:00', '01:00:00', NULL, 'demi-journée', 1, 0, '2025-04-08 13:47:31', '2025-04-08 18:31:16'),
(4, '06:00:00', '04:00:00', NULL, 'journée', 1, 0, '2025-04-08 13:47:51', '2025-04-08 13:47:51');

-- --------------------------------------------------------

--
-- Structure de la table `parents`
--

DROP TABLE IF EXISTS `parents`;
CREATE TABLE IF NOT EXISTS `parents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `emailparent` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephoneparent` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `travailleparent` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `situation_familiale` enum('Marié','Divorcé','Célibataire','Mariée','Divorcée') COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombreenfant` int(11) NOT NULL,
  `typerole` enum('Père','Mère','Tuteur') COLLATE utf8mb4_unicode_ci NOT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `parents`
--

INSERT INTO `parents` (`id`, `emailparent`, `telephoneparent`, `travailleparent`, `situation_familiale`, `nombreenfant`, `typerole`, `archiver`, `createdAt`, `updatedAt`, `deletedAt`, `userId`) VALUES
(47, 'parent2@gmail.com', '0794286408', 'travaille pas ', 'Marié', 4, 'Mère', 0, '2025-03-23 11:29:01', '2025-03-23 11:29:01', NULL, 47),
(48, 'parent1@gmail.com', '0794286408', 'enseignant', 'Marié', 4, 'Père', 0, '2025-03-23 11:29:01', '2025-03-23 11:29:01', NULL, 48),
(70, 'aghouiles@gmail.com', '0794286408', 'directeur', 'Marié', 4, 'Père', 0, '2025-03-24 07:47:02', '2025-03-24 07:47:02', NULL, 70),
(83, 'linda@gmail.com', '04857676', 'travaille pas', 'Marié', 2, 'Mère', 0, '2025-03-25 09:13:53', '2025-03-26 12:14:36', NULL, 83),
(84, 'saadi@gmail.com', '0794286234', 'salarié', 'Marié', 2, 'Père', 0, '2025-03-25 09:13:53', '2025-03-26 12:14:36', NULL, 84),
(107, 'saadi@gmail.com', '0794286234', 'salarié', 'Marié', 2, 'Père', 0, '2025-03-26 11:16:07', '2025-03-26 11:16:07', NULL, NULL),
(108, 'linda@gmail.com', '04857676', 'travaille pas', 'Marié', 2, 'Mère', 0, '2025-03-26 11:16:07', '2025-03-26 11:16:07', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `periodepaies`
--

DROP TABLE IF EXISTS `periodepaies`;
CREATE TABLE IF NOT EXISTS `periodepaies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateDebut` datetime NOT NULL,
  `dateFin` datetime NOT NULL,
  `statut` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `ecoleId` int(11) NOT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `ecoleId` (`ecoleId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `periodepaies`
--

INSERT INTO `periodepaies` (`id`, `code`, `dateDebut`, `dateFin`, `statut`, `ecoleId`, `archiver`, `createdAt`, `updatedAt`) VALUES
(1, 'periode-v1', '2025-04-01 00:00:00', '2025-04-30 00:00:00', 'Ouverte', 1, 0, '2025-03-18 09:22:39', '2025-04-12 10:51:54');

-- --------------------------------------------------------

--
-- Structure de la table `periodes`
--

DROP TABLE IF EXISTS `periodes`;
CREATE TABLE IF NOT EXISTS `periodes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `niveauId` int(11) NOT NULL,
  `sectionId` int(11) NOT NULL,
  `type` enum('matin','apres_midi','dejeuner') COLLATE utf8mb4_unicode_ci NOT NULL,
  `heureDebut` time NOT NULL,
  `heureFin` time NOT NULL,
  `sousPeriodes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `periodes_niveau_id_section_id_type` (`niveauId`,`sectionId`,`type`),
  KEY `sectionId` (`sectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Administration-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(2, 'Administration-Gestion élève-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(3, 'Administration-Gestion élève-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(4, 'Administration-Gestion élève-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(5, 'Administration-Gestion parents-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(6, 'Administration-Gestion élève-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(7, 'Administration-Gestion parents-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(8, 'Administration-Gestion parents-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(9, 'Administration-Gestion parents-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(10, 'Administration-Gestion enseignant-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(11, 'Administration-Gestion enseignant-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(12, 'Administration-Gestion enseignant-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(13, 'Administration-Gestion enseignant-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(14, 'Administration-Gestion privilège-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(15, 'Administration-Gestion privilège-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(16, 'Administration-Gestion privilège-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(17, 'Administration-Gestion privilège-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(18, 'Academique-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(19, 'Academique-Trimestre-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(20, 'Academique-Trimestre-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(21, 'Academique-Trimestre-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(22, 'Academique-Trimestre-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(23, 'Academique-Salle-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(24, 'Academique-Salle-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(25, 'Academique-Salle-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(26, 'Academique-Niveaux-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(27, 'Academique-Salle-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(28, 'Academique-Niveaux-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(29, 'Academique-Niveaux-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(30, 'Academique-Niveaux-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(31, 'Academique-Matière-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(32, 'Academique-Matière-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(33, 'Academique-Matière-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(34, 'Academique-Matière-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(35, 'Academique-Sections-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(36, 'Academique-Sections-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(37, 'Academique-Sections-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(38, 'Academique-Sections-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(39, 'Academique-Gestion emploi de temps-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(40, 'Academique-Gestion emploi de temps-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(41, 'Academique-Gestion emploi de temps-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(42, 'Academique-Gestion emploi de temps-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(43, 'Gestion Evaluation & bulletin-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(44, 'Ressources Humaines-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(45, 'Ressources Humaines-Gestion des employées-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(46, 'Ressources Humaines-Gestion des employées-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(47, 'Ressources Humaines-Gestion des employées-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(48, 'Ressources Humaines-Gestion des employées-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(49, 'Ressources Humaines-Gestion demande de congé-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(50, 'Ressources Humaines-Gestion demande de congé-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(51, 'Ressources Humaines-Gestion demande de congé-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(52, 'Ressources Humaines-Gestion demande de congé-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(53, 'Ressources Humaines-Gestion de mes demande de congé-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(54, 'Ressources Humaines-Gestion de mes demande de congé-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(55, 'Ressources Humaines-Gestion de mes demande de congé-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(56, 'Ressources Humaines-Gestion pointage-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(57, 'Ressources Humaines-Gestion de mes demande de congé-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(58, 'Ressources Humaines-Gestion pointage-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(59, 'Ressources Humaines-Gestion pointage-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(60, 'Ressources Humaines-Gestion pointage-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(61, 'Ressources Humaines-Gestion de mes pointage-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(62, 'Ressources Humaines-Gestion de mes pointage-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(63, 'Ressources Humaines-Gestion de mes pointage-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(64, 'Ressources Humaines-Gestion de mes pointage-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(65, 'Ressources Humaines-gestion attestation-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(66, 'Ressources Humaines-gestion attestation-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(67, 'Ressources Humaines-gestion attestation-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(68, 'Ressources Humaines-gestion attestation-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(69, 'Ressources Humaines-rapports pointage-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(70, 'Ressources Humaines-rapports pointage-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(71, 'Ressources Humaines-rapports pointage-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(72, 'Ressources Humaines-rapports pointage-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(73, 'Ressources Humaines-gestion de la paye-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(74, 'Ressources Humaines-gestion de la paye-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(75, 'Ressources Humaines-gestion de la paye-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(76, 'Ressources Humaines-gestion de la paye-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(77, 'Comptabilité-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(78, 'Cantine scolaire-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(79, 'Bibliothèque-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(80, 'Elearning-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(81, 'Transport-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(82, 'Statistique-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(83, 'Communication-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(84, 'Communication-Gestion des annonces-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(85, 'Communication-Gestion des annonces-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(86, 'Communication-Gestion des annonces-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(87, 'Communication-Gestion des annonces-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(88, 'Communication-Envoi de notifications-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(89, 'Communication-Envoi de notifications-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(90, 'Communication-Envoi de notifications-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(91, 'Communication-Envoi de notifications-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(92, 'Communication-Messagerie interne-Ajouter', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(93, 'Communication-Messagerie interne-Modifier', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(94, 'Communication-Messagerie interne-Supprimer', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(95, 'Communication-Messagerie interne-Voir', '2025-03-17 11:46:42', '2025-03-17 11:46:42'),
(96, 'Communication-Envoie d\'email-Voir', '2025-03-17 11:46:43', '2025-03-17 11:46:43'),
(97, 'Communication-Envoie d\'email-Supprimer', '2025-03-17 11:46:43', '2025-03-17 11:46:43'),
(98, 'Communication-Envoie d\'email-Modifier', '2025-03-17 11:46:43', '2025-03-17 11:46:43'),
(99, 'Communication-Envoie d\'email-Ajouter', '2025-03-17 11:46:43', '2025-03-17 11:46:43'),
(100, 'Parametre-Voir', '2025-03-17 11:46:43', '2025-03-17 11:46:43'),
(101, 'Parametre-Gestion écoles-Ajouter', '2025-03-17 11:46:43', '2025-03-17 11:46:43'),
(102, 'Parametre-Gestion écoles-Modifier', '2025-03-17 11:46:43', '2025-03-17 11:46:43'),
(103, 'Parametre-Gestion écoles-Supprimer', '2025-03-17 11:46:43', '2025-03-17 11:46:43'),
(104, 'Parametre-Gestion écoles-Voir', '2025-03-17 11:46:43', '2025-03-17 11:46:43'),
(105, 'Transport-Suivi les bus-Ajouter', '2025-03-18 11:45:28', '2025-03-18 11:45:28'),
(106, 'Transport-Suivi les bus-Modifier', '2025-03-18 11:45:28', '2025-03-18 11:45:28'),
(107, 'Transport-Suivi les bus-Supprimer', '2025-03-18 11:45:28', '2025-03-18 11:45:28'),
(108, 'Transport-Suivi les bus-Voir', '2025-03-18 11:45:28', '2025-03-18 11:45:28'),
(109, 'Ressources Humaines-Supprimer', '2025-03-26 09:28:44', '2025-03-26 09:28:44'),
(110, 'Ressources Humaines-Modifier', '2025-03-26 09:28:44', '2025-03-26 09:28:44'),
(111, 'Ressources Humaines-Ajouter', '2025-03-26 09:28:44', '2025-03-26 09:28:44'),
(112, 'Administration-Ajouter', '2025-04-11 16:12:23', '2025-04-11 16:12:23'),
(113, 'Administration-Modifier', '2025-04-11 16:12:23', '2025-04-11 16:12:23'),
(114, 'Administration-Supprimer', '2025-04-11 16:12:23', '2025-04-11 16:12:23'),
(115, 'Comptabilité-Supprimer', '2025-04-11 16:12:23', '2025-04-11 16:12:23'),
(116, 'Comptabilité-Modifier', '2025-04-11 16:12:23', '2025-04-11 16:12:23'),
(117, 'Comptabilité-Ajouter', '2025-04-11 16:12:23', '2025-04-11 16:12:23'),
(118, 'Cantine scolaire-Ajouter', '2025-04-11 16:12:23', '2025-04-11 16:12:23'),
(119, 'Cantine scolaire-Modifier', '2025-04-11 16:12:23', '2025-04-11 16:12:23'),
(120, 'Cantine scolaire-Supprimer', '2025-04-11 16:12:23', '2025-04-11 16:12:23'),
(121, 'Bibliothèque-Supprimer', '2025-04-11 16:12:23', '2025-04-11 16:12:23'),
(122, 'Bibliothèque-Modifier', '2025-04-11 16:12:23', '2025-04-11 16:12:23'),
(123, 'Bibliothèque-Ajouter', '2025-04-11 16:12:23', '2025-04-11 16:12:23');

-- --------------------------------------------------------

--
-- Structure de la table `pointages`
--

DROP TABLE IF EXISTS `pointages`;
CREATE TABLE IF NOT EXISTS `pointages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `statut` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `heuresupP` int(11) DEFAULT NULL,
  `HeureEMP` time DEFAULT NULL,
  `HeureSMP` time DEFAULT NULL,
  `HeureEAMP` time DEFAULT NULL,
  `HeureSAMP` time DEFAULT NULL,
  `datedu` datetime DEFAULT NULL,
  `datea` datetime DEFAULT NULL,
  `justificationab` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `justificationret` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date NOT NULL,
  `latlogEMP` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latlogSMP` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latlogEAMP` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latlogSAMP` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `type_pointage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IdHeureSup` int(11) DEFAULT NULL,
  `employe_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IdHeureSup` (`IdHeureSup`),
  KEY `employe_id` (`employe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `pointages`
--

INSERT INTO `pointages` (`id`, `statut`, `heuresupP`, `HeureEMP`, `HeureSMP`, `HeureEAMP`, `HeureSAMP`, `datedu`, `datea`, `justificationab`, `justificationret`, `date`, `latlogEMP`, `latlogSMP`, `latlogEAMP`, `latlogSAMP`, `archiver`, `type_pointage`, `IdHeureSup`, `employe_id`, `createdAt`, `updatedAt`) VALUES
(1, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-01', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(2, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-02', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(3, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-03', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(4, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-04', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(5, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-07', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(6, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-08', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(7, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-09', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(8, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-10', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(9, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-11', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(10, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-14', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(11, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-15', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(12, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-16', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(13, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-17', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(14, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-18', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(15, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-21', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(16, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-22', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(17, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-23', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(18, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-24', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(19, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-25', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(20, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-28', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(21, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-29', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(22, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-30', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 112, '2025-04-10 12:16:59', '2025-04-10 12:16:59'),
(31, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-01', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(32, 'absent', 0, NULL, NULL, NULL, NULL, NULL, NULL, 'maladie', NULL, '2025-04-02', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(33, 'retard', 0, '08:30:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, 'retard voiture', '2025-04-03', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(34, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-04', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(35, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-07', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(36, 'absent', 0, NULL, NULL, NULL, NULL, NULL, NULL, 'rdv médical', NULL, '2025-04-08', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(37, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-09', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(38, 'retard', NULL, '08:40:00', '12:00:00', '13:10:00', '16:30:00', NULL, NULL, NULL, 'retard bus', '2025-04-10', '', '', '', '', 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 14:22:29'),
(39, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-11', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(40, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-14', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(41, 'absent', 0, NULL, NULL, NULL, NULL, NULL, NULL, 'absence injustifiée', NULL, '2025-04-15', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(42, 'retard', 0, '08:30:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, 'retard personnel', '2025-04-16', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(43, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-17', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(44, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-18', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(45, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-21', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(46, 'absent', 0, NULL, NULL, NULL, NULL, NULL, NULL, 'problème familial', NULL, '2025-04-22', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(47, 'retard', 0, '08:50:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, 'retard météo', '2025-04-23', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(48, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-24', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(49, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-25', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(50, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-28', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(51, 'absent', 0, NULL, NULL, NULL, NULL, NULL, NULL, 'permission', NULL, '2025-04-29', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(52, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-30', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 8, '2025-04-10 16:16:01', '2025-04-10 16:16:01'),
(102, 'absent', 0, NULL, NULL, NULL, NULL, NULL, NULL, 'maladie', NULL, '2025-04-02', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(103, 'retard', 0, '08:45:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, 'retard bus', '2025-04-03', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(104, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-04', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(105, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-07', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(106, 'absent', 0, NULL, NULL, NULL, NULL, NULL, NULL, 'permission', NULL, '2025-04-08', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(107, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-09', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(108, 'retard', 0, '09:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, 'retard voiture', '2025-04-10', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(109, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-11', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(110, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-14', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(111, 'absent', 0, NULL, NULL, NULL, NULL, NULL, NULL, 'absence injustifiée', NULL, '2025-04-15', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(112, 'retard', 0, '08:30:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, 'retard personnel', '2025-04-16', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(113, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-17', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(114, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-18', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(115, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-21', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(116, 'absent', 0, NULL, NULL, NULL, NULL, NULL, NULL, 'RDV médical', NULL, '2025-04-22', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(117, 'retard', 0, '08:40:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, 'retard météo', '2025-04-23', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(118, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-24', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(119, 'present', 1, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, '', '2025-04-25', '', '', '', '', 0, 'normal', 2, 10, '2025-04-10 12:34:10', '2025-04-10 13:09:48'),
(120, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-28', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(121, 'absent', 0, NULL, NULL, NULL, NULL, NULL, NULL, 'problème familial', NULL, '2025-04-29', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(122, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-30', NULL, NULL, NULL, NULL, 0, 'normal', NULL, 10, '2025-04-10 12:34:10', '2025-04-10 12:34:10'),
(123, 'present', NULL, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-10', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 8, '2025-04-10 11:07:54', '2025-04-10 11:07:54'),
(124, 'present', 1, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, '', '2025-04-10', '', '', '', '', 0, 'manuel', 2, 9, '2025-04-10 11:07:54', '2025-04-10 11:09:05'),
(125, 'present', NULL, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-10', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 14, '2025-04-10 11:07:54', '2025-04-10 11:07:54'),
(126, 'present', NULL, '19:43:00', '10:46:00', '10:47:00', '10:47:00', NULL, NULL, NULL, NULL, '2025-04-10', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 21, '2025-04-10 11:07:54', '2025-04-10 11:07:54'),
(127, 'present', NULL, '14:20:00', '14:20:00', '14:20:00', '17:16:00', NULL, NULL, NULL, NULL, '2025-04-10', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 22, '2025-04-10 11:07:54', '2025-04-10 11:07:54'),
(128, 'present', NULL, '08:00:00', '12:00:00', '13:00:00', '17:00:00', NULL, NULL, NULL, NULL, '2025-04-10', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 110, '2025-04-10 11:07:54', '2025-04-10 11:07:54'),
(129, 'present', NULL, '13:31:00', '11:31:00', '11:32:00', '12:32:00', NULL, NULL, NULL, NULL, '2025-04-10', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 111, '2025-04-10 11:07:54', '2025-04-10 11:07:54'),
(130, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-02', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 14, '2025-04-10 17:08:24', '2025-04-10 17:08:24'),
(131, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-03', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 14, '2025-04-10 17:08:24', '2025-04-10 17:08:24'),
(132, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-04', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 14, '2025-04-10 17:08:24', '2025-04-10 17:08:24'),
(133, 'retard', 0, '08:30:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-07', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 14, '2025-04-10 17:08:24', '2025-04-10 17:08:24'),
(134, 'retard', 0, '12:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-08', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 14, '2025-04-10 17:08:24', '2025-04-10 17:08:24'),
(135, 'retard', 0, '14:00:00', '16:30:00', NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-09', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 14, '2025-04-10 17:08:24', '2025-04-10 17:08:24'),
(136, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-10', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 14, '2025-04-10 17:15:46', '2025-04-10 17:15:46'),
(137, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-11', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 14, '2025-04-10 17:15:46', '2025-04-10 17:15:46'),
(138, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-14', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 14, '2025-04-10 17:15:46', '2025-04-10 17:15:46'),
(139, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-15', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 14, '2025-04-10 17:15:46', '2025-04-10 17:15:46'),
(140, 'present', 0, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-16', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 14, '2025-04-10 17:15:46', '2025-04-10 17:15:46'),
(141, 'absent', NULL, '18:25:19', NULL, NULL, NULL, NULL, NULL, NULL, 'retard entrée du matin : ', '2025-04-11', '36.7574501516;5.060171519', NULL, NULL, NULL, 0, 'localisation', NULL, 114, '2025-04-11 16:25:19', '2025-04-11 16:25:19'),
(142, 'present', NULL, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-12', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 8, '2025-04-12 10:50:26', '2025-04-12 10:50:26'),
(143, 'present', NULL, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-12', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 9, '2025-04-12 10:50:26', '2025-04-12 10:50:26'),
(144, 'present', NULL, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-12', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 10, '2025-04-12 10:50:26', '2025-04-12 10:50:26'),
(145, 'present', NULL, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-12', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 14, '2025-04-12 10:50:26', '2025-04-12 10:50:26'),
(146, 'present', NULL, '19:43:00', '10:46:00', '10:47:00', '10:47:00', NULL, NULL, NULL, NULL, '2025-04-12', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 21, '2025-04-12 10:50:26', '2025-04-12 10:50:26'),
(147, 'present', NULL, '14:20:00', '14:20:00', '14:20:00', '17:16:00', NULL, NULL, NULL, NULL, '2025-04-12', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 22, '2025-04-12 10:50:26', '2025-04-12 10:50:26'),
(148, 'present', NULL, '08:00:00', '12:00:00', '13:00:00', '17:00:00', NULL, NULL, NULL, NULL, '2025-04-12', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 110, '2025-04-12 10:50:26', '2025-04-12 10:50:26'),
(149, 'present', NULL, '13:31:00', '11:31:00', '11:32:00', '12:32:00', NULL, NULL, NULL, NULL, '2025-04-12', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 111, '2025-04-12 10:50:26', '2025-04-12 10:50:26'),
(150, 'present', NULL, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-12', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 112, '2025-04-12 10:50:26', '2025-04-12 10:50:26'),
(151, 'present', NULL, '08:00:00', '12:00:00', '13:00:00', '16:30:00', NULL, NULL, NULL, NULL, '2025-04-12', NULL, NULL, NULL, NULL, 0, 'manuel', NULL, 114, '2025-04-12 10:50:26', '2025-04-12 10:50:26');

-- --------------------------------------------------------

--
-- Structure de la table `postes`
--

DROP TABLE IF EXISTS `postes`;
CREATE TABLE IF NOT EXISTS `postes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `poste` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `postes`
--

INSERT INTO `postes` (`id`, `poste`, `archiver`, `createdAt`, `updatedAt`) VALUES
(1, 'responsable', 0, '2025-03-17 12:33:03', '2025-03-17 12:33:03'),
(2, 'Enseignant', 0, '2025-03-17 12:33:29', '2025-03-17 12:33:29'),
(3, 'resonsable E', 0, '2025-03-29 11:24:41', '2025-03-29 11:24:41'),
(4, 'chauffeur', 0, '2025-04-03 07:17:23', '2025-04-03 07:17:23'),
(5, 'test', 0, '2025-04-03 07:29:06', '2025-04-03 07:29:06'),
(6, 'CHAUFFEUR', 0, '2025-04-03 07:36:46', '2025-04-03 07:36:46'),
(7, 'secrétaire', 0, '2025-04-11 16:03:19', '2025-04-11 16:03:19');

-- --------------------------------------------------------

--
-- Structure de la table `presences`
--

DROP TABLE IF EXISTS `presences`;
CREATE TABLE IF NOT EXISTS `presences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eleveId` int(11) NOT NULL,
  `date` date NOT NULL,
  `matin` enum('present','retard','absent') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'present',
  `apres_midi` enum('present','retard','absent') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'present',
  `heure` time DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `presences_eleve_id_date` (`eleveId`,`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `primes`
--

DROP TABLE IF EXISTS `primes`;
CREATE TABLE IF NOT EXISTS `primes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_prime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `montant` float NOT NULL,
  `montantType` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'montant',
  `identifiant_special` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prime_cotisable` tinyint(1) DEFAULT 0,
  `prime_imposable` tinyint(1) DEFAULT 0,
  `deduire` tinyint(1) DEFAULT 0,
  `ecoleId` int(11) NOT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `primes`
--

INSERT INTO `primes` (`id`, `code`, `type_prime`, `montant`, `montantType`, `identifiant_special`, `prime_cotisable`, `prime_imposable`, `deduire`, `ecoleId`, `archiver`, `createdAt`, `updatedAt`) VALUES
(22, 'R100', 'IEP', 0.5, 'pourcentage', 'IEP_1', 1, 1, 0, 1, 0, '2025-04-10 14:47:00', '2025-04-10 14:47:00'),
(23, 'R200', 'Allocation Familliale', 5000, 'montant', 'AF_1', 0, 0, 0, 1, 0, '2025-04-10 14:47:50', '2025-04-10 14:47:50'),
(24, 'R3000', 'Prime de Risque', 2000, 'jour', 'PR-1', 1, 1, 0, 1, 0, '2025-04-10 14:49:32', '2025-04-10 14:58:40'),
(25, 'R5000', 'Prime de Présentation', 1000, 'jour', 'PP_1', 1, 0, 1, 1, 0, '2025-04-10 14:51:07', '2025-04-10 14:51:07'),
(26, 'R5000', 'Prime de Nuisance', 0.2, 'pourcentage', 'PN_1', 1, 1, 1, 1, 0, '2025-04-10 14:52:20', '2025-04-10 15:18:18'),
(27, 'R6000', 'TRANSPORT', 100, 'jour', 'Tranport-1', 0, 1, 1, 1, 0, '2025-04-10 14:53:05', '2025-04-10 14:53:47'),
(28, 'R7000', 'PANIER', 300, 'jour', 'panier_1', 0, 1, 1, 1, 0, '2025-04-10 14:53:36', '2025-04-10 14:53:36');

-- --------------------------------------------------------

--
-- Structure de la table `prime_employes`
--

DROP TABLE IF EXISTS `prime_employes`;
CREATE TABLE IF NOT EXISTS `prime_employes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `PrimeId` int(11) NOT NULL,
  `EmployeId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `EmployeId` (`EmployeId`),
  KEY `Prime_Employes_EmployeId_PrimeId_unique` (`PrimeId`,`EmployeId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `prime_employes`
--

INSERT INTO `prime_employes` (`id`, `PrimeId`, `EmployeId`) VALUES
(35, 22, 8),
(38, 22, 9),
(37, 22, 10),
(34, 23, 8),
(36, 23, 10),
(32, 24, 8),
(33, 25, 8),
(31, 26, 8),
(30, 27, 8),
(40, 27, 9),
(41, 27, 10),
(29, 28, 8),
(39, 28, 9),
(42, 28, 10);

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Administrateur', '2025-03-17 11:22:56', '2025-03-17 11:22:56'),
(2, 'Utilisateur', '2025-03-17 11:35:07', '2025-03-17 11:35:07'),
(3, 'AdminPrincipal', '2025-03-17 11:40:01', '2025-03-17 11:40:01'),
(4, 'Admin', '2025-03-17 12:09:40', '2025-03-17 12:09:40'),
(5, 'Employé', '2025-03-17 12:35:28', '2025-03-17 12:35:28'),
(6, 'Responsable Rh', '2025-03-20 13:48:22', '2025-03-20 13:48:22'),
(7, 'Parent', '2025-03-23 10:51:40', '2025-03-23 10:51:40'),
(9, 'Elève', '2025-03-23 11:29:02', '2025-03-23 11:29:02');

-- --------------------------------------------------------

--
-- Structure de la table `salles`
--

DROP TABLE IF EXISTS `salles`;
CREATE TABLE IF NOT EXISTS `salles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sallearab` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacité` int(11) NOT NULL,
  `remarque` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ecoleId` int(11) DEFAULT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`),
  KEY `ecoleeId` (`ecoleeId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `salles`
--

INSERT INTO `salles` (`id`, `salle`, `sallearab`, `capacité`, `remarque`, `ecoleId`, `ecoleeId`, `archiver`) VALUES
(1, 'Salle 1', 'Salle', 20, 'jkdkj', 1, NULL, 0),
(2, 'salle2', 'salle2', 18, 'max 19 eleve', 1, NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `sections`
--

DROP TABLE IF EXISTS `sections`;
CREATE TABLE IF NOT EXISTS `sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classe` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `classearab` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `niveaunum` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numregime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `niveauxId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `niveauxId` (`niveauxId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sections`
--

INSERT INTO `sections` (`id`, `classe`, `classearab`, `niveaunum`, `numregime`, `niveauxId`, `archiver`) VALUES
(4, '5éme A', '5éme A', 'خامسة ابتدائي', '67576', 3, 0),
(5, '4eme A', '4éme A', 'خامسة ابتدائي', '2', 4, 0),
(6, '4 éme B', '4 éme B', 'رابعة ابتدائي', '3', 4, 0);

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `services`
--

INSERT INTO `services` (`id`, `service`, `archiver`, `createdAt`, `updatedAt`) VALUES
(1, 'comptabilité', 0, '2025-03-17 12:33:15', '2025-03-17 12:33:15'),
(2, 'A', 0, '2025-03-17 12:46:40', '2025-03-17 12:46:40'),
(3, 'RH', 0, '2025-03-17 12:51:21', '2025-03-17 12:51:21'),
(4, 'serviceE', 0, '2025-03-29 11:24:49', '2025-03-29 11:24:49'),
(5, 'B', 0, '2025-04-11 16:03:32', '2025-04-11 16:03:32');

-- --------------------------------------------------------

--
-- Structure de la table `trimests`
--

DROP TABLE IF EXISTS `trimests`;
CREATE TABLE IF NOT EXISTS `trimests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `titre_ar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datedebut` datetime DEFAULT NULL,
  `datefin` datetime DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `trimests`
--

INSERT INTO `trimests` (`id`, `titre`, `titre_ar`, `datedebut`, `datefin`, `archiver`) VALUES
(1, '1 er trimeste', 'الفصل الأول', '2024-09-02 00:00:00', '2024-12-20 00:00:00', 0);

-- --------------------------------------------------------

--
-- Structure de la table `userecoles`
--

DROP TABLE IF EXISTS `userecoles`;
CREATE TABLE IF NOT EXISTS `userecoles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserEcoles_ecoleeId_userId_unique` (`userId`,`ecoleeId`),
  KEY `ecoleeId` (`ecoleeId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `userecoles`
--

INSERT INTO `userecoles` (`id`, `userId`, `ecoleeId`) VALUES
(1, 7, 1),
(4, 11, 2),
(5, 114, 1);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nom_ar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prenom_ar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datenaiss` datetime DEFAULT NULL,
  `lieuxnaiss` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lieuxnaiss_ar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adresse` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adresse_ar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sexe` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationalite` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ecoleId` int(11) DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL,
  `lastIp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastMac` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastLocation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `statuscompte` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activer'
) ;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `nom_ar`, `prenom_ar`, `datenaiss`, `lieuxnaiss`, `lieuxnaiss_ar`, `adresse`, `adresse_ar`, `sexe`, `telephone`, `email`, `nationalite`, `username`, `password`, `type`, `ecoleId`, `lastLogin`, `lastIp`, `lastMac`, `lastLocation`, `latitude`, `longitude`, `createdAt`, `updatedAt`, `deletedAt`, `statuscompte`, `archiver`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'dounia@gmail.com', NULL, 'dounia', '$2b$10$eeJaJ2Ytu6Ad0Kflnr5ImOHG1cVcAOAuoIcWapteW2qBs56MdNmPu', 'Administrateur', NULL, '2025-03-30 11:54:29', '154.247.23.156', NULL, 'Inconnu, Inconnu', 36.754, 5.06061, '2025-03-17 11:22:56', '2025-03-30 11:54:29', NULL, 'activer', 0),
(2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'yasmine@gmail.com', NULL, 'yasmine', '$2b$10$O9o7uo3h5TdbCArLKjN0pe9YWsPtJCCFbldkhjo6.S7PnFSlEM34a', 'Administrateur', NULL, '2025-03-27 08:56:36', '154.247.201.72', NULL, 'Inconnu, Inconnu', 36.754, 5.06062, '2025-03-17 11:35:07', '2025-03-27 08:56:36', NULL, 'activer', 0),
(3, 'AdminPrincipaleEA', 'AdminPrincipaleEA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '076453645', 'AdminPrincipaleEA@gmail.com', NULL, 'Ecole@ECO6FQ984', '$2b$10$eeJaJ2Ytu6Ad0Kflnr5ImOHG1cVcAOAuoIcWapteW2qBs56MdNmPu', 'AdminPrincipal', 1, '2025-04-12 10:32:22', NULL, NULL, 'Inconnu, Inconnu', 36.7574, 5.06865, '2025-03-17 11:40:01', '2025-04-12 10:32:22', NULL, 'activer', 0),
(6, 'AdminPrincipaleEB', 'AdminPrincipaleEB', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '01234444', 'AdminPrincipaleEB@gmail.com', NULL, 'Ecole@ECOBC0280', '$2b$10$O9o7uo3h5TdbCArLKjN0pe9YWsPtJCCFbldkhjo6.S7PnFSlEM34a', 'AdminPrincipal', 4, '2025-03-27 10:21:53', '154.247.201.72', NULL, 'Inconnu, Inconnu', 36.7539, 5.06086, '2025-03-17 11:52:54', '2025-03-27 10:21:53', NULL, 'activer', 0),
(7, 'AdminsousEcoleA', 'AdminsousEcoleA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '012121212', 'AdminsousEcoleA@gmail.com', NULL, 'Ecole@SOUEGW887', '$2b$10$eeJaJ2Ytu6Ad0Kflnr5ImOHG1cVcAOAuoIcWapteW2qBs56MdNmPu', 'Admin', 1, '2025-03-22 22:10:36', '154.247.125.229', NULL, 'Inconnu, Inconnu', 36.5578, 4.86536, '2025-03-17 12:09:40', '2025-03-22 22:10:36', NULL, 'activer', 0),
(8, 'zahra', 'zahra', 'zahra', 'zahra', '2025-03-05 00:00:00', 'bejaia', 'bejaia', 'bejaia', 'bejaia', 'Féminin', '0123456789', 'EmployeEA@gmail.com', 'AL', 'employe@zz1542', '$2b$10$eeJaJ2Ytu6Ad0Kflnr5ImOHG1cVcAOAuoIcWapteW2qBs56MdNmPu', 'Employé', 1, '2025-03-31 22:22:53', '154.247.186.133', NULL, 'Inconnu, Inconnu', 36.7574, 5.06869, '2025-03-17 12:35:28', '2025-03-31 22:22:53', NULL, 'activer', 0),
(9, 'amina', 'amina', 'amina', 'amina', '2025-03-12 00:00:00', 'alger', 'alger', 'alger', 'alger', 'Féminin', '01234444', 'aminaESA@gmail.com', 'DZ', 'employe@aa8246', '$2b$10$arfaPb2tNaDf864T/WckgeB5lJB6MI4HY/Nw8vGexDPKHO3BOWazW', 'Employé', 1, '2025-04-12 10:54:26', NULL, NULL, 'Inconnu, Inconnu', 36.7574, 5.06865, '2025-03-17 12:49:22', '2025-04-12 10:54:26', NULL, 'activer', 0),
(10, 'mohend', 'mohend', 'mohend', 'mohend', '2025-03-14 00:00:00', 'bejaia', 'bejaia', 'bejaia', 'bejaia', 'Masculin', '0123456789', 'mohendESA@gmail.com', 'DZ', 'employe@mm5773', '$2b$10$nkUlb9NC0/zPOsDn5dfGaOa1FItgcLZ1CodOrPCDnHk.4tVtNekCG', 'Employé', 1, '2025-04-12 10:54:52', NULL, NULL, 'Inconnu, Inconnu', 36.7574, 5.06865, '2025-03-17 12:53:20', '2025-04-12 10:54:52', NULL, 'activer', 0),
(11, 'AdminsousEcoleB', 'AdminsousEcoleB', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '01233444444', 'AdminsousEcoleB@gmail.com', NULL, 'Ecole@SOUDUF137', '$2b$10$Qt59a5gK4qucT73luINi.uO55EtFOcckS6SVPOGDhdM9N2JWB1zPe', 'Admin', 4, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-18 11:40:02', '2025-03-18 11:40:02', NULL, 'activer', 0),
(14, 'amir', 'amir', 'amir', 'amir', '1997-01-23 00:00:00', 'alger', 'alger', 'alger', 'alger', 'Masculin', '01234444', 'amir@gmail.com', 'DZ', 'employe@aa3181', '$2b$10$.0wH3U.hBRLNv7pU8Q6LLeqcit72dmePNDMWX8ZNdo1HpjXmEQmJC', 'Employé', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-23 19:41:34', '2025-03-23 19:41:34', NULL, 'activer', 0),
(21, 'dounia', 'dounia', 'dounia', 'dounia', '2025-03-14 00:00:00', 'bejaia', 'bejaia', 'bejaia', 'bejaia', 'Féminin', '012345678', 'dounia@gmail.com', 'DZ', 'employe@dd9344', '$2b$10$H8LbkI5ZZ22YRo6.0dH6wOirZqWqAnMl/YflyLQjPpLQgJXFJdruC', 'Employé', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-24 10:00:53', '2025-03-24 10:00:53', NULL, 'activer', 0),
(22, 'Said ', 'Haddad', 'Haddad', 'said', '2014-03-24 00:00:00', 'alger', 'alger', '', '', 'Masculin', '0123456789', 'said@gmail.com', 'AL', 'employe@sh4548', '$2b$10$DhA/DPSA6aVwBZ9xlMRGPuAN7YqOA8uCWUdXDzefwAkvpXDJxoFSi', 'Employé', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-24 13:17:07', '2025-03-24 13:17:07', NULL, 'activer', 0),
(47, 'Parent2', 'Parent2', NULL, NULL, '1987-03-16 00:00:00', 'Amizour', NULL, '', NULL, NULL, '0794286408', 'parent2@gmail.com', NULL, 'parent@pp1018', '$2b$10$AThnt23OZVi/zsbEYE4yn.Jtw.THKuvuUtTPEXg.B/ZreCnSYfiRe', 'Parent', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-23 11:29:01', '2025-03-23 11:29:01', NULL, 'activer', 0),
(48, 'Parent1', 'Parent1', NULL, NULL, '1984-03-06 00:00:00', 'Amizour', NULL, '', NULL, NULL, '0794286408', 'parent1@gmail.com', NULL, 'parent@pp5461', '$2b$10$p8m8XoiUfxdq.LJy5EttE.XeEZDIo5rdv5FkowStUy8thyKK.yUuO', 'Parent', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-23 11:29:01', '2025-03-23 11:29:01', NULL, 'activer', 0),
(49, 'Eleve', 'Eleve', NULL, NULL, '2015-03-01 00:00:00', 'amizour', NULL, 'aferaoun', NULL, 'Féminin', NULL, NULL, NULL, 'Eleve@ee9761', '$2b$10$THpoBtEmvmA6UlVeb4K4IucQ89PlsMyhcB/Bpn8mqxs8vgdnjoOVS', 'Eleve', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-23 11:29:02', '2025-03-23 11:29:02', NULL, 'activer', 0),
(70, 'aghouiles', 'aghouiles', NULL, NULL, '1969-06-11 00:00:00', 'Amizour', NULL, '', NULL, NULL, '0794286408', 'aghouiles@gmail.com', NULL, 'parent@aa8704', '$2b$10$mpk3ZMcuLwNKsvAcleZEhObKaq1gZ8RlWPcv7XT8CNu8ugXYf4WYa', 'Parent', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-24 07:47:02', '2025-03-24 07:47:02', NULL, 'activer', 0),
(71, 'izem', 'izem', NULL, NULL, '1974-06-11 00:00:00', 'barbacha', NULL, '', NULL, NULL, '0794286408', 'izem@gmail.com', NULL, 'parent@ii2760', '$2b$10$m8nv5SU/sW6rXvp/cE2GLeTt8ogOTqLA1mj9mc6evLngP9rdp.MIq', 'Parent', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-24 07:47:02', '2025-03-24 07:47:02', NULL, 'activer', 0),
(72, 'aghouiles', 'yasmine', NULL, NULL, '2016-10-03 00:00:00', 'Barbacha', NULL, 'Feraoun', NULL, 'Féminin', NULL, NULL, NULL, 'Eleve@ay2607', '$2b$10$fM7hFWkxlIjOO54govmMeuz1Hu0yFPUX4ARDPGRUFbvF6gJWtkUyu', 'Eleve', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-24 07:47:02', '2025-03-24 07:47:02', NULL, 'activer', 0),
(83, 'linda ', 'bourdjahe', NULL, NULL, '1987-03-17 00:00:00', 'Barbacha', NULL, '', NULL, NULL, '04857676', 'linda@gmail.com', NULL, 'parent@lb6740', '$2b$10$26RvbrZzwlK5Zanm9zSwsugDVnQG.3Cxqm2nbbPhzUlWxa6S7U/kS', 'Parent', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-25 09:13:53', '2025-03-26 12:14:36', NULL, 'activer', 0),
(84, 'saadi', 'djafri', NULL, NULL, '1981-03-07 00:00:00', 'barbacha', NULL, '', NULL, NULL, '0794286234', 'saadi@gmail.com', NULL, 'parent@sd1826', '$2b$10$FKHmCh1QEJ7DiuqC85vcies.bLXkuvQgTxNHI9F9p1pEiAcF5waiC', 'Parent', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-25 09:13:53', '2025-03-26 12:14:36', NULL, 'activer', 0),
(85, 'ayline', 'ayline', NULL, NULL, '2016-03-05 00:00:00', 'amizour', NULL, 'Feraoun', NULL, 'Féminin', NULL, NULL, NULL, 'Eleve@aa6409', '$2b$10$rxkkBDQnhvBs7vbWDQ17U.ceeMzL34KlnXzFxpsiNg/Rt7YmN1yRS', 'Eleve', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-25 09:13:53', '2025-03-26 12:14:36', NULL, 'activer', 0),
(110, 'hamid', 'hamid', 'hamid', 'hamid', '2025-03-06 00:00:00', '', '', '', '', 'Masculin', '01234444', 'hamid@gmail.com', 'DZ', 'employe@hh3427', '$2b$10$ZXn8wF8eNx6Lo/dL8t1aWuP6oN6Hpm4p3lNcxSrfcvSC9Uwo4vUaS', 'Employé', 4, '2025-03-29 11:28:31', '105.108.17.38', NULL, 'Inconnu, Inconnu', 36.7573, 5.06869, '2025-03-29 11:26:14', '2025-03-29 11:28:31', NULL, 'activer', 0),
(111, 'testEnseishhssh', 'testEnsi', 'test', 'test', '2025-04-18 00:00:00', '', '', '', '', '', '01234444', '', '', 'employe@tt6466', '$2b$10$JMUpmdPmdJN7ZPjblBdpQ.7/FnNN3dVTktsM1uk2gCsEiRsC6cOyy', 'Employé', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-03 07:32:09', '2025-04-03 07:32:09', NULL, 'activer', 0),
(112, 'chafik', 'amine', 'chafik', 'amine', '2025-04-11 00:00:00', 'Bejaia ', 'bejaia', 'test', 'test', 'Masculin', '01234444', 'chaff@gmail.com', 'AL', 'employe@cc6918', '$2b$10$gZbsEWkAb8mfqF964ExUue4Dw.o5HNlt0ZEeVB4b1J8UmE54N2OiC', 'Employé', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-03 07:40:02', '2025-04-03 07:40:02', NULL, 'activer', 0),
(114, 'karima ', 'karima', 'karima', 'karima', '1999-01-11 00:00:00', 'alger', 'alger', 'bejaia', 'bejaia', 'Féminin', '0123456789', 'karima@gmail.com', 'DZ', 'employe@karimaSEA', '$2b$10$fz/mjJJ.IvqgPkj5ATsk0e/fBMZbhSMKQegfj0NaidCIdEmRVBZ/.', 'Employé', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-11 16:04:33', '2025-04-11 16:04:33', NULL, 'activer', 0);

-- --------------------------------------------------------

--
-- Structure de la table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE IF NOT EXISTS `user_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  `permissionId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `permissionId` (`permissionId`),
  KEY `user_roles_permissionId_userId_unique` (`userId`,`permissionId`) USING BTREE,
  KEY `user_roles_permissionId_roleId_unique` (`roleId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=696 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user_roles`
--

INSERT INTO `user_roles` (`id`, `userId`, `roleId`, `permissionId`) VALUES
(110, 1, 1, NULL),
(111, 2, 1, NULL),
(117, 6, 3, 1),
(118, 6, 3, 18),
(119, 6, 3, 43),
(120, 6, 3, 44),
(121, 6, 3, 77),
(195, 6, 3, 45),
(196, 6, 3, 46),
(197, 6, 3, 47),
(198, 6, 3, 48),
(199, 6, 3, 49),
(200, 6, 3, 50),
(201, 6, 3, 51),
(202, 6, 3, 52),
(203, 6, 3, 53),
(204, 6, 3, 54),
(205, 6, 3, 55),
(206, 6, 3, 57),
(207, 6, 3, 60),
(208, 6, 3, 59),
(209, 6, 3, 56),
(210, 6, 3, 58),
(211, 6, 3, 65),
(212, 6, 3, 66),
(213, 6, 3, 68),
(214, 6, 3, 67),
(215, 6, 3, 64),
(216, 6, 3, 63),
(217, 6, 3, 62),
(218, 6, 3, 61),
(219, 6, 3, 72),
(220, 6, 3, 71),
(221, 6, 3, 70),
(222, 6, 3, 69),
(223, 6, 3, 76),
(224, 6, 3, 75),
(225, 6, 3, 74),
(226, 6, 3, 73),
(239, 7, 4, NULL),
(240, 7, 4, 1),
(241, 7, 4, 2),
(242, 7, 4, 3),
(243, 7, 4, 4),
(244, 7, 4, 6),
(245, 7, 4, 5),
(246, 7, 4, 7),
(247, 7, 4, 8),
(248, 7, 4, 9),
(249, 7, 4, 10),
(250, 7, 4, 11),
(251, 7, 4, 12),
(252, 7, 4, 13),
(253, 7, 4, 14),
(254, 7, 4, 15),
(255, 7, 4, 16),
(256, 7, 4, 17),
(257, 7, 4, 18),
(258, 7, 4, 19),
(259, 7, 4, 20),
(260, 7, 4, 21),
(261, 7, 4, 22),
(262, 7, 4, 23),
(263, 7, 4, 24),
(264, 7, 4, 25),
(265, 7, 4, 27),
(266, 7, 4, 26),
(267, 7, 4, 28),
(268, 7, 4, 29),
(269, 7, 4, 30),
(270, 7, 4, 31),
(271, 7, 4, 32),
(272, 7, 4, 33),
(273, 7, 4, 34),
(274, 7, 4, 35),
(275, 7, 4, 36),
(276, 7, 4, 37),
(277, 7, 4, 38),
(278, 7, 4, 39),
(279, 7, 4, 40),
(280, 7, 4, 41),
(281, 7, 4, 42),
(282, 7, 4, 43),
(283, 7, 4, 44),
(284, 7, 4, 45),
(285, 7, 4, 46),
(286, 7, 4, 47),
(287, 7, 4, 48),
(288, 7, 4, 49),
(289, 7, 4, 50),
(290, 7, 4, 51),
(291, 7, 4, 52),
(292, 7, 4, 53),
(293, 7, 4, 54),
(294, 7, 4, 55),
(295, 7, 4, 57),
(296, 7, 4, 56),
(297, 7, 4, 58),
(298, 7, 4, 59),
(299, 7, 4, 60),
(300, 7, 4, 61),
(301, 7, 4, 62),
(302, 7, 4, 63),
(303, 7, 4, 64),
(304, 7, 4, 65),
(305, 7, 4, 66),
(306, 7, 4, 67),
(307, 7, 4, 68),
(308, 7, 4, 69),
(309, 7, 4, 70),
(310, 7, 4, 71),
(311, 7, 4, 72),
(312, 7, 4, 73),
(313, 7, 4, 74),
(314, 7, 4, 75),
(315, 7, 4, 76),
(316, 7, 4, 77),
(317, 7, 4, 78),
(318, 7, 4, 79),
(319, 7, 4, 80),
(320, 7, 4, 81),
(321, 7, 4, 82),
(322, 7, 4, 83),
(323, 7, 4, 100),
(324, 7, 4, 101),
(325, 7, 4, 102),
(326, 7, 4, 103),
(327, 7, 4, 104),
(332, 6, 3, 2),
(333, 6, 3, 3),
(334, 6, 3, 6),
(335, 6, 3, 4),
(336, 6, 3, 5),
(337, 6, 3, 9),
(338, 6, 3, 8),
(339, 6, 3, 7),
(340, 6, 3, 13),
(341, 6, 3, 11),
(342, 6, 3, 12),
(343, 6, 3, 10),
(344, 6, 3, 16),
(345, 6, 3, 17),
(346, 6, 3, 14),
(347, 6, 3, 15),
(348, 6, 3, 19),
(349, 6, 3, 21),
(350, 6, 3, 22),
(351, 6, 3, 20),
(352, 6, 3, 27),
(353, 6, 3, 25),
(354, 6, 3, 24),
(355, 6, 3, 23),
(356, 6, 3, 26),
(357, 6, 3, 28),
(358, 6, 3, 30),
(359, 6, 3, 29),
(360, 6, 3, 33),
(361, 6, 3, 32),
(362, 6, 3, 34),
(363, 6, 3, 31),
(364, 6, 3, 35),
(365, 6, 3, 36),
(366, 6, 3, 38),
(367, 6, 3, 37),
(368, 6, 3, 39),
(369, 6, 3, 40),
(370, 6, 3, 41),
(371, 6, 3, 42),
(372, 6, 3, 78),
(373, 6, 3, 79),
(374, 6, 3, 81),
(375, 6, 3, 105),
(376, 6, 3, 106),
(377, 6, 3, 107),
(378, 6, 3, 108),
(379, 6, 3, 80),
(380, 6, 3, 82),
(381, 6, 3, 83),
(382, 6, 3, 100),
(383, 11, 4, 45),
(384, 11, 4, 46),
(385, 11, 4, 47),
(386, 11, 4, 48),
(387, 11, 4, 49),
(388, 11, 4, 50),
(389, 11, 4, 51),
(390, 11, 4, 52),
(395, 11, 4, 60),
(396, 11, 4, 59),
(397, 11, 4, 56),
(398, 11, 4, 58),
(403, 11, 4, 65),
(404, 11, 4, 66),
(405, 11, 4, 67),
(406, 11, 4, 68),
(407, 11, 4, 72),
(408, 11, 4, 71),
(409, 11, 4, 70),
(410, 11, 4, 69),
(415, 10, 5, 52),
(416, 10, 5, 51),
(417, 10, 5, 50),
(422, 3, 3, 1),
(423, 3, 3, 4),
(424, 3, 3, 3),
(425, 3, 3, 2),
(426, 3, 3, 6),
(427, 3, 3, 9),
(428, 3, 3, 7),
(429, 3, 3, 8),
(430, 3, 3, 5),
(431, 3, 3, 10),
(432, 3, 3, 12),
(433, 3, 3, 13),
(434, 3, 3, 11),
(435, 3, 3, 16),
(436, 3, 3, 17),
(437, 3, 3, 15),
(438, 3, 3, 14),
(439, 3, 3, 18),
(440, 3, 3, 20),
(441, 3, 3, 22),
(442, 3, 3, 21),
(443, 3, 3, 19),
(444, 3, 3, 23),
(445, 3, 3, 24),
(446, 3, 3, 27),
(447, 3, 3, 25),
(448, 3, 3, 29),
(449, 3, 3, 30),
(450, 3, 3, 28),
(451, 3, 3, 26),
(453, 3, 3, 32),
(454, 3, 3, 34),
(455, 3, 3, 31),
(456, 3, 3, 35),
(457, 3, 3, 36),
(458, 3, 3, 38),
(459, 3, 3, 37),
(460, 3, 3, 42),
(461, 3, 3, 41),
(462, 3, 3, 40),
(463, 3, 3, 39),
(464, 3, 3, 43),
(465, 3, 3, 44),
(466, 3, 3, 45),
(467, 3, 3, 46),
(468, 3, 3, 47),
(469, 3, 3, 48),
(470, 3, 3, 49),
(471, 3, 3, 50),
(472, 3, 3, 51),
(473, 3, 3, 52),
(474, 3, 3, 58),
(475, 3, 3, 56),
(476, 3, 3, 59),
(477, 3, 3, 60),
(478, 3, 3, 65),
(479, 3, 3, 66),
(480, 3, 3, 67),
(481, 3, 3, 68),
(482, 3, 3, 69),
(483, 3, 3, 70),
(484, 3, 3, 71),
(485, 3, 3, 72),
(486, 3, 3, 76),
(487, 3, 3, 75),
(488, 3, 3, 74),
(489, 3, 3, 73),
(490, 3, 3, 77),
(491, 3, 3, 78),
(492, 3, 3, 79),
(493, 3, 3, 81),
(494, 3, 3, 108),
(495, 3, 3, 107),
(496, 3, 3, 106),
(497, 3, 3, 105),
(498, 3, 3, 80),
(499, 3, 3, 82),
(500, 3, 3, 83),
(501, 3, 3, 84),
(502, 3, 3, 85),
(503, 3, 3, 86),
(504, 3, 3, 87),
(505, 3, 3, 88),
(506, 3, 3, 89),
(507, 3, 3, 90),
(508, 3, 3, 91),
(509, 3, 3, 92),
(510, 3, 3, 93),
(511, 3, 3, 94),
(512, 3, 3, 95),
(513, 3, 3, 96),
(514, 3, 3, 97),
(515, 3, 3, 98),
(516, 3, 3, 99),
(517, 3, 3, 100),
(518, 3, 3, 101),
(519, 3, 3, 102),
(520, 3, 3, 103),
(521, 3, 3, 104),
(522, 14, 5, NULL),
(529, 21, 5, NULL),
(530, 22, 5, NULL),
(536, 10, 5, 59),
(537, 10, 5, 56),
(538, 10, 5, 58),
(539, 10, 5, 65),
(540, 10, 5, 66),
(541, 10, 5, 67),
(544, 10, 5, 70),
(545, 10, 5, 71),
(546, 10, 5, 72),
(552, 10, 5, 109),
(553, 10, 5, 110),
(554, 10, 5, 111),
(563, 10, 5, 53),
(564, 10, 5, 54),
(565, 10, 5, 55),
(568, 10, 5, 62),
(569, 10, 5, 63),
(570, 10, 5, 64),
(571, 10, 5, 49),
(572, 10, 5, 57),
(573, 10, 5, 60),
(574, 10, 5, 61),
(575, 10, 5, 68),
(576, 10, 5, 69),
(578, 10, 5, 44),
(579, 10, 5, 45),
(580, 10, 5, 46),
(581, 10, 5, 48),
(582, 10, 5, 47),
(583, 10, 5, 76),
(584, 10, 5, 75),
(585, 10, 5, 74),
(586, 10, 5, 73),
(588, 8, 6, 44),
(589, 49, 9, NULL),
(590, 72, 9, NULL),
(591, 85, 9, NULL),
(592, 47, 7, NULL),
(593, 48, 7, NULL),
(594, 70, 7, NULL),
(595, 71, 7, NULL),
(596, 83, 7, NULL),
(597, 84, 7, NULL),
(598, 3, 3, 33),
(599, 110, 5, 44),
(600, 110, 5, 53),
(601, 110, 5, 54),
(602, 110, 5, 55),
(603, 110, 5, 57),
(604, 110, 5, 61),
(605, 110, 5, 62),
(606, 110, 5, 63),
(607, 110, 5, 64),
(608, 110, 5, 109),
(609, 110, 5, 110),
(610, 110, 5, 111),
(611, 110, 5, 45),
(612, 110, 5, 46),
(613, 110, 5, 47),
(614, 110, 5, 48),
(615, 110, 5, 49),
(616, 110, 5, 50),
(617, 110, 5, 51),
(618, 110, 5, 52),
(619, 8, 5, 44),
(620, 8, 5, 53),
(621, 8, 5, 54),
(622, 8, 5, 55),
(623, 8, 5, 57),
(624, 8, 5, 61),
(625, 8, 5, 62),
(626, 8, 5, 63),
(627, 8, 5, 64),
(628, 8, 5, 109),
(629, 8, 5, 110),
(630, 8, 5, 111),
(631, 111, 5, NULL),
(632, 112, 5, NULL),
(633, 9, 5, 44),
(634, 9, 5, 53),
(635, 9, 5, 54),
(636, 9, 5, 55),
(637, 9, 5, 57),
(638, 9, 5, 61),
(639, 9, 5, 62),
(640, 9, 5, 63),
(641, 9, 5, 64),
(642, 9, 5, 109),
(643, 9, 5, 111),
(644, 9, 5, 110),
(647, 114, 5, 44),
(648, 114, 5, 53),
(649, 114, 5, 54),
(650, 114, 5, 55),
(651, 114, 5, 57),
(652, 114, 5, 61),
(653, 114, 5, 62),
(654, 114, 5, 63),
(655, 114, 5, 64),
(656, 114, 5, 109),
(657, 114, 5, 110),
(658, 114, 5, 111),
(659, 114, 5, 45),
(660, 114, 5, 46),
(661, 114, 5, 47),
(662, 114, 5, 48),
(663, 114, 5, 49),
(664, 114, 5, 50),
(665, 114, 5, 51),
(666, 114, 5, 52),
(667, 114, 5, 58),
(668, 114, 5, 56),
(669, 114, 5, 59),
(670, 114, 5, 60),
(671, 114, 5, 68),
(672, 114, 5, 67),
(673, 114, 5, 66),
(674, 114, 5, 65),
(675, 114, 5, 72),
(676, 114, 5, 71),
(677, 114, 5, 70),
(678, 114, 5, 69),
(679, 114, 5, 112),
(680, 114, 5, 113),
(681, 114, 5, 114),
(682, 114, 5, 1),
(683, 114, 5, 77),
(684, 114, 5, 115),
(685, 114, 5, 116),
(686, 114, 5, 117),
(687, 114, 5, 118),
(688, 114, 5, 119),
(689, 114, 5, 120),
(690, 114, 5, 78),
(691, 114, 5, 79),
(692, 114, 5, 121),
(693, 114, 5, 122),
(694, 114, 5, 123);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `ecoles`
--
ALTER TABLE `ecoles`
  ADD CONSTRAINT `ecoles_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `eleveparents`
--
ALTER TABLE `eleveparents`
  ADD CONSTRAINT `eleveparents_ibfk_1` FOREIGN KEY (`EleveId`) REFERENCES `eleves` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eleveparents_ibfk_2` FOREIGN KEY (`ParentId`) REFERENCES `parents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `eleves`
--
ALTER TABLE `eleves`
  ADD CONSTRAINT `eleves_ibfk_1` FOREIGN KEY (`niveauId`) REFERENCES `niveauxes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eleves_ibfk_2` FOREIGN KEY (`classeId`) REFERENCES `sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eleves_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `emploidutemps`
--
ALTER TABLE `emploidutemps`
  ADD CONSTRAINT `emploidutemps_ibfk_1` FOREIGN KEY (`niveauId`) REFERENCES `niveauxes` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `emploidutemps_ibfk_2` FOREIGN KEY (`sectionId`) REFERENCES `sections` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `emploidutemps_ibfk_3` FOREIGN KEY (`matiereId`) REFERENCES `matieres` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `emploidutemps_ibfk_4` FOREIGN KEY (`enseignantId`) REFERENCES `enseignants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `employes`
--
ALTER TABLE `employes`
  ADD CONSTRAINT `employes_ibfk_1` FOREIGN KEY (`poste`) REFERENCES `postes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employes_ibfk_2` FOREIGN KEY (`service`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employes_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `enseignantclasse`
--
ALTER TABLE `enseignantclasse`
  ADD CONSTRAINT `enseignantclasse_ibfk_1` FOREIGN KEY (`enseignantId`) REFERENCES `enseignants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `enseignantclasse_ibfk_2` FOREIGN KEY (`matiereId`) REFERENCES `matieres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `enseignantclasse_ibfk_3` FOREIGN KEY (`classeId`) REFERENCES `sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `enseignantclasse_ibfk_4` FOREIGN KEY (`niveauId`) REFERENCES `niveauxes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `enseignants`
--
ALTER TABLE `enseignants`
  ADD CONSTRAINT `enseignants_ibfk_1` FOREIGN KEY (`employe_id`) REFERENCES `employes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `heuressups`
--
ALTER TABLE `heuressups`
  ADD CONSTRAINT `heuressups_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `journalpaie`
--
ALTER TABLE `journalpaie`
  ADD CONSTRAINT `journalpaie_ibfk_1` FOREIGN KEY (`periodePaieId`) REFERENCES `periodepaies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `journalpaie_ibfk_2` FOREIGN KEY (`idEmploye`) REFERENCES `employes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `niveauxmatieres`
--
ALTER TABLE `niveauxmatieres`
  ADD CONSTRAINT `niveauxmatieres_ibfk_1` FOREIGN KEY (`niveauId`) REFERENCES `niveauxes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `niveauxmatieres_ibfk_2` FOREIGN KEY (`matiereId`) REFERENCES `matieres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `parametereretards`
--
ALTER TABLE `parametereretards`
  ADD CONSTRAINT `parametereretards_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `parents`
--
ALTER TABLE `parents`
  ADD CONSTRAINT `parents_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `periodepaies`
--
ALTER TABLE `periodepaies`
  ADD CONSTRAINT `periodepaies_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `periodes`
--
ALTER TABLE `periodes`
  ADD CONSTRAINT `periodes_ibfk_1` FOREIGN KEY (`niveauId`) REFERENCES `niveauxes` (`id`),
  ADD CONSTRAINT `periodes_ibfk_2` FOREIGN KEY (`sectionId`) REFERENCES `sections` (`id`);

--
-- Contraintes pour la table `pointages`
--
ALTER TABLE `pointages`
  ADD CONSTRAINT `pointages_ibfk_1` FOREIGN KEY (`IdHeureSup`) REFERENCES `heuressups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pointages_ibfk_2` FOREIGN KEY (`employe_id`) REFERENCES `employes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `presences`
--
ALTER TABLE `presences`
  ADD CONSTRAINT `presences_ibfk_1` FOREIGN KEY (`eleveId`) REFERENCES `eleves` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `prime_employes`
--
ALTER TABLE `prime_employes`
  ADD CONSTRAINT `prime_employes_ibfk_1` FOREIGN KEY (`PrimeId`) REFERENCES `primes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prime_employes_ibfk_2` FOREIGN KEY (`EmployeId`) REFERENCES `employes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `salles`
--
ALTER TABLE `salles`
  ADD CONSTRAINT `salles_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salles_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `sections`
--
ALTER TABLE `sections`
  ADD CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`niveauxId`) REFERENCES `niveauxes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `userecoles`
--
ALTER TABLE `userecoles`
  ADD CONSTRAINT `userecoles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `userecoles_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_3` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
