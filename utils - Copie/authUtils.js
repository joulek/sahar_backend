const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Génération de la clé secrète pour le jeton d'accès
const accessTokenSecret = crypto.randomBytes(32).toString('hex');

// Génération de la clé secrète pour le jeton de rafraîchissement
const refreshTokenSecret = crypto.randomBytes(32).toString('hex');

// Fonction pour créer un jeton d'accès
function createAccessToken(payload, expiresIn = '15m') {
  return jwt.sign(payload, accessTokenSecret, { expiresIn });
}

// Fonction pour créer un jeton de rafraîchissement
function createRefreshToken(payload, expiresIn = '30d') {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn });
}

module.exports = { createAccessToken, createRefreshToken };
