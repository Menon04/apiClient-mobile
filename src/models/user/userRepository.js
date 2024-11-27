const User = require('./user');

const userRepository = {
  findUserByEmail: async (email) => {
    try {
      const user = await User.findOne({
        where: { email }
      });
      return user;
    } catch (error) {
      throw new Error('Erro ao buscar usuário por email: ' + error.message);
    }
  },

  findUserById: async (id) => {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      throw new Error('Erro ao buscar usuário por ID: ' + error.message);
    }
  },

  updateUser: async (email, updates) => {
    try {
      const [rowsUpdated] = await User.update(
        updates,
        {
          where: { email }
        }
      );

      if (rowsUpdated === 0) {
        throw new Error('Usuário não encontrado para atualização.');
      }

      return rowsUpdated;
    } catch (error) {
      throw new Error('Erro ao atualizar usuário: ' + error.message);
    }
  },
  deleteUser: async (email) => {
    try {
      const rowsDeleted = await User.destroy({
        where: { email }
      });
      
      if (rowsDeleted === 0) {
        throw new Error('Usuário não encontrado para exclusão.');
      }
      
      return rowsDeleted;
    } catch (error) {
      throw new Error('Erro ao deletar usuário: ' + error.message);
    }
  }
};

module.exports = userRepository;
