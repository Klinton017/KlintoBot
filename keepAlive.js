import http from 'http';
import https from 'https';

export default function keepAlive() {
    // 1. Create the dummy web server so Render's health check passes
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write("TitanBot is Online and Self-Pinging!");
        res.end();
    });

    const PORT = process.env.PORT || 3000;
    
    server.listen(PORT, () => {
        console.log(`🌐 Web server running on port ${PORT}`);
        
        // 2. Start the self-pinging loop once the server is up
        startSelfPing();
    });
}

function startSelfPing() {
    // Render assigns this automatically to your public .onrender.com URL
    const url = process.env.RENDER_EXTERNAL_URL; 

    if (!url) {
        console.log("⚠️ No RENDER_EXTERNAL_URL found. Self-pinger will not run.");
        return;
    }

    console.log(`⏱️ Starting self-pinger for ${url}`);
    
    // Ping the URL every 10 minutes (600,000 milliseconds)
    setInterval(() => {
        https.get(url, (res) => {
            console.log(`♻️ Self-ping successful: Status ${res.statusCode}`);
        }).on('error', (err) => {
            console.error(`❌ Self-ping failed: ${err.message}`);
        });
    }, 10 * 60 * 1000); 
}
