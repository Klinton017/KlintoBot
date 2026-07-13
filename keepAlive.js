import http from 'http';

export default function keepAlive() {
  const server = http.createServer((req, res) => {
    // When the server is pinged, return a 200 OK status
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("Bot Keep-Alive Server is Online!");
    res.end();
  });

  // Render automatically assigns a port via process.env.PORT
  const PORT = process.env.PORT || 3000;
  
  server.listen(PORT, () => {
    console.log(`🌐 Keep-alive server is running on port ${PORT}`);
  }).on('error', (err) => {
    console.error(`❌ Failed to start keep-alive server. Port might be in use: ${err.message}`);
  });
}
