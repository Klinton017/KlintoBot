import https from 'https';

export default function keepAlive() {
    // Give TitanBot 5 seconds to fully boot up before starting the pinger
    setTimeout(() => {
        const url = process.env.RENDER_EXTERNAL_URL; 

        if (!url) {
            console.log("⚠️ No RENDER_EXTERNAL_URL found in environment variables. Self-pinger disabled.");
            return;
        }

        console.log(`⏱️ Starting background self-pinger for ${url}`);
        
        // Ping the URL every 10 minutes (600,000 milliseconds)
        setInterval(() => {
            https.get(url, (res) => {
                console.log(`♻️ Self-ping successful: Status ${res.statusCode}`);
            }).on('error', (err) => {
                console.error(`❌ Self-ping failed: ${err.message}`);
            });
        }, 10 * 60 * 1000); 
    }, 5000); 
}
