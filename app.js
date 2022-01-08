// Set up express
const express = require('express');
const app = express();

// Set up urlencoded parser to parse incoming form data.
app.use(express.urlencoded({extended: true}));

// Set up ejs
app.set('view engine', 'ejs');

// Set up public folder
app.use(express.static('public'));

let toDoList = [];

app.get("/", function(req, res) {

    // new Date() -with no arguments- returns the current date.
    const currentDate = new Date();

    let options = {
        // weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    // currentDate.toLocaleString() = currentDate.toLocaleDateString() + currentDate.toLocaleTimeString()
    const currentDateText = currentDate.toLocaleDateString([], options);
    const currentDayName = currentDate.toLocaleDateString([], {weekday: 'long'});
    // Pass [] into locales for the default location.

    res.render("list", {date: currentDateText, day: currentDayName, todo: toDoList});
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

    console.log(req.body)

    res.redirect("/");
})

// Listen at port 3000
const port = 3000;

app.listen(port, function() {
    console.log("Server running on port " + port);
})