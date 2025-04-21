// test-env.js

const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('Environment variables loaded successfully');
}

console.log('MONGO_URI from test-env.js:', process.env.MONGO_URI);
