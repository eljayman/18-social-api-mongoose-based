// use express as server
const express = require('express');
// configure db connection
const db = require('./config/connection');
// routes for requests, port for server
const routes = require('./routes');
const PORT = process.env.PORT || 3001;
//instantiate express server
const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// start configured server with mongoose db
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});