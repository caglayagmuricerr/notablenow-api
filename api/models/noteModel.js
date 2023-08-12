const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { 
        type: mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String,
        default: '', // if note is created but nothing is written in title, its value will be an empty string
    },
    text: {
        type: String,
        default: '', // if note is created but nothing is written in text, its value will be an empty string
    },
});

module.exports = mongoose.model('Note', noteSchema);