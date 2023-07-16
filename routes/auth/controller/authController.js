const fs = require('fs');
const AppError = require('../../../utils/AppError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const userControler = require('../../../controllers/userController');

async function signJwt(payload) {

    const token = jwt.sign(payload, process.env.JWT_SECRET || "mapupassignment the nodejs way" , {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });

    return token;
}

module.exports = {

    async signup(req, res,next) {
        try {
            if (!req.body) {
                return next(new AppError('Please provide a valid data', 400));
            }

            const { email, password, passwordConfirm } = req.body;

            if (!email || !password || !passwordConfirm) {
                return next(new AppError('Please provide a valid data', 400));
            }

            if (password !== passwordConfirm) {
                return next(new AppError('Password and Password Confirm must be same', 400));
            }

            let user = await userControler.getUserByEmail(email);

            if (user) {
                return next(new AppError('User already exist', 400));
            }

            const salt = await bcrypt.genSalt(10);

            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await userControler.createUser({
                email,
                password: hashedPassword
            });

            console.log(newUser.id);

            let token = await signJwt({ id: newUser.id });

            console.log(token,'token');

            res.status(201).json({
                status: 'success',
                token  
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req, res, next) {
        try {
            if (!req.body) {
                return next(new AppError('Please provide a valid data', 400));
            }

            const { email, password } = req.body;

            if (!email || !password) {
                return next(new AppError('Please provide a valid data', 400));
            }

            const user = await userControler.getUserByEmail(email);

            if (!user) {
                return next(new AppError('User not found', 401));
            }

            const isPasswordCorrect = await userControler.verifyPassword(password, user.password);

            if (!isPasswordCorrect) {
                return next(new AppError('Invalid password', 401));
            }

            let token = await signJwt({ id: user.id });

            res.status(200).json({
                status: 'success',
                token
            });
        } catch (error) {
            next(error);
        }
    }
}