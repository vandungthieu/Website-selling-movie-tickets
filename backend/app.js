import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import movieRoutes from "./routes/movieRoutes.js"
import bookingsRouter from "./routes/bookingRoutes.js"
import paymentRouter from "./models/paymentRoutes.js"


dotenv.config()
const app = express()
const port = 5000 
const uri = `mongodb+srv://tvzung20102003:${process.env.MONGO_PASSWORD}@cluster0.8kpnu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
app.use(express.json())


// middlewares
app.use("/user", userRoutes)
app.use('/movie',movieRoutes)
app.use('/booking',bookingsRouter)
app.use('/payment',paymentRouter)

mongoose.connect(uri)
.then(()=> 
    app.listen(port,()=>
        console.log(`Connected to database and server is running in http://localhost:${port}`)
    )). catch((e)=>console.log(e))

 