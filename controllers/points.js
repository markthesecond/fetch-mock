const transactions = require('../db/points')

const pointsController = {
    // method to add a transaction
    createPoints(payer, points) {
        // stores a new transaction object
        transactions.insert(
            /* payer and points are provided in the call, but timestamp
            is generated here */
            { payer: payer, points: points, timestamp: new Date }
        );
    },
    // method to read the point balance
    readPoints() {
        // creates an array holding all transactions
        let transArr = transactions.find();
        // empty object to collect point totals in
        const pointsPerPayer = {};
        // sorts through each transaction and totals points from a payer
        transArr.map(t => {
            // if this payer has been encountered, then we add the points
            if (pointsPerPayer.hasOwnProperty(t.payer)) {
                pointsPerPayer[t.payer] += t.points;
                // else we create that key and set an initial value
            } else pointsPerPayer[t.payer] = t.points;
        });
        return pointsPerPayer
    },
}

module.exports = pointsController;
