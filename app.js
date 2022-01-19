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

// Set up mongoose
const mongoose = require('mongoose');

// Create and connect to todolistDB
const database = "todolistDB";
mongoose.connect("mongodb://localhost:27017/" + database, function (err) {
    if(err)
        console.log(err);
    else
        console.log("Connected to " + database + " database.");
});

// Create itemSchema
const itemSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    }
});

// Validate that item value is not falsy or all whitespace.
itemSchema.path("value").validate(function(val) {
   return !!(!!val && val.trim());
});

// Create Item model based on itemSchema
const Item = mongoose.model("Item", itemSchema);

// Create listSchema
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
})

// Create List model based on listSchema
const List = mongoose.model("List", listSchema);

// Create default list items
const defaultItems = [
    { value: "Click the + icon or hit enter to add a new item to this list." },
    { value: "<-- Click on this to remove this item from this list." },
    { value: "Click on the trash icon to delete this list." }
];

// GET Home Page
app.get("/", function(req, res) {

    let mainListName = "To-Do";

    List.findOne({ name: mainListName }, function(err, thisList) {

        if(err)
            console.log(err);
        else {

            if(!thisList) {

                console.log("Creating " + mainListName + " List with default items.");

                let mainList = new List({
                    name: mainListName,
                    items: defaultItems
                });

                // Insert default items into the list
                mainList.save(function(err) {
                    if(err)
                        console.log(err);
                    else {
                        console.log("Default items are inserted into " + mainListName + " List.");
                        res.redirect("/");
                    }
                });
            } else {
                console.log("Showing " + thisList.name + " List.");
                res.render("list", {date: date.currentDateText, day: date.currentDayName, title: thisList.name , todo: thisList.items});
            }
        }
    });
});

// Redirect GET Main List Path to Home Page
app.get("/To-Do", function(req, res) {
   res.redirect("/");
});

// GET Custom List Page
app.get("/:listName", function(req, res) {

    let customListName = req.params.listName;

    List.findOne({ name: customListName }, function(err, thisList) {

        if(err)
            console.log(err);
        else {

            if(!thisList) {

                console.log("Creating " + customListName + " List with default items.");

                let newList = new List({
                    name: customListName,
                    items: defaultItems
                });

                // Insert default items into the list
                newList.save(function(err) {
                    if(err)
                        console.log(err);
                    else {
                        console.log("Default items are inserted into " + customListName + " List.");
                        res.redirect("/" + customListName);
                    }
                });
            } else {
                console.log("Showing " + thisList.name + " List.");
                res.render("list", {date: date.currentDateText, day: date.currentDayName, title: thisList.name , todo: thisList.items});
            }
        }
    });
});

// POST to Main/Custom List Page: Add Item / Drop List
app.post("/:listName", function(req, res) {

    let customListName = req.params.listName;

    let clickedButton = req.body.button;

    console.log("The " + clickedButton + " button was clicked.");

    List.findOne({ name: customListName }, function(err, customList) {

        if(err)
            console.log(err);
        else {
            if(clickedButton === "clear") {
                customList.collection.drop(function(err){
                    if(err)
                        console.log(err);
                    else {
                        console.log(customListName + " List deleted.");
                        res.redirect("/");
                        // Redirect to Main List when a custom list is deleted to prevent the custom list from being created again.
                    }
                });
            } else if(clickedButton === "add") {

                let newItemInput = req.body.newItem;

                let newItem = new Item({ value: newItemInput });

                customList.items.push(newItem);

                customList.save(function(err) {
                    if(err)
                        console.log(err);
                    else
                        console.log(newItem + " is inserted into " + customListName + " List.");
                });
                res.redirect("/" + customListName);
            }
        }
    });
});

app.post("/:listName/check", function(req, res) {

    let checkedItemId = req.body.itemId;
    let listName = req.body.listName;

    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function(err, thisList) {
        if(err)
            console.log(err);
        else {
            console.log(thisList);
            res.redirect("/" + listName);
        }
    });
});

// Listen at port 3000
const port = 3000;

app.listen(port, function() {
    console.log("Server running on port " + port);
});