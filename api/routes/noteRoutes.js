const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const AuthMiddleware = require('../middleware/auth');
const Note = require('../models/noteModel');
const User = require('../models/userModel');

router.get('/', AuthMiddleware, (req, res, next) => {  // don't write noteRoutes again. It would be noteRoutes/noteRoutes
    Note.find({ user: req.userData.userId })
    .select('-__v')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            notes: docs
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', AuthMiddleware, (req, res, next) => {
    console.log('req body: ' + req.body + '\n');

    const note = new Note({
        _id: new mongoose.Types.ObjectId(),
        user: req.userData.userId,
        title: req.body.title,
        text: req.body.text,
    });

    note
        .save()
        .then(result => {
            console.log('saved note body: ' + result);

            // Increment the user's quantity by 1 after saving the note
            User.findByIdAndUpdate(req.userData.userId, { $inc: { quantity: 1 } })
                .exec()
                .then(updatedUser => {
                    if (!updatedUser) {
                        throw new Error('User not found');
                    }
                    res.status(201).json({
                        message: 'Note created successfully',
                        quantity: req.userData.quantity,
                        title: req.body.title,
                        text: req.body.text
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
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

router.get('/:noteId', AuthMiddleware, (req,res,next) => {
    const id = req.params.noteId;
    Note.findById(id)
        .select('-__v') // if you want to exclude some property from a response, you can put a minus in front of it in select
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc){
                return res.status(200).json(doc); // The purpose of adding return here is to make the following res not work if a doc exists.
            }
            res.status(404).json({message: 'No valid entry found.'});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

//only updates existing properties, can't add new properties
router.patch('/:noteId', AuthMiddleware, (req, res, next) => {
    const id = req.params.noteId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Note.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:noteId', AuthMiddleware, (req, res, next) => {
    const id = req.params.noteId;
    Note.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;