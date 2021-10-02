const transactions = require('../db/points');

/**
 * Takes transactions and returns total points per payer
 * @param {Object[]} transactions - The transactions to be balanced
 * @param {string} transactions[].payer - The name of the payer
 * @param {number} transactions[].points - The amount of points credited
 * @param {Date} transactions[].timestamp - Date of transaction
 * @returns {Object} Object with keys for each payer in transactions 
 */
function getPointsPerPayer(transactions) {
    // empty object to collect point totals in
    const pointsPerPayer = {};
    // sorts through each transaction and totals points from a payer
    transactions.map(t => {
        // if this payer has been encountered, then we add the points
        if (pointsPerPayer.hasOwnProperty(t.payer)) {
            pointsPerPayer[t.payer] += t.points;
            // else we create that key and set an initial value
        } else pointsPerPayer[t.payer] = t.points;
    });

    return pointsPerPayer
}

/**
 * Adds points from different payers into one total
 * @param {Object} pointsPerPayer - Point balances listed by payer
 * @returns {number}
 */
function totalPoints(pointsPerPayer) {
    let total = 0;
    for (const payer in pointsPerPayer) {
        if (Object.hasOwnProperty.call(pointsPerPayer, payer)) {
            total += pointsPerPayer[payer];
        }
    }

    return total
}

const pointsController = {
    /**
     * Method to add a transaction
     * @param {string} payer - Name of the partner where the points originated
     * @param {number} points - Amount to be credited or debited
     */
    createPoints(payer, points) {
        // stores a new transaction object
        transactions.insert(
            /* payer and points are provided in the call, but timestamp
            is generated here */
            { payer: payer, points: points, timestamp: new Date }
        );
    },
    /**
     * Method to read the point balance
     * @returns Object with point balances per payer
     */
    readPoints() {
        // creates an array holding all transactions
        let transArr = transactions.find();
        
        return getPointsPerPayer(transArr);
    },
    /**
     * Method to spend points
     * @param {number} amount - Amount of points to be spent
     * @returns {Object} Object holding debits per payer from this spend
     * @see getPointsPerPayer
     */
    spendPoints(amount) {
        // 1. create variable to test against
        // let spendTotal = amount;
        // 2. get transactions and sort them in ascending date order
        let pointLog = transactions.find().sort((a,b) => {
            return a.timestamp - b.timestamp
        });
        // isolate the previous debits and credits on the account
        const creditLog = [], debitLog = [];
        pointLog.forEach(p => p.points > 0 ? creditLog.push(p) : debitLog.push(p));
        // determine the total points already spent and group them by payer
        const debitsPerPayer = getPointsPerPayer(debitLog);
        // begin adding up credited points against debited points
        //  until we've a positive integer equal to the amount to be spent
        for (let i = 0; totalPoints(debitsPerPayer) < amount; i++) {
            // create variables for the current payer and points to avoid
            //  accessing the array too often
            let currentPayer = creditLog[i].payer;
            let currentPoints = creditLog[i].points;
            // create a variable to account for points above the needed amount
            let actualPoints = 0;
            // if the points exceed the needed amount, use that value
            if (currentPoints <= amount - totalPoints(debitsPerPayer)) {
                actualPoints = currentPoints;
                // else use the difference between the amount and the
                //  accumulated credits
            } else actualPoints = amount - totalPoints(debitsPerPayer);
            // check if the payer's points have ever been spent
            if (debitsPerPayer.hasOwnProperty(currentPayer)) {
                // then add the points to the existing prop
                debitsPerPayer[currentPayer] += actualPoints;
                // or create the prop with that value
            } else debitsPerPayer[currentPayer] = actualPoints;
        }
        // then insert transactions debiting the appropriate amounts per payer
        const spendDate = new Date; // technically these are all being spent at the same time
        const keysOfDebitsPerPayer = Object.keys(debitsPerPayer);
        const spendReport = {}; // object to collect debits and report to us
        for (let i = 0; i < keysOfDebitsPerPayer.length; i++) {
            // check if this payer's points went positive in the last loop
            if (debitsPerPayer[keysOfDebitsPerPayer[i]]) {
                // make the amount negative to subtract from the total
                const debitedAmount = 0 - debitsPerPayer[keysOfDebitsPerPayer[i]];
                // then submit that transaction and add the points to the report
                transactions.insert({
                    payer: keysOfDebitsPerPayer[i],
                    points: debitedAmount,
                    timestamp: spendDate
                });
                spendReport[keysOfDebitsPerPayer[i]] = debitedAmount;
            }
        }
        return spendReport
    }
}

module.exports = pointsController;
