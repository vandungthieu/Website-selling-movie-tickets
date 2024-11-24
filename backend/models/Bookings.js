import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    movie:{
        type: mongoose.Types.ObjectId,
        ref:"Movie",
        required: true,
    },
    cinema:{
        type: mongoose.Types.ObjectId,
        ref : "Cinema",
        required: true,
    },
    showTime:{
        type: mongoose.Types.ObjectId,
        ref: "ShowTime",
        required: true
    },
    date:{
        type: Date,
        required: true,
    },
    seatNumber:{
        type: Number,
        required: true,
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
})

export default mongoose.model("Booking", bookingSchema)