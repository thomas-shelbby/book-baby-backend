const db = require('../config/db')
const path = require('path')
const fs = require('fs').promises // Use promises version of fs for async/await
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
   },
})

class bookFileController {
   static async quoteFileUpload(params, files, callback) {
      const { userId, quoteId } = params

      try {
         if (!files || files.length === 0) {
            return callback({
               success: 'false',
               message: 'No files uploaded',
               reason: 'no_files_uploaded',
            })
         }

         const uploadedFiles = []
         const sql =
            'INSERT INTO quote_files (userId, quoteId, filename, fileUrl) VALUES (?, ?, ?, ?)'

         // Process each file sequentially or in parallel with Promise.all
         for (const file of files) {
            const ext = path.extname(file.originalname)
            const base = path.basename(file.originalname, ext)
            const filename = base // without timestamp
            const fileUrl = `/quoteImagesAndFiles/${file.filename}`

            const [result] = await db.query(sql, [
               userId,
               quoteId,
               filename,
               fileUrl,
            ])

            uploadedFiles.push({
               fileId: result.insertId,
               fileUrl,
               filename,
               userId,
               quoteId,
            })
         }

         callback(null, {
            success: 'true',
            message: 'Files uploaded successfully',
            files: uploadedFiles,
         })
      } catch (err) {
         callback({
            success: 'false',
            message: 'Database error',
            reason: 'database_error',
            error: err.message,
         })
      }
   }

   static async deleteFile(params, callback) {
      const { fileId } = params

      try {
         if (!fileId) {
            return callback({
               success: 'false',
               message: 'Missing fileId in the request',
               reason: 'missing_fileId',
            })
         }

         // Step 1: Find the file from the database by fileId
         const sql = 'SELECT * FROM quote_files WHERE id = ?'
         const [result] = await db.query(sql, [fileId])

         if (result.length === 0) {
            return callback({
               success: 'false',
               message: 'File not found',
               reason: 'file_not_found',
            })
         }

         // Step 2: Extract the fileUrl and generate the absolute file path
         const fileData = result[0]
         const fileUrl = fileData.fileUrl
         const filePath = path.join(__dirname, '..', fileUrl)

         // Step 3: Delete the file from the server
         await fs.unlink(filePath)

         // Step 4: Delete the file record from the database
         const deleteSql = 'DELETE FROM quote_files WHERE id = ?'
         await db.query(deleteSql, [fileId])

         callback(null, {
            success: 'true',
            message: 'File deleted successfully',
         })
      } catch (err) {
         callback({
            success: 'false',
            message:
               err.code === 'ENOENT'
                  ? 'File not found on server'
                  : 'Failed to delete file',
            reason: err.code === 'ENOENT' ? 'file_not_found' : 'database_error',
            error: err.message,
         })
      }
   }

   static async uploadOrderDataFile(params, files, callback) {
      const { userId, bookId, book_status, remarks } = params

      try {
         // 1. Get user role
         const [userResult] = await db.query(
            'SELECT role FROM users WHERE id = ?',
            [userId],
         )
         if (userResult.length === 0) {
            return callback({
               success: 'false',
               message: 'User not found',
               reason: 'user_not_found',
            })
         }

         const role = userResult[0].role

         // 2. Check permissions
         if (role !== 'super-admin') {
            const [permResult] = await db.query(
               'SELECT permission FROM user_permissions WHERE user_id = ?',
               [userId],
            )
            const permissions = permResult.map((row) => row.permission)

            const hasAllPermissions = permissions.includes('all_permissions')
            const statusPermissionMap = {
               'in-progress': permissions.includes('approve_orders'),
               completed: permissions.includes('complete_orders'),
               rejected: permissions.includes('reject_orders'),
            }

            if (!hasAllPermissions && !statusPermissionMap[book_status]) {
               return callback({
                  success: 'false',
                  message: `You do not have permission to change the status to "${book_status}"`,
                  reason: 'unauthorized_status_change',
               })
            }
         }

         // 3. Handle file uploads
         const uploadedFiles = []
         if (files && files.length > 0) {
            const uploadDir = path.join(__dirname, '..', 'orderDataFiles')
            await fs.mkdir(uploadDir, { recursive: true })

            const allowedExtensions = ['.zip', '.rar']
            const insertSql =
               'INSERT INTO order_files_data (userId, quoteId, filename, fileUrl) VALUES (?, ?, ?, ?)'

            for (const file of files) {
               const ext = path.extname(file.originalname).toLowerCase()
               if (!allowedExtensions.includes(ext)) {
                  return callback({
                     success: 'false',
                     message: 'Only .zip and .rar files are allowed',
                     reason: 'invalid_file_type',
                  })
               }

               const base = path.basename(file.originalname, ext)
               const filename = base
               const fileUrl = `/orderDataFiles/${file.filename}`

               const [result] = await db.query(insertSql, [
                  userId,
                  bookId,
                  filename,
                  fileUrl,
               ])

               uploadedFiles.push({
                  fileId: result.insertId,
                  fileUrl,
                  filename,
                  userId,
                  bookId,
               })
            }
         }

         // 4. Update order status and remarks
         let updateSql, values
         if (remarks) {
            updateSql =
               'UPDATE order_data SET remark = ?, order_status = ? WHERE orderId = ?'
            values = [remarks, book_status, bookId]
         } else {
            updateSql =
               'UPDATE order_data SET order_status = ? WHERE orderId = ?'
            values = [book_status, bookId]
         }
         await db.query(updateSql, values)

         // 5. Get user info from order to send email
         const [orderResult] = await db.query(
            'SELECT user_id FROM order_data WHERE orderid = ? LIMIT 1',
            [bookId],
         )

         if (orderResult.length > 0) {
            const orderUserId = orderResult[0].user_id

            const [userDetails] = await db.query(
               'SELECT email, name FROM users WHERE id = ?',
               [orderUserId],
            )

            if (userDetails.length > 0) {
               const userEmail = userDetails[0].email
               const userName = userDetails[0].name

               // Parse remarks for message
               let adminMessage = ''
               try {
                  const parsedRemarks = JSON.parse(remarks)
                  adminMessage = parsedRemarks.message || ''
               } catch (e) {
                  console.warn('Invalid JSON in remarks:', e.message)
               }

               const subject = `Order Status Updated to "${book_status}"`
               let emailBody = `Hello ${userName},\n\nYour order status has been changed to "${book_status}".`

               if (adminMessage) {
                  emailBody += `\n\nAdmin Message: ${adminMessage}`
               }

               emailBody += `\n\nStatus changed by admin.\n\nBest regards,\nYour Team`

               // Add attachments if applicable
               let attachments = []
               if (
                  (book_status === 'completed' || book_status === 'rejected') &&
                  uploadedFiles.length > 0
               ) {
                  attachments = await Promise.all(
                     uploadedFiles.map(async (file) => {
                        const fullPath = path.join(
                           __dirname,
                           '..',
                           file.fileUrl,
                        )
                        return {
                           filename: file.filename + path.extname(fullPath),
                           path: fullPath,
                        }
                     }),
                  )
               }

               // Send email
               await transporter.sendMail({
                  from: `"Your Company" <grandsmoiz6@gmail.com>`,
                  to: userEmail,
                  subject: subject,
                  text: emailBody,
                  attachments: attachments,
               })
            }
         }

         // 6. Final success response
         callback(null, {
            success: 'true',
            message: 'Order updated and email sent',
            files: uploadedFiles,
         })
      } catch (err) {
         console.error(err)
         callback({
            success: 'false',
            message: 'Failed to process request',
            reason: 'server_error',
            error: err.message,
         })
      }
   }
}

module.exports = bookFileController
