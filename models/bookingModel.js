const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    totoalAmount: { type: Number, required: true },
    from: { type: String },
    to: { type: String },
    departureTime: { type: String },
    arrivalTime: { type: String },
    duration: { type: String },
    orderedBy:{type:String, required:true},
    userId:{type:mongoose.Types.ObjectId,ref:"User",required:true}
});


module.exports = mongoose.model('Booking', userSchema);
