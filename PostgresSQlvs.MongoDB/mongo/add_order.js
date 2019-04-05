var addOrder = function (userEmail, recipeName) {
    var recipe = db.recipes.findOne({
        name: recipeName
    });
    if (!recipe) {
        throw "Recipe with name " + recipeName + " not found";
    }
    var user = db.users.findOne({
        email: userEmail
    })
    if (!user) {
        throw "User with email " + userEmail + " not found";
    }
    recipe.ingredients.forEach(function (ingredient) {
        var inventoryItem = db.inventories.findOne({
            "_id": ingredient.ingredientRef
        })
        if (inventoryItem.quantity - ingredient.quantity < 0) {
            throw "Not enough " + ingredient.ingredientRef + " to make " + recipeName
        }
        db.inventories.update({
            _id: ingredient.ingredientRef,
        }, {
            $set: {
                quantity: inventoryItem.quantity - ingredient.quantity
            }
        })
    })
    db.orders.insert({
        user: user._id,
        recipe: recipe._id,
        createDate: new Date()
    });
}

db.system.js.save({
    '_id': 'addOrder',
    value: addOrder
})
