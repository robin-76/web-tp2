const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    publicationStatus: {
        type: String,
        required: true
    },
    goodStatus: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    firstDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    secondDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    photos: {
        type: [String]
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
})

const CommentSchema = new mongoose.Schema({
    author: String,
    text: String,
    agent: Boolean,
    date: { type: Date, default: Date.now },
    ad: { type: mongoose.Schema.Types.ObjectId, ref: "Ad" }
})

module.exports = mongoose.model('Ad', AdSchema);
module.exports = mongoose.model('Comment', CommentSchema);