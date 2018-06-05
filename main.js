require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { fetchTweets } = require('./twitter');
const { build } = require('async-service-builder');
const d = require('debug')('twitter-beautycloud');

const app = express();

const context = {
    tweets: []
};

const hashtags = [
    'metoo',
    'scandal'
];

const TIMEOUT = 60000; // 1 minute

const service = build(async() => {
    d('Fetching new tweets');
    const tweets = await Promise.all(hashtags.map(fetchTweets));

    context.tweets = tweets.reduce((a, b) => [...a, ...b], []);
    d(`Got ${context.tweets.length} tweets`);
}, TIMEOUT);

app.use(express.static('dist'));
app.use('/api/tweets', async(req, res) => {
    d('requesting tweets');
    res.status(200);
    res.json(context.tweets);
    res.end();
});

const server = createServer(app);

server.listen(process.env.PORT, () => {
    const { address, port } = server.address();
    console.log(`Listening on ${address}:${port}`)
});

service();

process.on('unhandledRejection', err => {
    console.error('err', err);
    process.exit(1);
});
