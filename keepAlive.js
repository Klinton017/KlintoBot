import http from 'http';
import https from 'https';

export default function keepAlive() {
    const PORT = process.env.PORT || 3000;

    // 1. Create a fallback server to satisfy Render's port requirement
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write("TitanBot Keep-Alive is active!");
        res.end();
    });

    // 2. Attempt to listen on the port
    server.listen(PORT, () => {
        console.log(`🌐 Keep-alive server successfully listening on port ${PORT}`);
        startSelfPing();
    }).on('error', (err) => {
        // If TitanBot already has a server on this port, do NOT crash.
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${PORT} is already in use by TitanBot's native files.`);
            console.log("Proceeding with background self-pinger only...");
            startSelfPing();
        } else {
            console.error(`❌ Web server error: ${err.message}`);
        }
    });
}

function startSelfPing() {
    const url = process.env.RENDER_EXTERNAL_URL;

    if (!url) {
        console.log("⚠️ RENDER_EXTERNAL_URL environment variable is missing.");
        console.log("👉 If you are using Render, make sure this is deployed as a 'Web Service'.");
        return;
    }

    console.log(`⏱️ Starting self-pinger loop targeting: ${url}`);

    // Ping immediately on startup, then every 10 minutes
    ping(url);
    setInterval(() => {
        ping(url);
    }, 10 * 60 * 1000); 
}

function ping(url) {
    https.get(url, (res) => {
        console.log(`♻️ Self-ping successful: Status ${res.statusCode}`);
    }).on('error', (err) => {
        console.error(`❌ Self-ping failed: ${err.message}`);
    });
}
