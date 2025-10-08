// controllers/PaymentController.js
const db = require('../config/db')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
   },
})

class PaymentController {
   static CreateStripePaymentIntent(params, callback) {
      const { amount, currency } = params
      if (!amount || !currency) {
         return callback(null, {
            message: 'Amount or Currency is missing',
            success: 'false',
            reason: 'missing_amount_or_currency',
         })
      }

      stripe.paymentIntents
         .create({
            amount: amount * 100,
            currency: currency,
         })
         .then((result) => {
            callback(null, {
               message: 'Payment intent created successfully',
               clientSecret: result.client_secret,
               success: 'true',
            })
         })
         .catch((err) => {
            callback(null, {
               message: 'Payment intent creation failed',
               stripe_intent_error: err,
               success: 'false',
               reason: 'payment_intent_creation_failed',
            })
         })
   }
   // static async handleOrderPayment(params, callback) {
   //    const {
   //       order_id,
   //       bookType,
   //       bookGenre,
   //       bookQuantity,
   //       pageCount,
   //       projectName,
   //       price,
   //       quoteId,
   //       bookDetails,
   //       payment_gross,
   //       payment_method,
   //       payment_status,
   //       payment_response,
   //       payment_date,
   //       payment_id,
   //    } = params

   //    // Validate required fields
   //    if (!order_id || !payment_id) {
   //       return callback(null, {
   //          message: 'Order ID or Payment ID is missing',
   //          success: 'false',
   //          reason: 'missing_required_fields',
   //       })
   //    }

   //    try {
   //       console.log(order_id, payment_id)
   //       const existingOrder = await db.query(
   //          'SELECT orderid FROM order_data WHERE orderid = ?',
   //          [order_id],
   //       )

   //       if (existingOrder[0].length > 0) {
   //          // Check if order already exists
   //          console.log(existingOrder)
   //          return callback(null, {
   //             message: 'Order ID already exists in the order_data table',
   //             success: 'false',
   //             reason: 'order_id_exists',
   //          })
   //       }

   //       // Check if payment_id already exists in the payments table
   //       const existingPayment = await db.query(
   //          'SELECT payment_id FROM payments WHERE payment_id = ?',
   //          [payment_id],
   //       )

   //       if (existingPayment[0].length > 0) {
   //          return callback(null, {
   //             message: 'Payment ID already exists in the payments table',
   //             success: 'false',
   //             reason: 'payment_id_exists',
   //          })
   //       }

   //       // Insert order data (without RETURNING id, use LAST_INSERT_ID())
   //       await db.query(
   //          'INSERT INTO order_data (bookType, bookGenre, bookQuantity, pageCount, projectName, price, quote_id, details, orderid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
   //          [
   //             bookType,
   //             bookGenre,
   //             bookQuantity,
   //             pageCount,
   //             projectName,
   //             price,
   //             quoteId,
   //             bookDetails,
   //             order_id,
   //          ],
   //       )

   //       // Get the last inserted ID using LAST_INSERT_ID()
   //       const orderId = await db.query('SELECT LAST_INSERT_ID() AS id')
   //       const orderIdValue = orderId[0][0].id // Access the last inserted id

   //       const paymentDate = isNaN(payment_date)
   //          ? new Date(payment_date) // PayPal: ISO string
   //          : new Date(payment_date * 1000) // Stripe: Unix timestamp
   //       const formattedPaymentDate = paymentDate
   //          .toISOString()
   //          .slice(0, 19)
   //          .replace('T', ' ') // Format as 'YYYY-MM-DD HH:mm:ss'

   //       // Insert payment data
   //       await db.query(
   //          'INSERT INTO payments (order_id, payment_gross, payment_method, payment_status, payment_response, payment_date, payment_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
   //          [
   //             orderIdValue, // Use the last inserted order ID
   //             payment_gross,
   //             payment_method,
   //             payment_status,
   //             payment_response,
   //             formattedPaymentDate,
   //             payment_id,
   //          ],
   //       )

   //       callback(null, {
   //          message: 'Order and payment created successfully',
   //          // clientSecret: paymentIntent.client_secret,
   //          orderId: orderIdValue,
   //          success: 'true',
   //       })
   //    } catch (err) {
   //       callback(null, {
   //          message: 'Order or payment creation failed',
   //          error: err.message,
   //          success: 'false',
   //          reason: 'order_or_payment_creation_failed',
   //       })
   //    }
   // }

   static async handleOrderPayment(params, callback) {
      const {
         order_id,
         bookType,
         bookGenre,
         bookQuantity,
         pageCount,
         projectName,
         price,
         quoteId,
         bookDetails,
         payment_gross,
         payment_method,
         payment_status,
         payment_response,
         payment_date,
         payment_id,
         user_id, // Added user_id parameter
      } = params

      // Validate required fields
      if (!order_id || !payment_id || !user_id) {
         return callback(null, {
            message: 'Order ID, Payment ID, or User ID is missing',
            success: 'false',
            reason: 'missing_required_fields',
         })
      }

      try {

         const userResult = await db.query(
            'SELECT email FROM users WHERE id = ?',
            [user_id],
         )

         if (userResult[0].length === 0) {
            return callback(null, {
               message: 'User not found',
               success: 'false',
               reason: 'user_not_found',
            })
         }

         const userEmail = userResult[0][0].email
         const existingOrder = await db.query(
            'SELECT orderid FROM order_data WHERE orderid = ?',
            [order_id],
         )

         if (existingOrder[0].length > 0) {
            // Check if order already exists
            // console.log(existingOrder)
            return callback(null, {
               message: 'Order ID already exists in the order_data table',
               success: 'false',
               reason: 'order_id_exists',
            })
         }

         // Check if payment_id already exists in the payments table
         const existingPayment = await db.query(
            'SELECT payment_id FROM payments WHERE payment_id = ?',
            [payment_id],
         )

         if (existingPayment[0].length > 0) {
            return callback(null, {
               message: 'Payment ID already exists in the payments table',
               success: 'false',
               reason: 'payment_id_exists',
            })
         }

         // Insert order data (without RETURNING id, use LAST_INSERT_ID())
         await db.query(
            'INSERT INTO order_data (bookType, bookGenre, bookQuantity, pageCount, projectName, price, quote_id, details, orderid, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
               bookType,
               bookGenre,
               bookQuantity,
               pageCount,
               projectName,
               price,
               quoteId,
               bookDetails,
               order_id,
               user_id,
            ],
         )

         // Get the last inserted ID using LAST_INSERT_ID()
         const orderId = await db.query('SELECT LAST_INSERT_ID() AS id')
         const orderIdValue = orderId[0][0].id // Access the last inserted id

         const paymentDate = isNaN(payment_date)
            ? new Date(payment_date) // PayPal: ISO string
            : new Date(payment_date * 1000) // Stripe: Unix timestamp
         const formattedPaymentDate = paymentDate
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ') // Format as 'YYYY-MM-DD HH:mm:ss'

         // Insert payment data
         await db.query(
            'INSERT INTO payments (order_id, payment_gross, payment_method, payment_status, payment_response, payment_date, payment_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
               orderIdValue, // Use the last inserted order ID
               payment_gross,
               payment_method,
               payment_status,
               payment_response,
               formattedPaymentDate,
               payment_id,
               user_id,
            ],
         )

         const mailOptions = {
            from: 'grandsmoiz6@gmail.com Book Services', // Sender email
            to: userEmail, // User email fetched from the database
            subject: 'Order Confirmation - Order Placed Successfully',
            text: `Dear User,

Your order (#${order_id}) has been successfully placed. The admin will review all the details, and once reviewed, your order will be marked as "In Progress". Thank you for ordering with us!

We appreciate your trust in our service.

Best regards,
The Team`,
         }

         transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
               console.log('Error sending email:', error)
            } else {
               console.log('Email sent: ' + info.response)
            }
         })

         callback(null, {
            message: 'Order and payment created successfully',
            // clientSecret: paymentIntent.client_secret,
            orderId: orderIdValue,
            success: 'true',
         })
      } catch (err) {
         callback(null, {
            message: 'Order or payment creation failed',
            error: err.message,
            success: 'false',
            reason: 'order_or_payment_creation_failed',
         })
      }
   }
}

module.exports = PaymentController
