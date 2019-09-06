const express = require('express');
const server = express();
const projectsRouter = require('./projects/projectsRouter');

// <----- GLOBAL MIDDLEWARE ----->
server.use(express.json());

// <----- CUSTOM MIDDLEWARE ----->
// globally
server.use(logger);

server.use('/api/projects', projectsRouter);

server.get('/', (req, res) => {
  res.send(`It's working.`)
});

function logger(req, res, next) {
  const now = new Date();
  console.log('--------------------');
  console.log(`request path: ${req.path}`);
  console.log(`type of request: ${req.method}`);
  console.log('requested @ ', now);
  next();
};

module.exports = server;