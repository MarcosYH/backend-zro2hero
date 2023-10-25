// middleware/auth.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }

  try {
    const decoded = jwt.verify(token, 'votre_secret_key');
    req.user = decoded.user;

    // Vérification du rôle
    if (req.user.role !== 'admin' && req.user.role !== 'client') {
      return res.status(403).json({ message: 'Accès interdit. Rôle non autorisé.' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token non valide.' });
  }
}

module.exports = authMiddleware;
