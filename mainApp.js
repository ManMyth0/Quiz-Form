// main location of the app and its required components

// require dependencies
require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// require needed modules / components
// const testPost = require('./routes/testPost.js');
const testGet = require('./routes/testGet.js');

// start the server
app.listen(PORT, () =>
    console.log(`Connected, Listening on port: ${ PORT }`) 
);

// test static middleware for frontend access
app.use(express.static('./staticPages'));

// use routes here
// app.use("/", testPost);
app.use("/", testGet);

// schema save and route request test
const testSchemaSave = require('./routes/saveNewQuiz.js');
app.use("/", testSchemaSave);