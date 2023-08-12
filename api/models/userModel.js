const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note'}, //store the id of note thats related to the user
    quantity: { type: Number, default: 0 },
    username: { type: String },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        // ^ this is very basic validation using regex ^
    },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);