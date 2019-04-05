var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pizza');
mongoose.set('debug', true);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    var usersSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        email: {type: String, required: true, unique: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        address1: {type: String, required: true},
        address2: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        zip: {type: String, required: true}
    });
    var Users = mongoose.model('Users', usersSchema);

    var inventorySchema = mongoose.Schema({
        _id: String,
        name: {type: String, required: true, unique: true},
        description: {type: String, required: true},
        quantity: {type: Number, min: 0, required: true}
    });
    var Inventory = mongoose.model('Inventory', inventorySchema);

    var recipesSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        name: {type: String, required: true},
        description: {type: String, required: true},
        ingredients: [{
            quantity: {type: Number, min: 0, required: true},
            ingredientRef: {type: String, ref: 'Inventory', required: true}
        }]
    });
    var Recipes = mongoose.model('Recipes', recipesSchema);

    var ordersSchema = mongoose.Schema({
        user: {type: String, ref: 'Inventory', required: true},
        recipe: {type: String, ref: 'Inventory', required: true},
        createDate: {type: Date, default: Date.now}
    });
    var Orders = mongoose.model('Orders', ordersSchema);
    ordersSchema.methods.addOrder = function (userEmail, recipeName) {
        Recipes.findOne({
            name: recipeName
        })
        .exec(function (err, recipe) {
            if (!recipe) {
                throw "Recipe with name " + recipeName + " not found";
            }
            Users.findOne({
                email: userEmail
            })
            .exec(function (err, user) {
                if (!user) {
                    throw "User with email " + userEmail + " not found";
                }
                recipe.ingredients.forEach(function (ingredient) {
                    Inventory.findOne({
                        _id: ingredient.ingredientRef
                    }, function (err, inventoryItem) {
                        console.log(inventoryItem.quantity - ingredient.quantity)
                        if (inventoryItem.quantity - ingredient.quantity < 0) {
                            throw "Not enough " + ingredient.ingredientRef.$id + " to make " + recipeName
                        }
                        inventoryItem.quantity = inventoryItem.quantity - ingredient.quantity;
                        inventoryItem.save();
                    })
                })

                var order = new Orders({
                    user: user._id,
                    recipe: recipe._id
                });
                order.save().then(function () {
                    console.log("Created new order!");
                })
            });
        });
    };

    // Test of addOrder method and schema objects
    ordersSchema.methods.addOrder('flewis@mccoy-richardson.com', 'Alexis');
});
