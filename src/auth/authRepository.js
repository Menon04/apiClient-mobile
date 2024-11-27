const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user/user');

const authRepository = {
  registerUser: async (firstName, lastName, email, password) => {
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await User.create({
        id: uuidv4(),
        firstName,
        lastName,
        email,
        password: hashedPassword,
        wallet: 0
      });
      return user;
    } catch (error) {
      throw new Error('Erro ao registrar usuário: ' + error.message);
    }
  },

  loginUser: async (email, password) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Usuário não encontrado.');
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Senha incorreta.');
      }

      return user;
    } catch (error) {
      throw new Error('Erro ao fazer login: ' + error.message);
    }
  },
  findByGithubId: async (githubId) => {
    try {
      const user = await User.findOne({ where: { githubId } });
      return user;
    } catch (error) {
      throw new Error("Erro ao buscar usuário pelo GitHub ID");
    }
  },
  save: async (userData) => {
    try {
      const user = await User.create({
        id: uuidv4(),
        ...userData,
        wallet: 0
      });
      return user;
    } catch (error) {
      throw new Error('Error saving user: ' + error.message);
    }
  }

};

module.exports = authRepository;
