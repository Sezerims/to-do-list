// Set up express
const express = require('express');
const app = express();

// Set up date.js module
const date = require(__dirname + '/date.js');

// Set up urlencoded parser to parse incoming form data.
app.use(express.urlencoded({extended: true}));

// Set up public folder
app.use(express.static('public'));

// Set up ejs
app.set('view engine', 'ejs');

let toDoList = [];

app.get("/", function(req, res) {
    res.render("list", {date: date.currentDateText, day: date.currentDayName, todo: toDoList});
})

app.post("/", function(req, res) {

    let button = req.body.button;
    let newListItem = req.body.newItem;

    if(button === "clear") {
        toDoList = []
    }
    // Check if empty string, null, or all whitespace before pushing into array.
    else if(!!newListItem && !!newListItem.trim()) {
        toDoList.push(req.body.newItem);
    }

    res.redirect("/");
})

// Listen at port 3000
const port = 3000;

app.listen(port, function() {
    console.log("Server running on port " + port);
})