const userService = require('../services/userService');

const updateProfile = async (req, res) => {
  const { email } = req.user;
  const updates = req.body;  

  try {
    await userService.updateUserProfile(email, updates);
    res.status(200).json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(400).json({ error: 'Erro ao atualizar perfil: ' + error.message });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await userService.getUserProfile(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    res.status(400).json({ error: 'Erro ao buscar perfil: ' + error.message });
  }
};

const getProfileByEmail = async (req, res) => {
  const email  = req.user.email;

  try {
    const user = await userService.getUserProfileByEmail(email);
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    res.status(400).json({ error: 'Erro ao buscar perfil: ' + error.message });
  }
};

const deleteProfile = async (req, res) => {
  const { email } = req.user;

  try {
    await userService.deleteUserProfile(email);
    res.status(200).json({ message: 'Perfil deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar perfil:', error);
    res.status(400).json({ error: 'Erro ao deletar perfil: ' + error.message });
  }
};

module.exports = { updateProfile, getProfile, getProfileByEmail, deleteProfile };
