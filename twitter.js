const Twitter = require('twitter');
const d = require('debug')('twitter-beautycloud:twitter');

const twitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_APPLICATION_TOKEN
});

async function fetchTweets(hashtag) {
    d('fetching tweets');
    const res = await twitter.get('search/tweets', {
        q: `#${hashtag}`,
        count: 200,
        tweet_mode: 'extended'
    });
    d(res);
    return res.statuses.map(status => ({
        id: status.id,
        text: status.full_text,
        user: {
            handle: `@${status.user.screen_name}`,
            name: status.user.name
        },
        retweets: status.retweet_count
    }));
}

module.exports = {
    fetchTweets
};
