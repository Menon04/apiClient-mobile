const Ticker = require('./ticker');

class TickerRepository {
    async findBySymbol(symbol) {
        return await Ticker.findOne({
            where: { symbol: symbol.toUpperCase() }
        });
    }

    async createTicker(data) {
        return await Ticker.create({
            symbol: data.symbol.toUpperCase(),
            name: data.longName || data.shortName,
            type: 'stock'
        });
    }
}

module.exports = new TickerRepository();