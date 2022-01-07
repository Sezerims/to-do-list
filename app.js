const express = require('express');

const app = express();

const path = require('path');

app.get("/", function(req, res) {

    res.sendFile(__dirname + "/index.html");
})

const port = 3000;

app.listen(port, function() {
    console.log("Server running on port " + port);
})