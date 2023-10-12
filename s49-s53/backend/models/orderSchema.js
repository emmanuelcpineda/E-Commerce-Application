const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	products: [
		{
			productId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
				required: true
			},
			quantity: {
				type: Number,
				required: true
			}
		}
	],
	totalAmount: {
		type: Number,
	},
	purchasedOn: {
		type: Date,
		default: new Date(),
	}
	
}, {timestamps:true});

module.exports = mongoose.model('Order', orderSchema);