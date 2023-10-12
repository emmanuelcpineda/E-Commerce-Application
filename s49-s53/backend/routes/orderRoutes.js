const order = require('../controllers/orderControllers');
const express = require('express');
const {verifyUser, verifyIfAdmin} = require('../middlewares/authenticate');

//use express router
const router = express.Router();

//create a new order
//@url http://localhost:4500/app/orders/checkout
router.post('/checkout', verifyUser, order.createOrder);

//retrieve authenticated user's orders
//@url http://localhost:4500/app/orders/myPurchases/:userId
router.get('/myPurchases/:userId', verifyUser, order.singleUserOrders);

//Retrieve all orders
//@url http://localhost:4500/app/orders/
router.get('/', verifyUser, verifyIfAdmin, order.getAllOrders);

module.exports = router;