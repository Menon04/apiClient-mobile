const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  try {
    if (token.startsWith('gho_')) {
      req.user = {
        provider: 'github',
        token: token
      };
      return next();
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = {
      ...decoded,
      provider: 'local'
    };
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token inválido.' });
    }
    return res.status(500).json({ error: 'Erro na autenticação.' });
  }
};

module.exports = authenticateToken;