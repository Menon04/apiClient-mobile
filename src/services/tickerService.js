const axios = require('axios');
const tickerRepository = require('../models/ticker/tickerRepository');

class TickerService {
    constructor() {
        this.apiToken = process.env.BRAPI_TOKEN;
        this.baseUrl = 'https://brapi.dev/api';
        this.defaultParams = {
            range: '1mo',
            interval: '1d',
        };
    }

    async getQuote(tickers) {
        try {
            if (!tickers) {
                throw new Error('Tickers parameter is required');
            }
            
            const queryParams = new URLSearchParams({
                token: this.apiToken,
                ...this.defaultParams
            });

            const url = `${this.baseUrl}/quote/${tickers}?${queryParams}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(`API Error: ${error.response.data.message || error.response.statusText}`);
            }
            throw error;
        }
    }

    async findOrCreateTicker(quoteData) {
        const ticker = await tickerRepository.findBySymbol(quoteData.symbol);
        if (ticker) return ticker;
        return await tickerRepository.createTicker(quoteData);
    }
}

module.exports = new TickerService();