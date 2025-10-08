const express = require('express')
const router = express.Router()
const bookFileController = require('../controllers/bookFileController')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'quoteImagesAndFiles')
if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, uploadDir)
   },
   filename: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      const base = path.basename(file.originalname, ext)
      const timestamp = Date.now()
      cb(null, `${base} - ${timestamp}${ext}`)
   },
})

const upload = multer({ storage })

router.post('/', upload.array('file'), (req, res) => {
   const action = req.query.action || ''
   let params

   try {
      params = JSON.parse(req.body.params)
      params = JSON.parse(params)
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

   try {
      const decoded = jwt.verify(authorization, process.env.JWT_SECRET)
      req.user = decoded
   } catch (error) {
      return res.status(200).json({
         success: 'false',
         message: 'Failed to verify token please try again later',
         reason: 'invalid_token',
      })
   }

   switch (action) {
      case 'quote_file_upload':
         bookFileController.quoteFileUpload(
            params,
            req.files,
            (err, result) => {
               if (err) return res.status(400).json(err)
               res.json(result)
            },
         )
         break
      case 'book_status_change_file_upload':
         bookFileController.uploadOrderDataFile(
            params,
            req.files,
            (err, result) => {
               if (err) return res.status(400).json(err)
               res.json(result)
            },
         )
         break
      case 'quote_file_delete':
         bookFileController.deleteFile(params, (err, result) => {
            if (err) return res.status(400).json(err)
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
