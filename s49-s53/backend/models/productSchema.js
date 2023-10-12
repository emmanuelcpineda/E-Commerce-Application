const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Product name is required.']
	},
	description: {
		type: String,
		required: [true, 'Product description is required.']
	},
	price: {
		type: Number,
		required: [true, 'Product price is required.']
	},
	productImage: {
	  	type: String,
	  	required: true 
	},
	isActive: {
		type: Boolean,
		default: true,
		required: true 
	},
	createdOn: {
		type: Date,
		default: new Date(),
		required: true
	}

},{timestamps:true});

module.exports = mongoose.model('Product', productSchema);