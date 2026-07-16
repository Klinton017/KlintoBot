import https from 'https';

export default function startSelfPing() {
    // Wait 10 seconds to ensure TitanBot's native web server is fully booted up first
    setTimeout(() => {
        const url = process.env.RENDER_EXTERNAL_URL;

        if (!url) {
            console.log("⚠️ RENDER_EXTERNAL_URL not found. Self-pinger disabled.");
            return;
        }

        console.log(`⏱️ Starting background self-pinger targeting: ${url}`);

        // Ping immediately, then every 10 minutes
        ping(url);
        setInterval(() => {
            ping(url);
        }, 10 * 60 * 1000);
    }, 10000);
}

function ping(url) {
    https.get(url, (res) => {
        console.log(`♻️ Self-ping successful: Status ${res.statusCode}`);
    }).on('error', (err) => {
        console.error(`❌ Self-ping failed: ${err.message}`);
    });
}
