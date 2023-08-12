const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/userModel');

var salt = bcrypt.genSaltSync(10);

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'An account has already been created utilizing the provided email address.'
                });
            } else {
                bcrypt.hashSync(req.body.password, salt, (err, hashedPass) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            email: req.body.email,
                            password: hashedPass
                        });
                        user
                            .save()
                            .then(result => {
                                console.log('User created : ' + result);
                                res.status(201).json({
                                    message: 'User created',
                                    username: req.body.username,
                                    email: req.body.email,
                                    password: hashedPass
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if ( user.length < 1 ) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            } 
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err){
                    return res.status(401).json({
                        message: 'Auth Failed'
                    });
                }
                if(result){
                    const token = jwt.sign({ 
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    process.env.JWT_KEY, 
                    {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({
                        message: 'Auth Successful',
                        token: token,
                        userId: user[0]._id,
                        quantity: user[0].quantity
                    });
                }
                res.status(401).json({
                    message: 'Auth Failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted.'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;