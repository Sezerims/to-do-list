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

    /*
    const dayOfWeek = currentDate.getDay(); // Sun: 0, ... Sat: 6
    const dayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth(); // Jan: 0, ... Dec: 11
    const currentYear = currentDate.getFullYear();

    const currentDayName = dayName(dayOfWeek);
    const currentMonthName = monthName(currentMonth);

    const currentDateText = currentMonthName + " " + dayOfMonth + ", " + currentYear;
    */

    let options = {
        // weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    // currentDate.toLocaleString() = currentDate.toLocaleDateString() + currentDate.toLocaleTimeString()
    const currentDateText = currentDate.toLocaleDateString("en-US", options);
    const currentDayName = currentDate.toLocaleDateString("en-US", {weekday: 'long'});
    // Pass [] into locales for the default location.

    res.render("list", {date: currentDateText, day: currentDayName, todo: toDoList});
    // res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {
    toDoList.push(req.body.newItem);

    res.redirect("/");
})

// Listen at port 3000
const port = 3000;

app.listen(port, function() {
    console.log("Server running on port " + port);
})

/*
function dayName(dayNumber) {
    switch (dayNumber) {
        case 0:
            return "Sunday";
            break;
        case 1:
            return "Monday";
            break;
        case 2:
            return "Tuesday";
            break;
        case 3:
            return "Wednesday";
            break;
        case 4:
            return "Thursday";
            break;
        case 5:
            return "Friday";
            break;
        case 6:
            return "Saturday";
            break;
    }
}

function monthName(monthNumber) {
    switch (monthNumber) {
        case 0:
            return "January";
            break;
        case 1:
            return "February";
            break;
        case 2:
            return "March";
            break;
        case 3:
            return "April";
            break;
        case 4:
            return "May";
            break;
        case 5:
            return "June";
            break;
        case 6:
            return "July";
            break;
        case 7:
            return "August";
            break;
        case 8:
            return "September";
            break;
        case 9:
            return "October";
            break;
        case 10:
            return "November";
            break;
        case 11:
            return "December";
            break;
    }
}
*/