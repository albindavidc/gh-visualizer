import app from './dist-vercel/index.js';
import http from 'http';
const server = http.createServer(app);
server.listen(3001, async () => {
    try {
        const res = await fetch('http://localhost:3001/api/github?username=albindavidc');
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Body:", text.slice(0, 100));
    } catch(e) {
        console.error("Crash:", e);
    }
    server.close();
});
