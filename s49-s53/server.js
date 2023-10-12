//import dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const colors = require('colors');
const users = require('./backend/routes/userRoutes');
const products = require('./backend/routes/productRoutes');
const orders = require('./backend/routes/orderRoutes');
const cart = require('./backend/routes/cartRoutes');
const auth = require('./backend/middlewares/authenticate');
const cloudinary = require('./backend/middlewares/cloudinary');

const PORT = process.env.PORT || 4022;
const api = express();

api.use(cors());
api.use(express.json({limit: '50mb'}));
api.use(express.urlencoded({extended:true, limit: '50mb '}));

//backend routes
//@url http://localhost:4022/b22/users
api.use('/b22/users', users);

//@url http://localhost:4022/b22/products
api.use('/b22/products', products);

//@url http://localhost:4022/b22/orders
api.use('/b22/orders', orders);

//@url http://localhost:4022/b22/cart
api.use('/b22/cart', cart);

//DB connection
const DBCONN = mongoose.connect(process.env.DB_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.connection.once('open', () => console.log('MongoDB Atlas Connection Granted!'.blue.bold.italic.underline));

//check if server listens to the right port
if(require.main === module)
{
	api.listen(PORT, () => console.log(`Server is now online at port:${PORT}`.blue.bold.italic));
}



module.exports = {api, mongoose}