const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/authenticate');
const jwt = require('jsonwebtoken');

//to create a new user
module.exports.createUser = async (req, res) => {
	const { name, email, password } = req.body;
	if(!name || !email || !password)
	{
		return res.status(400).send('Please input value on all fields.');
	}
	//to check if user exist
	const userExist = await User.findOne({email})
	if(userExist){
		return res.status(400).send(`${userExist.email} already exists.
				If you wish to create a new account, input different credentials.`);
	}
	//hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	//create user
	const newUser = await User.create({
		name,
		email,
		password: hashedPassword
	});
	newUser.save();
	if(newUser)
	{
		return res.status(201).json({message: `Success! Welcome ${newUser.name}!`})
	}
	else 
	{
		return res.status(400).send('Invalid User Data');
	}
}

//to check if user email already exists
module.exports.ifUserEmailExist = (req, res) => {
	return User.find({email : req.body.email}).then(result => {
		if(result.length > 0){
			return res.status(404).json({message:`${req.body.email} already exists. If you wish to create a new account, input different credentials.`});
		}else{
			return res.status(200).json({message: `${req.body.email} is valid to use.`});
		}
	})
}

//to logIn users
module.exports.userLogin = async (req, res) => {
	try{
		const {email, password} = req.body;
		//find the email of user in the database
		const user = await User.findOne({email});
		if(user && (await bcrypt.compare(password, user.password)))
		{
			return res.status(200).json({message: `Welcome ${user.name}!`,
				_id: user.id, 
				email: user.email,
				token: auth.userToken(user._id)});
		}
		else
		{
			return res.status(400).send('Invalid Email or Password')
		}

	}catch(err){
		console.error(err);
		res.status(500).send('An Error Occured.');
	}
}

// to get all users
module.exports.getAllInfo = async(req, res) => {
	try{
		const allInfo = await User.find({});
		if(!allInfo){
			console.log(allInfo);
			return res.status(404).send('Cannot Retrieve Users');
		}
		return res.status(200).send(allInfo);
	}catch(err){
		console.log(err);
		res.status(500).send('An Error Occured');
	}
}

// to get info of a specific user
module.exports.getUserInfo = async(req, res) => {
	try{
		const user = await User.findById(req.params.userId);
		if(!user){
			console.log(user);
			return res.status(404).send('User NOT Found.');
		}
		return res.status(200).send(user);
	}catch(err){
		console.log(err);
		res.status(500).send('An Error Occured');
	}
}

// to make a user an admin
module.exports.makeAdmin = async (req, res) => {
	const user = await User.findById(req.params.userId);
    try {
        console.log(user);
        user.isAdmin = true;
        user.save();
        console.log(user.isAdmin);
        return res.send(user).status(200);
    } catch(err) {
    	console.log(err);
    	return res.status(500).send('Error. Process Aborted.')
    }
}