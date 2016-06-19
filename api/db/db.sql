-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Client :  localhost:3306
-- Généré le :  Dim 19 Juin 2016 à 22:59
-- Version du serveur :  5.5.38
-- Version de PHP :  5.6.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `seatmate`
--

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
`id` int(11) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `facebook_id` int(11) DEFAULT NULL,
  `pseudo` varchar(55) NOT NULL,
  `token` varchar(255) NOT NULL,
  `token_date` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id`, `mail`, `password`, `facebook_id`, `pseudo`, `token`, `token_date`) VALUES
(1, 'jb@seatmate.io', '9cf95dacd226dcf43da376cdb6cbba7035218921', 0, 'jb92130', 'test', 0),
(4, 'test@test.com', '9cf95dacd226dcf43da376cdb6cbba7035218921', 0, 'test', 'a7d8b2d3c6a2f23b8c03f0bcd6e3e3110ca03aa4ad6e1ec0758773c5d272cf33', 1466365558);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `mail` (`mail`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
