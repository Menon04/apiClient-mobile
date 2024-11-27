const portfolioRepository = require('../models/portfolio/portfolioRepository');
const tickerService = require('./tickerService');
const dividendRepository = require('../models/dividend/dividendRepository');

class ProfitabilityService {
    async calculateMonthlyReturns(userId) {
        const portfolios = await portfolioRepository.findByUserId(userId);
        const currentMonth = new Date().getMonth();
        
        const returns = await Promise.all(portfolios.map(async portfolio => {
            const quoteData = await tickerService.getQuote(portfolio.ticker.symbol);
            const currentPrice = quoteData.results[0].regularMarketPrice;
            const marketValue = currentPrice * portfolio.quantity;
            const costBasis = portfolio.averagePrice * portfolio.quantity;
            
            const unrealizedGain = marketValue - costBasis;
            
            const monthlyDividends = await dividendRepository.findByPortfolioId(portfolio.id);
            const monthDividendsTotal = monthlyDividends
                .filter(div => div.paymentDate.getMonth() === currentMonth)
                .reduce((sum, div) => sum + div.amount, 0);
            
            return {
                ticker: portfolio.ticker.symbol,
                quantity: portfolio.quantity,
                averagePrice: portfolio.averagePrice,
                currentPrice: currentPrice,
                marketValue: marketValue,
                costBasis: costBasis,
                unrealizedReturn: unrealizedGain,
                dividendReturn: monthDividendsTotal,
                totalReturn: unrealizedGain + monthDividendsTotal,
                returnPercentage: ((unrealizedGain + monthDividendsTotal) / costBasis * 100).toFixed(2)
            };
        }));

        const totalReturn = returns.reduce((sum, item) => sum + item.totalReturn, 0);
        const totalCost = returns.reduce((sum, item) => sum + item.costBasis, 0);

        return {
            positions: returns,
            summary: {
                totalReturn,
                portfolioReturnPercentage: (totalReturn / totalCost * 100).toFixed(2)
            }
        };
    }
}

module.exports = new ProfitabilityService();