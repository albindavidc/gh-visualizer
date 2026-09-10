import { config } from 'dotenv';
config();
console.log("Token in .env is:", process.env.GH_TOKEN);
