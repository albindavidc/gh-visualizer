process.env.NODE_ENV = 'production';
process.env.PORT = '3000'; // Vercel sets PORT usually
const app = require('./dist/server.cjs').default || require('./dist/server.cjs');
console.log("App loaded");
