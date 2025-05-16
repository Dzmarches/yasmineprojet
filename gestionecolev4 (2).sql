-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 16 mai 2025 à 18:55
-- Version du serveur : 11.2.2-MariaDB
-- Version de PHP : 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestionecolev5`
--

-- --------------------------------------------------------

--
-- Structure de la table `achats`
--

DROP TABLE IF EXISTS `achats`;
CREATE TABLE IF NOT EXISTS `achats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `articleId` int(11) NOT NULL,
  `fournisseurId` int(11) NOT NULL,
  `prix` float NOT NULL,
  `devise` varchar(10) DEFAULT NULL,
  `tva` float DEFAULT NULL,
  `unite` varchar(255) DEFAULT NULL,
  `date_achat` datetime NOT NULL,
  `date_peremption` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `articleId` (`articleId`),
  KEY `fournisseurId` (`fournisseurId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `anneescolaires`
--

DROP TABLE IF EXISTS `anneescolaires`;
CREATE TABLE IF NOT EXISTS `anneescolaires` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) DEFAULT NULL,
  `titre_ar` varchar(255) DEFAULT NULL,
  `datedebut` datetime DEFAULT NULL,
  `datefin` datetime DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `anneescolaires`
--

INSERT INTO `anneescolaires` (`id`, `titre`, `titre_ar`, `datedebut`, `datefin`, `archiver`) VALUES
(1, '2024-2025', NULL, '2024-09-08 00:00:00', '2025-06-25 00:00:00', 0),
(2, '2025-2026', NULL, '2025-09-08 00:00:00', '2026-06-25 00:00:00', 0);

-- --------------------------------------------------------

--
-- Structure de la table `articles`
--

DROP TABLE IF EXISTS `articles`;
CREATE TABLE IF NOT EXISTS `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code_article` varchar(255) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `magasinier` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `categorieId` int(11) NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `date_creation` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `articles_code_article_libelle` (`code_article`,`libelle`),
  KEY `categorieId` (`categorieId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `attestations`
--

DROP TABLE IF EXISTS `attestations`;
CREATE TABLE IF NOT EXISTS `attestations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `modeleTexte` text NOT NULL,
  `module` varchar(255) NOT NULL,
  `ecoleId` int(11) NOT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`),
  KEY `ecoleeId` (`ecoleeId`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `attestations`
--

INSERT INTO `attestations` (`id`, `code`, `nom`, `description`, `modeleTexte`, `module`, `ecoleId`, `ecoleeId`, `archiver`, `createdAt`, `updatedAt`) VALUES
(4, 'ADT', 'ATTESTATION DE TRAVAIL                          ', 'test', '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<br></p><h4>\n<br>\n<br><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<u><strong><em>&nbsp; ATTESTATION&nbsp; DE TRAVAIL</em></strong></u></span><br></h4><p><br></p>\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp;</span><br><strong><span style=\"font-family: Tahoma; font-weight: bold;\">Réf&nbsp;:/DRH/[dateToday]</span></strong></p>\n\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><span style=\"font-family: Tahoma;\">&nbsp;</span><br></p>\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><span style=\"font-family: Tahoma;\">&nbsp;</span><br></p>\n<p class=\"MsoNormal\" align=\"right\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: right;\"><strong><span style=\"font-family: Tahoma; font-weight: bold;\">Ecole [nomecoleP] </span></strong></p>\n\n\n\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><br></p>\n\n\n\n\n\n\n\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify;\"><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp;</span><br></p>\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify;\"><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp;</span><br></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">Nous soussignés, Société</span><strong><span style=\"font-family: Tahoma; font-weight: bold;\">&nbsp;[nomecoleP] ,[nomecole]</span></strong><span style=\"font-family: Tahoma;\">&nbsp;</span><span style=\"font-family: Tahoma;\">&nbsp;attestons par la présente que: Mr/Mlle/Mme [nom]&nbsp; [prenom]</span><span style=\"font-family: Tahoma;\"> né le [datenaiss]</span><span style=\"font-family: Tahoma;\">&nbsp;à [Lieunais]</span><strong><span style=\"font-family: Tahoma; font-weight: bold;\">,</span></strong><span style=\"font-family: Tahoma;\">&nbsp;exerce au sein de notre société depuis le [daterecru]</span><span style=\"font-family: Tahoma;\">, et occupe actuellement la fonction de [poste]&nbsp;à ce jour</span><span style=\"font-family: Tahoma;\">.</span></p><p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\"><br></span></p>\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">En foi de quoi, la présente attestation est délivrée, sur demande de l\'intéressé pour servir et valoir ce que de droit.</span></p>\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><br></p>\n', 'employe', 1, 1, 0, '2025-03-27 08:56:59', '2025-04-15 09:40:46'),
(8, 'CDT', 'CERTIFICAT DE TRAVAIL', '', '<h4 align=\"center\" style=\"break-after: avoid; font-family: &quot;Times New Roman&quot;; font-weight: bold; text-align: center;\"><u>CERTIFICAT DE TRAVAIL</u></h4>\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp;</span><br></p>\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp;</span><br></p>\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><strong><span style=\"font-family: Tahoma; font-weight: bold;\">Réf&nbsp;: N°/DRH/</span></strong></p><p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><strong><span style=\"font-family: Tahoma; font-weight: bold;\">Ecole:[nomecoleP]</span></strong><br></p>\n<p class=\"MsoNormal\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;;\"><br></p>\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify;\"><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp;</span><br></p>\n\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify;\"><span style=\"font-family: &quot;Times New Roman&quot;;\">&nbsp;</span><br></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">Je, soussigné Mr/Mlle/Mme. </span><strong><span style=\"font-family: Tahoma; font-weight: bold;\">....</span></strong><span style=\"font-family: Tahoma;\">, agissant en qualité de </span><strong><span style=\"font-family: Tahoma; font-weight: bold;\">Gérant</span></strong><span style=\"font-family: Tahoma;\">&nbsp;de la Société</span><strong><span style=\"font-family: Tahoma; font-weight: bold;\">&nbsp;[nomecoleP]</span></strong><span style=\"font-family: Tahoma;\">&nbsp;.</span></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">&nbsp;</span><br></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">Déclare et certifie que Mr/Mlle/Mme&nbsp; [nom] [prenom]</span><strong><span style=\"font-family: Tahoma; font-weight: bold;\">,</span></strong><span style=\"font-family: Tahoma;\">&nbsp;né le[datenaiss]</span><span style=\"font-family: Tahoma;\">&nbsp;à [Lieunais]</span><span style=\"font-family: Tahoma;\">&nbsp;</span><span style=\"font-family: Tahoma;\">, a exercé au sein de la société du [daterecru]</span><span style=\"font-family: Tahoma;\">&nbsp;au&nbsp;[dateCesT]</span><span style=\"font-family: Tahoma;\">&nbsp;en qualité de [poste]</span><span style=\"font-family: Tahoma;\">.</span></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><br></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">Mr/Mlle/Mme </span><strong><span style=\"font-family: Tahoma; font-weight: bold;\">[nom] [prenom]&nbsp;</span></strong><span style=\"font-family: Tahoma;\">nous quitte libre de tout engagement. </span></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">&nbsp;</span><br></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">Ce certificat est délivré pour servir et valoir ce que de droit.</span></p>\n<p class=\"MsoBodyText\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><span style=\"font-family: Tahoma;\">&nbsp;</span><br></p>\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify; line-height: 150%;\"><br></p>\n<p class=\"MsoNormal\" align=\"justify\" style=\"margin: 0px; font-family: &quot;Times New Roman&quot;; text-align: justify;\"><span style=\"font-family: Tahoma;\">&nbsp;</span><br></p>', 'employe', 1, NULL, 0, '2025-04-11 15:21:56', '2025-04-15 09:41:50'),
(11, 'CPE', 'Contrat Paiment Eléve', '', '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; <strong><u style=\"font-size: 24px;\">Contrat du Paiment</u></strong>&nbsp; &nbsp; &nbsp;</p><p><br><strong><span style=\"font-family: &quot;Times New Roman&quot;, serif;\">Entre les\n            soussignés :</span></strong></p>\n\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><strong><span style=\"font-family: &quot;Times New Roman&quot;, serif;\"><br></span></strong><span style=\"font-family: Symbol;\"><span>&nbsp; &nbsp; &nbsp; ·<span style=\"font: 9px &quot;Times New Roman&quot;;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n            </span></span></span><strong><em><span style=\"font-family: &quot;Times New Roman&quot;, serif;\">L’Établissement scolaire</span></em></strong><span style=\"font-family: &quot;Times New Roman&quot;, serif;\"> : [nomecolePE], <span>&nbsp;&nbsp;</span>Représenté par : ...<span>&nbsp; </span></span></p>\n\n\n\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><span style=\"font-family: &quot;Times New Roman&quot;, serif;\"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>Adresse : [adressePE]</span></p>\n\n<p class=\"MsoListParagraph\" style=\"margin: 0px 0px 11px 48px; line-height: 107%; font-family: Calibri, sans-serif; text-indent: -24px; font-size: 15px;\"><span style=\"font-family: Symbol;\"><span>·<span style=\"font: 9px &quot;Times New Roman&quot;;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n            </span></span></span><strong><em><span style=\"font-family: &quot;Times New Roman&quot;, serif;\">Représentant légal de l’élève</span></em></strong><span style=\"font-family: &quot;Times New Roman&quot;, serif;\"> : [nomP] [prenomP], Téléphone : [TelP], E-mail :\n        [EmailP]<span>&nbsp; </span></span></p>\n\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 11px 24px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><span style=\"font-family: &quot;Times New Roman&quot;, serif;\"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>Adresse : [AdresseP]</span></p>\n\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><span style=\"font-family: &quot;Times New Roman&quot;, serif;\"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><strong><em><span>&nbsp;&nbsp;</span>Concernant l’élève </em></strong>: [nomE] [prenomE],\n        Date de naissance : [datenaissE], Niveau : [NV]</span></p><p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><span style=\"font-family: &quot;Times New Roman&quot;, serif;\"><br></span></p>\n\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><strong><span style=\"font-family: &quot;Times New Roman&quot;, serif;\">Article 1 –\n            Objet<span><br></span></span></strong></p><p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><span style=\"line-height: 107%; font-family: &quot;Times New Roman&quot;, serif; font-size: 14px;\">Le présent contrat a pour objet de fixer les modalités financières liées à\n        l’inscription et à la scolarité de l’élève mentionné ci-dessus pour l’année\n        scolaire [AS].</span></p>\n\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><span style=\"line-height: 107%; font-family: &quot;Times New Roman&quot;, serif; font-size: 14px;\"><br></span></p>\n\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><strong><span style=\"font-family: &quot;Times New Roman&quot;, serif;\">Article 2 –\n            Frais d’inscription<span><br></span></span></strong></p><p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><span style=\"line-height: 107%; font-family: &quot;Times New Roman&quot;, serif; font-size: 14px;\">Le montant des frais d’inscription est fixé à : [FraisInsc] DZD. Ce montant\n        est payable une seule fois à l’inscription et n’est pas remboursable.</span></p><p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><span style=\"line-height: 107%; font-family: &quot;Times New Roman&quot;, serif; font-size: 14px;\"><br></span></p>\n\n\n\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><strong><span style=\"font-family: &quot;Times New Roman&quot;, serif;\">Article 3 –\n            Frais de scolarité<span><br></span></span></strong></p><p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><span style=\"line-height: 107%; font-family: &quot;Times New Roman&quot;, serif; font-size: 14px;\">Date début paiement : [ddP], Date fin paiement : [dfP], Code contrat :\n        [codeC]<span>&nbsp; </span></span></p>\n\n\n\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 14px;\"><span style=\"line-height: 107%; font-family: &quot;Times New Roman&quot;, serif; font-size: 13px;\">Le montant total annuel des frais de scolarité est fixé à</span><span style=\"font-family: &quot;Times New Roman&quot;, serif;\"> : </span><span style=\"line-height: 107%; font-family: &quot;Times New Roman&quot;, serif; font-size: 13px;\">[totalC] DZD.</span><span style=\"font-family: &quot;Times New Roman&quot;, serif;\"><span>&nbsp; </span></span></p>\n\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><em><span style=\"line-height: 107%; font-family: &quot;Times New Roman&quot;, serif; font-size: 14px;\">Ce montant peut être réglé selon le planning suivant:</span></em></p><p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 14px;\"><span style=\"font-family: &quot;Times New Roman&quot;, serif;\">[planning]</span></p><p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 14px;\"><span style=\"font-family: &quot;Times New Roman&quot;, serif;\"><br></span></p>\n\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><strong><span style=\"font-family: &quot;Times New Roman&quot;, serif;\">Article 4 –\n            Engagement<span>&nbsp; </span></span></strong></p>\n\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><em><span style=\"line-height: 107%; font-family: &quot;Times New Roman&quot;, serif; font-size: 14px;\">Le représentant légal s’engage à respecter les\n            échéances de paiement convenues. Tout retard pourra entraîner l’application de\n            pénalités ou la suspension temporaire de la scolarité de l’élève.</span></em></p><p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><em><span style=\"line-height: 107%; font-family: &quot;Times New Roman&quot;, serif; font-size: 14px;\"><br></span></em></p>\n\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><strong><span style=\"font-family: &quot;Times New Roman&quot;, serif;\">Article 5 –\n            Signature<span><br></span></span></strong></p><p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><strong><span style=\"line-height: 107%; font-family: &quot;Times New Roman&quot;, serif; font-size: 14px;\">Fait le [datetoday]</span></strong></p>\n\n\n\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><em><span style=\"line-height: 107%; font-family: &quot;Times New Roman&quot;, serif; font-size: 14px;\">Signature de l’établissement : ______________Signature\n            du représentant légal : _______________</span></em></p>\n\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 11px; line-height: 107%; font-family: Calibri, sans-serif; font-size: 15px;\"><em><span style=\"line-height: 107%; font-family: &quot;Times New Roman&quot;, serif; font-size: 13px;\"><span>&nbsp;</span></span></em><br></p>', 'eleve', 1, NULL, 0, '2025-04-29 12:30:26', '2025-05-05 13:37:28'),
(14, 'RPE2', 'Reçu Paiment Eléve', 'version2', '<p>[logoecoleP] &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [dateToday] : </p><p style=\"text-align: right;\">Numero du recu:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </p><p style=\"text-align: center;\"><br></p><h2 style=\"text-align: center;\"><strong>Recu de paiement&nbsp;</strong> </h2><p><br></p><table style=\"border-collapse:collapse;width: 100%;\"><tbody>\n<tr>\n	<td style=\"width: 36.711%;\">&nbsp; &nbsp;Nom &amp; prénom elève&nbsp;</td>\n	<td style=\"width: 62.9568%;\"> <br>&nbsp; &nbsp;[nomE]&nbsp; [prenomE]<br><br></td></tr>\n<tr>\n	<td>&nbsp; &nbsp;Nom &amp; prénom responsable</td>\n	<td><br>&nbsp; [nomP]&nbsp; [prenomP]<br><br></td></tr>\n<tr>\n	<td>&nbsp; &nbsp;Mode de paiment</td>\n	<td>&nbsp; &nbsp; <br>&nbsp; &nbsp;[ModeP]<br><br></td></tr>\n<tr>\n	<td>&nbsp; &nbsp;Détails</td>\n	<td>&nbsp;<br>&nbsp; &nbsp;[detail]<br><br></td></tr>\n<tr>\n	<td>&nbsp; Montant</td>\n	<td>\n	&nbsp;<br>&nbsp; &nbsp;[totalC]<br><br></td></tr></tbody></table><p style=\"text-align: right;\">Total:&nbsp;[totalC]</p><p style=\"text-align: right;\"><br></p><p style=\"text-align: right;\"><br></p><p style=\"text-align: right;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\">Signateur :&nbsp;</p>', 'eleve', 1, NULL, 0, '2025-05-04 14:54:43', '2025-05-05 12:13:40'),
(15, 'RPE', 'Reçu Paiment Eléve', '', '<p>&nbsp; [logoecoleP]&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </p><p><br></p><p><br></p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Date:&nbsp; &nbsp;[dateToday]&nbsp; </p><p style=\"text-align: right;\"><br></p><h2 style=\"text-align: center;\"><strong>Recu de paiement&nbsp;</strong> </h2><p><br></p><p>  \n\n	\n	\n	\n	\n	\n	<br></p><table style=\"border-collapse: collapse; width: 595px; height: 169px;\"><tbody>\n<tr>\n	<td style=\"width: 16.9435%;\">&nbsp; Nom<br>&nbsp; Prénom <br>&nbsp; elève<br></td>\n	<td style=\"width: 18.9369%; vertical-align: middle;\">&nbsp; Nom <br>&nbsp; Prénom<br>&nbsp; Parent<br></td>\n	<td style=\"width: 17.2757%;\">&nbsp;Mode<br>&nbsp;Paiement<br></td>\n	<td style=\"width: 26.5781%;\">&nbsp; &nbsp; &nbsp;Détails<br></td>\n	<td style=\"width: 20%;\">&nbsp; &nbsp; Montant\n<br></td></tr>\n<tr>\n	<td>&nbsp; &nbsp;[nomE]<br><br>&nbsp; &nbsp;[prenomE]<br></td>\n	<td>&nbsp; [nomP]<br><br>&nbsp; [prenomP]<br></td>\n	<td>[ModeP]<br></td>\n	<td>&nbsp; [detail]<br></td>\n	<td style=\"width: 20%;\">&nbsp; &nbsp; &nbsp;[totalC]&nbsp;<br></td></tr></tbody></table><p style=\"text-align: right;\"><br></p><p style=\"text-align: right;\"><br></p><p style=\"text-align: right;\">Total:&nbsp;[totalC] DZD</p><p style=\"text-align: right;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\"><br></p><p style=\"text-align: left;\">Signateur :&nbsp;</p>', 'eleve', 1, NULL, 0, '2025-05-05 08:13:35', '2025-05-05 12:14:15'),
(16, 'CPE2', 'Contrat Paiment Eléve', 'version2', '<p class=\"ds-markdown-paragraph\" style=\"margin: 13.716px 0px; font-size: 16.002px; line-height: 28.575px; color: rgb(64, 64, 64); font-family: DeepSeek-CJK-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, Oxygen, &quot;Open Sans&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;CONTRAT DE PAIEMENT </strong></p><p class=\"ds-markdown-paragraph\" style=\"margin: 13.716px 0px; font-size: 16.002px; line-height: 28.575px; color: rgb(64, 64, 64); font-family: DeepSeek-CJK-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, Oxygen, &quot;Open Sans&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"><strong>Entre les soussignés :</strong></p><p class=\"ds-markdown-paragraph\" style=\"margin: 13.716px 0px; font-size: 16.002px; line-height: 28.575px; color: rgb(64, 64, 64); font-family: DeepSeek-CJK-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, Oxygen, &quot;Open Sans&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"><br><strong>L\'Établissement scolaire :</strong><br>Nom : [nomEcolePE] |&nbsp; &nbsp; Adresse : [adressePE] |&nbsp; &nbsp; &nbsp;&nbsp;Représenté par : ......</p><p class=\"ds-markdown-paragraph\" style=\"margin: 13.716px 0px; font-size: 16.002px; line-height: 28.575px; color: rgb(64, 64, 64); font-family: DeepSeek-CJK-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, Oxygen, &quot;Open Sans&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"><strong>Le Représentant légal de l\'élève :</strong><br>Nom &amp; Prénom : [nomP] [prenomP] &nbsp; &nbsp; &nbsp; &nbsp;Téléphone : [TelP]&nbsp;</p><p class=\"ds-markdown-paragraph\" style=\"margin: 13.716px 0px; font-size: 16.002px; line-height: 28.575px; color: rgb(64, 64, 64); font-family: DeepSeek-CJK-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, Oxygen, &quot;Open Sans&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"> E-mail : [EmailP]&nbsp; &nbsp;&nbsp; Adresse : [AdresseP] | </p><p class=\"ds-markdown-paragraph\" style=\"margin: 13.716px 0px; font-size: 16.002px; line-height: 28.575px; color: rgb(64, 64, 64); font-family: DeepSeek-CJK-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, Oxygen, &quot;Open Sans&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"><strong>Élève concerné :</strong><br>Nom &amp; Prénom : [nomE] [prenomE] | </p><p class=\"ds-markdown-paragraph\" style=\"margin: 13.716px 0px; font-size: 16.002px; line-height: 28.575px; color: rgb(64, 64, 64); font-family: DeepSeek-CJK-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, Oxygen, &quot;Open Sans&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\">Date de naissance : [datenaissE] | Niveau : [NV]</p><hr style=\"height: 1px; margin: 32px 0px; background: none 0% 0% / auto repeat scroll padding-box border-box rgb(229, 229, 229); border: none; display: block; color: rgb(64, 64, 64); font-family: DeepSeek-CJK-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, Oxygen, &quot;Open Sans&quot;, sans-serif; font-size: 16.002px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"><p class=\"ds-markdown-paragraph\" style=\"margin: 13.716px 0px; font-size: 16.002px; line-height: 28.575px; color: rgb(64, 64, 64); font-family: DeepSeek-CJK-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, Oxygen, &quot;Open Sans&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"><strong>Article 1 – Objet</strong><br>Le présent contrat fixe les modalités financières de l\'inscription et de la scolarité de l\'élève pour l\'année scolaire [AS].</p><p class=\"ds-markdown-paragraph\" style=\"margin: 13.716px 0px; font-size: 16.002px; line-height: 28.575px; color: rgb(64, 64, 64); font-family: DeepSeek-CJK-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, Oxygen, &quot;Open Sans&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"><strong>Article 2 – Frais d\'inscription</strong><br>Montant : [FraisInsc] DZD (payable une fois à l\'inscription, non remboursable).</p><p class=\"ds-markdown-paragraph\" style=\"margin: 13.716px 0px; font-size: 16.002px; line-height: 28.575px; color: rgb(64, 64, 64); font-family: DeepSeek-CJK-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, Oxygen, &quot;Open Sans&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"><strong>Article 3 – Frais de scolarité</strong><br>Montant total annuel : [totalC] DZD | Paiement échelonné selon le planning : [planning]<br>Dates : Du [ddP] au [dfP] | Code contrat : [codeC]</p><p class=\"ds-markdown-paragraph\" style=\"margin: 13.716px 0px; font-size: 16.002px; line-height: 28.575px; color: rgb(64, 64, 64); font-family: DeepSeek-CJK-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, Oxygen, &quot;Open Sans&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"><strong>Article 4 – Engagement</strong><br>Le représentant légal s\'engage à respecter les échéances. Tout retard pourra entraîner des pénalités ou une suspension temporaire de la scolarité.</p><p class=\"ds-markdown-paragraph\" style=\"margin: 13.716px 0px; font-size: 16.002px; line-height: 28.575px; color: rgb(64, 64, 64); font-family: DeepSeek-CJK-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, Oxygen, &quot;Open Sans&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"><br></p><p class=\"ds-markdown-paragraph\" style=\"margin: 13.716px 0px; font-size: 16.002px; line-height: 28.575px; color: rgb(64, 64, 64); font-family: DeepSeek-CJK-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, Oxygen, &quot;Open Sans&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"><strong>Article 5 – Signature</strong><br>Fait à [Ville], le [Date].<br>Signature de l\'établissement : ___________________<br>Signature du représentant légal : ___________________</p><br class=\"Apple-interchange-newline\">', 'eleve', 1, NULL, 0, '2025-05-05 12:35:17', '2025-05-05 12:35:17'),
(18, 'CRS', 'CERTIFICAT DE SCOLARITÉ', '', '<p class=\"MsoNormal\" align=\"center\" style=\"line-height: 114%; font-family: Cambria; text-align: center;\"><span style=\"font-family: Cambria;\">.ÉCOLE PRIVÉE [nomecolePE]</span></p><p class=\"MsoNormal\" align=\"center\" style=\"line-height: 114%; font-family: Cambria; text-align: center;\">[adressePE]<span style=\"font-family: Cambria;\"><br></span><span style=\"font-family: Cambria;\"><br></span></p><p class=\"MsoNormal\" align=\"center\" style=\"line-height: 114%; font-family: Cambria; text-align: center;\"><span style=\"font-family: Cambria;\"><br></span></p>\n\n<h4 class=\"MsoNormal\" align=\"center\" style=\"line-height: 114%; font-family: Cambria; text-align: center;\"><strong><span style=\"font-family: Cambria;\"><u>CERTIFICAT DE SCOLARITÉ</u></span></strong></h4><p><br></p>\n<p class=\"MsoNormal\" style=\"line-height: 114%; font-family: Cambria;\"><span style=\"font-family: Cambria;\">&nbsp;</span><br></p>\n<p class=\"MsoNormal\" style=\"line-height: 114%; font-family: Cambria;\"><span style=\"font-family: Cambria;\">Je soussigné(e), ................, Directeur(trice) de l’établissement «[nomecolePE] », certifie que :</span><span style=\"font-family: Cambria;\"><br></span><span style=\"font-family: Cambria;\"><br></span><strong><span style=\"font-family: Cambria;\">Nom de l’élève : [nomE]</span></strong><span style=\"font-family: Cambria;\"><br></span><strong><span style=\"font-family: Cambria;\">Né(e) le : [LieunaisE]</span></strong><span style=\"font-family: Cambria;\"><br></span><strong><span style=\"font-family: Cambria;\">Est inscrit(e) en classe de : </span></strong><span style=\"font-family: Cambria;\">.......</span><span style=\"font-family: Cambria;\"><br></span><strong><span style=\"font-family: Cambria;\">Pour l’année scolaire :..................</span></strong></p><p class=\"MsoNormal\" style=\"line-height: 114%; font-family: Cambria;\"><span style=\"font-family: Cambria;\">Le présent certificat est délivré à l’intéressé(e) pour servir et valoir ce que de droit.</span><span style=\"font-family: Cambria;\"><br></span></p>\n<p class=\"MsoNormal\" style=\"line-height: 114%; font-family: Cambria;\"><span style=\"font-family: Cambria;\">&nbsp;</span><br></p>\n<p class=\"MsoNormal\" style=\"line-height: 114%; font-family: Cambria;\"><span style=\"font-family: Cambria;\">Fait à ..........., le&nbsp;[dateToday]</span><span style=\"font-family: Cambria;\"><br></span><span style=\"font-family: Cambria;\"><br></span><span style=\"font-family: Cambria;\">Le(la) Directeur(trice)</span></p><p class=\"MsoNormal\" style=\"line-height: 114%; font-family: Cambria;\"><span style=\"font-family: Cambria;\">................................</span></p>', 'eleve', 1, NULL, 0, '2025-05-07 13:13:52', '2025-05-07 13:22:50');

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code_categorie` varchar(255) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `date_creation` datetime DEFAULT NULL,
  `date_modification` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_categorie` (`code_categorie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `congeabsences`
--

DROP TABLE IF EXISTS `congeabsences`;
CREATE TABLE IF NOT EXISTS `congeabsences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_demande` varchar(255) DEFAULT NULL,
  `statut` varchar(255) DEFAULT 'En attente',
  `dateDebut` datetime DEFAULT NULL,
  `dateFin` datetime DEFAULT NULL,
  `commentaire` varchar(255) DEFAULT NULL,
  `motif` varchar(255) DEFAULT NULL,
  `jour_congeMois` float DEFAULT 0,
  `jour_consomme` float DEFAULT 0,
  `jour_restant` float DEFAULT 0,
  `archiver` int(11) DEFAULT 0,
  `fichier` varchar(255) DEFAULT NULL,
  `employe_id` int(11) DEFAULT NULL,
  `ecoleId` int(11) NOT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `idCA` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employe_id` (`employe_id`),
  KEY `ecoleId` (`ecoleId`),
  KEY `ecoleeId` (`ecoleeId`),
  KEY `idCA` (`idCA`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `contrats`
--

DROP TABLE IF EXISTS `contrats`;
CREATE TABLE IF NOT EXISTS `contrats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `niveauId` int(11) NOT NULL,
  `annescolaireId` int(11) NOT NULL,
  `eleveId` int(11) NOT NULL,
  `totalApayer` decimal(15,2) NOT NULL,
  `date_debut_paiement` datetime NOT NULL,
  `date_creation` datetime NOT NULL,
  `date_sortie` datetime NOT NULL,
  `nombre_echeances` int(11) DEFAULT NULL,
  `typePaiment` varchar(255) NOT NULL,
  `Remarque` varchar(255) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `niveauId` (`niveauId`),
  KEY `annescolaireId` (`annescolaireId`),
  KEY `eleveId` (`eleveId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cyclescolaires`
--

DROP TABLE IF EXISTS `cyclescolaires`;
CREATE TABLE IF NOT EXISTS `cyclescolaires` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomCycle` varchar(255) NOT NULL,
  `nomCycleArabe` varchar(255) NOT NULL,
  `classement` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `cyclescolaires`
--

INSERT INTO `cyclescolaires` (`id`, `nomCycle`, `nomCycleArabe`, `classement`, `archiver`) VALUES
(1, 'Primaire', 'الإبتدائية', 1, 0),
(2, 'Cem', 'المتوسطة', 2, 0),
(3, 'Lycée', 'الثانوية', 3, 0);

-- --------------------------------------------------------

--
-- Structure de la table `demandeautorisations`
--

DROP TABLE IF EXISTS `demandeautorisations`;
CREATE TABLE IF NOT EXISTS `demandeautorisations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_demande` varchar(255) NOT NULL,
  `statut` varchar(255) DEFAULT 'En attente',
  `dateDebut` datetime NOT NULL,
  `dateFin` datetime NOT NULL,
  `commentaire` varchar(255) DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `motif` varchar(255) DEFAULT NULL,
  `RaisonA` varchar(255) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `eleve_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `depenses`
--

DROP TABLE IF EXISTS `depenses`;
CREATE TABLE IF NOT EXISTS `depenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `cause_ar` varchar(255) NOT NULL,
  `cause_fr` varchar(255) NOT NULL,
  `montant` decimal(15,2) NOT NULL,
  `date` datetime NOT NULL,
  `par_ar` varchar(255) NOT NULL,
  `par_fr` varchar(255) NOT NULL,
  `mode_paie` varchar(255) NOT NULL,
  `remarque` varchar(255) NOT NULL,
  `fichier` varchar(255) DEFAULT NULL,
  `typeId` int(11) NOT NULL,
  `ecoleId` int(11) NOT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `typeId` (`typeId`),
  KEY `ecoleId` (`ecoleId`),
  KEY `ecoleeId` (`ecoleeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `devoires`
--

DROP TABLE IF EXISTS `devoires`;
CREATE TABLE IF NOT EXISTS `devoires` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `enseignantId` int(11) NOT NULL,
  `matiereId` int(11) NOT NULL,
  `niveauId` int(11) NOT NULL,
  `sectionId` int(11) NOT NULL,
  `annescolaireId` int(11) NOT NULL,
  `trimestId` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `dateLimite` datetime NOT NULL,
  `fichier` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `periodeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_section_annee_trim` (`sectionId`,`annescolaireId`,`trimestId`),
  KEY `enseignantId` (`enseignantId`),
  KEY `matiereId` (`matiereId`),
  KEY `niveauId` (`niveauId`),
  KEY `annescolaireId` (`annescolaireId`),
  KEY `trimestId` (`trimestId`),
  KEY `periodeId` (`periodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ecoleachats`
--

DROP TABLE IF EXISTS `ecoleachats`;
CREATE TABLE IF NOT EXISTS `ecoleachats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ecoleId` int(11) DEFAULT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `achatId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `EcoleAchats_achatId_ecoleId_unique` (`ecoleId`,`achatId`),
  UNIQUE KEY `EcoleAchats_achatId_ecoleeId_unique` (`ecoleeId`),
  KEY `achatId` (`achatId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ecolearticles`
--

DROP TABLE IF EXISTS `ecolearticles`;
CREATE TABLE IF NOT EXISTS `ecolearticles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ecoleId` int(11) DEFAULT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `articleId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `EcoleArticles_articleId_ecoleId_unique` (`ecoleId`,`articleId`),
  UNIQUE KEY `EcoleArticles_articleId_ecoleeId_unique` (`ecoleeId`),
  KEY `articleId` (`articleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ecolecategories`
--

DROP TABLE IF EXISTS `ecolecategories`;
CREATE TABLE IF NOT EXISTS `ecolecategories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ecoleId` int(11) DEFAULT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `categorieId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `EcoleCategories_categorieId_ecoleId_unique` (`ecoleId`,`categorieId`),
  UNIQUE KEY `EcoleCategories_categorieId_ecoleeId_unique` (`ecoleeId`),
  KEY `categorieId` (`categorieId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ecolefournisseurs`
--

DROP TABLE IF EXISTS `ecolefournisseurs`;
CREATE TABLE IF NOT EXISTS `ecolefournisseurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ecoleId` int(11) DEFAULT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `fournisseurId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `EcoleFournisseurs_fournisseurId_ecoleId_unique` (`ecoleId`,`fournisseurId`),
  UNIQUE KEY `EcoleFournisseurs_fournisseurId_ecoleeId_unique` (`ecoleeId`),
  KEY `fournisseurId` (`fournisseurId`)
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
  KEY `matiereId` (`matiereId`),
  KEY `EcoleMatieres_matiereId_ecoleId_unique` (`ecoleId`,`matiereId`) USING BTREE,
  KEY `EcoleMatieres_matiereId_ecoleeId_unique` (`ecoleeId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecolematieres`
--

INSERT INTO `ecolematieres` (`id`, `ecoleId`, `ecoleeId`, `matiereId`) VALUES
(1, 1, 3, 1),
(3, 1, 3, 2),
(4, 1, 3, 3),
(5, 1, 3, 4),
(6, 1, 3, 5),
(7, 1, 3, 6),
(8, 1, 3, 7),
(9, 1, 3, 8),
(10, 1, 3, 9),
(11, 1, 3, 10),
(12, 1, 3, 11),
(13, 1, 3, 12),
(14, 1, NULL, 13),
(15, 1, NULL, 14),
(16, 1, NULL, 15),
(17, 1, NULL, 16),
(18, 1, NULL, 17),
(19, 1, NULL, 18),
(20, 1, NULL, 19),
(21, 1, NULL, 20),
(22, 1, NULL, 21),
(23, 1, NULL, 22),
(24, 1, NULL, 23),
(25, 1, NULL, 24),
(26, 1, NULL, 25),
(27, 1, NULL, 26),
(28, 1, NULL, 27),
(29, 1, NULL, 28),
(30, 1, NULL, 29),
(31, 1, NULL, 30),
(32, 1, NULL, 31),
(33, 1, NULL, 32),
(34, 1, NULL, 33),
(35, 1, NULL, 34);

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecoleniveaus`
--

INSERT INTO `ecoleniveaus` (`id`, `ecoleId`, `ecoleeId`, `niveauId`, `archiver`) VALUES
(1, 1, NULL, 1, 0),
(5, 1, NULL, 5, 0),
(6, 1, NULL, 6, 0),
(7, 1, NULL, 7, 0),
(8, 1, NULL, 8, 0),
(10, 1, NULL, 3, 0);

-- --------------------------------------------------------

--
-- Structure de la table `ecoleprincipals`
--

DROP TABLE IF EXISTS `ecoleprincipals`;
CREATE TABLE IF NOT EXISTS `ecoleprincipals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomecole` varchar(255) NOT NULL,
  `nom_arecole` varchar(255) NOT NULL,
  `logo` varchar(255) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `emailecole` varchar(255) NOT NULL,
  `telephoneecole` varchar(255) NOT NULL,
  `maps` varchar(255) NOT NULL,
  `fix` varchar(255) NOT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `insta` varchar(255) DEFAULT NULL,
  `linkdin` varchar(255) DEFAULT NULL,
  `rc` varchar(255) NOT NULL,
  `rib` varchar(255) NOT NULL,
  `nif` varchar(255) NOT NULL,
  `numerodagrimo` varchar(255) NOT NULL,
  `dateFinDagrimo` datetime NOT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecoleprincipals`
--

INSERT INTO `ecoleprincipals` (`id`, `nomecole`, `nom_arecole`, `logo`, `adresse`, `emailecole`, `telephoneecole`, `maps`, `fix`, `facebook`, `insta`, `linkdin`, `rc`, `rib`, `nif`, `numerodagrimo`, `dateFinDagrimo`, `archiver`) VALUES
(1, 'Les iris', 'ليزريس', '/images/Ecole/1746353819202-logo-site2.png', 'bejaia', 'lesiris@lesiris.com', '0796782733', '[[36.75171779635603,5.064675807952882],[36.75185533748613,5.064010620117188],[36.75156306228997,5.063838958740235],[36.75142552063593,5.064740180969239]]', '034827347', 'https://www.facebook.com/lesirisdebejaia', 'https://www.instagram.com/lesirisdebejaia', 'https://www.linkedin.com/lesirisdebejaia', '378374\'', '098747585', '2787485', '23455', '2027-05-04 00:00:00', 0),
(2, 'Les Colombes ', 'كلومب', '/images/Ecole/1746354145026-settings.png', 'Bejaia', 'colombes@colombes.com', '076746575', '[[36.753591773046466,5.036952495574952],[36.75354019631896,5.036158561706544],[36.753076004210854,5.03626585006714],[36.75299004240114,5.036973953247071]]', '034826574', 'https://www.facebook.com/p/Les-colombes-%C3%A9cole-priv%C3%A9e-100069422376202/?locale=fr_FR', 'https://www.instagram.com/p/Les-colombes-%C3%A9cole-priv%C3%A9e-100069422376202/?locale=fr_FR', '', '9082908098', '289398', '899983090909908908', '98766', '2026-06-05 00:00:00', 0);

-- --------------------------------------------------------

--
-- Structure de la table `ecoleremarques`
--

DROP TABLE IF EXISTS `ecoleremarques`;
CREATE TABLE IF NOT EXISTS `ecoleremarques` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ecoleId` int(11) DEFAULT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `remarqueId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `EcoleRemarques_remarqueId_ecoleId_unique` (`ecoleId`,`remarqueId`),
  UNIQUE KEY `EcoleRemarques_remarqueId_ecoleeId_unique` (`ecoleeId`),
  KEY `remarqueId` (`remarqueId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ecoles`
--

DROP TABLE IF EXISTS `ecoles`;
CREATE TABLE IF NOT EXISTS `ecoles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomecole` varchar(255) NOT NULL,
  `nom_arecole` varchar(255) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `emailecole` varchar(255) NOT NULL,
  `telephoneecole` varchar(255) NOT NULL,
  `maps` varchar(255) NOT NULL,
  `fix` varchar(255) NOT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `insta` varchar(255) DEFAULT NULL,
  `linkdin` varchar(255) DEFAULT NULL,
  `rc` varchar(255) NOT NULL,
  `rib` varchar(255) NOT NULL,
  `siegesocial` varchar(255) DEFAULT NULL,
  `nif` varchar(255) NOT NULL,
  `cycle` varchar(255) NOT NULL,
  `ecoleId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecoles`
--

INSERT INTO `ecoles` (`id`, `nomecole`, `nom_arecole`, `adresse`, `emailecole`, `telephoneecole`, `maps`, `fix`, `facebook`, `insta`, `linkdin`, `rc`, `rib`, `siegesocial`, `nif`, `cycle`, `ecoleId`, `archiver`) VALUES
(3, 'Les iris Primaire', 'Les iris Primaire', 'Bejaia', 'lesirisprimaire@lesiris.com', '079839849', '[[36.752240129083425,5.056586265563966],[36.75303098182995,5.056586265563966],[36.7527902883788,5.058131217956544],[36.75189627752044,5.058259963989259]]', '034827364', '', '', '', '87687', '237868778', NULL, '7678567', 'Primaire', 1, 0),
(4, 'Les iris Cem', 'Les iris Cem', 'Bejaia', 'lesirisprimaire@lesiris.com', '0794286499', '[[36.753546750968255,5.039119720458985],[36.753512366466914,5.038175582885743],[36.75285905801333,5.037961006164551],[36.75248082426058,5.039420127868653]]', '03456767', '', '', '', '87687', '0598686987', NULL, '7678567', 'CEM', 1, 0);

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
  UNIQUE KEY `EcoleSections_sectionId_ecoleId_unique` (`ecoleId`,`sectionId`),
  UNIQUE KEY `EcoleSections_sectionId_ecoleeId_unique` (`ecoleeId`),
  KEY `sectionId` (`sectionId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecolesections`
--

INSERT INTO `ecolesections` (`id`, `ecoleId`, `ecoleeId`, `sectionId`) VALUES
(1, 1, 3, 1),
(2, 1, NULL, 2),
(3, 1, NULL, 3),
(4, 1, NULL, 4),
(5, 1, NULL, 5),
(6, 1, NULL, 6);

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecole_secole_postes`
--

INSERT INTO `ecole_secole_postes` (`id`, `ecoleId`, `ecoleeId`, `posteId`, `createdAt`, `updatedAt`) VALUES
(1, 1, NULL, 1, '2025-04-20 09:35:30', '2025-04-20 09:35:30'),
(2, 1, NULL, 2, '2025-04-20 12:27:30', '2025-04-20 12:27:30'),
(3, 1, NULL, 3, '2025-04-20 12:27:37', '2025-04-20 12:27:37'),
(4, 1, NULL, 4, '2025-04-20 12:27:41', '2025-04-20 12:27:41'),
(5, 1, NULL, 5, '2025-04-22 19:54:16', '2025-04-22 19:54:16');

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
  KEY `Ecole_SEcole_Roles_roleId_ecoleeId_unique` (`ecoleeId`,`roleId`) USING BTREE,
  KEY `Ecole_SEcole_Roles_roleId_ecoleId_unique` (`ecoleId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecole_secole_roles`
--

INSERT INTO `ecole_secole_roles` (`id`, `ecoleId`, `ecoleeId`, `roleId`, `createdAt`, `updatedAt`) VALUES
(1, 1, NULL, 3, '2025-05-04 10:16:59', '2025-05-04 10:16:59'),
(2, 2, NULL, 3, '2025-05-04 10:22:25', '2025-05-04 10:22:25'),
(4, 1, 3, 4, '2025-05-04 10:31:59', '2025-05-04 10:31:59'),
(5, 1, 4, 4, '2025-05-04 10:34:45', '2025-05-04 10:34:45'),
(6, 1, NULL, 5, '2025-05-14 13:31:51', '2025-05-14 13:31:51');

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ecole_secole_services`
--

INSERT INTO `ecole_secole_services` (`id`, `ecoleId`, `ecoleeId`, `serviceId`, `createdAt`, `updatedAt`) VALUES
(1, 1, NULL, 1, '2025-04-20 09:35:41', '2025-04-20 09:35:41'),
(2, 1, NULL, 2, '2025-04-20 12:27:49', '2025-04-20 12:27:49'),
(3, 1, NULL, 3, '2025-04-20 12:27:58', '2025-04-20 12:27:58'),
(4, 1, NULL, 4, '2025-04-22 19:55:29', '2025-04-22 19:55:29');

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `eleveparents`
--

INSERT INTO `eleveparents` (`id`, `EleveId`, `ParentId`) VALUES
(1, 20, 29),
(2, 22, 21),
(4, 22, 29),
(3, 32, 31),
(5, 56, 54),
(6, 56, 55),
(7, 65, 64);

-- --------------------------------------------------------

--
-- Structure de la table `eleves`
--

DROP TABLE IF EXISTS `eleves`;
CREATE TABLE IF NOT EXISTS `eleves` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nactnaiss` varchar(255) DEFAULT NULL,
  `etat_social` varchar(255) DEFAULT NULL,
  `antecedents` enum('Oui','Non') DEFAULT NULL,
  `antecedentsDetails` varchar(255) DEFAULT NULL,
  `suiviMedical` enum('Oui','Non') DEFAULT NULL,
  `suiviMedicalDetails` varchar(255) DEFAULT NULL,
  `natureTraitement` enum('Oui','Non') DEFAULT NULL,
  `natureTraitementDetails` varchar(255) DEFAULT NULL,
  `crises` enum('Oui','Non') DEFAULT NULL,
  `crisesDetails` varchar(255) DEFAULT NULL,
  `conduiteTenir` enum('Oui','Non') DEFAULT NULL,
  `conduiteTenirDetails` varchar(255) DEFAULT NULL,
  `operationChirurgical` enum('Oui','Non') DEFAULT NULL,
  `operationChirurgicalDetails` varchar(255) DEFAULT NULL,
  `maladieChronique` enum('Oui','Non') DEFAULT NULL,
  `maladieChroniqueDetails` varchar(255) DEFAULT NULL,
  `dateInscription` datetime DEFAULT NULL,
  `autreecole` enum('Oui','Non') DEFAULT NULL,
  `nomecole` varchar(255) DEFAULT NULL,
  `redoublant` enum('Oui','Non') DEFAULT NULL,
  `niveauredoublant` varchar(255) DEFAULT NULL,
  `orphelin` enum('orpholinepère','orpholinemère','orpholinelesdeux','vivant') DEFAULT NULL,
  `niveaueleve` varchar(255) DEFAULT NULL,
  `numinscription` varchar(255) NOT NULL,
  `numidentnational` varchar(255) NOT NULL,
  `datedinscriptionEncour` datetime NOT NULL,
  `fraixinscription` decimal(10,2) DEFAULT 0.00,
  `groupeSanguin` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `cycle` varchar(255) DEFAULT NULL,
  `niveauId` int(11) DEFAULT NULL,
  `classeId` int(11) DEFAULT NULL,
  `annescolaireId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numinscription` (`numinscription`),
  UNIQUE KEY `numidentnational` (`numidentnational`),
  KEY `niveauId` (`niveauId`),
  KEY `classeId` (`classeId`),
  KEY `annescolaireId` (`annescolaireId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `eleves`
--

INSERT INTO `eleves` (`id`, `nactnaiss`, `etat_social`, `antecedents`, `antecedentsDetails`, `suiviMedical`, `suiviMedicalDetails`, `natureTraitement`, `natureTraitementDetails`, `crises`, `crisesDetails`, `conduiteTenir`, `conduiteTenirDetails`, `operationChirurgical`, `operationChirurgicalDetails`, `maladieChronique`, `maladieChroniqueDetails`, `dateInscription`, `autreecole`, `nomecole`, `redoublant`, `niveauredoublant`, `orphelin`, `niveaueleve`, `numinscription`, `numidentnational`, `datedinscriptionEncour`, `fraixinscription`, `groupeSanguin`, `photo`, `cycle`, `niveauId`, `classeId`, `annescolaireId`, `archiver`, `userId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(20, '234756', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', '2025-09-14 00:00:00', 'Non', '', 'Non', '', 'orpholinepère', 'moyenne', '886235884128678', '857760476', '2025-04-01 00:00:00', 4000.00, 'O+', '/images/Eleve/1745310166687-teamwork.png', 'Primaire', 1, 1, NULL, 0, 20, '2025-04-20 09:30:37', '2025-05-12 09:32:42', NULL),
(22, '987364', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', '2025-09-01 00:00:00', 'Non', '', 'Non', '', 'orpholinemère', 'moyenne', '075830180740201', '23450124', '2024-09-01 00:00:00', 2000.00, 'O+', '/images/Eleve/1745310690157-children.png', 'Primaire', 1, 1, NULL, 0, 22, '2025-04-20 09:39:21', '2025-05-12 10:42:26', NULL),
(32, '65666698', 'Moyen', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', '2025-09-01 00:00:00', 'Non', '', 'Non', '', 'vivant', '', '604404897944222', '7677YTYTVV', '2025-03-01 00:00:00', 50000.00, NULL, '/images/Eleve/1745824245279-kyc.png', 'Primaire', 3, 2, NULL, 0, 32, '2025-04-28 07:10:45', '2025-04-29 07:30:20', NULL),
(56, '12478876', 'moyen', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', '2025-04-04 00:00:00', 'Non', '', 'Non', '', 'vivant', 'excellent', '393062052005829', '989889999', '2025-04-04 00:00:00', 3000.00, NULL, '/images/Eleve/1746344275686-kyc.png', 'Primaire', 3, 2, NULL, 0, 56, '2025-05-04 07:37:55', '2025-05-12 09:37:59', NULL),
(65, '878888', 'moyen', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', 'Non', '', '2024-09-02 00:00:00', 'Oui', '', 'Non', '', 'orpholinelesdeux', 'excellent', '447990986801780', '9898888', '2024-06-04 00:00:00', 2000.00, NULL, '/images/Eleve/1746431404549-kyc.png', 'Primaire', 5, 3, NULL, 0, 65, '2025-05-05 07:50:04', '2025-05-07 22:07:54', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `emploidutemps`
--

DROP TABLE IF EXISTS `emploidutemps`;
CREATE TABLE IF NOT EXISTS `emploidutemps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jour` varchar(255) NOT NULL,
  `heure` varchar(255) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=965 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `emploidutemps`
--

INSERT INTO `emploidutemps` (`id`, `jour`, `heure`, `duree`, `niveauId`, `sectionId`, `matiereId`, `enseignantId`) VALUES
(617, 'Mardi', '08:00-08:30', 30, 7, 5, 4, 67),
(618, 'Mercredi', '08:00-08:30', 30, 7, 5, 4, 67),
(619, 'Mardi', '08:30-09:00', 30, 7, 5, 4, 67),
(620, 'Mardi', '09:00-09:30', 30, 7, 5, 4, 67),
(621, 'Dimanche', '08:00-08:30', 30, 7, 5, 4, 67),
(622, 'Jeudi', '08:00-08:30', 30, 7, 5, 4, 67),
(623, 'Lundi', '08:00-08:30', 30, 7, 5, 4, 67),
(624, 'Dimanche', '08:30-09:00', 30, 7, 5, 4, 67),
(625, 'Jeudi', '13:00-13:30', 30, 7, 5, 25, 69),
(626, 'Dimanche', '13:00-13:30', 30, 7, 5, 25, 69),
(627, 'Dimanche', '13:30-14:00', 30, 7, 5, 25, 69),
(628, 'Dimanche', '14:00-14:30', 30, 7, 5, 25, 69),
(629, 'Mardi', '09:45-10:30', 45, 7, 5, 25, 69),
(630, 'Jeudi', '08:30-09:00', 30, 7, 5, 1, 67),
(631, 'Mercredi', '08:30-09:00', 30, 7, 5, 1, 67),
(632, 'Dimanche', '09:00-09:30', 30, 7, 5, 1, 67),
(633, 'Lundi', '08:30-09:00', 30, 7, 5, 1, 67),
(634, 'Lundi', '09:00-09:30', 30, 7, 5, 14, 67),
(635, 'Mardi', '10:30-11:15', 45, 7, 5, 14, 67),
(636, 'Dimanche', '09:45-10:30', 30, 7, 5, 14, 67),
(637, 'Dimanche', '10:30-11:15', 45, 7, 5, 27, 71),
(638, 'Lundi', '09:45-10:30', 45, 7, 5, 27, 71),
(639, 'Lundi', '10:30-11:15', 45, 7, 5, 27, 71),
(640, 'Lundi', '13:00-13:30', 30, 7, 5, 16, 67),
(641, 'Lundi', '13:30-14:00', 30, 7, 5, 16, 67),
(642, 'Lundi', '14:00-14:30', 30, 7, 5, 34, 67),
(643, 'Dimanche', '14:30-15:15', 45, 7, 5, 34, 67),
(644, 'Mercredi', '13:00-13:30', 30, 7, 5, 7, 67),
(645, 'Lundi', '14:30-15:15', 30, 7, 5, 7, 67),
(646, 'Lundi', '15:15-16:00', 45, 7, 5, 13, 67),
(647, 'Dimanche', '15:15-16:00', 45, 7, 5, 30, 67),
(648, 'Mercredi', '09:00-09:30', 30, 7, 5, 12, 67),
(649, 'Mercredi', '09:45-10:30', 45, 7, 5, 31, 67),
(650, 'Jeudi', '09:00-09:30', 30, 7, 5, 26, 70),
(651, 'Jeudi', '09:45-10:30', 45, 7, 5, 26, 70),
(652, 'Jeudi', '13:30-14:00', 30, 7, 5, 28, 67),
(653, 'Mercredi', '13:30-14:00', 30, 7, 5, 18, 67),
(654, 'Jeudi', '10:30-11:15', 30, 7, 5, 21, 67),
(655, 'Jeudi', '14:00-14:30', 30, 7, 5, 33, 67),
(656, 'Jeudi', '14:30-15:15', 30, 7, 5, 29, 67),
(657, 'Mercredi', '14:00-14:30', 30, 7, 5, 20, 67),
(658, 'Mercredi', '10:30-11:15', 30, 7, 5, 22, 67),
(659, 'Mercredi', '14:30-15:15', 30, 7, 5, 22, 67),
(660, 'Jeudi', '08:00-08:30', 30, 8, 6, 4, 68),
(661, 'Lundi', '08:00-08:30', 30, 8, 6, 4, 68),
(662, 'Dimanche', '08:00-08:30', 30, 8, 6, 4, 68),
(663, 'Dimanche', '08:30-09:00', 30, 8, 6, 4, 68),
(664, 'Mardi', '08:00-08:30', 30, 8, 6, 4, 68),
(665, 'Jeudi', '08:30-09:00', 30, 8, 6, 4, 68),
(666, 'Lundi', '13:00-13:30', 30, 8, 6, 25, 69),
(667, 'Mercredi', '13:00-13:30', 30, 8, 6, 25, 69),
(668, 'Mercredi', '13:30-14:00', 30, 8, 6, 25, 69),
(669, 'Jeudi', '13:00-13:30', 30, 8, 6, 25, 69),
(670, 'Dimanche', '13:00-13:30', 30, 8, 6, 25, 69),
(671, 'Mardi', '08:30-09:00', 30, 8, 6, 14, 68),
(672, 'Lundi', '08:30-09:00', 30, 8, 6, 14, 68),
(673, 'Dimanche', '09:00-09:30', 30, 8, 6, 14, 68),
(674, 'Jeudi', '09:00-09:30', 30, 8, 6, 14, 68),
(675, 'Lundi', '09:00-09:30', 30, 8, 6, 14, 68),
(676, 'Jeudi', '09:45-10:30', 45, 8, 6, 27, 71),
(677, 'Mercredi', '08:00-08:30', 30, 8, 6, 27, 71),
(678, 'Jeudi', '10:30-11:15', 45, 8, 6, 27, 71),
(679, 'Mercredi', '08:30-09:00', 30, 8, 6, 27, 71),
(680, 'Jeudi', '13:30-14:00', 30, 8, 6, 1, 68),
(681, 'Mardi', '09:00-09:30', 30, 8, 6, 1, 68),
(682, 'Mardi', '09:45-10:30', 30, 8, 6, 1, 68),
(683, 'Lundi', '13:30-14:00', 30, 8, 6, 29, 68),
(684, 'Dimanche', '13:30-14:00', 30, 8, 6, 29, 68),
(685, 'Lundi', '14:00-14:30', 30, 8, 6, 7, 68),
(686, 'Mercredi', '14:00-14:30', 30, 8, 6, 7, 68),
(687, 'Jeudi', '14:00-14:30', 30, 8, 6, 13, 68),
(688, 'Jeudi', '14:30-15:15', 30, 8, 6, 13, 68),
(689, 'Mardi', '10:30-11:15', 30, 8, 6, 34, 68),
(690, 'Mercredi', '14:30-15:15', 30, 8, 6, 34, 68),
(691, 'Lundi', '09:45-10:30', 45, 8, 6, 16, 68),
(692, 'Mercredi', '09:00-09:30', 30, 8, 6, 30, 68),
(693, 'Dimanche', '09:45-10:30', 45, 8, 6, 31, 68),
(694, 'Dimanche', '10:30-11:15', 45, 8, 6, 12, 68),
(695, 'Dimanche', '14:00-14:30', 30, 8, 6, 20, NULL),
(696, 'Lundi', '10:30-11:15', 30, 8, 6, 21, 68),
(697, 'Lundi', '14:30-15:15', 30, 8, 6, 22, 68),
(698, 'Lundi', '15:15-16:00', 30, 8, 6, 28, NULL),
(699, 'Jeudi', '15:15-16:00', 30, 8, 6, 18, NULL),
(811, 'Dimanche', '08:00-08:30', 30, 6, 4, 4, 66),
(812, 'Jeudi', '08:00-08:30', 30, 6, 4, 4, 66),
(813, 'Dimanche', '08:30-09:00', 30, 6, 4, 4, 66),
(814, 'Jeudi', '08:30-09:00', 30, 6, 4, 4, 66),
(815, 'Mercredi', '08:00-08:30', 30, 6, 4, 4, 66),
(816, 'Mardi', '08:00-08:30', 30, 6, 4, 4, 66),
(817, 'Mercredi', '08:30-09:00', 30, 6, 4, 4, 66),
(818, 'Jeudi', '09:00-09:30', 30, 6, 4, 4, 66),
(819, 'Dimanche', '09:00-09:30', 30, 6, 4, 4, 66),
(820, 'Mercredi', '09:00-09:30', 30, 6, 4, 4, 66),
(821, 'Jeudi', '13:00-13:30', 30, 6, 4, 25, 69),
(822, 'Mercredi', '13:00-13:30', 30, 6, 4, 25, 69),
(823, 'Mardi', '08:30-09:00', 30, 6, 4, 25, 69),
(824, 'Mercredi', '13:30-14:00', 30, 6, 4, 25, 69),
(825, 'Lundi', '13:00-13:30', 30, 6, 4, 25, 69),
(826, 'Mercredi', '14:00-14:30', 30, 6, 4, 25, 69),
(827, 'Mercredi', '14:30-15:15', 30, 6, 4, 25, 69),
(828, 'Lundi', '08:00-08:30', 30, 6, 4, 14, 66),
(829, 'Lundi', '08:30-09:00', 30, 6, 4, 14, 66),
(830, 'Dimanche', '09:45-10:30', 45, 6, 4, 14, 66),
(831, 'Mardi', '09:00-09:30', 30, 6, 4, 14, 66),
(832, 'Lundi', '09:00-09:30', 30, 6, 4, 14, 66),
(833, 'Lundi', '09:45-10:30', 45, 6, 4, 26, 70),
(834, 'Mardi', '09:45-10:30', 45, 6, 4, 26, 70),
(835, 'Lundi', '10:30-11:15', 30, 6, 4, 26, 70),
(836, 'Lundi', '13:30-14:00', 30, 6, 4, 12, 66),
(837, 'Jeudi', '09:45-10:30', 30, 6, 4, 12, 66),
(838, 'Lundi', '14:00-14:30', 30, 6, 4, 34, 66),
(839, 'Jeudi', '13:30-14:00', 30, 6, 4, 34, 66),
(840, 'Lundi', '14:30-15:15', 45, 6, 4, 7, 66),
(841, 'Mardi', '10:30-11:15', 45, 6, 4, 32, 66),
(842, 'Mercredi', '15:15-16:00', 45, 6, 4, 18, 66),
(843, 'Jeudi', '14:00-14:30', 30, 6, 4, 29, 66),
(844, 'Jeudi', '10:30-11:15', 30, 6, 4, 21, 66),
(845, 'Jeudi', '14:30-15:15', 30, 6, 4, 13, 66),
(846, 'Mercredi', '09:45-10:30', 45, 6, 4, 1, 66),
(847, 'Mercredi', '10:30-11:15', 30, 6, 4, 1, 66),
(848, 'Jeudi', '15:15-16:00', 30, 6, 4, 20, 66),
(849, 'Dimanche', '10:30-11:15', 45, 6, 4, 22, 66),
(850, 'Dimanche', '13:00-13:30', 30, 6, 4, 16, 66),
(851, 'Jeudi', '08:00-08:30', 30, 1, 1, 4, 5),
(852, 'Jeudi', '08:30-09:00', 30, 1, 1, 4, 5),
(853, 'Mercredi', '08:00-08:30', 30, 1, 1, 4, 5),
(854, 'Dimanche', '08:00-08:30', 30, 1, 1, 4, 5),
(855, 'Lundi', '08:00-08:30', 30, 1, 1, 4, 5),
(856, 'Mardi', '08:00-08:30', 30, 1, 1, 4, 5),
(857, 'Mardi', '08:30-09:00', 30, 1, 1, 4, 5),
(858, 'Mardi', '09:00-09:30', 30, 1, 1, 6, 5),
(859, 'Lundi', '08:30-09:00', 30, 1, 1, 6, 5),
(860, 'Dimanche', '08:30-09:00', 30, 1, 1, 6, 5),
(861, 'Lundi', '09:00-09:30', 30, 1, 1, 6, 5),
(862, 'Jeudi', '09:00-09:30', 30, 1, 1, 6, 5),
(863, 'Lundi', '09:45-10:30', 45, 1, 1, 6, 5),
(864, 'Dimanche', '13:00-13:30', 30, 1, 1, 7, 5),
(865, 'Lundi', '13:00-13:30', 30, 1, 1, 7, 5),
(866, 'Jeudi', '13:00-13:30', 30, 1, 1, 7, 5),
(867, 'Mardi', '09:45-10:30', 45, 1, 1, 7, 5),
(868, 'Lundi', '10:30-11:15', 30, 1, 1, 2, 5),
(869, 'Jeudi', '09:45-10:30', 30, 1, 1, 2, 5),
(870, 'Mardi', '10:30-11:15', 30, 1, 1, 2, 5),
(871, 'Jeudi', '13:30-14:00', 30, 1, 1, 11, 5),
(872, 'Jeudi', '14:00-14:30', 30, 1, 1, 11, 5),
(873, 'Lundi', '13:30-14:00', 30, 1, 1, 11, 5),
(874, 'Jeudi', '10:30-11:15', 45, 1, 1, 3, 5),
(875, 'Lundi', '14:00-14:30', 30, 1, 1, 3, 5),
(876, 'Mercredi', '13:00-13:30', 30, 1, 1, 10, 5),
(877, 'Jeudi', '14:30-15:15', 30, 1, 1, 10, 5),
(878, 'Lundi', '14:30-15:15', 30, 1, 1, 12, 5),
(879, 'Mercredi', '08:30-09:00', 30, 1, 1, 12, 5),
(880, 'Mercredi', '09:00-09:30', 30, 1, 1, 5, 5),
(881, 'Jeudi', '15:15-16:00', 45, 1, 1, 5, 5),
(882, 'Mercredi', '09:45-10:30', 30, 1, 1, 5, 5),
(883, 'Dimanche', '09:00-09:30', 30, 1, 1, 8, 5),
(884, 'Mercredi', '10:30-11:15', 45, 1, 1, 8, 5),
(885, 'Lundi', '15:15-16:00', 30, 1, 1, 8, 5),
(886, 'Mercredi', '13:30-14:00', 30, 1, 1, 1, 5),
(887, 'Mercredi', '14:00-14:30', 30, 1, 1, 1, 5),
(888, 'Mercredi', '14:30-15:15', 30, 1, 1, 9, 5),
(889, 'Mercredi', '15:15-16:00', 30, 1, 1, 9, 5),
(890, 'Mercredi', '08:00-08:30', 30, 3, 2, 4, 6),
(891, 'Dimanche', '08:00-08:30', 30, 3, 2, 4, 6),
(892, 'Lundi', '08:00-08:30', 30, 3, 2, 4, 6),
(893, 'Jeudi', '08:00-08:30', 30, 3, 2, 4, 6),
(894, 'Dimanche', '08:30-09:00', 30, 3, 2, 4, 6),
(895, 'Jeudi', '08:30-09:00', 30, 3, 2, 4, 6),
(896, 'Mercredi', '08:30-09:00', 30, 3, 2, 4, 6),
(897, 'Dimanche', '09:00-09:30', 30, 3, 2, 4, 6),
(898, 'Jeudi', '09:00-09:30', 30, 3, 2, 14, 6),
(899, 'Mardi', '08:00-08:30', 30, 3, 2, 14, 6),
(900, 'Mercredi', '09:00-09:30', 30, 3, 2, 14, 6),
(901, 'Dimanche', '09:45-10:30', 45, 3, 2, 14, 6),
(902, 'Jeudi', '09:45-10:30', 45, 3, 2, 14, 6),
(903, 'Mardi', '08:30-09:00', 30, 3, 2, 17, 6),
(904, 'Mercredi', '13:00-13:30', 30, 3, 2, 17, 6),
(905, 'Jeudi', '13:00-13:30', 30, 3, 2, 17, 6),
(906, 'Mardi', '09:00-09:30', 30, 3, 2, 1, 6),
(907, 'Mardi', '09:45-10:30', 30, 3, 2, 1, 6),
(908, 'Lundi', '08:30-09:00', 30, 3, 2, 1, 6),
(909, 'Lundi', '09:00-09:30', 30, 3, 2, 16, 6),
(910, 'Mardi', '10:30-11:15', 45, 3, 2, 16, 6),
(911, 'Lundi', '13:00-13:30', 30, 3, 2, 20, 6),
(912, 'Jeudi', '13:30-14:00', 30, 3, 2, 20, 6),
(913, 'Dimanche', '13:00-13:30', 30, 3, 2, 20, 6),
(914, 'Mercredi', '09:45-10:30', 45, 3, 2, 13, 6),
(915, 'Jeudi', '10:30-11:15', 30, 3, 2, 13, 6),
(916, 'Jeudi', '14:00-14:30', 30, 3, 2, 7, 6),
(917, 'Dimanche', '13:30-14:00', 30, 3, 2, 7, 6),
(918, 'Mercredi', '13:30-14:00', 30, 3, 2, 19, 6),
(919, 'Lundi', '13:30-14:00', 30, 3, 2, 19, 6),
(920, 'Jeudi', '14:30-15:15', 45, 3, 2, 12, NULL),
(921, 'Lundi', '14:00-14:30', 30, 3, 2, 18, 6),
(922, 'Lundi', '09:45-10:30', 30, 3, 2, 21, 6),
(923, 'Jeudi', '15:15-16:00', 30, 3, 2, 22, 6),
(924, 'Lundi', '10:30-11:15', 30, 3, 2, 15, 6),
(925, 'Lundi', '14:30-15:15', 30, 3, 2, 15, 6),
(926, 'Dimanche', '08:00-08:30', 30, 5, 3, 4, 11),
(927, 'Dimanche', '08:30-09:00', 30, 5, 3, 4, 11),
(928, 'Lundi', '08:00-08:30', 30, 5, 3, 4, 11),
(929, 'Lundi', '08:30-09:00', 30, 5, 3, 4, 11),
(930, 'Mercredi', '08:00-08:30', 30, 5, 3, 4, 11),
(931, 'Jeudi', '08:00-08:30', 30, 5, 3, 4, 11),
(932, 'Lundi', '09:00-09:30', 30, 5, 3, 4, 11),
(933, 'Mercredi', '08:30-09:00', 30, 5, 3, 4, 11),
(934, 'Jeudi', '08:30-09:00', 30, 5, 3, 14, 11),
(935, 'Mardi', '08:00-08:30', 30, 5, 3, 14, 11),
(936, 'Dimanche', '09:00-09:30', 30, 5, 3, 14, 11),
(937, 'Lundi', '09:45-10:30', 45, 5, 3, 14, 11),
(938, 'Dimanche', '09:45-10:30', 45, 5, 3, 14, 11),
(939, 'Mardi', '08:30-09:00', 30, 5, 3, 14, 11),
(940, 'Lundi', '10:30-11:15', 30, 5, 3, 14, 11),
(941, 'Mercredi', '09:00-09:30', 30, 5, 3, 16, 11),
(942, 'Jeudi', '09:00-09:30', 30, 5, 3, 16, 11),
(943, 'Jeudi', '09:45-10:30', 45, 5, 3, 16, 11),
(944, 'Dimanche', '13:00-13:30', 30, 5, 3, 7, 11),
(945, 'Mercredi', '13:00-13:30', 30, 5, 3, 7, 11),
(946, 'Mercredi', '13:30-14:00', 30, 5, 3, 7, 11),
(947, 'Lundi', '13:00-13:30', 30, 5, 3, 20, 11),
(948, 'Mardi', '09:00-09:30', 30, 5, 3, 20, 11),
(949, 'Lundi', '13:30-14:00', 30, 5, 3, 20, 11),
(950, 'Dimanche', '13:30-14:00', 30, 5, 3, 23, 11),
(951, 'Dimanche', '14:00-14:30', 30, 5, 3, 23, 11),
(952, 'Dimanche', '10:30-11:15', 30, 5, 3, 19, 11),
(953, 'Mardi', '09:45-10:30', 30, 5, 3, 19, 11),
(954, 'Jeudi', '13:00-13:30', 30, 5, 3, 24, 11),
(955, 'Jeudi', '13:30-14:00', 30, 5, 3, 24, 11),
(956, 'Lundi', '14:00-14:30', 30, 5, 3, 21, 11),
(957, 'Dimanche', '14:30-15:15', 45, 5, 3, 22, 11),
(958, 'Jeudi', '10:30-11:15', 45, 5, 3, 1, 11),
(959, 'Mardi', '10:30-11:15', 45, 5, 3, 1, 11),
(960, 'Mercredi', '09:45-10:30', 30, 5, 3, 15, 11),
(961, 'Mercredi', '10:30-11:15', 30, 5, 3, 15, 11),
(962, 'Jeudi', '14:00-14:30', 30, 5, 3, 18, 11),
(963, 'Jeudi', '14:30-15:15', 30, 5, 3, 12, 11),
(964, 'Dimanche', '15:15-16:00', 30, 5, 3, 13, 11);

-- --------------------------------------------------------

--
-- Structure de la table `employes`
--

DROP TABLE IF EXISTS `employes`;
CREATE TABLE IF NOT EXISTS `employes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sitfamiliale` varchar(255) DEFAULT NULL,
  `nbrenfant` int(11) DEFAULT NULL,
  `TypePI` varchar(255) DEFAULT NULL,
  `NumPI` varchar(255) DEFAULT NULL,
  `NumPC` varchar(255) DEFAULT NULL,
  `NumAS` varchar(255) DEFAULT NULL,
  `poste` int(11) DEFAULT NULL,
  `service` int(11) DEFAULT NULL,
  `daterecru` datetime NOT NULL,
  `NVTetudes` varchar(255) DEFAULT NULL,
  `Experience` varchar(255) DEFAULT NULL,
  `SalairNeg` decimal(10,2) DEFAULT NULL,
  `TypeContrat` varchar(255) DEFAULT NULL,
  `DateFinContrat` datetime DEFAULT NULL,
  `Remarque` varchar(255) DEFAULT NULL,
  `HeureEM` time NOT NULL,
  `HeureSM` time NOT NULL,
  `HeureEAM` time NOT NULL,
  `HeureSAM` time NOT NULL,
  `nbrJourTravail` int(11) NOT NULL,
  `nbrHeureLegale` decimal(8,2) NOT NULL,
  `Typepai` varchar(255) DEFAULT NULL,
  `Numpai` varchar(255) DEFAULT NULL,
  `CE` varchar(255) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `photo` varchar(255) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `declaration` tinyint(1) DEFAULT 0,
  `abattement` varchar(255) DEFAULT 'non',
  `dateabt` datetime DEFAULT NULL,
  `tauxabt` float DEFAULT 0,
  `notify` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `poste` (`poste`),
  KEY `service` (`service`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `employes`
--

INSERT INTO `employes` (`id`, `sitfamiliale`, `nbrenfant`, `TypePI`, `NumPI`, `NumPC`, `NumAS`, `poste`, `service`, `daterecru`, `NVTetudes`, `Experience`, `SalairNeg`, `TypeContrat`, `DateFinContrat`, `Remarque`, `HeureEM`, `HeureSM`, `HeureEAM`, `HeureSAM`, `nbrJourTravail`, `nbrHeureLegale`, `Typepai`, `Numpai`, `CE`, `archiver`, `photo`, `userId`, `declaration`, `abattement`, `dateabt`, `tauxabt`, `notify`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(5, 'Marié', 4, 'Carte d\'identité nationale', '56566777', '', '', 1, 1, '2025-02-01 00:00:00', 'master2', '6', 50000.00, 'CDI', '2025-05-15 00:00:00', '', '08:00:00', '12:00:00', '13:00:00', '16:30:00', 22, 173.33, 'virement bancaire', '56566666', '7', 0, '/images/employes/hedadi_karima_1989-01-20_.jpg', 5, 1, 'non', NULL, 0, 0, '2025-04-20 09:37:02', '2025-05-14 13:57:14', NULL),
(6, 'Célibataire', 0, 'Passeport', '787777', '', '', 1, 1, '2024-03-12 00:00:00', 'master2', '8', 60000.00, 'cdi', '2025-04-02 00:00:00', '', '08:00:00', '12:00:00', '13:00:00', '16:30:00', 22, 173.33, 'virement bancaire', '5656', '6', 0, NULL, 6, 1, 'non', NULL, 0, 0, '2025-04-20 09:42:48', '2025-05-14 14:00:44', NULL),
(9, 'Célibataire', 0, 'Passeport', '8788888', '5656666', '09876545', 4, 2, '2022-10-03 00:00:00', 'master2', '3', 67000.00, 'CDD', '2025-12-25 00:00:00', '', '08:00:00', '12:00:00', '13:00:00', '17:00:00', 22, 173.33, 'virement bancaire', '656789435 56', 'SM', 1, '/images/employes/makbel_mohend_1994-01-20_.jpg', 9, 1, 'non', NULL, 0, 0, '2025-04-20 12:31:34', '2025-05-14 09:25:08', NULL),
(10, 'Marié', 4, 'Passeport', '7878888', '', '', 3, 3, '2024-07-01 00:00:00', 'master2', '5', 400000.00, 'CDI', '2025-05-07 00:00:00', '', '09:00:00', '12:00:00', '13:00:00', '16:00:00', 22, 173.33, '', '5656', '565-55', 1, NULL, 10, 1, 'non', NULL, 0, 0, '2025-04-20 12:34:40', '2025-05-14 09:25:15', NULL),
(11, '', 0, '', '', '', '', 1, 1, '2025-04-01 00:00:00', '', '', 40000.00, '', '2025-05-01 00:00:00', '', '08:00:00', '12:00:00', '13:00:00', '16:30:00', 22, 173.33, '', '', '', 0, NULL, 11, 0, 'non', NULL, 0, 0, '2025-04-21 14:07:38', '2025-05-14 14:03:44', NULL),
(13, 'Marié', 3, 'Carte d\'identité nationale', '123456789', '', '', 2, 3, '2025-04-01 00:00:00', 'master2', '4', 700000.00, 'CDD', '2025-11-12 00:00:00', '', '08:00:00', '12:00:00', '13:00:00', '16:30:00', 22, 173.33, 'virement bancaire', '65656666', '78765-66', 0, '/images/employes/abdeli_aida_1992-01-21_.jpg', 13, 0, 'non', NULL, 0, 0, '2025-04-21 19:25:40', '2025-05-13 12:28:32', NULL),
(15, 'Marié', 3, 'Carte d\'identité nationale', '989988888865', '', '', 4, 2, '2024-12-01 00:00:00', 'master2', '6', 70000.00, 'CDI', '2025-06-30 00:00:00', '', '08:00:00', '12:00:00', '13:00:00', '17:00:00', 22, 173.33, 'virement bancaire', '76776666', '768888', 1, NULL, 15, 1, 'oui', NULL, 0.7, 0, '2025-04-21 19:32:18', '2025-05-14 09:25:08', NULL),
(66, 'Marié', 3, 'Carte d\'identité nationale', '786786', '876876786', '090908', 1, 4, '2025-05-01 00:00:00', 'M2', '3', 30000.00, 'CDI', '2026-06-07 00:00:00', '', '08:00:00', '12:00:00', '13:00:00', '16:30:00', 22, 173.33, 'virement bancaire', '67565757657', '7867687', 0, '/images/employes/karim_azoug_2025-05-08_.png', 66, 1, 'non', NULL, 0, 0, '2025-05-14 13:31:51', '2025-05-14 14:10:54', NULL),
(67, 'Marié', 2, 'Carte d\'identité nationale', '0988778897', '677658787', '35445434', 1, 2, '2025-05-08 00:00:00', 'M2', '3', 30000.00, 'CDI', '2026-05-31 00:00:00', '', '08:00:00', '12:00:00', '13:00:00', '16:00:00', 22, 173.33, 'CCP', '767667267', '089908', 0, '/images/employes/kamel_izem_1969-05-22_.png', 67, 1, 'non', NULL, 0, 0, '2025-05-14 13:35:33', '2025-05-14 14:10:11', NULL),
(68, 'Marié', 4, 'Passeport', '878487897', '9873099', '656656', 1, 2, '2025-05-08 00:00:00', 'M2', '3', 30000.00, 'CDI', '2026-05-31 00:00:00', '', '08:00:00', '12:00:00', '13:00:00', '16:00:00', 22, 173.33, '', '7377846784674', '0899344', 0, '/images/employes/halim_heddad_1975-05-23_.png', 68, 1, 'non', NULL, 0, 0, '2025-05-14 13:40:30', '2025-05-14 14:13:48', NULL),
(69, 'Célibataire', 0, 'Passeport', '7687876', '786786786', '7766756757', 1, 2, '2025-05-08 00:00:00', 'M2', '3', 30000.00, 'CDI', '2026-05-31 00:00:00', '', '08:00:00', '12:00:00', '13:00:00', '16:00:00', 22, 173.33, 'CCP', '7377846784674', '088234', 0, '/images/employes/salima_mokhtar_1987-05-29_.png', 69, 1, 'non', NULL, 0, 0, '2025-05-14 13:42:45', '2025-05-14 14:15:51', NULL),
(70, 'Marié', 2, 'Carte d\'identité nationale', '87687868', '78876786', '87678', 1, 2, '2025-05-08 00:00:00', 'M2', '3', 30000.00, 'CDI', '2026-05-31 00:00:00', '', '08:00:00', '12:00:00', '13:00:00', '16:00:00', 22, 173.33, 'CCP', '7377846784674', '088008', 0, '/images/employes/djamila_qasi_1985-05-28_.png', 70, 1, 'non', NULL, 0, 0, '2025-05-14 13:44:57', '2025-05-14 14:16:59', NULL),
(71, 'Marié', 3, 'Carte d\'identité nationale', '8798789', '987897987', '67667567', 1, 4, '2025-05-01 00:00:00', 'M2', '3', 30000.00, 'CDI', '2026-06-07 00:00:00', '', '08:00:00', '12:00:00', '13:00:00', '16:00:00', 22, 173.33, 'CCP', '67565757657', '78676006', 0, '/images/employes/razika_saleh_1983-05-22_.png', 71, 1, 'non', NULL, 0, 0, '2025-05-14 14:19:14', '2025-05-14 14:20:18', NULL);

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
  KEY `niveauId` (`niveauId`),
  KEY `EnseignantClasse_niveauId_enseignantId_unique` (`enseignantId`,`niveauId`) USING BTREE,
  KEY `EnseignantClasse_matiereId_enseignantId_unique` (`matiereId`) USING BTREE,
  KEY `EnseignantClasse_classeId_enseignantId_unique` (`classeId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `enseignantclasse`
--

INSERT INTO `enseignantclasse` (`id`, `enseignantId`, `matiereId`, `classeId`, `niveauId`) VALUES
(13, 5, 1, 1, 1),
(14, 5, 2, 1, 1),
(15, 5, 3, 1, 1),
(16, 5, 4, 1, 1),
(17, 5, 5, 1, 1),
(18, 5, 6, 1, 1),
(19, 5, 7, 1, 1),
(20, 5, 8, 1, 1),
(21, 5, 9, 1, 1),
(22, 5, 10, 1, 1),
(23, 5, 11, 1, 1),
(24, 5, 12, 1, 1),
(25, 6, 21, 2, 3),
(26, 6, 22, 2, 3),
(27, 6, 13, 2, 3),
(28, 6, 4, 2, 3),
(29, 6, 14, 2, 3),
(30, 6, 1, 2, 3),
(31, 6, 20, 2, 3),
(32, 6, 15, 2, 3),
(33, 6, 16, 2, 3),
(34, 6, 7, 2, 3),
(35, 6, 17, 2, 3),
(36, 6, 18, 2, 3),
(37, 6, 19, 2, 3),
(38, 11, 4, 3, 5),
(39, 11, 21, 3, 5),
(40, 11, 22, 3, 5),
(41, 11, 1, 3, 5),
(42, 11, 14, 3, 5),
(43, 11, 15, 3, 5),
(44, 11, 20, 3, 5),
(45, 11, 13, 3, 5),
(46, 11, 7, 3, 5),
(47, 11, 12, 3, 5),
(48, 11, 16, 3, 5),
(49, 11, 23, 3, 5),
(50, 11, 18, 3, 5),
(51, 11, 24, 3, 5),
(52, 11, 19, 3, 5),
(84, 67, 4, 5, 7),
(85, 67, 1, 5, 7),
(86, 67, 21, 5, 7),
(87, 67, 22, 5, 7),
(88, 67, 14, 5, 7),
(89, 67, 28, 5, 7),
(90, 67, 7, 5, 7),
(91, 67, 29, 5, 7),
(92, 67, 13, 5, 7),
(93, 67, 30, 5, 7),
(94, 67, 33, 5, 7),
(95, 67, 12, 5, 7),
(96, 67, 16, 5, 7),
(97, 67, 31, 5, 7),
(98, 67, 34, 5, 7),
(99, 67, 18, 5, 7),
(100, 67, 20, 5, 7),
(101, 66, 1, 4, 6),
(102, 66, 4, 4, 6),
(103, 66, 7, 4, 6),
(104, 66, 12, 4, 6),
(105, 66, 13, 4, 6),
(106, 66, 14, 4, 6),
(107, 66, 16, 4, 6),
(108, 66, 18, 4, 6),
(109, 66, 20, 4, 6),
(110, 66, 21, 4, 6),
(111, 66, 22, 4, 6),
(112, 66, 29, 4, 6),
(113, 66, 32, 4, 6),
(114, 66, 34, 4, 6),
(115, 68, 4, 6, 8),
(116, 68, 7, 6, 8),
(117, 68, 1, 6, 8),
(118, 68, 12, 6, 8),
(119, 68, 14, 6, 8),
(120, 68, 16, 6, 8),
(121, 68, 30, 6, 8),
(122, 68, 31, 6, 8),
(123, 68, 21, 6, 8),
(124, 68, 22, 6, 8),
(125, 68, 29, 6, 8),
(126, 68, 13, 6, 8),
(127, 68, 34, 6, 8),
(128, 69, 25, 4, 6),
(129, 69, 25, 4, 7),
(130, 69, 25, 4, 8),
(131, 69, 25, 5, 6),
(132, 69, 25, 5, 7),
(133, 69, 25, 5, 8),
(134, 69, 25, 6, 6),
(135, 69, 25, 6, 7),
(136, 69, 25, 6, 8),
(137, 70, 26, 4, 6),
(138, 70, 26, 4, 7),
(139, 70, 26, 5, 6),
(140, 70, 26, 5, 7),
(141, 71, 27, 5, 7),
(142, 71, 27, 5, 8),
(143, 71, 27, 6, 7),
(144, 71, 27, 6, 8);

-- --------------------------------------------------------

--
-- Structure de la table `enseignants`
--

DROP TABLE IF EXISTS `enseignants`;
CREATE TABLE IF NOT EXISTS `enseignants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `npe` varchar(255) NOT NULL,
  `pfe` varchar(255) NOT NULL,
  `ddn` datetime DEFAULT NULL,
  `ninn` varchar(255) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `disponibilites` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`disponibilites`)),
  `employe_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employe_id` (`employe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `enseignants`
--

INSERT INTO `enseignants` (`id`, `npe`, `pfe`, `ddn`, `ninn`, `archiver`, `disponibilites`, `employe_id`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(5, '', '', '2025-04-04 00:00:00', '7777', 0, '{\"lundi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"mardi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"12:00\"}]},\"mercredi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"jeudi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"vendredi\":{\"disponible\":false,\"heures\":[]},\"samedi\":{\"disponible\":false,\"heures\":[]},\"dimanche\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]}}', 5, '2025-04-20 09:37:02', '2025-05-14 13:57:14', NULL),
(6, '', '', '2025-04-11 00:00:00', '888', 0, '{\"lundi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"mardi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"12:00\"}]},\"mercredi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"jeudi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"vendredi\":{\"disponible\":false,\"heures\":[]},\"samedi\":{\"disponible\":false,\"heures\":[]},\"dimanche\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]}}', 6, '2025-04-20 09:42:48', '2025-05-14 14:00:44', NULL),
(11, '', '', '2025-04-04 00:00:00', 'TT', 0, '{\"lundi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"mardi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"12:00\"}]},\"mercredi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"jeudi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"vendredi\":{\"disponible\":false,\"heures\":[]},\"samedi\":{\"disponible\":false,\"heures\":[]},\"dimanche\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]}}', 11, '2025-04-21 14:07:38', '2025-05-14 14:03:44', NULL),
(66, '', '', '2025-05-30 00:00:00', '8977998', 0, '{\"lundi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"mardi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"12:00\"}]},\"mercredi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"jeudi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"vendredi\":{\"disponible\":false,\"heures\":[]},\"samedi\":{\"disponible\":false,\"heures\":[]},\"dimanche\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]}}', 66, '2025-05-14 13:31:51', '2025-05-14 14:10:54', NULL),
(67, '', '', '2025-05-30 00:00:00', '789798783°0', 0, '{\"lundi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"mardi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"12:00\"}]},\"mercredi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"jeudi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"vendredi\":{\"disponible\":false,\"heures\":[]},\"samedi\":{\"disponible\":false,\"heures\":[]},\"dimanche\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]}}', 67, '2025-05-14 13:35:33', '2025-05-14 14:10:11', NULL),
(68, '', '', '2025-05-28 00:00:00', '778887667', 0, '{\"lundi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"mardi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"12:00\"}]},\"mercredi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"jeudi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"vendredi\":{\"disponible\":false,\"heures\":[]},\"samedi\":{\"disponible\":false,\"heures\":[]},\"dimanche\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]}}', 68, '2025-05-14 13:40:30', '2025-05-14 14:13:48', NULL),
(69, '', '', '2025-06-07 00:00:00', '76677647646', 0, '{\"lundi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"mardi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"12:00\"}]},\"mercredi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"jeudi\":{\"disponible\":true,\"heures\":[{\"debut\":\"13:00\",\"fin\":\"16:00\"}]},\"vendredi\":{\"disponible\":false,\"heures\":[]},\"samedi\":{\"disponible\":false,\"heures\":[]},\"dimanche\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]}}', 69, '2025-05-14 13:42:45', '2025-05-14 14:15:51', NULL),
(70, '', '', '2025-06-21 00:00:00', '739897984738943', 0, '{\"lundi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"mardi\":{\"disponible\":false,\"heures\":[]},\"mercredi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"jeudi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"12:00\"}]},\"vendredi\":{\"disponible\":false,\"heures\":[]},\"samedi\":{\"disponible\":false,\"heures\":[]},\"dimanche\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]}}', 70, '2025-05-14 13:44:57', '2025-05-14 14:16:59', NULL),
(71, '', '', '2025-05-31 00:00:00', '88789878789', 0, '{\"lundi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"mardi\":{\"disponible\":false,\"heures\":[]},\"mercredi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"jeudi\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]},\"vendredi\":{\"disponible\":false,\"heures\":[]},\"samedi\":{\"disponible\":false,\"heures\":[]},\"dimanche\":{\"disponible\":true,\"heures\":[{\"debut\":\"08:00\",\"fin\":\"16:00\"}]}}', 71, '2025-05-14 14:19:14', '2025-05-14 14:20:18', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE IF NOT EXISTS `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `start` datetime NOT NULL,
  `allDay` tinyint(1) DEFAULT 1,
  `backgroundColor` varchar(255) DEFAULT '#ff0000',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `fournisseurs`
--

DROP TABLE IF EXISTS `fournisseurs`;
CREATE TABLE IF NOT EXISTS `fournisseurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `date_creation` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `heuressups`
--

DROP TABLE IF EXISTS `heuressups`;
CREATE TABLE IF NOT EXISTS `heuressups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `taux` float NOT NULL,
  `ecoleId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `irgs`
--

DROP TABLE IF EXISTS `irgs`;
CREATE TABLE IF NOT EXISTS `irgs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pays` varchar(255) NOT NULL,
  `annee_fiscale` int(11) NOT NULL,
  `tranche_min` decimal(10,2) DEFAULT NULL,
  `tranche_max` decimal(10,2) DEFAULT NULL,
  `taux_imposition` decimal(5,2) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `journalpaie`
--

DROP TABLE IF EXISTS `journalpaie`;
CREATE TABLE IF NOT EXISTS `journalpaie` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `periodePaieId` int(11) NOT NULL,
  `nom_prenom` varchar(255) NOT NULL,
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
  `NomAutreRetenues` varchar(255) DEFAULT NULL,
  `date` datetime NOT NULL,
  `heuresSup` decimal(10,2) DEFAULT 0.00,
  `GeinheuresSup` decimal(10,2) DEFAULT 0.00,
  `Geins` decimal(10,2) DEFAULT 0.00,
  `Retenues` decimal(10,2) DEFAULT 0.00,
  `statut` varchar(255) DEFAULT 'non publier',
  `bulletin_html` longtext DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `JournalPaie_periodePaieId_idEmploye_unique` (`periodePaieId`,`idEmploye`),
  KEY `idEmploye` (`idEmploye`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `joursferies`
--

DROP TABLE IF EXISTS `joursferies`;
CREATE TABLE IF NOT EXISTS `joursferies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `nom` varchar(255) NOT NULL,
  `ecoleId` int(11) NOT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `matieres`
--

DROP TABLE IF EXISTS `matieres`;
CREATE TABLE IF NOT EXISTS `matieres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `nomarabe` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `matieres`
--

INSERT INTO `matieres` (`id`, `nom`, `nomarabe`, `image`, `archiver`, `createdAt`, `updatedAt`) VALUES
(1, 'Science Islamique', 'التربية الإسلامية', 'image-1746356088207-407428368.png', 0, '2025-05-04 10:54:48', '2025-05-04 10:54:48'),
(2, 'Lecteur', 'تعبير الشفوي', 'image-1746356134558-944493382.png', 0, '2025-05-04 10:55:34', '2025-05-04 10:55:34'),
(3, 'jeux de lecteur', 'ألعاب قرائية', 'image-1746356211606-966213294.png', 0, '2025-05-04 10:56:51', '2025-05-04 10:56:51'),
(4, 'Mathématique', 'رياضيات', 'image-1746356238500-366689829.png', 0, '2025-05-04 10:57:18', '2025-05-04 10:57:18'),
(5, 'musqiue', 'موسيقى و إنشاد', NULL, 0, '2025-05-04 10:57:57', '2025-05-04 10:57:57'),
(6, 'L\'éveil scientifique', 'إيقاظ علمي', NULL, 0, '2025-05-04 10:58:42', '2025-05-04 10:58:42'),
(7, 'Sport', 'التربية بدنية', 'image-1746356351916-149607247.png', 0, '2025-05-04 10:59:11', '2025-05-04 10:59:11'),
(8, 'planification', 'تخطيط', NULL, 0, '2025-05-04 11:00:03', '2025-05-04 11:00:03'),
(9, 'Éducation rythmique', 'التربية إيقاعية', NULL, 0, '2025-05-04 11:01:06', '2025-05-04 11:01:06'),
(10, 'Dessin', 'رسم و أشغال', NULL, 0, '2025-05-04 11:01:45', '2025-05-04 11:01:45'),
(11, 'Théâtre et marionnettes', 'مسرح وعرائس', NULL, 0, '2025-05-04 11:02:38', '2025-05-04 11:02:38'),
(12, 'Éducation civique', 'التربية المدنية', NULL, 0, '2025-05-04 11:59:49', '2025-05-04 11:59:49'),
(13, 'Production orale', 'إنتاج الشفوي', NULL, 0, '2025-05-14 11:57:29', '2025-05-14 11:57:29'),
(14, 'Lecteur', 'قراءة', NULL, 0, '2025-05-14 11:58:11', '2025-05-14 11:58:11'),
(15, 'Ecriteur', 'الكتابة', NULL, 0, '2025-05-14 11:59:24', '2025-05-14 11:59:24'),
(16, 'Éducation scientifique', 'التربية العلمية', 'image-1747224022208-750159516.png', 0, '2025-05-14 12:00:22', '2025-05-14 12:00:22'),
(17, 'expression linguistique', 'تعبير لغوي', NULL, 0, '2025-05-14 12:01:00', '2025-05-14 12:01:00'),
(18, 'Éducation artistique', 'التربية الفنية', NULL, 0, '2025-05-14 12:01:39', '2025-05-14 12:01:39'),
(19, 'Intégration', 'إدماج', NULL, 0, '2025-05-14 12:02:04', '2025-05-14 12:02:04'),
(20, 'محفوظات', 'محفوظات', NULL, 0, '2025-05-14 12:04:02', '2025-05-14 12:04:02'),
(21, 'ف المنطوق', 'ف المنطوق', NULL, 0, '2025-05-14 12:05:28', '2025-05-14 12:05:28'),
(22, 'expression orale', 'تعبير الشفوي', NULL, 0, '2025-05-14 12:06:39', '2025-05-14 12:06:39'),
(23, 'Dictée', 'إملاء', NULL, 0, '2025-05-14 12:08:06', '2025-05-14 12:08:06'),
(24, 'Lecture et maîtrise', 'قراءة و إتقان', NULL, 0, '2025-05-14 12:16:07', '2025-05-14 12:16:07'),
(25, 'Français', 'الفرنسية', 'image-1747224987282-909245237.png', 0, '2025-05-14 12:16:27', '2025-05-14 12:16:27'),
(26, 'Anglais', 'الإنجليزية', 'image-1747225020572-789552317.png', 0, '2025-05-14 12:17:00', '2025-05-14 12:17:00'),
(27, 'tazaghith', 'الأمازيغية', 'image-1747225038697-275808977.png', 0, '2025-05-14 12:17:18', '2025-05-14 12:17:18'),
(28, 'adverbe grammatical', 'ظرف النحوية', NULL, 0, '2025-05-14 12:18:24', '2025-05-14 12:18:24'),
(29, 'Lecteur', 'مطالعة', NULL, 0, '2025-05-14 12:19:23', '2025-05-14 12:19:23'),
(30, 'Histoire', 'تاريخ', 'image-1747225203177-343308670.png', 0, '2025-05-14 12:20:03', '2025-05-14 12:20:03'),
(31, 'géographie', 'الجغرافيا', 'image-1747225237431-700403766.png', 0, '2025-05-14 12:20:37', '2025-05-14 12:20:37'),
(32, 'histoire et géographie', 'تاريخ و جغرافيا', NULL, 0, '2025-05-14 12:21:07', '2025-05-14 12:21:07'),
(33, 'adverbe morphologique', 'ظرف الصرفية', NULL, 0, '2025-05-14 12:22:12', '2025-05-14 12:22:12'),
(34, 'Production écrite', 'إنتاج كتابي', NULL, 0, '2025-05-14 12:23:06', '2025-05-14 12:23:06');

-- --------------------------------------------------------

--
-- Structure de la table `moyennegenerales`
--

DROP TABLE IF EXISTS `moyennegenerales`;
CREATE TABLE IF NOT EXISTS `moyennegenerales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `EleveId` int(11) NOT NULL,
  `niveauId` int(11) NOT NULL,
  `sectionId` int(11) NOT NULL,
  `annescolaireId` int(11) NOT NULL,
  `trimestId` int(11) NOT NULL,
  `cycle` enum('Primaire','Cem','Lycée') DEFAULT NULL,
  `moyenne` decimal(5,2) NOT NULL,
  `status` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `enseignantId` int(11) DEFAULT NULL,
  `matiereId` int(11) DEFAULT NULL,
  `periodeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_eleve_section_annee_trim` (`EleveId`,`sectionId`,`annescolaireId`,`trimestId`),
  KEY `niveauId` (`niveauId`),
  KEY `sectionId` (`sectionId`),
  KEY `annescolaireId` (`annescolaireId`),
  KEY `trimestId` (`trimestId`),
  KEY `enseignantId` (`enseignantId`),
  KEY `matiereId` (`matiereId`),
  KEY `periodeId` (`periodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `niveauxes`
--

DROP TABLE IF EXISTS `niveauxes`;
CREATE TABLE IF NOT EXISTS `niveauxes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomniveau` varchar(255) NOT NULL,
  `nomniveuarab` varchar(255) DEFAULT NULL,
  `statutInscription` varchar(255) DEFAULT NULL,
  `cycle` varchar(255) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `ordre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `niveauxes`
--

INSERT INTO `niveauxes` (`id`, `nomniveau`, `nomniveuarab`, `statutInscription`, `cycle`, `archiver`, `ordre`) VALUES
(1, 'Prés-Scolaire', 'التحضيري', 'Ouvert', 'Primaire', 0, '0'),
(3, '1 ère Année', 'السنة الأولى', 'Ouvert', 'Primaire', 0, '1'),
(5, '2 ème Année', 'السنة الثانية', 'Ouvert', 'Primaire', 0, '2'),
(6, '3 ème Année', 'السنة الثالثة', 'Ouvert', 'Primaire', 0, '3'),
(7, '4 ème Année', 'السنة الرابعة', 'Ouvert', 'Primaire', 0, '4'),
(8, '5 ème Année', 'السنة الخامسة', 'Ouvert', 'Primaire', 0, '5');

-- --------------------------------------------------------

--
-- Structure de la table `niveauxmatieres`
--

DROP TABLE IF EXISTS `niveauxmatieres`;
CREATE TABLE IF NOT EXISTS `niveauxmatieres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `niveauId` int(11) NOT NULL,
  `matiereId` int(11) NOT NULL,
  `enseignantId` int(11) DEFAULT NULL,
  `duree` int(11) DEFAULT NULL,
  `dureeseance` int(11) DEFAULT NULL,
  `nombreseanceparjour` int(11) DEFAULT NULL,
  `preference` varchar(255) DEFAULT NULL,
  `matieresConfessions` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `enseignantId` (`enseignantId`),
  KEY `NiveauxMatieres_matiereId_niveauId_unique` (`niveauId`) USING BTREE,
  KEY `NiveauxMatieres_matiereId_enseignantId_unique` (`matiereId`,`enseignantId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `niveauxmatieres`
--

INSERT INTO `niveauxmatieres` (`id`, `niveauId`, `matiereId`, `enseignantId`, `duree`, `dureeseance`, `nombreseanceparjour`, `preference`, `matieresConfessions`) VALUES
(49, 5, 4, NULL, 240, 60, 1, 'Uniquement La matiné', NULL),
(50, 5, 21, NULL, 45, 45, 1, 'Uniquement La matiné', NULL),
(51, 5, 22, NULL, 45, 45, 1, 'Uniquement La matiné', NULL),
(52, 5, 1, NULL, 90, 45, 1, 'Moitié Moitié', NULL),
(53, 5, 7, NULL, 90, 45, 1, 'Uniquement L\'après-midi', NULL),
(54, 5, 14, NULL, 240, 60, 1, 'Uniquement La matiné', NULL),
(55, 5, 15, NULL, 60, 30, 1, 'Plus Grand Moitié La Matin', NULL),
(56, 5, 13, NULL, 30, 30, 1, 'Plus Grand Moitié La Matin', NULL),
(57, 5, 20, NULL, 90, 45, 1, 'Uniquement L\'après-midi', NULL),
(58, 5, 19, NULL, 60, 30, 1, 'Uniquement La matiné', NULL),
(59, 5, 18, NULL, 45, 45, 1, 'Uniquement L\'après-midi', NULL),
(60, 5, 16, NULL, 105, 45, 1, 'Uniquement La matiné', NULL),
(61, 5, 12, NULL, 30, 30, 1, 'Uniquement La matiné', NULL),
(62, 5, 23, NULL, 75, 45, 1, 'Uniquement L\'après-midi', NULL),
(63, 5, 24, NULL, 60, 30, 1, 'Uniquement L\'après-midi', NULL),
(64, 6, 25, NULL, 210, 60, 1, 'Uniquement L\'après-midi', NULL),
(65, 6, 21, NULL, 30, 30, 1, 'Uniquement La matiné', NULL),
(66, 6, 22, NULL, 45, 45, 1, 'Moitié Moitié', NULL),
(67, 6, 14, NULL, 180, 45, 1, 'Moitié Moitié', NULL),
(68, 6, 16, NULL, 30, 30, 1, 'Moitié Moitié', NULL),
(69, 6, 20, NULL, 30, 30, 1, 'Uniquement L\'après-midi', NULL),
(70, 6, 26, NULL, 120, 60, 1, 'Moitié Moitié', NULL),
(71, 6, 4, NULL, 300, 60, 1, 'Uniquement La matiné', NULL),
(72, 6, 1, NULL, 75, 45, 1, 'Moitié Moitié', NULL),
(73, 6, 12, NULL, 60, 30, 1, 'Uniquement La matiné', NULL),
(74, 6, 18, NULL, 45, 45, 1, 'Uniquement L\'après-midi', NULL),
(75, 6, 13, NULL, 30, 30, 1, 'Uniquement La matiné', NULL),
(76, 6, 34, NULL, 60, 30, 1, 'Uniquement L\'après-midi', NULL),
(77, 6, 7, NULL, 60, 60, 1, 'Uniquement L\'après-midi', NULL),
(78, 6, 32, NULL, 45, 45, 1, 'Uniquement La matiné', NULL),
(79, 6, 29, NULL, 45, 45, 1, 'Uniquement L\'après-midi', NULL),
(80, 7, 4, NULL, 240, 60, 1, 'Uniquement La matiné', NULL),
(81, 7, 1, NULL, 120, 60, 1, 'Uniquement La matiné', NULL),
(82, 7, 25, NULL, 165, 60, 1, 'Uniquement L\'après-midi', NULL),
(83, 7, 21, NULL, 30, 30, 1, 'Uniquement La matiné', NULL),
(84, 7, 22, NULL, 60, 30, 1, 'Moitié Moitié', NULL),
(85, 7, 14, NULL, 105, 45, 1, 'Uniquement La matiné', NULL),
(86, 7, 26, NULL, 90, 45, 1, 'Moitié Moitié', NULL),
(87, 7, 27, NULL, 150, 45, 1, 'Moitié Moitié', NULL),
(88, 7, 28, NULL, 45, 45, 1, 'Uniquement L\'après-midi', NULL),
(89, 7, 7, NULL, 60, 60, 1, 'Uniquement L\'après-midi', NULL),
(90, 7, 29, NULL, 30, 30, 1, 'Uniquement L\'après-midi', NULL),
(91, 7, 13, NULL, 45, 45, 1, 'Uniquement La matiné', NULL),
(92, 7, 30, NULL, 45, 45, 1, 'Uniquement La matiné', NULL),
(93, 7, 33, NULL, 30, 30, 1, 'Uniquement La matiné', NULL),
(94, 7, 12, NULL, 45, 45, 1, 'Uniquement La matiné', NULL),
(95, 7, 16, NULL, 75, 45, 1, 'Uniquement La matiné', NULL),
(96, 7, 31, NULL, 45, 45, 1, 'Uniquement La matiné', NULL),
(97, 7, 34, NULL, 75, 45, 1, 'Uniquement L\'après-midi', NULL),
(98, 7, 18, NULL, 45, 45, 1, 'Uniquement L\'après-midi', NULL),
(99, 7, 20, NULL, 30, 30, 1, 'Uniquement L\'après-midi', NULL),
(117, 3, 21, NULL, 30, 30, 1, 'Uniquement La matiné', NULL),
(118, 3, 22, NULL, 30, 30, 1, 'Uniquement La matiné', NULL),
(119, 3, 13, NULL, 75, 45, 1, 'Uniquement La matiné', NULL),
(120, 3, 4, NULL, 240, 60, 1, 'Uniquement La matiné', NULL),
(121, 3, 14, NULL, 180, 60, 1, 'Uniquement La matiné', NULL),
(122, 3, 1, NULL, 90, 30, 1, 'Uniquement La matiné', NULL),
(123, 3, 20, NULL, 90, 45, 1, 'Uniquement L\'après-midi', NULL),
(124, 3, 15, NULL, 60, 30, 1, 'Moitié Moitié', NULL),
(125, 3, 16, NULL, 90, 45, 1, 'Uniquement La matiné', NULL),
(126, 3, 12, NULL, 45, 45, 1, 'Uniquement La matiné', NULL),
(127, 3, 7, NULL, 75, 45, 1, 'Uniquement L\'après-midi', NULL),
(128, 3, 17, NULL, 105, 45, 1, 'Uniquement L\'après-midi', NULL),
(129, 3, 18, NULL, 45, 45, 1, 'Uniquement L\'après-midi', NULL),
(130, 3, 19, NULL, 75, 45, 1, 'Uniquement L\'après-midi', NULL),
(131, 1, 1, NULL, 60, 30, 1, 'Plus Grand Moitié La Matin', NULL),
(132, 1, 2, NULL, 90, 30, 1, 'Uniquement La matiné', NULL),
(133, 1, 3, NULL, 90, 45, 1, 'Plus Grand Moitié La Matin', NULL),
(134, 1, 4, NULL, 220, 60, 1, 'Uniquement La matiné', NULL),
(135, 1, 5, NULL, 105, 45, 1, 'Moitié Moitié', NULL),
(136, 1, 6, NULL, 195, 60, 1, 'Uniquement La matiné', NULL),
(137, 1, 7, NULL, 150, 75, 1, 'Uniquement L\'après-midi', NULL),
(138, 1, 8, NULL, 105, 45, 1, 'Moitié Moitié', NULL),
(139, 1, 9, NULL, 75, 30, 1, 'Moitié Moitié', NULL),
(140, 1, 10, NULL, 75, 30, 1, 'Uniquement L\'après-midi', NULL),
(141, 1, 11, NULL, 90, 45, 1, 'Uniquement L\'après-midi', NULL),
(142, 1, 12, NULL, 60, 30, 1, 'Uniquement La matiné', NULL),
(143, 8, 21, NULL, 30, 30, 1, 'Uniquement La matiné', NULL),
(144, 8, 22, NULL, 30, 30, 1, 'Uniquement La matiné', NULL),
(145, 8, 1, NULL, 90, 45, 1, 'Uniquement La matiné', NULL),
(146, 8, 4, NULL, 180, 60, 1, 'Uniquement La matiné', NULL),
(147, 8, 25, NULL, 165, 45, 1, 'Uniquement L\'après-midi', NULL),
(148, 8, 14, NULL, 165, 45, 1, 'Moitié Moitié', NULL),
(149, 8, 16, NULL, 45, 45, 1, 'Uniquement La matiné', NULL),
(150, 8, 27, NULL, 150, 45, 1, 'Moitié Moitié', NULL),
(151, 8, 13, NULL, 60, 30, 1, 'Uniquement La matiné', NULL),
(152, 8, 29, NULL, 75, 45, 1, 'Uniquement L\'après-midi', NULL),
(153, 8, 30, NULL, 45, 45, 1, 'Uniquement La matiné', NULL),
(154, 8, 28, NULL, 30, 30, 1, 'Uniquement La matiné', NULL),
(155, 8, 31, NULL, 45, 45, 1, 'Uniquement La matiné', NULL),
(156, 8, 7, NULL, 75, 75, 1, 'Uniquement L\'après-midi', NULL),
(157, 8, 34, NULL, 60, 30, 1, 'Uniquement L\'après-midi', NULL),
(158, 8, 20, NULL, 45, 45, 1, 'Uniquement L\'après-midi', NULL),
(159, 8, 18, NULL, 30, 30, 1, 'Uniquement L\'après-midi', NULL),
(160, 8, 12, NULL, 45, 45, 1, 'Uniquement La matiné', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `notes`
--

DROP TABLE IF EXISTS `notes`;
CREATE TABLE IF NOT EXISTS `notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `EleveId` int(11) NOT NULL,
  `matiereId` int(11) NOT NULL,
  `enseignantId` int(11) NOT NULL,
  `sectionId` int(11) NOT NULL,
  `annescolaireId` int(11) NOT NULL,
  `trimestId` int(11) NOT NULL,
  `expression_orale` float DEFAULT NULL,
  `lecture` float DEFAULT NULL,
  `production_ecrite` float DEFAULT NULL,
  `moyenne_eval` float DEFAULT NULL,
  `eval_continue` float DEFAULT NULL,
  `devoir1` float DEFAULT NULL,
  `devoir2` float DEFAULT NULL,
  `travaux_pratiques` float DEFAULT NULL,
  `moyenne_devoirs` float DEFAULT NULL,
  `examens` float DEFAULT NULL,
  `moyenne` float DEFAULT NULL,
  `coefficient` float DEFAULT NULL,
  `moyenne_total` float DEFAULT NULL,
  `remarque` varchar(255) DEFAULT NULL,
  `calcul` float DEFAULT NULL,
  `grandeurs_mesures` float DEFAULT NULL,
  `organisation_donnees` float DEFAULT NULL,
  `espace_geometrie` float DEFAULT NULL,
  `moyenne_eval_math` float DEFAULT NULL,
  `examens_math` float DEFAULT NULL,
  `moyenne_math` float DEFAULT NULL,
  `remarque_math` varchar(255) DEFAULT NULL,
  `cycle` enum('Primaire','Cem','Lycée') DEFAULT NULL,
  `exemption` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `periodeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `notes__eleve_id_matiere_id_section_id_periode_id` (`EleveId`,`matiereId`,`sectionId`,`periodeId`),
  KEY `matiereId` (`matiereId`),
  KEY `enseignantId` (`enseignantId`),
  KEY `sectionId` (`sectionId`),
  KEY `annescolaireId` (`annescolaireId`),
  KEY `trimestId` (`trimestId`),
  KEY `periodeId` (`periodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `statut` varchar(255) NOT NULL,
  `ecoleId` int(11) NOT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `parents`
--

DROP TABLE IF EXISTS `parents`;
CREATE TABLE IF NOT EXISTS `parents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `emailparent` varchar(255) DEFAULT NULL,
  `telephoneparent` varchar(255) DEFAULT NULL,
  `travailleparent` varchar(255) DEFAULT NULL,
  `situation_familiale` enum('Marié','Divorcé','Célibataire','Mariée','Divorcée','') DEFAULT NULL,
  `nombreenfant` int(11) DEFAULT NULL,
  `typerole` enum('Père','Mère','Tuteur') DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `parents`
--

INSERT INTO `parents` (`id`, `emailparent`, `telephoneparent`, `travailleparent`, `situation_familiale`, `nombreenfant`, `typerole`, `archiver`, `createdAt`, `updatedAt`, `deletedAt`, `userId`) VALUES
(21, 'parnet2@gmail.com', '056476837', 'chomage', 'Marié', 2, 'Père', 0, '2025-04-20 09:39:21', '2025-04-22 08:31:30', NULL, 21),
(29, 'parents1@gmail.com', '07635465', 'enseignante', 'Marié', 2, 'Mère', 0, '2025-04-20 09:30:37', '2025-04-22 08:22:46', NULL, 29),
(30, 'AdminEcoleB1@gmail.com', '0799987888', 'enseignante ', 'Marié', 2, 'Mère', 0, '2025-04-28 07:10:45', '2025-04-28 07:10:45', NULL, 30),
(31, 'karim@gmail.com', '123456789', 'enseignant', 'Marié', 2, 'Père', 0, '2025-04-28 07:10:45', '2025-04-28 07:10:45', NULL, 31),
(36, 'karim@gmail.com', '012345678', 'Entrepreneur ', 'Marié', 4, 'Père', 0, '2025-04-28 08:24:04', '2025-04-28 08:24:04', NULL, 36),
(42, 'karim@gmail.com', '012345678', 'Entrepreneur ', 'Marié', 4, 'Père', 0, '2025-04-28 08:27:34', '2025-04-28 08:27:34', NULL, 42),
(49, 'aminekarim@gmail.com', '0123456789', 'responsable', 'Marié', 6, 'Père', 0, '2025-04-29 13:29:12', '2025-04-29 13:29:12', NULL, 49),
(50, 'B@GMAIL;COM', '0123456789', 'RESPONSABLE', 'Marié', 3, 'Mère', 0, '2025-04-29 13:29:12', '2025-04-29 13:29:12', NULL, 50),
(54, 'sewinga2023z@gmail.com', '0123456789', 'enseignant', 'Marié', 2, 'Père', 0, '2025-05-04 07:37:55', '2025-05-04 07:37:55', NULL, 54),
(55, 'sewinga2023z@gmail.com', 'à123456789', 'enseignante ', 'Marié', 4, 'Mère', 0, '2025-05-04 07:37:55', '2025-05-04 07:37:55', NULL, 55),
(61, 'said@gmail.com', '012345678', 'responsable', '', 2, 'Tuteur', 0, '2025-05-05 07:47:38', '2025-05-05 07:47:38', NULL, NULL),
(64, 'gdggdg@gmail.com', '012345678', 'responsable', '', 2, 'Tuteur', 0, '2025-05-05 07:50:04', '2025-05-05 07:50:04', NULL, 64);

-- --------------------------------------------------------

--
-- Structure de la table `periodenotes`
--

DROP TABLE IF EXISTS `periodenotes`;
CREATE TABLE IF NOT EXISTS `periodenotes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` tinyint(1) DEFAULT 0,
  `dateDebutPeriode` datetime DEFAULT NULL,
  `dateFinPeriode` datetime DEFAULT NULL,
  `ecoleId` int(11) DEFAULT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`),
  KEY `ecoleeId` (`ecoleeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `periodepaies`
--

DROP TABLE IF EXISTS `periodepaies`;
CREATE TABLE IF NOT EXISTS `periodepaies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `dateDebut` datetime NOT NULL,
  `dateFin` datetime NOT NULL,
  `statut` varchar(255) NOT NULL DEFAULT '',
  `ecoleId` int(11) NOT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `ecoleId` (`ecoleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `periodes`
--

DROP TABLE IF EXISTS `periodes`;
CREATE TABLE IF NOT EXISTS `periodes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cycleId` int(11) NOT NULL,
  `type` enum('matin','apres_midi','dejeuner') NOT NULL,
  `heureDebut` time NOT NULL,
  `heureFin` time NOT NULL,
  `sousPeriodes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`sousPeriodes`)),
  `label` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `periodes_cycle_id_type` (`cycleId`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `periodes`
--

INSERT INTO `periodes` (`id`, `cycleId`, `type`, `heureDebut`, `heureFin`, `sousPeriodes`, `label`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'matin', '08:00:00', '11:15:00', '[{\"debut\":\"08:00\",\"fin\":\"08:30\",\"label\":\"\"},{\"debut\":\"08:30\",\"fin\":\"09:00\",\"label\":\"\"},{\"debut\":\"09:00\",\"fin\":\"09:30\",\"label\":\"\"},{\"debut\":\"09:30\",\"fin\":\"09:45\",\"label\":\"Pause\"},{\"debut\":\"09:45\",\"fin\":\"10:30\",\"label\":\"\"},{\"debut\":\"10:30\",\"fin\":\"11:15\",\"label\":\"\"}]', NULL, '2025-05-14 14:23:29', '2025-05-14 14:23:29'),
(2, 1, 'dejeuner', '12:00:00', '13:00:00', '[]', 'Déjeuner', '2025-05-14 14:23:29', '2025-05-14 14:23:29'),
(3, 1, 'apres_midi', '13:00:00', '16:00:00', '[{\"debut\":\"13:00\",\"fin\":\"13:30\",\"label\":\"\"},{\"debut\":\"13:30\",\"fin\":\"14:00\",\"label\":\"\"},{\"debut\":\"14:00\",\"fin\":\"14:30\",\"label\":\"\"},{\"debut\":\"14:30\",\"fin\":\"15:15\",\"label\":\"\"},{\"debut\":\"15:15\",\"fin\":\"16:00\",\"label\":\"\"}]', NULL, '2025-05-14 14:23:29', '2025-05-14 14:23:29');

-- --------------------------------------------------------

--
-- Structure de la table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Administration-Gestion élève-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(2, 'Administration-Gestion élève-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(3, 'Administration-Gestion élève-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(4, 'Administration-Gestion élève-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(5, 'Administration-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(6, 'Administration-Gestion parents-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(7, 'Administration-Gestion parents-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(8, 'Administration-Gestion parents-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(9, 'Administration-Gestion parents-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(10, 'Administration-Gestion enseignant-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(11, 'Administration-Gestion enseignant-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(12, 'Administration-Gestion enseignant-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(13, 'Administration-Gestion enseignant-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(14, 'Administration-Gestion privilège-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(15, 'Administration-Gestion privilège-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(16, 'Administration-Gestion privilège-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(17, 'Administration-Gestion privilège-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(18, 'Academique-Trimestre-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(19, 'Academique-Trimestre-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(20, 'Academique-Trimestre-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(21, 'Academique-Trimestre-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(22, 'Academique-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(23, 'Academique-Salle-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(24, 'Academique-Salle-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(25, 'Academique-Salle-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(26, 'Academique-Salle-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(27, 'Academique-Niveaux-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(28, 'Academique-Niveaux-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(29, 'Academique-Niveaux-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(30, 'Academique-Niveaux-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(31, 'Academique-Matière-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(32, 'Academique-Matière-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(33, 'Academique-Matière-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(34, 'Academique-Matière-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(35, 'Academique-Sections-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(36, 'Academique-Sections-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(37, 'Academique-Sections-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(38, 'Academique-Sections-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(39, 'Academique-Gestion emploi de temps-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(40, 'Academique-Gestion emploi de temps-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(41, 'Academique-Gestion emploi de temps-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(42, 'Academique-Gestion emploi de temps-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(43, 'Ressources Humaines-Gestion des employées-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(44, 'Ressources Humaines-Gestion des employées-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(45, 'Ressources Humaines-Gestion des employées-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(46, 'Ressources Humaines-Gestion des employées-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(47, 'Ressources Humaines-Gestion demande de congé-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(48, 'Ressources Humaines-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(49, 'Ressources Humaines-Gestion demande de congé-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(50, 'Ressources Humaines-Gestion demande de congé-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(51, 'Ressources Humaines-Gestion demande de congé-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(52, 'Ressources Humaines-Gestion pointage-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(53, 'Ressources Humaines-Gestion pointage-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(54, 'Ressources Humaines-Gestion pointage-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(55, 'Ressources Humaines-Gestion pointage-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(56, 'Ressources Humaines-gestion attestation-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(57, 'Ressources Humaines-gestion attestation-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(58, 'Ressources Humaines-gestion attestation-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(59, 'Ressources Humaines-gestion attestation-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(60, 'Ressources Humaines-rapports pointage-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(61, 'Ressources Humaines-rapports pointage-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(62, 'Ressources Humaines-rapports pointage-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(63, 'Ressources Humaines-rapports pointage-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(64, 'Ressources Humaines-gestion de la paye-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(65, 'Ressources Humaines-gestion de la paye-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(66, 'Ressources Humaines-gestion de la paye-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(67, 'Ressources Humaines-gestion de la paye-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(68, 'Transport-Suivi les bus-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(69, 'Transport-Suivi les bus-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(70, 'Transport-Suivi les bus-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(71, 'Transport-Suivi les bus-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(72, 'Transport-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(73, 'Communication-Gestion des annonces-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(74, 'Communication-Gestion des annonces-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(75, 'Communication-Gestion des annonces-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(76, 'Communication-Gestion des annonces-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(77, 'Communication-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(78, 'Communication-Envoi de notifications-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(79, 'Communication-Envoi de notifications-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(80, 'Communication-Envoi de notifications-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(81, 'Communication-Envoi de notifications-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(82, 'Communication-Messagerie interne-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(83, 'Communication-Messagerie interne-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(84, 'Communication-Messagerie interne-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(85, 'Communication-Messagerie interne-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(86, 'Communication-Envoie d\'email-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(87, 'Communication-Envoie d\'email-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(88, 'Communication-Envoie d\'email-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(89, 'Communication-Envoie d\'email-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(90, 'Parametre-Gestion écoles-Ajouter', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(91, 'Parametre-Gestion écoles-Modifier', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(92, 'Parametre-Gestion écoles-Supprimer', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(93, 'Parametre-Gestion écoles-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(94, 'Parametre-Voir', '2025-05-04 10:23:23', '2025-05-04 10:23:23'),
(95, 'Statistique-Voir', '2025-05-04 10:23:53', '2025-05-04 10:23:53'),
(96, 'Elearning-Voir', '2025-05-04 10:23:53', '2025-05-04 10:23:53'),
(97, 'Bibliothèque-Voir', '2025-05-04 10:23:53', '2025-05-04 10:23:53'),
(98, 'Comptabilité-Voir', '2025-05-04 10:23:53', '2025-05-04 10:23:53'),
(99, 'Cantine scolaire-Voir', '2025-05-04 10:23:53', '2025-05-04 10:23:53'),
(100, 'Gestion Evaluation & bulletin-Voir', '2025-05-04 10:23:53', '2025-05-04 10:23:53');

-- --------------------------------------------------------

--
-- Structure de la table `planningpaiements`
--

DROP TABLE IF EXISTS `planningpaiements`;
CREATE TABLE IF NOT EXISTS `planningpaiements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ContratId` int(11) NOT NULL,
  `codePP` varchar(255) NOT NULL,
  `date_echeance` datetime NOT NULL,
  `montant_echeance` decimal(15,2) NOT NULL,
  `montant_restant` decimal(15,2) DEFAULT NULL,
  `etat_paiement` varchar(255) DEFAULT 'non payé',
  `date_paiement` datetime DEFAULT NULL,
  `mode_paiement` varchar(255) DEFAULT NULL,
  `notification` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ContratId` (`ContratId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `pointages`
--

DROP TABLE IF EXISTS `pointages`;
CREATE TABLE IF NOT EXISTS `pointages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `statut` varchar(255) DEFAULT NULL,
  `heuresupP` float DEFAULT NULL,
  `HeureEMP` time DEFAULT NULL,
  `HeureSMP` time DEFAULT NULL,
  `HeureEAMP` time DEFAULT NULL,
  `HeureSAMP` time DEFAULT NULL,
  `datedu` datetime DEFAULT NULL,
  `datea` datetime DEFAULT NULL,
  `justificationab` varchar(255) DEFAULT NULL,
  `justificationret` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  `latlogEMP` varchar(255) DEFAULT NULL,
  `latlogSMP` varchar(255) DEFAULT NULL,
  `latlogEAMP` varchar(255) DEFAULT NULL,
  `latlogSAMP` varchar(255) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `type_pointage` varchar(255) DEFAULT NULL,
  `IdHeureSup` int(11) DEFAULT NULL,
  `employe_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IdHeureSup` (`IdHeureSup`),
  KEY `employe_id` (`employe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `pointages`
--

INSERT INTO `pointages` (`id`, `statut`, `heuresupP`, `HeureEMP`, `HeureSMP`, `HeureEAMP`, `HeureSAMP`, `datedu`, `datea`, `justificationab`, `justificationret`, `date`, `latlogEMP`, `latlogSMP`, `latlogEAMP`, `latlogSAMP`, `archiver`, `type_pointage`, `IdHeureSup`, `employe_id`, `createdAt`, `updatedAt`) VALUES
(1, 'absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-15', NULL, NULL, NULL, NULL, 0, 'auto', NULL, 5, '2025-05-15 10:46:00', '2025-05-15 10:46:00'),
(2, 'absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-15', NULL, NULL, NULL, NULL, 0, 'auto', NULL, 6, '2025-05-15 10:46:00', '2025-05-15 10:46:00'),
(3, 'absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-15', NULL, NULL, NULL, NULL, 0, 'auto', NULL, 11, '2025-05-15 10:46:00', '2025-05-15 10:46:00'),
(4, 'absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-15', NULL, NULL, NULL, NULL, 0, 'auto', NULL, 13, '2025-05-15 10:46:00', '2025-05-15 10:46:00'),
(5, 'absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-15', NULL, NULL, NULL, NULL, 0, 'auto', NULL, 66, '2025-05-15 10:46:00', '2025-05-15 10:46:00'),
(6, 'absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-15', NULL, NULL, NULL, NULL, 0, 'auto', NULL, 67, '2025-05-15 10:46:00', '2025-05-15 10:46:00'),
(7, 'absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-15', NULL, NULL, NULL, NULL, 0, 'auto', NULL, 68, '2025-05-15 10:46:00', '2025-05-15 10:46:00'),
(8, 'absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-15', NULL, NULL, NULL, NULL, 0, 'auto', NULL, 69, '2025-05-15 10:46:00', '2025-05-15 10:46:00'),
(9, 'absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-15', NULL, NULL, NULL, NULL, 0, 'auto', NULL, 70, '2025-05-15 10:46:01', '2025-05-15 10:46:01'),
(10, 'absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-15', NULL, NULL, NULL, NULL, 0, 'auto', NULL, 71, '2025-05-15 10:46:01', '2025-05-15 10:46:01');

-- --------------------------------------------------------

--
-- Structure de la table `postes`
--

DROP TABLE IF EXISTS `postes`;
CREATE TABLE IF NOT EXISTS `postes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `poste` varchar(255) NOT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `postes`
--

INSERT INTO `postes` (`id`, `poste`, `archiver`, `createdAt`, `updatedAt`) VALUES
(1, 'Enseignant', 0, '2025-04-20 09:35:30', '2025-04-20 09:35:30'),
(2, 'responsable', 0, '2025-04-20 12:27:30', '2025-04-20 12:27:30'),
(3, 'secrétaire', 0, '2025-04-20 12:27:37', '2025-04-20 12:27:37'),
(4, 'chef', 1, '2025-04-20 12:27:41', '2025-05-14 09:25:08'),
(5, 'chesousecoleA', 0, '2025-04-22 19:54:16', '2025-04-22 19:54:16');

-- --------------------------------------------------------

--
-- Structure de la table `presences`
--

DROP TABLE IF EXISTS `presences`;
CREATE TABLE IF NOT EXISTS `presences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eleveId` int(11) NOT NULL,
  `enseignantId` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `matin` enum('present','retard','absent') NOT NULL DEFAULT 'present',
  `apres_midi` enum('present','retard','absent') NOT NULL DEFAULT 'present',
  `heure` time DEFAULT NULL,
  `justificationMatin` varchar(255) DEFAULT NULL,
  `justificationApresMidi` varchar(255) DEFAULT NULL,
  `justificationTextMatin` text DEFAULT NULL,
  `justificationTextApresMidi` text DEFAULT NULL,
  `fichierJustification` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `presences_eleve_id_date` (`eleveId`,`date`),
  KEY `enseignantId` (`enseignantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `primes`
--

DROP TABLE IF EXISTS `primes`;
CREATE TABLE IF NOT EXISTS `primes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `type_prime` varchar(255) NOT NULL,
  `montant` float NOT NULL,
  `montantType` varchar(255) NOT NULL DEFAULT 'montant',
  `identifiant_special` varchar(255) NOT NULL,
  `prime_cotisable` tinyint(1) DEFAULT 0,
  `prime_imposable` tinyint(1) DEFAULT 0,
  `deduire` tinyint(1) DEFAULT 0,
  `ecoleId` int(11) NOT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  UNIQUE KEY `Prime_Employes_EmployeId_PrimeId_unique` (`PrimeId`,`EmployeId`),
  KEY `EmployeId` (`EmployeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `remarques`
--

DROP TABLE IF EXISTS `remarques`;
CREATE TABLE IF NOT EXISTS `remarques` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `remarque` varchar(255) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `revenus`
--

DROP TABLE IF EXISTS `revenus`;
CREATE TABLE IF NOT EXISTS `revenus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `cause_ar` varchar(255) NOT NULL,
  `cause_fr` varchar(255) NOT NULL,
  `montant` decimal(15,2) NOT NULL,
  `date` datetime NOT NULL,
  `par_ar` varchar(255) NOT NULL,
  `par_fr` varchar(255) NOT NULL,
  `mode_paie` varchar(255) NOT NULL,
  `remarque` varchar(255) NOT NULL,
  `fichier` varchar(255) DEFAULT NULL,
  `typeId` int(11) NOT NULL,
  `ecoleId` int(11) NOT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `typeId` (`typeId`),
  KEY `ecoleId` (`ecoleId`),
  KEY `ecoleeId` (`ecoleeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Administrateur', '2025-05-04 10:04:34', '2025-05-04 10:04:34'),
(3, 'AdminPrincipal', '2025-05-04 10:16:59', '2025-05-04 10:16:59'),
(4, 'Admin', '2025-05-04 10:28:18', '2025-05-04 10:28:18'),
(5, 'Employé', '2025-04-20 09:37:02', '2025-04-20 09:37:02'),
(6, 'Parent', '2025-04-28 07:10:45', '2025-04-28 07:10:45'),
(8, 'Elève', '2025-04-28 07:10:45', '2025-04-28 07:10:45');

-- --------------------------------------------------------

--
-- Structure de la table `salles`
--

DROP TABLE IF EXISTS `salles`;
CREATE TABLE IF NOT EXISTS `salles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salle` varchar(255) DEFAULT NULL,
  `sallearab` varchar(255) DEFAULT NULL,
  `capacité` int(11) DEFAULT NULL,
  `remarque` varchar(255) DEFAULT NULL,
  `ecoleId` int(11) DEFAULT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`),
  KEY `ecoleeId` (`ecoleeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sections`
--

DROP TABLE IF EXISTS `sections`;
CREATE TABLE IF NOT EXISTS `sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classe` varchar(255) DEFAULT NULL,
  `classearab` varchar(255) DEFAULT NULL,
  `niveaunum` varchar(255) DEFAULT NULL,
  `numregime` varchar(255) DEFAULT NULL,
  `niveauxId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `niveauxId` (`niveauxId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sections`
--

INSERT INTO `sections` (`id`, `classe`, `classearab`, `niveaunum`, `numregime`, `niveauxId`, `archiver`) VALUES
(1, 'Prés-Scolaire', ' التحضيري', 'تحضيري', '1', 1, 0),
(2, '1 èr Année A', 'السنة الأولى أ', 'أولى ابتدائي', '2', 3, 0),
(3, '2 ème Année A', 'السنة الثانية أ', 'ثانية ابتدائي', '3', 5, 0),
(4, '3 èr Année A', 'السنة الثالثة', 'ثالثة ابتدائي', '4', 6, 0),
(5, '4 ème Année A', 'السنة الرابعة أ', 'رابعة ابتدائي', '5', 7, 0),
(6, '5 ème Année A', 'السنة الخامسة', 'خامسة ابتدائي', '6', 8, 0);

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service` varchar(255) NOT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `services`
--

INSERT INTO `services` (`id`, `service`, `archiver`, `createdAt`, `updatedAt`) VALUES
(1, 'A', 0, '2025-04-20 09:35:41', '2025-04-20 09:35:41'),
(2, 'RH', 0, '2025-04-20 12:27:49', '2025-04-20 12:27:49'),
(3, 'Comptabilité', 1, '2025-04-20 12:27:58', '2025-05-14 09:25:15'),
(4, 'servicesousecoelA', 0, '2025-04-22 19:55:29', '2025-04-22 19:55:29');

-- --------------------------------------------------------

--
-- Structure de la table `travailrendus`
--

DROP TABLE IF EXISTS `travailrendus`;
CREATE TABLE IF NOT EXISTS `travailrendus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `devoirId` int(11) DEFAULT NULL,
  `eleveId` int(11) NOT NULL,
  `fichier` varchar(255) NOT NULL,
  `dateSoumission` datetime DEFAULT NULL,
  `note` float DEFAULT NULL,
  `commentaire` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `devoirId` (`devoirId`),
  KEY `eleveId` (`eleveId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `trimests`
--

DROP TABLE IF EXISTS `trimests`;
CREATE TABLE IF NOT EXISTS `trimests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) DEFAULT NULL,
  `titre_ar` varchar(255) DEFAULT NULL,
  `datedebut` datetime DEFAULT NULL,
  `datefin` datetime DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `trimests`
--

INSERT INTO `trimests` (`id`, `titre`, `titre_ar`, `datedebut`, `datefin`, `archiver`) VALUES
(1, '1 ér trimest', 'الفصل الأول', '2024-09-01 00:00:00', '2024-12-19 00:00:00', 0),
(2, '2 ème Trimeste ', 'الفصل الثاني', '2025-01-05 00:00:00', '2025-03-20 00:00:00', 0),
(3, '3 ème Trimeste ', 'الفصل الثالث', '2025-04-06 00:00:00', '2025-05-30 00:00:00', 0);

-- --------------------------------------------------------

--
-- Structure de la table `typedepenses`
--

DROP TABLE IF EXISTS `typedepenses`;
CREATE TABLE IF NOT EXISTS `typedepenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `remarque` varchar(255) DEFAULT NULL,
  `ecoleId` int(11) NOT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`),
  KEY `ecoleeId` (`ecoleeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `typerevenues`
--

DROP TABLE IF EXISTS `typerevenues`;
CREATE TABLE IF NOT EXISTS `typerevenues` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `remarque` varchar(255) DEFAULT NULL,
  `ecoleId` int(11) NOT NULL,
  `ecoleeId` int(11) DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ecoleId` (`ecoleId`),
  KEY `ecoleeId` (`ecoleeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `userecoles`
--

INSERT INTO `userecoles` (`id`, `userId`, `ecoleeId`) VALUES
(2, 7, 3),
(3, 8, 4);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `nom_ar` varchar(255) DEFAULT NULL,
  `prenom_ar` varchar(255) DEFAULT NULL,
  `datenaiss` datetime DEFAULT NULL,
  `lieuxnaiss` varchar(255) DEFAULT NULL,
  `lieuxnaiss_ar` varchar(255) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `adresse_ar` varchar(255) DEFAULT NULL,
  `sexe` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nationalite` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `ecoleId` int(11) DEFAULT NULL,
  `statuscompte` varchar(255) NOT NULL DEFAULT 'activer',
  `dateAD` datetime DEFAULT NULL,
  `archiver` int(11) DEFAULT 0,
  `lastLogin` datetime DEFAULT NULL,
  `lastIp` varchar(255) DEFAULT NULL,
  `lastMac` varchar(255) DEFAULT NULL,
  `lastLocation` varchar(255) DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `ecoleId` (`ecoleId`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `nom_ar`, `prenom_ar`, `datenaiss`, `lieuxnaiss`, `lieuxnaiss_ar`, `adresse`, `adresse_ar`, `sexe`, `telephone`, `email`, `nationalite`, `username`, `password`, `type`, `ecoleId`, `statuscompte`, `dateAD`, `archiver`, `lastLogin`, `lastIp`, `lastMac`, `lastLocation`, `latitude`, `longitude`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'yasmine@gmail.com', NULL, 'yasmine', '$2b$10$ThxxA6pbQMhkNlLkzuhPL.OGcqBk3K9nBwtnkQGWP7nxQkxTpUNkW', 'Administrateur', NULL, 'activer', NULL, 0, '2025-05-15 12:38:10', NULL, NULL, 'Inconnu, Inconnu', 36.754, 5.06065, '2025-05-04 10:04:34', '2025-05-15 12:38:10', NULL),
(2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'dounia@gmail.com', NULL, 'dounia', '$2b$10$R3J58BgYcpbLFVBoYKC3MOq9Mt8XJGDVhmFOemQE3N.UOhEL8XPxe', 'Administrateur', NULL, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-04 10:05:56', '2025-05-04 10:05:56', NULL),
(3, 'lesiris', 'lesiris', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0791829389', 'lesiris@gmail.com', NULL, 'Ecole@LESABN437', '$2b$10$ThxxA6pbQMhkNlLkzuhPL.OGcqBk3K9nBwtnkQGWP7nxQkxTpUNkW', 'AdminPrincipal', 1, 'activer', NULL, 0, '2025-05-14 11:03:58', NULL, NULL, 'Inconnu, Inconnu', 36.7539, 5.06081, '2025-05-04 10:16:59', '2025-05-14 11:03:58', NULL),
(4, 'colombes', 'colombes', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '076376474', 'colombes@gmail.com', NULL, 'Ecole@LESHH1880', '$2b$10$R3J58BgYcpbLFVBoYKC3MOq9Mt8XJGDVhmFOemQE3N.UOhEL8XPxe', 'AdminPrincipal', 2, 'activer', NULL, 0, '2025-05-04 10:35:28', NULL, NULL, 'Inconnu, Inconnu', 35.8202, 5.51055, '2025-05-04 10:22:25', '2025-05-04 10:35:28', NULL),
(5, 'hedadi', 'karima', 'hedadi', 'karima', '1988-12-31 00:00:00', 'bejaia', 'bejaia', 'bejaia', 'bejaia', 'Féminin', '0123445666', 'hedadikarima@gmail.com', 'DZ', 'employe@hedadikarima', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Employé', 1, 'activer', NULL, 0, '2025-04-29 13:21:19', NULL, NULL, 'Inconnu, Inconnu', 36.1628, 5.6918, '2025-04-20 09:37:02', '2025-04-29 13:21:19', NULL),
(6, 'mokhetar', 'hamid', 'mokhetar', 'hamid', '2000-01-20 00:00:00', 'bejaia', 'bejaia', 'Bejaia ', 'bejaia', 'Masculin', '01234444', 'mokhetrahamid@gmail.om', 'DZ', 'employe@mokhetrahamid', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Employé', 1, 'activer', NULL, 0, '2025-04-30 12:16:37', NULL, NULL, 'Inconnu, Inconnu', 36.754, 5.06063, '2025-04-20 09:42:48', '2025-04-30 12:16:37', NULL),
(7, 'directeur primaire', 'directeur primaire', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '076736473', 'directeurlesiris@gmail.com', NULL, 'Ecole@LESP8C936', '$2b$10$ThxxA6pbQMhkNlLkzuhPL.OGcqBk3K9nBwtnkQGWP7nxQkxTpUNkW', 'Admin', 1, 'activer', NULL, 0, '2025-05-04 10:36:59', NULL, NULL, 'Inconnu, Inconnu', 35.8202, 5.51055, '2025-05-04 10:31:59', '2025-05-04 10:36:59', NULL),
(8, 'directeur Cem', 'directeur Cem', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0770979090', 'directeurlesiris@gmail.com', NULL, 'Ecole@LESWJT281', '$2b$10$ThxxA6pbQMhkNlLkzuhPL.OGcqBk3K9nBwtnkQGWP7nxQkxTpUNkW', 'Admin', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-04 10:34:45', '2025-05-04 10:34:45', NULL),
(9, 'makbel', 'mohend', 'makbel', 'mohend', '1994-01-20 00:00:00', 'Sétif ', 'Sétif ', 'bejaia', 'bejaia', 'Masculin', '0123456789', 'makbelmohend@gmail.com', 'DZ', 'employe@makbelmohend', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Employé', 1, 'activer', NULL, 1, '2025-05-13 09:21:02', NULL, NULL, 'Inconnu, Inconnu', 36.754, 5.0608, '2025-04-20 12:31:34', '2025-05-14 09:25:08', NULL),
(10, 'amari', 'mounira', 'amari', 'mounira', '1970-01-20 00:00:00', 'Bejaia ', 'Bejaïa ', 'Bejaia', 'Bejaia', '', '0123456789', 'amarimounira@gmail.com', '', 'employe@amarimounira', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Employé', 1, 'désactiver', '2025-04-09 00:00:00', 1, '2025-04-21 11:47:21', NULL, NULL, 'Inconnu, Inconnu', 36.754, 5.06082, '2025-04-20 12:34:40', '2025-05-14 09:25:15', NULL),
(11, 'abdeli', 'sarah', 'abdeli', 'sarah', '1994-01-21 00:00:00', '', '', '', '', '', '', '', '', 'employe@as8715', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Employé', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-21 14:07:37', '2025-04-22 20:49:21', NULL),
(13, 'abdeli', 'aida', 'abdeli', 'aida', '1992-01-21 00:00:00', 'bejaia', 'bejaia', 'Bejaia', 'Bejaia', 'Féminin', '0123456789', 'abdeliaida@gmail.com', 'DZ', 'employe@abdeliaida', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Employé', 1, 'activer', NULL, 0, '2025-05-04 07:26:19', NULL, NULL, 'Inconnu, Inconnu', 36.7297, 5.04955, '2025-04-21 19:25:40', '2025-05-04 07:26:19', NULL),
(15, 'amer', 'omar', 'amer', 'omar', '1947-01-21 00:00:00', 'alger', 'alger', 'alger', 'alger', 'Masculin', '0123456789', 'ameromar@gmail.com', 'DZ', 'employe@ameromar', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Employé', 1, 'activer', NULL, 1, '2025-04-21 20:13:00', NULL, NULL, 'Inconnu, Inconnu', 36.7574, 5.06869, '2025-04-21 19:32:18', '2025-05-14 09:25:08', NULL),
(20, 'eleve1', 'eleve1', 'eleve1', 'eleve1', '2017-04-01 00:00:00', 'بجاية', NULL, 'بجاية', NULL, 'Féminin', NULL, NULL, NULL, 'Eleve@ee7648', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Eleve', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-20 09:30:37', '2025-04-22 08:22:46', NULL),
(21, 'parent2', 'parent2', NULL, NULL, '1968-04-10 00:00:00', 'bejaia', NULL, 'Bejaia', NULL, NULL, '056476837', 'parnet2@gmail.com', NULL, 'parent@pp9914', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Parent', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-20 09:39:21', '2025-04-22 08:31:30', NULL),
(22, 'eleve2', 'eleve2', NULL, NULL, '2016-04-02 00:00:00', 'bejaia', NULL, 'bejaia', NULL, 'Féminin', NULL, NULL, NULL, 'Eleve@ee5768', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Eleve', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-20 09:39:21', '2025-04-22 08:31:30', NULL),
(29, 'parent1', 'parent1', NULL, NULL, '1970-04-04 00:00:00', 'بجاية', NULL, 'Bejaia', NULL, NULL, '07635465', 'parents1@gmail.com', NULL, 'parent@pp3465', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Parent', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-20 09:30:37', '2025-04-22 08:22:46', NULL),
(30, 'mokhetar', 'hania', 'mokhetar', 'hania', '2000-01-28 00:00:00', 'alger', 'alger', 'Bejaia', '', NULL, '0799987888', 'AdminEcoleB1@gmail.com', '', 'parent@mh4259', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Parent', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-28 07:10:45', '2025-04-28 07:10:45', NULL),
(31, 'mokhetar', 'karim', 'mokhetar', 'karim', '1985-01-28 00:00:00', 'bejaia', 'bejaia', 'Bejaia', '', NULL, '123456789', 'karim@gmail.com', '', 'parent@mk4808', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Parent', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-28 07:10:45', '2025-04-28 07:10:45', NULL),
(32, 'mokhetar', 'amine', 'mokhetar', 'amine', '2011-01-28 00:00:00', 'Bejaia', 'Bejaia ', 'Bejaia', 'Bejaia', 'Masculin', NULL, NULL, 'DZ', 'Eleve@ma4412', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Eleve', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-28 07:10:45', '2025-04-28 07:10:45', NULL),
(35, 'amrani', 'karima', 'amrani', 'karima', '1999-01-01 00:00:00', 'alger', 'alger', 'Bejaia', '', NULL, '0777777', 'karima@gmail.com', '', 'parent@ak9429', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Parent', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-28 08:24:04', '2025-04-28 08:24:04', NULL),
(36, 'amrani', 'karim', 'amrani', 'karim', '1990-01-01 00:00:00', 'alger', 'alger', 'Bejaia', '', NULL, '012345678', 'karim@gmail.com', '', 'parent@ak2051', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Parent', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-28 08:24:04', '2025-04-28 08:24:04', NULL),
(41, 'amrani', 'karima', 'amrani', 'karima', '1999-01-01 00:00:00', 'alger', 'alger', 'Bejaia', '', NULL, '0777777', 'karima@gmail.com', '', 'parent@ak9', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Parent', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-28 08:27:34', '2025-04-28 08:27:34', NULL),
(42, 'amrani', 'karim', 'amrani', 'karim', '1990-01-01 00:00:00', 'alger', 'alger', 'Bejaia', '', NULL, '012345678', 'karim@gmail.com', '', 'parent@ak', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Parent', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-28 08:27:34', '2025-04-28 08:27:34', NULL),
(43, 'amine', 'karima', 'amie', 'karima', '1999-09-09 00:00:00', 'bejaia', '', 'Bejaia', '', NULL, '', '', '', 'parent@ak5355', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Parent', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-29 13:27:15', '2025-04-29 13:27:15', NULL),
(44, 'amine', 'karim', 'amine', 'karim', '1999-05-02 00:00:00', 'bejaia', 'bajiai', 'Bejaia', '', NULL, '0123456789', 'aminekarim@gmail.com', '', 'parent@ak8513', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Parent', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-29 13:27:15', '2025-04-29 13:27:15', NULL),
(49, 'amine', 'karim', 'amine', 'karim', '1999-05-02 00:00:00', 'bejaia', 'bajiai', 'Bejaia', '', NULL, '0123456789', 'aminekarim@gmail.com', '', 'parent@ak85', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Parent', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-29 13:29:12', '2025-04-29 13:29:12', NULL),
(50, 'amine', 'karima', 'amie', 'karima', '1999-09-09 00:00:00', 'bejaia', 'bejia', 'Bejaia', '', NULL, '0123456789', 'B@GMAIL;COM', '', 'parent@ak5', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Parent', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-29 13:29:12', '2025-04-29 13:29:12', NULL),
(51, 'amine', 'amine', 'amine', 'amine', '2011-02-01 00:00:00', 'bejaia', 'bejaia', 'alger', 'alger', 'Masculin', NULL, '', 'DZ', 'Eleve@aa2672', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Eleve', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-29 13:29:12', '2025-04-29 13:29:12', NULL),
(54, 'Amer', 'salim', 'omar', 'salim', '1999-02-03 00:00:00', 'bejaia', 'bejaia', '', '', NULL, '0123456789', 'ddou9477@gmail.com', '', 'parent@os2416', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Parent', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-04 07:37:55', '2025-05-04 07:37:55', NULL),
(55, 'Amer', 'salima', 'salima', 'salim', '1999-07-05 00:00:00', 'bejaia', 'bejaia', '', '', NULL, 'à123456789', 'chikh.douniaa@gmail.com', '', 'parent@ss6072', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Parent', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-04 07:37:55', '2025-05-04 07:37:55', NULL),
(56, 'Amer', 'karim', 'salim', 'salim', '2011-04-01 00:00:00', 'bejaia', 'bejaia', 'alger', 'alger', 'Masculin', NULL, '', 'DZ', 'Eleve@ss9531', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Eleve', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-04 07:37:55', '2025-05-04 07:37:55', NULL),
(64, 'rahmani', 'said', 'rahmani', 'said', '2000-05-05 00:00:00', 'alger', 'alger', '', '', NULL, '012345678', 'ddou@gmail.com', '', 'parent@rs2613', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Parent', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-05 07:50:04', '2025-05-05 07:50:04', NULL),
(65, 'said', 'mokhetar', 'said', 'said', '2014-02-02 00:00:00', 'bejaia', 'bejaia', 'bejaia', 'bejaia', 'Féminin', NULL, NULL, 'DZ', 'Eleve@ss1312', '$2b$10$0QijibOzKpkfST3HqX5WtedQRy/CfAKtgShpvThM6/XTYzdrs3xK2', 'Eleve', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-05 07:50:04', '2025-05-05 07:50:04', NULL),
(66, 'karim', 'azoug', 'karim', 'azoug', '2025-05-08 00:00:00', 'bejaia', 'bejaia', 'bejaia', 'bejaia', 'Masculin', '0794286408', 'karim@gmail.com', 'DZ', 'employe@ka1930', '$2b$10$CjEvFHrXiA7IR1C0vP.CRufi/43gdVN9/72pKL36E529TCf.5dGyu', 'Employé', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-14 13:31:51', '2025-05-14 13:31:51', NULL),
(67, 'kamel', 'izem', 'kamel', 'izem', '1969-05-22 00:00:00', 'feraoun', 'feraoun', 'bejaia', 'bejaia', 'Féminin', '0770979098', 'kamel@gmail.com', 'DZ', 'employe@ki9477', '$2b$10$44FZUsqNsM.df9mIhJTlgOR5/0L55PKU..Ov3ZaXZvfQ.fAmH2Rn.', 'Employé', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-14 13:35:33', '2025-05-14 13:35:33', NULL),
(68, 'halim', 'heddad', 'halim', 'heddad', '1975-05-23 00:00:00', 'bejaia', 'bejaia', 'bejaia', 'bejaia', 'Féminin', '0791918229', 'halim@gmail.com', 'DZ', 'employe@hh3772', '$2b$10$eNffFYH5Ywcg.fLSgbZBF.3hbFxCj5fYOa8HCSccu0iUMahIQx8V2', 'Employé', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-14 13:40:30', '2025-05-14 13:40:30', NULL),
(69, 'salima', 'mokhtar', 'salima', 'mokhtar', '1987-05-29 00:00:00', 'bejaia', 'bejaia', 'bejaia', 'bejaia', 'Féminin', '0794286443', 'salima@gmail.com', 'DZ', 'employe@sm5064', '$2b$10$0xW0V/5JcENeDFR0Gw9o4.jLlF2aYQEdq5rOzJw8hFaBCXm/vRX.O', 'Employé', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-14 13:42:45', '2025-05-14 13:42:45', NULL),
(70, 'djamila', 'qasi', 'djamila', 'qasi', '1985-05-28 00:00:00', 'bejaia', 'bejaia', 'bejaia', 'bejaia', 'Féminin', '07942864054', 'djamila@gmail.com', 'DZ', 'employe@dq6352', '$2b$10$hdg0gPrN/ilYD5.bO2Qmm.z1RABGpYt9zwaVd9VrQA3L2YX7nOLau', 'Employé', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-14 13:44:57', '2025-05-14 13:44:57', NULL),
(71, 'razika', 'saleh', 'razika', 'saleh', '1983-05-22 00:00:00', 'bejaia', 'bejaia', 'bejaia', 'bejaia', 'Féminin', '077667867', 'razika@gmail.com', 'DZ', 'employe@rs8433', '$2b$10$eNrVb9Mesd4ErNswMNvv8.DcsOlomUd3VqO5Rd7ra2PUfDNH9vCS2', 'Employé', 1, 'activer', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-14 14:19:14', '2025-05-14 14:19:14', NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=415 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user_roles`
--

INSERT INTO `user_roles` (`id`, `userId`, `roleId`, `permissionId`) VALUES
(1, 1, 1, NULL),
(4, 2, 1, NULL),
(7, 3, 3, 1),
(8, 3, 3, 2),
(9, 3, 3, 3),
(10, 3, 3, 4),
(11, 3, 3, 5),
(12, 3, 3, 6),
(13, 3, 3, 7),
(14, 3, 3, 8),
(15, 3, 3, 9),
(16, 3, 3, 10),
(17, 3, 3, 11),
(18, 3, 3, 12),
(19, 3, 3, 13),
(20, 3, 3, 14),
(21, 3, 3, 15),
(22, 3, 3, 16),
(23, 3, 3, 17),
(24, 3, 3, 18),
(25, 3, 3, 19),
(26, 3, 3, 20),
(27, 3, 3, 21),
(28, 3, 3, 22),
(29, 3, 3, 23),
(30, 3, 3, 24),
(31, 3, 3, 25),
(32, 3, 3, 26),
(33, 3, 3, 27),
(34, 3, 3, 29),
(35, 3, 3, 28),
(36, 3, 3, 30),
(37, 3, 3, 31),
(38, 3, 3, 32),
(39, 3, 3, 33),
(40, 3, 3, 34),
(41, 3, 3, 35),
(42, 3, 3, 36),
(43, 3, 3, 37),
(44, 3, 3, 38),
(45, 3, 3, 39),
(46, 3, 3, 40),
(47, 3, 3, 41),
(48, 3, 3, 42),
(49, 3, 3, 43),
(50, 3, 3, 44),
(51, 3, 3, 45),
(52, 3, 3, 46),
(53, 3, 3, 48),
(54, 3, 3, 47),
(55, 3, 3, 49),
(56, 3, 3, 50),
(57, 3, 3, 51),
(58, 3, 3, 52),
(59, 3, 3, 53),
(60, 3, 3, 54),
(61, 3, 3, 55),
(62, 3, 3, 56),
(63, 3, 3, 57),
(64, 3, 3, 58),
(65, 3, 3, 59),
(66, 3, 3, 61),
(67, 3, 3, 60),
(68, 3, 3, 62),
(69, 3, 3, 63),
(70, 3, 3, 65),
(71, 3, 3, 66),
(72, 3, 3, 64),
(73, 3, 3, 67),
(74, 3, 3, 68),
(75, 3, 3, 69),
(76, 3, 3, 70),
(77, 3, 3, 71),
(78, 3, 3, 72),
(79, 3, 3, 73),
(80, 3, 3, 74),
(81, 3, 3, 75),
(82, 3, 3, 76),
(83, 3, 3, 77),
(84, 3, 3, 79),
(85, 3, 3, 78),
(86, 3, 3, 80),
(87, 3, 3, 81),
(88, 3, 3, 83),
(89, 3, 3, 82),
(90, 3, 3, 84),
(91, 3, 3, 85),
(92, 3, 3, 86),
(93, 3, 3, 87),
(94, 3, 3, 88),
(95, 3, 3, 89),
(96, 3, 3, 90),
(97, 3, 3, 91),
(98, 3, 3, 92),
(99, 3, 3, 93),
(100, 3, 3, 94),
(101, 4, 3, 1),
(102, 4, 3, 2),
(103, 4, 3, 3),
(104, 4, 3, 4),
(105, 4, 3, 5),
(106, 4, 3, 6),
(107, 4, 3, 7),
(108, 4, 3, 8),
(109, 4, 3, 9),
(110, 4, 3, 10),
(111, 4, 3, 11),
(112, 4, 3, 12),
(113, 4, 3, 13),
(114, 4, 3, 14),
(115, 4, 3, 15),
(116, 4, 3, 16),
(117, 4, 3, 17),
(118, 4, 3, 18),
(119, 4, 3, 19),
(120, 4, 3, 20),
(121, 4, 3, 21),
(122, 4, 3, 22),
(123, 4, 3, 23),
(124, 4, 3, 24),
(125, 4, 3, 25),
(126, 4, 3, 26),
(127, 4, 3, 27),
(128, 4, 3, 29),
(129, 4, 3, 28),
(130, 4, 3, 30),
(131, 4, 3, 31),
(132, 4, 3, 32),
(133, 4, 3, 33),
(134, 4, 3, 34),
(135, 4, 3, 35),
(136, 4, 3, 36),
(137, 4, 3, 37),
(138, 4, 3, 38),
(139, 4, 3, 39),
(140, 4, 3, 40),
(141, 4, 3, 41),
(142, 4, 3, 42),
(143, 4, 3, 43),
(144, 4, 3, 44),
(145, 4, 3, 45),
(146, 4, 3, 46),
(147, 4, 3, 48),
(148, 4, 3, 47),
(149, 4, 3, 49),
(150, 4, 3, 50),
(151, 4, 3, 51),
(152, 4, 3, 52),
(153, 4, 3, 53),
(154, 4, 3, 54),
(155, 4, 3, 55),
(156, 4, 3, 56),
(157, 4, 3, 57),
(158, 4, 3, 58),
(159, 4, 3, 59),
(160, 4, 3, 61),
(161, 4, 3, 60),
(162, 4, 3, 62),
(163, 4, 3, 63),
(164, 4, 3, 65),
(165, 4, 3, 66),
(166, 4, 3, 64),
(167, 4, 3, 67),
(168, 4, 3, 68),
(169, 4, 3, 69),
(170, 4, 3, 70),
(171, 4, 3, 71),
(172, 4, 3, 72),
(173, 4, 3, 73),
(174, 4, 3, 74),
(175, 4, 3, 75),
(176, 4, 3, 76),
(177, 4, 3, 77),
(178, 4, 3, 79),
(179, 4, 3, 78),
(180, 4, 3, 80),
(181, 4, 3, 81),
(182, 4, 3, 83),
(183, 4, 3, 82),
(184, 4, 3, 84),
(185, 4, 3, 85),
(186, 4, 3, 86),
(187, 4, 3, 87),
(188, 4, 3, 88),
(189, 4, 3, 89),
(190, 4, 3, 90),
(191, 4, 3, 91),
(192, 4, 3, 92),
(193, 4, 3, 93),
(194, 4, 3, 94),
(195, 4, 3, 95),
(196, 4, 3, 96),
(197, 4, 3, 97),
(198, 4, 3, 98),
(199, 4, 3, 99),
(200, 4, 3, 100),
(201, 3, 3, 100),
(202, 3, 3, 98),
(203, 3, 3, 99),
(204, 3, 3, 97),
(205, 3, 3, 96),
(206, 3, 3, 95),
(208, 7, 4, NULL),
(209, 7, 4, 1),
(210, 7, 4, 2),
(211, 7, 4, 3),
(212, 7, 4, 4),
(213, 7, 4, 5),
(214, 7, 4, 6),
(215, 7, 4, 7),
(216, 7, 4, 8),
(217, 7, 4, 9),
(218, 7, 4, 10),
(219, 7, 4, 11),
(220, 7, 4, 12),
(221, 7, 4, 13),
(222, 7, 4, 14),
(223, 7, 4, 15),
(224, 7, 4, 16),
(225, 7, 4, 17),
(226, 7, 4, 18),
(227, 7, 4, 19),
(228, 7, 4, 20),
(229, 7, 4, 21),
(230, 7, 4, 22),
(231, 7, 4, 23),
(232, 7, 4, 24),
(233, 7, 4, 25),
(234, 7, 4, 26),
(235, 7, 4, 27),
(236, 7, 4, 29),
(237, 7, 4, 28),
(238, 7, 4, 30),
(239, 7, 4, 31),
(240, 7, 4, 32),
(241, 7, 4, 33),
(242, 7, 4, 34),
(243, 7, 4, 35),
(244, 7, 4, 36),
(245, 7, 4, 37),
(246, 7, 4, 38),
(247, 7, 4, 39),
(248, 7, 4, 40),
(249, 7, 4, 41),
(250, 7, 4, 42),
(251, 7, 4, 43),
(252, 7, 4, 44),
(253, 7, 4, 45),
(254, 7, 4, 46),
(255, 7, 4, 48),
(256, 7, 4, 47),
(257, 7, 4, 49),
(258, 7, 4, 50),
(259, 7, 4, 51),
(260, 7, 4, 52),
(261, 7, 4, 53),
(262, 7, 4, 54),
(263, 7, 4, 55),
(264, 7, 4, 56),
(265, 7, 4, 57),
(266, 7, 4, 58),
(267, 7, 4, 59),
(268, 7, 4, 61),
(269, 7, 4, 60),
(270, 7, 4, 62),
(271, 7, 4, 63),
(272, 7, 4, 65),
(273, 7, 4, 66),
(274, 7, 4, 64),
(275, 7, 4, 67),
(276, 7, 4, 68),
(277, 7, 4, 69),
(278, 7, 4, 70),
(279, 7, 4, 71),
(280, 7, 4, 72),
(281, 7, 4, 73),
(282, 7, 4, 74),
(283, 7, 4, 75),
(284, 7, 4, 76),
(285, 7, 4, 77),
(286, 7, 4, 79),
(287, 7, 4, 78),
(288, 7, 4, 80),
(289, 7, 4, 81),
(290, 7, 4, 83),
(291, 7, 4, 82),
(292, 7, 4, 84),
(293, 7, 4, 85),
(294, 7, 4, 86),
(295, 7, 4, 87),
(296, 7, 4, 88),
(297, 7, 4, 89),
(298, 7, 4, 90),
(299, 7, 4, 91),
(300, 7, 4, 92),
(301, 7, 4, 93),
(302, 7, 4, 94),
(303, 7, 4, 100),
(304, 7, 4, 98),
(305, 7, 4, 99),
(306, 7, 4, 97),
(307, 7, 4, 96),
(308, 7, 4, 95),
(309, 8, 4, NULL),
(310, 8, 4, 1),
(311, 8, 4, 2),
(312, 8, 4, 3),
(313, 8, 4, 4),
(314, 8, 4, 5),
(315, 8, 4, 6),
(316, 8, 4, 7),
(317, 8, 4, 8),
(318, 8, 4, 9),
(319, 8, 4, 10),
(320, 8, 4, 11),
(321, 8, 4, 12),
(322, 8, 4, 13),
(323, 8, 4, 14),
(324, 8, 4, 15),
(325, 8, 4, 16),
(326, 8, 4, 17),
(327, 8, 4, 18),
(328, 8, 4, 19),
(329, 8, 4, 20),
(330, 8, 4, 21),
(331, 8, 4, 22),
(332, 8, 4, 23),
(333, 8, 4, 24),
(334, 8, 4, 25),
(335, 8, 4, 26),
(336, 8, 4, 27),
(337, 8, 4, 29),
(338, 8, 4, 28),
(339, 8, 4, 30),
(340, 8, 4, 31),
(341, 8, 4, 32),
(342, 8, 4, 33),
(343, 8, 4, 34),
(344, 8, 4, 35),
(345, 8, 4, 36),
(346, 8, 4, 37),
(347, 8, 4, 38),
(348, 8, 4, 39),
(349, 8, 4, 40),
(350, 8, 4, 41),
(351, 8, 4, 42),
(352, 8, 4, 43),
(353, 8, 4, 44),
(354, 8, 4, 45),
(355, 8, 4, 46),
(356, 8, 4, 48),
(357, 8, 4, 47),
(358, 8, 4, 49),
(359, 8, 4, 50),
(360, 8, 4, 51),
(361, 8, 4, 52),
(362, 8, 4, 53),
(363, 8, 4, 54),
(364, 8, 4, 55),
(365, 8, 4, 56),
(366, 8, 4, 57),
(367, 8, 4, 58),
(368, 8, 4, 59),
(369, 8, 4, 61),
(370, 8, 4, 60),
(371, 8, 4, 62),
(372, 8, 4, 63),
(373, 8, 4, 65),
(374, 8, 4, 66),
(375, 8, 4, 64),
(376, 8, 4, 67),
(377, 8, 4, 68),
(378, 8, 4, 69),
(379, 8, 4, 70),
(380, 8, 4, 71),
(381, 8, 4, 72),
(382, 8, 4, 73),
(383, 8, 4, 74),
(384, 8, 4, 75),
(385, 8, 4, 76),
(386, 8, 4, 77),
(387, 8, 4, 79),
(388, 8, 4, 78),
(389, 8, 4, 80),
(390, 8, 4, 81),
(391, 8, 4, 83),
(392, 8, 4, 82),
(393, 8, 4, 84),
(394, 8, 4, 85),
(395, 8, 4, 86),
(396, 8, 4, 87),
(397, 8, 4, 88),
(398, 8, 4, 89),
(399, 8, 4, 90),
(400, 8, 4, 91),
(401, 8, 4, 92),
(402, 8, 4, 93),
(403, 8, 4, 94),
(404, 8, 4, 100),
(405, 8, 4, 98),
(406, 8, 4, 99),
(407, 8, 4, 97),
(408, 8, 4, 96),
(409, 66, 5, NULL),
(410, 67, 5, NULL),
(411, 68, 5, NULL),
(412, 69, 5, NULL),
(413, 70, 5, NULL),
(414, 71, 5, NULL);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `achats`
--
ALTER TABLE `achats`
  ADD CONSTRAINT `achats_ibfk_1` FOREIGN KEY (`articleId`) REFERENCES `articles` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `achats_ibfk_2` FOREIGN KEY (`fournisseurId`) REFERENCES `fournisseurs` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Contraintes pour la table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`categorieId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `congeabsences`
--
ALTER TABLE `congeabsences`
  ADD CONSTRAINT `congeabsences_ibfk_1` FOREIGN KEY (`employe_id`) REFERENCES `employes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `congeabsences_ibfk_2` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `congeabsences_ibfk_3` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `congeabsences_ibfk_4` FOREIGN KEY (`idCA`) REFERENCES `congeannuels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `congeannuels`
--
ALTER TABLE `congeannuels`
  ADD CONSTRAINT `congeannuels_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `congeannuels_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `contrats`
--
ALTER TABLE `contrats`
  ADD CONSTRAINT `contrats_ibfk_1` FOREIGN KEY (`niveauId`) REFERENCES `niveauxes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `contrats_ibfk_2` FOREIGN KEY (`annescolaireId`) REFERENCES `anneescolaires` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `contrats_ibfk_3` FOREIGN KEY (`eleveId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `depenses`
--
ALTER TABLE `depenses`
  ADD CONSTRAINT `depenses_ibfk_1` FOREIGN KEY (`typeId`) REFERENCES `typedepenses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `depenses_ibfk_2` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `depenses_ibfk_3` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `devoires`
--
ALTER TABLE `devoires`
  ADD CONSTRAINT `devoires_ibfk_1` FOREIGN KEY (`enseignantId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `devoires_ibfk_2` FOREIGN KEY (`matiereId`) REFERENCES `matieres` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `devoires_ibfk_3` FOREIGN KEY (`niveauId`) REFERENCES `niveauxes` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `devoires_ibfk_4` FOREIGN KEY (`sectionId`) REFERENCES `sections` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `devoires_ibfk_5` FOREIGN KEY (`annescolaireId`) REFERENCES `anneescolaires` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `devoires_ibfk_6` FOREIGN KEY (`trimestId`) REFERENCES `trimests` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `devoires_ibfk_7` FOREIGN KEY (`periodeId`) REFERENCES `periodenotes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `ecoleachats`
--
ALTER TABLE `ecoleachats`
  ADD CONSTRAINT `ecoleachats_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecoleachats_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecoleachats_ibfk_3` FOREIGN KEY (`achatId`) REFERENCES `achats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ecolearticles`
--
ALTER TABLE `ecolearticles`
  ADD CONSTRAINT `ecolearticles_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecolearticles_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecolearticles_ibfk_3` FOREIGN KEY (`articleId`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ecolecategories`
--
ALTER TABLE `ecolecategories`
  ADD CONSTRAINT `ecolecategories_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecolecategories_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecolecategories_ibfk_3` FOREIGN KEY (`categorieId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ecolefournisseurs`
--
ALTER TABLE `ecolefournisseurs`
  ADD CONSTRAINT `ecolefournisseurs_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecolefournisseurs_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecolefournisseurs_ibfk_3` FOREIGN KEY (`fournisseurId`) REFERENCES `fournisseurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ecolematieres`
--
ALTER TABLE `ecolematieres`
  ADD CONSTRAINT `ecolematieres_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecolematieres_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecolematieres_ibfk_3` FOREIGN KEY (`matiereId`) REFERENCES `matieres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ecoleniveaus`
--
ALTER TABLE `ecoleniveaus`
  ADD CONSTRAINT `ecoleniveaus_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecoleniveaus_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecoleniveaus_ibfk_3` FOREIGN KEY (`niveauId`) REFERENCES `niveauxes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ecoleremarques`
--
ALTER TABLE `ecoleremarques`
  ADD CONSTRAINT `ecoleremarques_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecoleremarques_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecoleremarques_ibfk_3` FOREIGN KEY (`remarqueId`) REFERENCES `remarques` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ecoles`
--
ALTER TABLE `ecoles`
  ADD CONSTRAINT `ecoles_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `ecolesections`
--
ALTER TABLE `ecolesections`
  ADD CONSTRAINT `ecolesections_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecolesections_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecolesections_ibfk_3` FOREIGN KEY (`sectionId`) REFERENCES `sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ecole_secole_postes`
--
ALTER TABLE `ecole_secole_postes`
  ADD CONSTRAINT `ecole_secole_postes_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecole_secole_postes_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecole_secole_postes_ibfk_3` FOREIGN KEY (`posteId`) REFERENCES `postes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ecole_secole_roles`
--
ALTER TABLE `ecole_secole_roles`
  ADD CONSTRAINT `ecole_secole_roles_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecole_secole_roles_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecole_secole_roles_ibfk_3` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ecole_secole_services`
--
ALTER TABLE `ecole_secole_services`
  ADD CONSTRAINT `ecole_secole_services_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecole_secole_services_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ecole_secole_services_ibfk_3` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `eleves_ibfk_3` FOREIGN KEY (`annescolaireId`) REFERENCES `anneescolaires` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `eleves_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Contraintes pour la table `joursferies`
--
ALTER TABLE `joursferies`
  ADD CONSTRAINT `joursferies_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `moyennegenerales`
--
ALTER TABLE `moyennegenerales`
  ADD CONSTRAINT `moyennegenerales_ibfk_1` FOREIGN KEY (`EleveId`) REFERENCES `eleves` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `moyennegenerales_ibfk_2` FOREIGN KEY (`niveauId`) REFERENCES `niveauxes` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `moyennegenerales_ibfk_3` FOREIGN KEY (`sectionId`) REFERENCES `sections` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `moyennegenerales_ibfk_4` FOREIGN KEY (`annescolaireId`) REFERENCES `anneescolaires` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `moyennegenerales_ibfk_5` FOREIGN KEY (`trimestId`) REFERENCES `trimests` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `moyennegenerales_ibfk_6` FOREIGN KEY (`enseignantId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `moyennegenerales_ibfk_7` FOREIGN KEY (`matiereId`) REFERENCES `matieres` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `moyennegenerales_ibfk_8` FOREIGN KEY (`periodeId`) REFERENCES `periodenotes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `niveauxmatieres`
--
ALTER TABLE `niveauxmatieres`
  ADD CONSTRAINT `niveauxmatieres_ibfk_1` FOREIGN KEY (`niveauId`) REFERENCES `niveauxes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `niveauxmatieres_ibfk_2` FOREIGN KEY (`matiereId`) REFERENCES `matieres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `niveauxmatieres_ibfk_3` FOREIGN KEY (`enseignantId`) REFERENCES `enseignants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`EleveId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notes_ibfk_2` FOREIGN KEY (`matiereId`) REFERENCES `matieres` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `notes_ibfk_3` FOREIGN KEY (`enseignantId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `notes_ibfk_4` FOREIGN KEY (`sectionId`) REFERENCES `sections` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `notes_ibfk_5` FOREIGN KEY (`annescolaireId`) REFERENCES `anneescolaires` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `notes_ibfk_6` FOREIGN KEY (`trimestId`) REFERENCES `trimests` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `notes_ibfk_7` FOREIGN KEY (`periodeId`) REFERENCES `periodenotes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
-- Contraintes pour la table `periodenotes`
--
ALTER TABLE `periodenotes`
  ADD CONSTRAINT `periodenotes_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `periodenotes_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `periodepaies`
--
ALTER TABLE `periodepaies`
  ADD CONSTRAINT `periodepaies_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `periodes`
--
ALTER TABLE `periodes`
  ADD CONSTRAINT `periodes_ibfk_1` FOREIGN KEY (`cycleId`) REFERENCES `cyclescolaires` (`id`);

--
-- Contraintes pour la table `planningpaiements`
--
ALTER TABLE `planningpaiements`
  ADD CONSTRAINT `planningpaiements_ibfk_1` FOREIGN KEY (`ContratId`) REFERENCES `contrats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `presences_ibfk_1` FOREIGN KEY (`eleveId`) REFERENCES `eleves` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `presences_ibfk_2` FOREIGN KEY (`enseignantId`) REFERENCES `enseignants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `primes`
--
ALTER TABLE `primes`
  ADD CONSTRAINT `primes_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `prime_employes`
--
ALTER TABLE `prime_employes`
  ADD CONSTRAINT `prime_employes_ibfk_1` FOREIGN KEY (`PrimeId`) REFERENCES `primes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prime_employes_ibfk_2` FOREIGN KEY (`EmployeId`) REFERENCES `employes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `revenus`
--
ALTER TABLE `revenus`
  ADD CONSTRAINT `revenus_ibfk_1` FOREIGN KEY (`typeId`) REFERENCES `typerevenues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `revenus_ibfk_2` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `revenus_ibfk_3` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Contraintes pour la table `travailrendus`
--
ALTER TABLE `travailrendus`
  ADD CONSTRAINT `travailrendus_ibfk_1` FOREIGN KEY (`devoirId`) REFERENCES `devoires` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `travailrendus_ibfk_2` FOREIGN KEY (`eleveId`) REFERENCES `eleves` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Contraintes pour la table `typedepenses`
--
ALTER TABLE `typedepenses`
  ADD CONSTRAINT `typedepenses_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `typedepenses_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `typerevenues`
--
ALTER TABLE `typerevenues`
  ADD CONSTRAINT `typerevenues_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `typerevenues_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `userecoles`
--
ALTER TABLE `userecoles`
  ADD CONSTRAINT `userecoles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `userecoles_ibfk_2` FOREIGN KEY (`ecoleeId`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`ecoleId`) REFERENCES `ecoleprincipals` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
