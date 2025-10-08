const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const jwt = require('jsonwebtoken')
const e = require('express')

router.use(express.urlencoded({ extended: true }))
router.use(express.json()) // Add JSON parsing middleware

router.post('/', async (req, res) => {
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
         // console.log(JSON.parse(req.body.params))
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

   const { authorization } = params
   if (!authorization) {
      return res.status(401).json({
         success: 'false',
         message: 'Missing authorization token',
         reason: 'missing_token',
      })
   }

   try {
      jwt.verify(authorization, process.env.JWT_SECRET)
   } catch (error) {
      return res.status(401).json({
         success: 'false',
         message: 'Failed to verify token please try again later',
         reason: 'invalid_token',
      })
   }

   // Convert callback-based UserController methods to promises
   const promisifyController = (controllerMethod) =>
      new Promise((resolve, reject) => {
         controllerMethod(params, (err, result) => {
            if (err) reject(err)
            else resolve(result)
         })
      })

   try {
      switch (action) {
         case 'get-user-info':
            res.json(await promisifyController(UserController.getUserInfo))
            break
         case 'update-contact-info':
            res.json(
               await promisifyController(UserController.updateUserContactInfo),
            )
            break
         case 'add-address':
            res.json(
               await promisifyController(UserController.addAddressDetails),
            )
            break
         case 'edit-address':
            res.json(
               await promisifyController(UserController.editAddressDetails),
            )
            break
         case 'get-all-addresses':
            res.json(
               await promisifyController(UserController.getAllUserAddresses),
            )
            break
         case 'get-user-address':
            res.json(
               await promisifyController(UserController.getImportantAddresses),
            )
            break
         case 'create_user':
            res.json(await promisifyController(UserController.createUser))
            break
         case 'get_all_users':
            res.json(await promisifyController(UserController.getAllUsers))
            break
         case 'change_user_status':
            res.json(await promisifyController(UserController.toggleUserStatus))
            break
         case 'get_user_permissions':
            res.json(
               await promisifyController(UserController.getUserPermissions),
            )
            break
         case 'get_user_details':
            res.json(
               await promisifyController(UserController.getUserDetailsById),
            )
            break
         case 'edit_user_details_and_permissions':
            res.json(
               await promisifyController(
                  UserController.editUserDetailsAndPermissions,
               ),
            )
            break
         default:
            res.status(400).json({
               success: 'false',
               message: 'Invalid action',
               reason: 'invalid_action',
            })
      }
   } catch (err) {
      res.status(500).json({
         success: 'false',
         message: 'Server error',
         reason: 'server_error',
         details: err.message,
      })
   }
})

module.exports = router
