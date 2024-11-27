const walletService = require('../services/walletService');

const walletController = {
  async deposit(req, res) {
    const { email } = req.user;
    const { amount } = req.body;

    try {
      const result = await walletService.deposit(email, amount);
      res.status(200).json({ 
        message: 'Depósito realizado com sucesso',
        newBalance: result.wallet
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async withdraw(req, res) {
    const { email } = req.user;
    const { amount } = req.body;

    try {
      const result = await walletService.withdraw(email, amount);
      res.status(200).json({ 
        message: 'Saque realizado com sucesso',
        newBalance: result.wallet
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getBalance(req, res) {
    const { email } = req.user;

    try {
      const balance = await walletService.getBalance(email);
      res.status(200).json({ balance });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = walletController;