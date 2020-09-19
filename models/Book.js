const mongoose = require("mongoose");

const Book = mongoose.Schema({
    genre: {
        type: String,
        required: true
    }, 
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    }
});

mongoose.model("books", Book);