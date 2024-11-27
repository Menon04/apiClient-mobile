const path = require('path');
const config = require('../infra/config/config.json');

const env = 'development';
const dbConfig = config[env];

const rootDir = path.resolve(__dirname, '..');

module.exports = {
  config: {
    dialect: dbConfig.dialect,
    storage: path.join(rootDir, dbConfig.database),
    define: {
      timestamps: true,
      underscored: true,
    },
  }
};