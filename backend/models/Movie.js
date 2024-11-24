import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    director: {
        type: String,
        require: true
    },
    actor:[{
        type: String,
        require: true,
    }],
    genre:[{
        type: String,
        require: true,
    }],
    duration:{
        type: String,
        require: true,
    },
    language:{
        type: String,
        require: true,
    },
    releaseDate:{
        type: Date,
        require: true,
    },
    posterUrl: {
        type: String,
        require: true
    },
    featured:{
        type: Boolean,

    },
    bookings:[{
        type:mongoose.Types.ObjectId,
        ref:"Booking"
    }],
    admin:{
        type: String,
        require: true,
    }
})

export default mongoose.model("Movie", movieSchema)