const User = require('../models/userSchema');
const Product = require('../models/productSchema');
const Order = require('../models/orderSchema');
const jwt = require('jsonwebtoken'); 

//create new order
module.exports.createOrder = async (req, res, next) => {
    // Destructure user input in the body
    const { userId, productId, quantity } = req.body;

    // Check if the token and userId match
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            const token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.SECRET_JWT);

            // Check if the decoded ID matches the user's ID
            if (userId !== decoded.id) {
                console.log(userId, decoded.id);
                return res.status(400).send('Error. Invalid Credentials.');
            }
        } catch (error) {
            console.error(error);
            return res.status(401).send('Error. Failed to Authenticate.');
        }
    } else {
        // No authorization header found
        return res.status(401).send('Error. Token Not Provided.');
    }

    // Check if user is admin
    const confirmUser = await User.findById(userId);
    console.log(confirmUser.isAdmin);
    if (confirmUser.isAdmin) {
        return res.status(400).send('Admins Should Not Checkout Orders.');
    }

    try {
        if (!userId || !productId || !quantity) {
            return res.status(400).send('Please input values for all fields.');
        }
        // Create a new Order
        const newOrder = await Order.create({
            userId,
            productId,
            quantity,
        });
        newOrder.save();
        if (newOrder) {
            return res.status(201).json({ message: 'Success! Your Order is Now Being Processed.' });
        } else {
            return res.status(500).send('Unable to Process Order.');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An Error Occurred. Process Aborted.' });
    }
};

//get orders made by an authenticated user
module.exports.singleUserOrders = async(req, res) => {
	try {
        // Check if the token and userId match
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                // Get token from header
                const token = req.headers.authorization.split(' ')[1];

                // Verify token
                const decoded = jwt.verify(token, process.env.SECRET_JWT);

                // Check if the decoded ID matches the user's ID
                if (req.params.userId !== decoded.id) {
                    console.log(req.params.userId, decoded.id);
                    return res.status(400).send('Error. Invalid Credentials.');
                }
            } catch (error) {
                console.error(error);
                return res.status(401).send('Error. Failed to Authenticate.');
            }
        } else {
            // No authorization header found
            return res.status(401).send('Error. Token Not Provided.');
        }

        const {userId} = req.params;
	    // Check if user is admin
        const isUserAdmin = await User.findById(userId);
        console.log(isUserAdmin.isAdmin);
        if (isUserAdmin.isAdmin) {
            return res.status(400).send('Admins Do NOT Have Orders.');
        }
        //look for orders made by user
	    const userOrders = await Order.find({ userId: userId });
	    // Send the userCourses array as JSON response
	    res.status(200).json({ message: 'User Orders Retrieved', orders: userOrders });
	} catch (error) {
	    console.error(error);
	    res.status(500).json({ error: 'Server Error. Cannot get the courses enrolled by the user.' });
	}
}

//get all orders from all users -- admin only --
module.exports.getAllOrders = async(req, res) => {
	try{
		const allOrders = await Order.find({});
		if(!allOrders){
			console.log(allOrders);
			return res.status(404).send('Cannot Retrieve Orders');
		}
		return res.status(200).json({totalOrders: allOrders.length, products: allOrders});
	}catch(err){
		console.log(err);
		res.status(500).send('An Error Occured');
	}
}