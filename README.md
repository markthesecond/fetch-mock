# Fetch Rewards Points Service
A simple web service to manage a user's points in a remarkably similar way to
how they're handled in your Fetch account. Built 100% in JavaScript.

#### Features
- adding points transactions with payer name and autogenerated timestamp
- retrieving point balances per payer
- spending arbitrary numbers of points

## Installation
0. Ensure you have [Node.js](https://nodejs.org/en/download/) installed.
1. Clone this repository to the destination computer:
 ```sh
 git clone https://github.com/markthesecond/fetch-mock.git
 ```
 2. Navigate into the `fetch-mock` (or whatever you named it) directory
```sh
cd fetch-mock
```
3. Install the Node dependencies
```sh
npm install
```
Done! Now you're ready to start crediting and debiting.

## Usage
1. Simply run `npm start`, or if you prefer, `node server.js`
2. Then, in a tool like [Insomnia](https://insomnia.rest/download) or [Postman](https://www.postman.com/downloads), or even [cURL](https://curl.se/download.html), send your HTTP requests to [localhost:3000/points](localhost:3000/points).
#### Supported HTTP methods
- GET   returns the current balance of points from each payer
- POST  accepts JSON data to add transactions
- PUT   accepts JSON data to spend points from your accumulated pool

##### POST body legend
```json
{
    "payer": "PAYER_NAME", // expects a string
    "points": 9001 // expects a number
}
```

##### PUT body legend
```json
{
    "points": 8080 // expects a number
}
```
