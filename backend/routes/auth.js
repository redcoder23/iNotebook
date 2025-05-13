const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "harryisagoodb$oy"; 
const fetchuser=require("../middleware/fetchuser");

// router.post('/',async(req,res)=>{ 
//     // obj={
//     //     a:'thios',
//     //    number:34 
//     //   }
//     // res.json(obj);    
//     // res.send(req.body);

//     const user= new User(req.body);  
//     await user.save(); 
// })


//route 1 :create a user using:POST"/api/auth/createuser" .No login required
router.post('/createuser', [
    body('email').isEmail().withMessage('Email must be valid').notEmpty().withMessage('Email is required'),
    body('password').isLength({ min: 5 }).withMessage('password must be at least 5 characters'),
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 1 }).withMessage('Names must be valid'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array().map(err => ({
                field: err.param, msg: err.msg
            }))
        });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const savedpassword = await bcrypt.hash(req.body.password, salt);
        const user = new User(req.body);
        user.password = savedpassword
        const ext = await User.findOne({ email: req.body.email });
        if (!ext) {
            await user.save();
            const data = {
                user: { id: user.id }
            }
            const jwtdata = jwt.sign(data, JWT_SECRET);
            console.log(jwtdata);
            return res.status(201).json({
                message: 'User created successfully',
                token: jwtdata,
                user: { id: user.id, name: user.name, email: user.email }
            });
        }
        return res.status(400).json({ message: 'email already exists' });
    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({
                errors: [{ field: 'email', msg: 'Email already exists (DB check)' }]
            });
        }
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

// route2: authenticate a user using post "/api/auth/login " no login required 
router.post('/login', [
    body('email').isEmail().withMessage('Email must be valid').notEmpty().withMessage('Email is required'),
    body('password').isLength({ min: 5 }).withMessage('password must be at least 5 characters'),
], async (req, res) => {
    //if there are errors,return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "enter valid credential" });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ error: "enter valid credential" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        return res.json({ authtoken });
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error");
    }
});

//router 3: get loggedin user details using post:/api/auth/getuser" login required 
router.post('/getuser', fetchuser, async (req, res) => {
    //if there are errors,return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
       const userId = req.user.id; 
    //    console.log(userId);
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
          res.status(500).send("Internal Server error");
    }
});  
 
//route 4
module.exports = router;