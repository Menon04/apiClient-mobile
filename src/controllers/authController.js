const authService = require('../services/authService');

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const { user, token } = await authService.registerUser(firstName, lastName, email, password);
    res.status(201).json({ message: 'Usuário registrado com sucesso', user, token });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(400).json({ error: 'Usuário já existe ou erro no cadastro' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, token } = await authService.loginUser(email, password);
    res.json({ message: 'Login realizado com sucesso', user, token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(400).json({ error: error.message });
  }
};

const githubLogin = (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&scope=read:user user:email`;
  res.redirect(githubAuthUrl);
};

const githubCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: 'Código de autorização não fornecido.' });
  }

  try {
    const token = await authService.loginWithGitHub(code);
    res.json({ message: 'Login com GitHub realizado com sucesso', token });
  } catch (error) {
    console.error('Erro no callback do GitHub:', error);
    res.status(400).json({ error: 'Falha ao autenticar com GitHub' });
  }
};

module.exports = { register, login, githubCallback, githubLogin };