const Cart = require('../models/cartSchema');
const User = require('../models/userSchema');
const Product = require('../models/productSchema');
const jwt = require('jsonwebtoken');

//to add an item into the cart
module.exports.addItem = async(req, res) => {
	const {userId, productId, quantity} = req.body;

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

    // Check if the user is an admin
    const confirmUser = await User.findById(userId);

    if (!confirmUser) {
        return res.status(404).send('User not found.');
    }

    if (confirmUser.isAdmin) {
        return res.status(400).send('Admins Should Not Add Items to the Cart.');
    }

    try {
        // Fetch the current product details, including its price
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found.');
        }

        // Calculate the total price for this item in the cart
        const totalPrice = product.price * quantity;

        // Add the product to the user's cart with the current price
        await Cart.findOneAndUpdate(
            { userId },
            {
                $push: {
                    products: {
                        productId,
                        quantity,
                        price: product.price, // Store the current product price
                    },
                },
            },
            { new: true, upsert: true }
        );

        // Respond with a success message
        return res.status(200).json({ message: `Item added to the cart: ${product.name}.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server Error. Failed to add item to the cart.' });
    }

}

//to get all items in the cart
module.exports.getAllItems = async(req, res) => {
	try{
		const allItems = await Cart.find({});
		if(!allItems) {
			return res.status(404).send('Error. Cannot Find Items.');
		}
		return res.status(200).json({message: 'All Products:', items: allItems});

	}catch(error) {
        console.error(error);
        return res.status(500).json({ error: 'Server Error. Failed to add item to the cart.' });
    }
}

// to calculate total price of all items in the cart
module.exports.calculateTotalPrice = async (req, res) => {
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
    const cart = await Cart.findOne({userId});

    if (!cart) {
        return 0;
    }

    let totalPrice = 0;

    for (const item of cart.products) {
        // Fetch the current product price from the database (in case it has changed)
        const product = await Product.findById(item.productId);

        if (product) {
            // Use the current product price for the calculation
            totalPrice += product.price * item.quantity;
        }
    }

    return res.status(200).json({message: 'total price of all items', total: totalPrice});
};

// to update/change quantity of an item in the cart
module.exports.updateItemQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity} = req.body;

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

        // Update the quantity of the product in the user's cart
        await Cart.updateOne(
            { userId, 'products.productId': productId },
            { $set: { 'products.$.quantity': quantity } }
        );
        // Respond with a success message
        return res.status(200).json({ message: `Sucess! New Quantity Updated.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server Error. Failed to update quantity.' });
    }
};

// to remove an item from the cart
module.exports.removeItem = async(req, res) => {
	const {itemId} = req.params;
	try {
        // Find the item in the cart by its unique identifier
        const removedItem = await Cart.findOneAndDelete({ 'products._id': itemId });
        if (!removedItem) {
        	console.log(removedItem);
            return res.status(404).send('Item not found in the cart.');
        }

        return res.status(200).send(`Item ${removedItem.products[0].productId} has been successfully removed.`);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server Error. Failed to remove item from the cart.' });
    }
}

// to compute the subtotal of each item in the cart
module.exports.computeSubtotal = async (req, res) => {
    const { userId } = req.params;

    try {
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

        // Fetch the user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send('Cart not found.');
        }

        // Calculate the subtotal for each item in the cart
        const cartWithSubtotals = cart.products.map((item) => ({
            ...item,
            subtotal: item.quantity * item.price,
        }));

        return res.status(200).json({ message: 'Subtotal of each item:', cart: cartWithSubtotals });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server Error. Failed to compute subtotals.' });
    }
};