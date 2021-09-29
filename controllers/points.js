const transactions = require('../db/points')

const pointsController = {
    createPoints(payer, points) {
        transactions.insert(
            { payer: payer, points: points, timestamp: new Date }
        );
    }
}

module.exports = pointsController;
