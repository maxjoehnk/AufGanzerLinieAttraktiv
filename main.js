require('dotenv').config();
const express = require('express');
const { fetchTweets } = require('./twitter');
const { build } = require('./service-builder');
const d = require('debug')('twitter-beautycloud');

const app = express();

const context = {
    tweets: []
};

const hashtags = [
    'beauty',
    'attractive',
    'fashion'
];

build(async() => {
    d('Fetching new tweets');
    const tweets = await Promise.all(hashtags.map(fetchTweets));

    context.tweets = tweets.reduce((a, b) => [...a, ...b], []);
    d(`Got ${context.tweets.length} tweets`);
}, 10000);

app.use(express.static('dist'));
app.use('/api/tweets', async(req, res) => {
    d('requesting tweets');
    res.status(200);
    res.json(context.tweets);
    res.end();
});

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));
