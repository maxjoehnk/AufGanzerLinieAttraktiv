let running = true;

async function build(callback, interval = 5000) {
    while (running) {
        try {
            callback();
        }catch(err) {
            console.error(err);
        }
        await timeout(interval);
    }
}

const timeout = time => new Promise(resolve => setTimeout(resolve, time));

process.on('exit', () => {
    running = false;
});

module.exports = {
    build
};
