const express = require('express');
const userController = require('../controllers/userControllers');
const {verifyUser, verifyIfAdmin} = require('../middlewares/authenticate');

//use router
const router = express.Router();

//create user
//@url http://localhost:4500/app/users/signUp
router.post('/signUp', userController.createUser);

//check if email exists
//@url http://localhost:4500/app/users/
router.post('/', userController.ifUserEmailExist);

//user logIn
//@url http://localhost:4500/app/users/login
router.post('/login', userController.userLogin);

//get all information of all users
//@url http://localhost:4500/app/users/all
router.get('/all', verifyUser, verifyIfAdmin, userController.getAllInfo);

//get a user information
//@url http://localhost:4500/app/users/info
router.get('/info/:userId', verifyUser, userController.getUserInfo);

//make a user an admin
//@url http://localhost:4500/app/users/setToAdmin/:userId
router.put('/setToAdmin/:userId', verifyUser, verifyIfAdmin, userController.makeAdmin);


module.exports = router;