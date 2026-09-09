process.env.NODE_ENV = 'production';
process.env.VERCEL = '1';
import('./server.ts').then(mod => {
    console.log("Loaded", mod);
}).catch(err => {
    console.error("Crash:", err);
});
