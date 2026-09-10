import app from './dist-github/index.js';
import http from 'http';
const server = http.createServer(app);
server.listen(3002, async () => {
    try {
        const res = await fetch('http://localhost:3002/api/github?username=albindavidc');
        console.log("Status:", res.status);
        console.log("Body:", await res.text());
    } catch(e) {
        console.error("Crash:", e);
    }
    server.close();
});
