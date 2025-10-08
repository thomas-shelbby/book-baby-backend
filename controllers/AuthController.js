const jwt = require('jsonwebtoken')
const md5 = require('md5')
const nodemailer = require('nodemailer')
const db = require('../config/db')

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
   },
})

class AuthController {
   static async signup(params, callback) {
      const { name, email, password } = params
      const hashedPassword = md5(password)
      const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
         expiresIn: '1h',
      })

      try {
         const sql =
            'INSERT INTO users (name, email, password, role, status, provider, verified) VALUES (?, ?, ?, ?, ?, ?, ?)'
         await db.query(sql, [
            name,
            email,
            hashedPassword,
            'user',
            'active',
            'email',
            0,
         ])

         const verificationLink = `https://book-baby.zuzteccrm.com/verify?token=${verificationToken}`
         const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email',
            text: `Please verify your email by clicking this link: ${verificationLink}`,
         }

         await transporter.sendMail(mailOptions)
         callback(null, {
            message: 'Verification email sent. Please check your inbox.',
            success: 'true',
         })
      } catch (err) {
         callback({
            error: {
               message:
                  err.code === 'ER_DUP_ENTRY'
                     ? 'Email already exists'
                     : 'Database error',
               success: 'false',
               reason:
                  err.code === 'ER_DUP_ENTRY'
                     ? 'duplicate_email'
                     : 'database_error',
               details: err.message,
            },
         })
      }
   }

   static async signin(params, callback) {
      const { email, password } = params
      const hashedPassword = md5(password)

      try {
         const sql = 'SELECT * FROM users WHERE email = ? AND password = ?'
         const [results] = await db.query(sql, [email, hashedPassword])

         if (results.length === 0) {
            return callback({
               error: {
                  message: 'Invalid credentials',
                  success: 'false',
                  reason: 'invalid_credentials',
               },
            })
         }

         const user = results[0]

         if (user.status !== 'active') {
            return callback({
               error: {
                  message: 'unactive',
                  success: 'false',
                  reason: 'inactive',
               },
            })
         }

         if (user.verified === 0) {
            const verificationToken = jwt.sign(
               { email },
               process.env.JWT_SECRET,
               { expiresIn: '1h' },
            )
            const verificationLink = `https://book-baby.zuzteccrm.com/verify?token=${verificationToken}`
            const mailOptions = {
               from: process.env.EMAIL_USER,
               to: email,
               subject: 'Verify Your Email',
               text: `You are unverified. Please verify your email by clicking this link: ${verificationLink}`,
            }

            await transporter.sendMail(mailOptions)
            return callback({
               error: {
                  message:
                     'You are unverified. We have sent an activation email to your account.',
                  success: 'false',
                  reason: 'unverified',
               },
            })
         }

         const token = jwt.sign(
            { name: user.name, email, role: user.role },
            process.env.JWT_SECRET,
         )
         callback(null, {
            message: 'Signin successful',
            success: 'true',
            token,
         })
      } catch (err) {
         callback({
            error: {
               message: 'Database error',
               success: 'false',
               reason: 'database_error',
               details: err.message,
            },
         })
      }
   }

   static async googleAuth(params, callback) {
      const { name, email, provider } = params

      try {
         const sqlSelect = 'SELECT * FROM users WHERE email = ?'
         const [results] = await db.query(sqlSelect, [email])

         if (results.length > 0) {
            const user = results[0]

            if (user.status !== 'active') {
               return callback({
                  error: {
                     message: 'unactive',
                     success: 'false',
                     reason: 'inactive',
                  },
               })
            }

            const token = jwt.sign(
               { name: user.name, email, role: user.role },
               process.env.JWT_SECRET,
            )
            return callback(null, {
               message: 'Google authentication successful',
               success: 'true',
               token,
            })
         }

         const sqlInsert =
            'INSERT INTO users (name, email, role, status, provider, verified) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?'
         await db.query(sqlInsert, [
            name,
            email,
            'user',
            'active',
            provider,
            1,
            name,
         ])

         const token = jwt.sign({ name, email }, process.env.JWT_SECRET)
         callback(null, {
            message: 'Google authentication successful',
            success: 'true',
            token,
         })
      } catch (err) {
         callback({
            error: {
               message: 'Database error',
               success: 'false',
               reason: 'database_error',
               details: err.message,
            },
         })
      }
   }

   static async verifyEmail(params, callback) {
      const { token } = params

      try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET)
         const { email } = decoded

         const sql =
            'UPDATE users SET verified = 1 WHERE email = ? AND verified = 0'
         const [result] = await db.query(sql, [email])

         if (result.affectedRows === 0) {
            return callback({
               error: {
                  message: 'Invalid or expired verification token',
                  success: 'false',
                  reason: 'invalid_token',
               },
            })
         }

         callback(null, {
            message: 'Email verified successfully',
            success: 'true',
         })
      } catch (err) {
         callback({
            error: {
               message: 'Invalid or expired verification token',
               success: 'false',
               reason: 'invalid_token',
               details: err.message,
            },
         })
      }
   }

   static async forgotPassword(params, callback) {
      const { email } = params

      try {
         const sql = 'SELECT * FROM users WHERE email = ?'
         const [results] = await db.query(sql, [email])

         if (results.length === 0) {
            return callback({
               error: {
                  message: 'Email not found',
                  success: 'false',
                  reason: 'email_not_found',
               },
            })
         }

         const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: '15m',
         })
         const resetLink = `https://book-baby.zuzteccrm.com/reset-password?token=${resetToken}`
         const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Your Password',
            text: `Click this link to reset your password: ${resetLink}. This link will expire in 15 minutes.`,
         }

         await transporter.sendMail(mailOptions)
         callback(null, {
            message: 'Password reset email sent. Please check your inbox.',
            success: 'true',
         })
      } catch (err) {
         callback({
            error: {
               message: 'Failed to send reset email',
               success: 'false',
               reason: 'email_failure',
               details: err.message,
            },
         })
      }
   }

   static async verifyResetToken(params, callback) {
      const { token } = params

      try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET)
         const { email } = decoded

         const sql = 'SELECT * FROM users WHERE email = ?'
         const [results] = await db.query(sql, [email])

         if (results.length === 0) {
            return callback({
               error: {
                  message: 'Invalid reset token',
                  success: 'false',
                  reason: 'invalid_token',
               },
            })
         }

         const user = results[0]
         if (user.provider === 'google' && user.password === null) {
            return callback({
               message: 'You logged in with Gmail, please set your password',
               success: 'false',
               reason: 'set_password',
            })
         }

         callback(null, {
            message: 'Token is valid',
            success: 'true',
            reason: 'reset_password',
         })
      } catch (err) {
         callback({
            error: {
               message: 'Invalid or expired reset token',
               success: 'false',
               reason: 'invalid_token',
               details: err.message,
            },
         })
      }
   }

   static async resetPassword(params, callback) {
      const { token, newPassword, confirmPassword } = params

      if (newPassword !== confirmPassword) {
         return callback({
            error: {
               message: 'Passwords do not match',
               success: 'false',
               reason: 'password_mismatch',
            },
         })
      }

      try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET)
         const { email } = decoded
         const hashedPassword = md5(newPassword)

         const sql = 'UPDATE users SET password = ? WHERE email = ?'
         const [result] = await db.query(sql, [hashedPassword, email])

         if (result.affectedRows === 0) {
            return callback({
               error: {
                  message: 'Failed to reset password',
                  success: 'false',
                  reason: 'database_error',
               },
            })
         }

         callback(null, {
            message: 'Password reset successfully',
            success: 'true',
         })
      } catch (err) {
         callback({
            error: {
               message: 'Invalid or expired reset token',
               success: 'false',
               reason: 'invalid_token',
               details: err.message,
            },
         })
      }
   }

   static async changePassword(params, callback) {
      const {
         authorization,
         userId,
         previousPassword,
         newPassword,
         confirmPassword,
      } = params

      if (!authorization) {
         return callback({
            error: {
               message: 'Authorization token is missing',
               success: 'false',
               reason: 'missing_authorization',
            },
         })
      }

      try {
         const decoded = jwt.verify(authorization, process.env.JWT_SECRET)
         const { email } = decoded

         const sqlCheckUser = 'SELECT * FROM users WHERE id = ?'
         const [results] = await db.query(sqlCheckUser, [userId])

         if (results.length === 0) {
            return callback(null, {
               message: 'User not found',
               success: 'false',
               reason: 'user_not_found',
            })
         }

         const user = results[0]
         const hashedPreviousPassword = previousPassword
            ? md5(previousPassword)
            : null

         if (user.password && user.password !== hashedPreviousPassword) {
            return callback(null, {
               message: 'Incorrect previous password',
               success: 'false',
               reason: 'incorrect_password',
            })
         }

         if (newPassword !== confirmPassword) {
            return callback(null, {
               message: 'New password and confirm password do not match',
               success: 'false',
               reason: 'password_mismatch',
            })
         }

         const hashedNewPassword = md5(newPassword)
         const sqlUpdatePassword = 'UPDATE users SET password = ? WHERE id = ?'
         const [result] = await db.query(sqlUpdatePassword, [
            hashedNewPassword,
            userId,
         ])

         if (result.affectedRows === 0) {
            return callback(null, {
               message: 'Failed to update password',
               success: 'false',
               reason: 'database_error',
            })
         }

         callback(null, {
            message: 'Password changed successfully',
            success: 'true',
         })
      } catch (err) {
         callback(null, {
            message: 'Invalid or expired authorization token',
            success: 'false',
            reason: 'invalid_token',
            details: err.message,
         })
      }
   }

   static async adminSignin(params, callback) {
      const { email, password } = params
      const hashedPassword = md5(password)

      try {
         const sql = 'SELECT * FROM users WHERE email = ? AND password = ?'
         const [results] = await db.query(sql, [email, hashedPassword])

         if (results.length === 0) {
            return callback({
               error: {
                  message: 'Invalid credentials',
                  success: 'false',
                  reason: 'invalid_credentials',
               },
            })
         }

         const user = results[0]

         // console.log(user)

         if (user.role !== 'admin' && user.role !== 'super-admin') {
            return callback({
               error: {
                  message: 'You are not authorized to login to the admin panel',
                  success: 'false',
                  reason: 'not_admin',
               },
            })
         }

         if (user.status !== 'active') {
            return callback({
               error: {
                  message: 'Account is inactive',
                  success: 'false',
                  reason: 'inactive',
               },
            })
         }

         const token = jwt.sign(
            { name: user.name, email, role: user.role },
            process.env.JWT_SECRET,
         )
         callback(null, {
            message: 'Admin signin successful',
            success: 'true',
            token,
         })
      } catch (err) {
         callback({
            error: {
               message: 'Database error',
               success: 'false',
               reason: 'database_error',
               details: err.message,
            },
         })
      }
   }

   static async adminGoogleAuth(params, callback) {
      const { name, email, provider } = params

      try {
         const sqlSelect = 'SELECT * FROM users WHERE email = ?'
         const [results] = await db.query(sqlSelect, [email])

         if (results.length > 0) {
            const user = results[0]

            if (user.role !== 'admin' || user.role !== 'super-admin') {
               return callback({
                  error: {
                     message:
                        'You are not authorized to login to the admin panel',
                     success: 'false',
                     reason: 'not_admin',
                  },
               })
            }

            if (user.status !== 'active') {
               return callback({
                  error: {
                     message: 'Account is inactive',
                     success: 'false',
                     reason: 'inactive',
                  },
               })
            }

            const token = jwt.sign(
               { name: user.name, email, role: user.role },
               process.env.JWT_SECRET,
            )
            return callback(null, {
               message: 'Admin Google authentication successful',
               success: 'true',
               token,
            })
         }

         return callback({
            error: {
               message: 'No admin account found with this email',
               success: 'false',
               reason: 'not_admin',
            },
         })
      } catch (err) {
         callback({
            error: {
               message: 'Database error',
               success: 'false',
               reason: 'database_error',
               details: err.message,
            },
         })
      }
   }
}

module.exports = AuthController
