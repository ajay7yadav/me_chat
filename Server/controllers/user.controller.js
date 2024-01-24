const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');

module.exports.login = async (req, res) => {
    let { username, email, password } = req.body;
    try {

        username = String(username).toLowerCase();
        email = String(email).toLowerCase();

        // Check same userName
        const checkUserName = await User.findOne({ username });
        if (checkUserName) return res.status(400).send({ status: false, message: "Username already exists !" });

        // Check same email
        const checkEmail = await User.findOne({ email });
        if (checkEmail) return res.status(400).send({ status: false, message: "email already exists !" });

        let hashPassword = await bcrypt.hash(password, 10);

        const users = await User.create({
            username,
            email,
            password : hashPassword
        });

        delete users.password;
        return res.status(201).send({
            status : true,
            data : users
        })

    } catch (err) {
        return res.status(500).send({ status: false, message: "We are working on it, Internal error !" });
    }
}

module.exports.signin = async (req, res) => {
    let { username, password } = req.body;
    try {

        username = String(username).toLowerCase();

        // Check same userName
        let user = await User.findOne({ username });
        if (!user) return res.status(404).send({ status: false, message: "user not found !" });

        // Check password
        let comparePass = await bcrypt.compare(password, user.password);
        if(!comparePass) return res.status(400).send({ status: false, message: "password not matched !" });

        delete user.password;
        return res.status(201).send({
            status : true,
            data : user
        });

    } catch (err) {
        return res.status(500).send({ status: false, message: "We are working on it, Internal error !" });
    }
}

module.exports.setAvatar = async (req, res) => {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    try {

        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet : true,
            avatarImage
        });
        
        return res.status(201).send({
            isSet : userData.isAvatarImageSet,
            image : userData.avatarImage
        });

    } catch (err) {
        return res.status(500).send({ status: false, message: "We are working on it, Internal error !" });
    }
}

module.exports.allUsersRoutes = async(req, res) =>{
    const userId = req.params.id;
    try {
        // find all users not including requested user
        const users = await User.find({_id : {$ne : userId }}).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ]);
                
        return res.status(200).send(users);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: false, message: "We are working on it, Internal error !" });
    }
}