const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please input your name']
	},
	email: {
		type: String,
		required: [true, 'Please input your email']
	},
	password: {
		type: String,
		required: [true, 'Please input your password']
	},
	isAdmin: {
		type: Boolean,
		default: false,
		required: true
	}

}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);