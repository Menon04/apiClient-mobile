const bcrypt = require('bcrypt');
const userRepository = require('../models/user/userRepository');

const updateUserProfile = async (email, updates) => {
  try {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    const rowsUpdated = await userRepository.updateUser(email, updates);
    return rowsUpdated;
  } catch (error) {
    throw new Error('Erro ao atualizar perfil do usuário: ' + error.message);
  }
};

const getUserProfile = async (userId) => {
  try {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  } catch (error) {
    throw new Error('Erro ao obter perfil do usuário: ' + error.message);
  }
};

const getUserProfileByEmail = async (email) => {
  try {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  } catch (error) {
    throw new Error('Erro ao obter perfil do usuário: ' + error.message);
  }
};

const deleteUserProfile = async (email) => {
  try {
    await userRepository.deleteUser(email);
  } catch (error) {
    throw new Error('Erro ao deletar perfil do usuário: ' + error.message);
  }
};

module.exports = { updateUserProfile, getUserProfile, getUserProfileByEmail, deleteUserProfile };
