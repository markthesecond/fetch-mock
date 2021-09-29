const lokijs = require('lokijs'); // lightweight flexible storage package

const db = new lokijs('simple.db'); // instantiate a store
// create a collection to hold a complete transaction history
const transactions = db.addCollection('transactions');

module.exports = transactions;
