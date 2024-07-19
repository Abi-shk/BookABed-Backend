const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    }
}
);

module.exports = mongoose.model("Todo", TodoSchema)