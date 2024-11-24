import mongoose, { Schema } from "mongoose";

const showTimeSchema = new mongoose.Schema({
    movie:{
        type: mongoose.Types.ObjectId,
        ref: "Movie",
        required: true
    },
    cinema:{
        type: mongoose.Types.ObjectId,
        ref:"Cinema",
        required: true
    },
    format:{
        type: String,
        required: true,
    },
    times:[
        {
            date:{
                type: Date,
                required: true
            },
            time:{
                type: String,
                required: true
            },
            avaiableSeat:{
                type: Number,
                required: true,
            }
        }
    ]
        
})

export default mongoose.model("ShowTime", showTimeSchema)