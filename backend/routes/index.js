const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const User = require('../db');  // Updated import
const { JWT_SECRET } = require('../config');
const { signupSchema, signinSchema } = require('../schemas');

router.post('/signup', async (req, res) => {
    try {
        const { success } = signupSchema.safeParse(req.body);
        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs"
            });
        }

        const { username, password, firstName, lastName } = req.body;
        const existingUser = await User.findOne({ username });
        
        if (existingUser) {
            return res.status(411).json({
                message: "Username already exists"
            });
        }

        const user = await User.create({
            username,
            password,
            firstName,
            lastName
        });

        res.json({
            message: 'User created successfully'
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { success } = signinSchema.safeParse(req.body);
        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs"
            });
        }

        const { username, password } = req.body;
        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(411).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({ username }, JWT_SECRET);
        res.json({
            token
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;