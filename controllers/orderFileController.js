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

class orderFileController {
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

module.exports = orderFileController
