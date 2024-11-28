const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const authRepository = require('../auth/authRepository');
const axios = require('axios');

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const loginUser = async (email, password) => {
  try {
    const user = await authRepository.loginUser(email, password);
    const token = jwt.sign({ 
      id: user.id,
      email: user.email 
    }, SECRET_KEY, { expiresIn: '1h' });
    return { user, token };
  } catch (error) {
    throw new Error('Erro ao fazer login: ' + error.message);
  }
};

const registerUser = async (firstName, lastName, email, password) => {
  try {
    const user = await authRepository.registerUser(firstName, lastName, email, password);
    const token = jwt.sign({ 
      id: user.id,
      email: user.email 
    }, SECRET_KEY, { expiresIn: '1h' });
    return { user, token };
  } catch (error) {
    throw new Error('Erro ao registrar usuário: ' + error.message);
  }
};

const loginWithGitHub = async (code) => {
  try {
    const accessToken = await getGitHubAccessToken(code);
    const githubUser = await getGitHubUser(accessToken);

    let user = await authRepository.findByGithubId(githubUser.id.toString());

    if (!user) {
      const newUserData = {
        firstName: githubUser.name ? githubUser.name.split(" ")[0] : githubUser.login,
        lastName: githubUser.name ? githubUser.name.split(" ").slice(1).join(" ") : "",
        email: githubUser.email || "",
        githubId: githubUser.id.toString(),
      };

      await authRepository.save(newUserData);
      user = await authRepository.findByGithubId(githubUser.id.toString());
    }

    if (!SECRET_KEY) {
      throw new Error("JWT_SECRET não definido");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return token;
  } catch (error) {
    throw new Error('Erro ao autenticar com GitHub: ' + error.message);
  }
};

const getGitHubAccessToken = async (code) => {
  try {
    const response = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECT_URL
      },
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    throw new Error('Erro ao obter access token do GitHub');
  }
};

const getGitHubUser = async (accessToken) => {
  try {
    const response = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter dados do usuário do GitHub');
  }
};

module.exports = { registerUser, loginUser, loginWithGitHub };