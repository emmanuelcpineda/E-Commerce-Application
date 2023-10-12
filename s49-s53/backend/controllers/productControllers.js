const Product = require('../models/productSchema');
const User = require('../models/userSchema');
const cloudinary = require('../middlewares/cloudinary');

//to add new products
module.exports.createProduct = async(req, res) => {
	//destructure user input in the body
	const { name, description, price, productImage} = req.body;
	
	//upload to cloudinary
	const productImg = await cloudinary.uploader
	.upload(productImage, 
	{
		upload_preset: 'UnsignedUpload',
		resource_type: 'image',
		allowed_formats: ['png', 'jpg', 'jpeg', 'jfif']
	},
	function(error, result) {
		error? console.warn(error) : console.log(result); });

	if(!name || !description || !price || !productImage)
	{
		return res.status(400).send('Please input value on all fields.');
	}
	//to lessen product redundancy
	const isProduct = await User.findOne({name})
	if(isProduct){
		return res.status(400).send(`${userExist.description} already exists.
				If you wish to create a new product, input different information.`);
	}
	console.log(productImg.public_id)
	const imgUrl = productImg.public_id;
	//create new product
	const newProduct = await Product.create({
		name,
		description,
		price,
		productImage: imgUrl,
	});
	newProduct.save();
	if(newProduct)
	{
		return res.status(201).json(newProduct);
	}
	else 
	{
		return res.status(400).send('Invalid User Data');
	}
};

// to retrieve all products
module.exports.getAllProducts = async(req, res) => {
	try{
		const allProducts = await Product.find({});
		if(!allProducts){
			console.log(allProducts);
			return res.status(404).send('Cannot Retrieve Products');
		}
		return res.status(200).json({totalProducts: allProducts.length, products: allProducts});
	}catch(err){
		console.log(err);
		res.status(500).send('An Error Occured');
	}
};

// to retrieve all active products
module.exports.allActiveProducts = async(req, res) => {
	try{
		const allProducts = await Product.find({isActive: true});
		if(!allProducts){
			console.log(allProducts);
			return res.status(404).send('Cannot Retrieve Products');
		}
		return res.status(200).json({totalProducts: allProducts.length, products: allProducts});
	}catch(err){
		console.log(err);
		res.status(500).send('An Error Occured');
	}
};

// to retrieve a single product
module.exports.getSingleProduct = async(req, res) => {
	try{
		const product = await Product.findById(req.params.productId);
		if(!product){
			console.log(product);
			return res.status(404).send('Cannot Retrieve Products');
		}
		return res.status(200).json({item: product});
	}catch(err){
		console.log(err);
		res.status(500).send('An Error Occured');
	}
};

//to update information of a product
module.exports.updateProductInfo = async(req, res) => {
	try{
		let newInfo = {
	        name : req.body.name,
	        description : req.body.description,
	        price : req.body.price
	    };

	    return Product.findByIdAndUpdate(req.params.productId, newInfo).then((course, error) => {
	        if(error){
	            return res.status(404).send('An Error Occured. Unable to Update Product.')
	        }else{
	            return res.status(200).json({newProductInfo: newInfo});
	        }
	    })
	}catch(err) {
		console.log(err);
		res.status(500).send('An Error Occured. Process Aborted.');
	}
}

// to set the status of a product to NOT Active
module.exports.notActive = async(req, res) => {
	return Product.findById(req.body.productId).then((result, err) => {
        if(err) 
        {
            console.log(err);
            return res.send(err).status(400);
        }
        result.isActive = false;
        result.save();
        return res.send(result).status(200);
    })
}

// to set the status of a product to Active
module.exports.active = async(req, res) => {
	return Product.findById(req.body.productId).then((result, err) => {
        if(err) 
        {
            console.log(err);
            return res.send(err).status(400);
        }
        result.isActive = true;
        result.save();
        return res.send(result).status(200);
    })
}

