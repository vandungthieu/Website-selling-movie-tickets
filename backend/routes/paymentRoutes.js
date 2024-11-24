import express from 'express'
import {createPaymentUrl, deletePayment, getPaymentById} from '../controllers/paymentController.js'
const paymentRouter = express.Router()

paymentRouter.get('/create_payment',createPaymentUrl)
paymentRouter.get('/payment:id',getPaymentById)
paymentRouter.get('/payment:id',deletePayment)