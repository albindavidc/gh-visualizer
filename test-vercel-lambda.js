import app from './dist-vercel/index.js';
import http from 'http';

const server = http.createServer(app);
server.listen(3001, async () => {
    try {
        const res = await fetch('http://localhost:3001/api/graph?username=albindavidc');
        const text = await res.text();
        if (res.status === 200 && text.startsWith('<svg')) {
            console.log("Vercel bundle smoke test passed!");
        } else {
            console.error("Failed!", res.status, text.slice(0, 100));
        }
    } catch(e) {
        console.error("Crash during request:", e);
    }
    server.close();
});
