// routes/payment.js
const express = require('express')
const router = express.Router()
const PaymentController = require('../controllers/PaymentController')
const jwt = require('jsonwebtoken')

router.use(express.urlencoded({ extended: true }))
router.use(express.json())

router.post('/', (req, res) => {
   const action = req.query.action || ''
   let params

   try {
      const contentType = req.headers['content-type']
      // console.log('Content-Type:', contentType)
      if (
         contentType &&
         contentType.includes('application/x-www-form-urlencoded')
      ) {
         const bodyKey = Object.keys(req.body)[0]
         if (!bodyKey) throw new Error('No params found')
         const outerParsed = JSON.parse(bodyKey)
         if (!outerParsed.params) throw new Error('Params field not found')
         params = JSON.parse(outerParsed.params)
         // console.log(Object.keys(req.body)[0])
      } else if (contentType && contentType.includes('application/json')) {
         params = JSON.parse(req.body.params)
         // console.log(JSON.parse(params.params))
      } else {
         throw new Error('Unsupported Content-Type')
      }
   } catch (error) {
      // console.log(req)
      return res.status(200).json({
         success: 'false',
         message: 'Invalid request format',
         reason: 'invalid_format',
      })
   }

   const authorization = params.authorization
   if (!authorization) {
      return res.status(200).json({
         success: 'false',
         message: 'Missing authorization token',
         reason: 'missing_token',
      })
   }

   const token = authorization
   if (!token) {
      return res.status(200).json({
         success: 'false',
         message: 'Invalid authorization token',
         reason: 'invalid_token',
      })
   }

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      if (!decoded) {
         return res.status(200).json({
            success: 'false',
            message: 'Failed to verify token please try again later',
            reason: 'invalid_token',
         })
      }
   } catch (error) {
      return res.status(200).json({
         success: 'false',
         message: 'Failed to verify token please try again later',
         reason: 'invalid_token',
      })
   }

   switch (action) {
      case 'create_stripe_payment_intent':
         PaymentController.CreateStripePaymentIntent(params, (err, result) => {
            if (err) return res.status(400).json(err) // Directly returning error without wrapping in 'error' field
            res.json(result)
         })
         break
      case 'order_payment':
         PaymentController.handleOrderPayment(params, (err, result) => {
            if (err) return res.status(400).json(err) // Directly returning error without wrapping in 'error' field
            res.json(result)
         })
         break
      default:
         res.status(400).json({
            success: 'false',
            message: 'Invalid action',
            reason: 'invalid_action',
         })
   }
})

module.exports = router
