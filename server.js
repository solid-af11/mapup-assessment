const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const http = require('http'); 
const app = require('./app'); 

// creating the server
const server = http.createServer(app); 

const port = process.env.PORT || 5000; 

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('EXCEPTION! Shutting down...');
    process.exit(1);
});

server.listen(port,()=>{
    console.log(`Server listening on port : ${port}`); 
}); 


process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('REJECTION! Shutting down...');
    server.close(() => {
      process.exit(1);
    });
});

module.exports = server; 