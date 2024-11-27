const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('../infra/database/index');
const authenticateToken = require('./middlewares/authMiddleware');
const walletRoutes = require('./routes/walletRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const tickerRoutes = require('./routes/tickerRoutes');
const dividendRoutes = require('./routes/dividendRoutes');
const profitabilityRoutes = require('./routes/profitabilityRoutes');

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Client ID:', process.env.CLIENT_ID);
console.log('Redirect URI:', process.env.REDIRECT_URL);

app.use(bodyParser.json());
app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', authRoutes);
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/ticker', tickerRoutes);
app.use('/api/dividends', dividendRoutes);
app.use('/api/profitability', profitabilityRoutes);

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port: http://localhost:${PORT}`);
      console.log('Database synchronized successfully.');
    });
  })
  .catch(error => {
    console.error('Failed to synchronize database:', error);
  });