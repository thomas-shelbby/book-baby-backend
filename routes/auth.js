const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const AuthController = require('../controllers/AuthController')

const router = express.Router()

router.use(express.urlencoded({ extended: true }))

passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: 'http://localhost:5000/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
         const params = {
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: 'google',
         }
         AuthController.googleAuth(params, (err, result) => {
            if (err) return done(err.error)
            done(null, result)
         })
      },
   ),
)

router.get(
   '/google',
   passport.authenticate('google', { scope: ['profile', 'email'] }),
)

router.get(
   '/google/callback',
   passport.authenticate('google', { session: false }),
   (req, res) => {
      res.redirect(`https://book-baby.zuzteccrm.com?token=${req.user.token}`)
   },
)

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
      return res.status(400).json({
         success: 'false',
         message: 'Invalid request format',
         reason: 'invalid_format',
      })
   }

   switch (action) {
      case 'signup':
         AuthController.signup(params, (err, result) => {
            if (err) return res.status(400).json(err.error)
            res.json(result)
         })
         break

      case 'signin':
         AuthController.signin(params, (err, result) => {
            if (err) return res.status(401).json(err.error)
            res.json(result)
         })
         break

      case 'google':
         AuthController.googleAuth(params, (err, result) => {
            if (err) return res.status(400).json(err.error)
            res.json(result)
         })
         break

      case 'verify':
         AuthController.verifyEmail(params, (err, result) => {
            if (err) return res.status(400).json(err.error)
            res.json(result)
         })
         break

      case 'forgot-password':
         AuthController.forgotPassword(params, (err, result) => {
            if (err) return res.status(400).json(err.error)
            res.json(result)
         })
         break

      case 'verify-reset-token':
         AuthController.verifyResetToken(params, (err, result) => {
            if (err) return res.status(400).json(err.error)
            res.json(result)
         })
         break

      case 'reset-password':
         AuthController.resetPassword(params, (err, result) => {
            if (err) return res.status(400).json(err.error)
            res.json(result)
         })
         break

      case 'change-password':
         AuthController.changePassword(params, (err, result) => {
            if (err) return res.status(400).json(err.error)
            res.json(result)
         })
         break
      case 'admin_signin':
         AuthController.adminSignin(params, (err, result) => {
            if (err) return res.status(400).json(err.error)
            res.json(result)
         })
         break
      case 'admin_google_signin':
         AuthController.adminGoogleAuth(params, (err, result) => {
            if (err) return res.status(400).json(err.error)
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
