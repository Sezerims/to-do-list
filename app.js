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
    _id: Number,
    value: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    }
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
    {_id: 1, value: "Click the + icon or hit enter to add a new item to this list."},
    {_id: 2, value: "<-- Click on this to cross out an item."},
    {_id: 3, value: "Click on the trash icon to delete this list."}
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

                // Insert default items into the items collection
                mainList.save(function(err) {
                    if(err)
                        console.log(err);
                    else {
                        console.log("Default items are inserted into the items collection.");
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

                // Insert default items into the items collection
                newList.save(function(err) {
                    if(err)
                        console.log(err);
                    else {
                        console.log("Default items are inserted into the items collection.");
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

app.post("/check", function(req, res) {

    let checkedItemId = req.body.checkItem;

    console.log(checkedItemId);

    /*
    Item.findOneAndUpdate({ _id: checkedItemId }, {
       checked: true
    }, function(err, item) {
        if(err)
            console.log(err);
        else
            console.log("Item is checked:");
    });
    */

    List.findOne({ name: "To-Do" }, function(err, mainList) {
        if(err)
            console.log(err);
        else
        {
            /*
            Item.findOneAndRemove({ _id: checkedItemId }, function(err) {
                if(err)
                    console.log(err);
                else {
                    console.log("Item removed from the list.");
                    res.redirect("/");
                }
            });
            */
        }
    });

});

// POST to Main/Custom List Page: Add Item / Drop List
app.post("/:listName", function(req, res) {

    let customListName = req.params.listName;

    let clickedButton = req.body.button;

    List.findOne({ name: customListName }, function(err, customList) {

        if(err)
            console.log(err)
        else {
            if(clickedButton === "clear") {
                customList.collection.drop(function(err){
                    if(err)
                        console.log(err);
                    else {
                        console.log(customListName + " List deleted.");
                        res.redirect("/");
                        // Redirect to Main List when a custom list is deleted
                        // to prevent the custom list from being created again.
                    }
                });
            } else if(clickedButton === "add") {
                let newItemInput = req.body.newItem;
                let newId = 1;

                newId = customList.items.length + 1;

                let newItem = new Item({
                    _id: newId,
                    value: newItemInput
                });

                customList.items.push(newItem);

                customList.save(function(err) {
                    if(err)
                        console.log(err);
                    else
                        console.log(newItem + " is inserted into" + customListName + " List.");
                });
                res.redirect("/" + customListName);
            }
        }
    });

    /*
    // Check if empty string, null, or all whitespace before pushing into array.
    else if(!!newListItem && !!newListItem.trim()) {
        toDoList.push(req.body.newItem);
    }
    */
});

// Listen at port 3000
const port = 3000;

app.listen(port, function() {
    console.log("Server running on port " + port);
});