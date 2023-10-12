const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const dotenv = require('dotenv').config();

//Token creation 
    const userToken = (user) => {
        const data = {
            id : user._id,
            email : user.email,
            isAdmin : user.isAdmin
        };
        return jwt.sign(data, process.env.SECRET_JWT, {});      
    };

 

//Token Verification
    const verifyUser = (req, res, next) => {
        console.log(req.headers.authorization);

        //contains the token to be passed and verified
        let token = req.headers.authorization;

        //verify if the token passed is a genuine token
        if(typeof token === "undefined"){
            return res.send({auth: "Invalid Request. Token Does Not Exist."});
        } else {
            console.log(token);     
            token = token.slice(7, token.length);
            console.log(token);

    		//Token decryption and validation
            jwt.verify(token, process.env.SECRET_JWT, (err, decodedToken) => {
                if(err){
                    return res.send({
                        auth: "NOT Authorized",
                    });
                } else {
                    console.log(decodedToken);                
                    req.user = decodedToken
                    next();
                }
            })
        }
    };




// verify if a authenticated user is an admin or not
const verifyIfAdmin = async(req, res, next) => {
    try{
        const user = await User.findById(req.user.id);
        if(user.isAdmin){
            console.log(user.name + ' is Admin? ' + user.isAdmin);
            next();
        } else {
            return res.send({
                auth: "Failed",
                message: "Invalid request. Access Denied."
            })
        }
    } catch(err) {
        console.error(err);
        return res.status(500).send('An error Occured. Process Aborted.')
    }
}

module.exports = {userToken, verifyUser, verifyIfAdmin};