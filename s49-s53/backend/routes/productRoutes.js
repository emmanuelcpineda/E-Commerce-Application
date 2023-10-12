const product = require('../controllers/productControllers');
const express = require('express');
const {verifyUser, verifyIfAdmin} = require('../middlewares/authenticate');
const router = express.Router();

//to create a new product, for admins only
//@url http://localhost:4500/app/products/add
router.post('/add', verifyUser, verifyIfAdmin, product.createProduct);

//to retrieve all products
//@url http://localhost:4500/app/products/
router.get('/', product.getAllProducts);

//to retrieve all active products
//@url http://localhost:4500/app/products/allActive
router.get('/allActive', product.allActiveProducts);

//to retrieve a single product
//@url http://localhost:4500/app/products/
router.get('/:productId', product.getSingleProduct);

//to update a product
//@url http://localhost:4500/app/products//updateInfo/:productId
router.put('/updateInfo/:productId', verifyUser, verifyIfAdmin, product.updateProductInfo);

//to set product status to NOT Active
//@url http://localhost:4500/app/products/setToNotActive
router.put('/setToNotActive', verifyUser, verifyIfAdmin, product.notActive);

//to set product status to Active
//@url http://localhost:4500/app/products/setToNotActive
router.put('/setToActive', verifyUser, verifyIfAdmin, product.active);

module.exports = router;
