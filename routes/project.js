// routes/user.js
const express = require('express')
const router = express.Router()
const ProjectController = require('../controllers/ProjectController')
const jwt = require('jsonwebtoken')

router.use(express.urlencoded({ extended: true }))

router.post('/', (req, res) => {
   const action = req.query.action || ''
   let params

   try {
      const bodyKey = Object.keys(req.body)[0]
      if (!bodyKey) throw new Error('No params found')
      const outerParsed = JSON.parse(bodyKey)
      if (!outerParsed.params) throw new Error('Params field not found')
      params = JSON.parse(outerParsed.params)
   } catch (error) {
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
      //   case 'get-user-info':
      //      ProjectController.getUserInfo(params, (err, result) => {
      //         if (err) return res.status(400).json(err) // Directly returning error without wrapping in 'error' field
      //         res.json(result)
      //      })
      //      break
      case 'send_project_details_email':
         ProjectController.sendEmailToUser(params, (err, result) => {
            if (err) return res.status(400).json(err) // Directly returning error without wrapping in 'error' field
            res.json(result)
         })
         break
      case 'get_user_projects':
         ProjectController.getUserProjects(params, (err, result) => {
            if (err) return res.status(400).json(err) // Directly returning error without wrapping in 'error' field
            res.json(result)
         })
         break
      case 'get_pie_chart_orders':
         ProjectController.getPieChartOrders(params, (err, result) => {
            if (err) return res.status(400).json(err) // Directly returning error without wrapping in 'error' field
            res.json(result)
         })
         break
      case 'get_orders_trend':
         ProjectController.getOrdersTrend(params, (err, result) => {
            if (err) return res.status(400).json(err) // Directly returning error without wrapping in 'error' field
            res.json(result)
         })
         break
      case 'get_all_book_orders':
         ProjectController.getAllBookOrders(params, (err, result) => {
            if (err) return res.status(400).json(err) // Directly returning error without wrapping in 'error' field
            res.json(result)
         })
         break
      case 'get_book_order_details':
         ProjectController.getBookOrderDetails(params, (err, result) => {
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
