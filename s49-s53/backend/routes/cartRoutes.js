const express = require('express');
const {verifyUser, verifyIfAdmin} = require('../middlewares/authenticate');
const cart = require('../controllers/cartControllers');

const router = express.Router();

//route to add product to cart
//@url http://localhost:4500/app/cart/add
router.post('/add', verifyUser, cart.addItem);

//route to get all products in the cart
//@url http://localhost:4500/app/cart/
router.get('/', verifyUser, cart.getAllItems);

//route to calculate total prices of all items in the cart
//@url http://localhost:4500/app/cart/totalPrice/:userId
router.get('/totalPrice/:userId', verifyUser, cart.calculateTotalPrice);

//route to update/change quantity of an item in the cart
//@url http://localhost:4500/app/cart/updateQuantity
router.put('/updateQuantity', verifyUser, cart.updateItemQuantity);

//route to remove a product from cart
//@url http://localhost:4500/app/cart/deleteItem/:itemId
router.delete('/deleteItem/:itemId', verifyUser, cart.removeItem);

//route to compute the subtotal of each item in the cart
//@url http://localhost:4500/app/cart/subtotal/:userId
router.get('/subtotal/:userId', verifyUser, cart.computeSubtotal);

module.exports = router;