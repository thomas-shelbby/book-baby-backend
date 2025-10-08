// controllers/userController.js
const md5 = require('md5')
const db = require('../config/db')

class UserController {
   static async getUserInfo(params, callback) {
      const { email } = params

      try {
         // Query to get user info from users table
         const userSql =
            'SELECT id, name, email, provider, password FROM users WHERE email = ?'
         const [userResults] = await db.query(userSql, [email])

         if (userResults.length === 0) {
            return callback({
               error: {
                  message: 'User not found',
                  success: 'false',
                  reason: 'user_not_found',
               },
            })
         }

         const user = userResults[0]
         const userId = user.id

         // Query to get contact info from user_contact_info table
         const contactSql =
            'SELECT phone, mobile_phone, id, user_id FROM user_contact_info WHERE user_id = ?'
         const [contactResults] = await db.query(contactSql, [userId])

         // Check if the user has a password
         const hasPassword = !!user.password

         // Combine user and contact info
         const userInfo = {
            id: user.id,
            name: user.name,
            email: user.email,
            provider: user.provider,
            password: hasPassword,
            contact_info: contactResults.length > 0 ? contactResults[0] : null,
         }

         callback(null, {
            message: 'User information retrieved successfully',
            success: 'true',
            data: userInfo,
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

   static async updateUserContactInfo(params, callback) {
      const { userId, phone, mobilePhone } = params
      let sentResponse = false

      const sendResponse = (err, result) => {
         if (sentResponse) return
         sentResponse = true
         callback(err, result)
      }

      try {
         const query = `SELECT * FROM user_contact_info WHERE user_id = ?`
         const [results] = await db.query(query, [userId])

         if (results.length > 0) {
            const existingPhone = results[0].phone
            const existingMobilePhone = results[0].mobile_phone

            if (
               existingPhone === phone &&
               existingMobilePhone === mobilePhone
            ) {
               return sendResponse(null, {
                  success: 'false',
                  message: 'No changes to save.',
                  reason: 'no_changes_to_save',
               })
            }

            const updateQuery = `UPDATE user_contact_info SET phone = ?, mobile_phone = ? WHERE user_id = ?`
            await db.query(updateQuery, [phone, mobilePhone, userId])
            sendResponse(null, {
               success: 'true',
               message: 'Contact information updated successfully',
            })
         } else {
            const insertQuery = `INSERT INTO user_contact_info (user_id, phone, mobile_phone) VALUES (?, ?, ?)`
            await db.query(insertQuery, [userId, phone, mobilePhone])
            sendResponse(null, {
               success: 'true',
               message: 'Contact information added successfully',
            })
         }
      } catch (err) {
         sendResponse({
            error: {
               message: 'Database error',
               success: 'false',
               reason: 'database_error',
               details: err.message,
            },
         })
      }
   }

   static async getAllUserAddresses(params, callback) {
      const { userId } = params

      try {
         // Check if userId is provided
         if (!userId) {
            return callback(null, {
               success: 'false',
               message: 'Please login to fetch addresses',
               reason: 'missing_user_id',
            })
         }

         // Query to get all addresses for the user
         const addressSql = 'SELECT * FROM user_address_info WHERE user_id = ?'
         const [addressResults] = await db.query(addressSql, [userId])

         // Check if no addresses found
         if (addressResults.length === 0) {
            return callback(null, {
               success: 'true',
               message: 'No addresses found for this user. Please add one.',
               data: [],
            })
         }

         // Return the retrieved addresses
         callback(null, {
            success: 'true',
            message: 'User addresses retrieved successfully',
            data: addressResults,
         })
      } catch (err) {
         callback({
            success: 'false',
            message: 'Database error',
            reason: 'database_error',
            details: err.message,
         })
      }
   }

   static async getImportantAddresses(params, callback) {
      const { userId, bookType } = params

      try {
         if (!userId || !bookType) {
            return callback(null, {
               success: 'false',
               message: 'Missing required parameters',
               reason: 'missing_parameters',
            })
         }

         const addressSql = `
            SELECT * FROM user_address_info 
            WHERE user_id = ? AND (is_contact_address = TRUE OR is_default_shipping_address = TRUE)
         `
         const [addressResults] = await db.query(addressSql, [userId])

         let contactAddress = null
         let defaultShippingAddress = null

         addressResults.forEach((address) => {
            if (
               address.is_contact_address &&
               address.is_default_shipping_address
            ) {
               contactAddress = address
               defaultShippingAddress = address
            } else {
               if (address.is_contact_address && !contactAddress) {
                  contactAddress = address
               }
               if (
                  address.is_default_shipping_address &&
                  !defaultShippingAddress
               ) {
                  defaultShippingAddress = address
               }
            }
         })

         const data = {
            contact_address: contactAddress,
         }

         if (bookType === 'printedBooks' || bookType === 'printedBooksAndEbooks') {
            data.default_shipping_address = defaultShippingAddress
         }

         callback(null, {
            success: 'true',
            message: 'Relevant address(es) retrieved successfully',
            data: data,
         })
      } catch (err) {
         callback({
            success: 'false',
            message: 'Database error',
            reason: 'database_error',
            details: err.message,
         })
      }
   }

   static async addAddressDetails(params, callback) {
      const {
         companyName,
         country,
         zip,
         streetAddress,
         aptSuiteBldg,
         deliveryInstructions,
         cityTown,
         state,
         isContactAddress,
         isDefaultShippingAddress,
         userId,
      } = params

      try {
         // Validate required fields
         if (!country || !zip || !streetAddress || !cityTown || !state) {
            return callback(null, {
               success: 'false',
               message: 'Missing required fields',
               reason: 'missing_required_fields',
            })
         }

         // If isContactAddress is true, unset it for any other address of the user
         if (isContactAddress) {
            const updateContactQuery = `
               UPDATE user_address_info 
               SET is_contact_address = FALSE 
               WHERE user_id = ? AND is_contact_address = TRUE
            `
            await db.query(updateContactQuery, [userId])
         }

         // If isDefaultShippingAddress is true, unset it for any other address of the user
         if (isDefaultShippingAddress) {
            const updateShippingQuery = `
               UPDATE user_address_info 
               SET is_default_shipping_address = FALSE 
               WHERE user_id = ? AND is_default_shipping_address = TRUE
            `
            await db.query(updateShippingQuery, [userId])
         }

         // Insert the new address record
         const insertQuery = `
            INSERT INTO user_address_info (user_id, company_name, country, zip, street_address, 
            apt_suite_bldg, delivery_instructions, city_town, state, is_contact_address, 
            is_default_shipping_address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         `
         const [insertResults] = await db.query(insertQuery, [
            userId,
            companyName,
            country,
            zip,
            streetAddress,
            aptSuiteBldg,
            deliveryInstructions,
            cityTown,
            state,
            isContactAddress,
            isDefaultShippingAddress,
         ])

         const addedAddress = {
            id: insertResults.insertId,
            user_id: userId,
            company_name: companyName,
            country: country,
            zip: zip,
            street_address: streetAddress,
            apt_suite_bldg: aptSuiteBldg,
            delivery_instructions: deliveryInstructions,
            city_town: cityTown,
            state: state,
            is_contact_address: isContactAddress ? 1 : 0,
            is_default_shipping_address: isDefaultShippingAddress ? 1 : 0,
         }

         callback(null, {
            success: 'true',
            message: 'Address added successfully',
            address: addedAddress,
         })
      } catch (err) {
         callback({
            success: 'false',
            message: 'Database error',
            reason: 'database_error',
            details: err.message,
         })
      }
   }

   static async editAddressDetails(params, callback) {
      const {
         addressId,
         companyName,
         country,
         zip,
         streetAddress,
         aptSuiteBldg,
         deliveryInstructions,
         cityTown,
         state,
         isContactAddress,
         isDefaultShippingAddress,
         userId,
      } = params

      try {
         // Validate address ID
         if (!addressId) {
            return callback(null, {
               success: 'false',
               message: 'No address ID provided',
               reason: 'missing_address_id',
            })
         }

         // Validate required fields
         if (!country || !zip || !streetAddress || !cityTown || !state) {
            return callback(null, {
               success: 'false',
               message: 'Missing required fields',
               reason: 'missing_required_fields',
            })
         }

         // If isContactAddress is true, unset it for any other address of the user
         if (isContactAddress) {
            const updateContactQuery = `
               UPDATE user_address_info 
               SET is_contact_address = FALSE 
               WHERE user_id = ? AND is_contact_address = TRUE
            `
            await db.query(updateContactQuery, [userId])
         }

         // If isDefaultShippingAddress is true, unset it for any other address of the user
         if (isDefaultShippingAddress) {
            const updateShippingQuery = `
               UPDATE user_address_info 
               SET is_default_shipping_address = FALSE 
               WHERE user_id = ? AND is_default_shipping_address = TRUE
            `
            await db.query(updateShippingQuery, [userId])
         }

         // Update the address record
         const updateQuery = `
            UPDATE user_address_info 
            SET company_name = ?, country = ?, zip = ?, street_address = ?, 
            apt_suite_bldg = ?, delivery_instructions = ?, city_town = ?, 
            state = ?, is_contact_address = ?, is_default_shipping_address = ?
            WHERE id = ?
         `
         await db.query(updateQuery, [
            companyName,
            country,
            zip,
            streetAddress,
            aptSuiteBldg,
            deliveryInstructions,
            cityTown,
            state,
            isContactAddress,
            isDefaultShippingAddress,
            addressId,
         ])

         const updatedAddress = {
            id: addressId,
            user_id: userId,
            company_name: companyName,
            country: country,
            zip: zip,
            street_address: streetAddress,
            apt_suite_bldg: aptSuiteBldg,
            delivery_instructions: deliveryInstructions,
            city_town: cityTown,
            state: state,
            is_contact_address: isContactAddress ? 1 : 0,
            is_default_shipping_address: isDefaultShippingAddress ? 1 : 0,
         }

         callback(null, {
            success: 'true',
            message: 'Address details updated successfully',
            address: updatedAddress,
         })
      } catch (err) {
         callback({
            success: 'false',
            message: 'Database error',
            reason: 'database_error',
            details: err.message,
         })
      }
   }

   static async createUser(params, callback) {
      try {
         // 1. Parse incoming params
         // const parsed = JSON.parse(params)
         const { name, email, password, role, permissions, authorization } =
            params
         const hashedPassword = md5(password)

         // 2. Decode token and extract role/email
         const decoded = JSON.parse(
            Buffer.from(authorization.split('.')[1], 'base64').toString(),
         )
         const creatorEmail = decoded.email
         const creatorRole = decoded.role

         // 3. Get creator's user_id
         const [creatorResult] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [creatorEmail],
         )
         if (creatorResult.length === 0) {
            return callback(null, {
               message: 'Invalid creator user',
               success: false,
               reason: 'invalid_creator_user',
            })
         }

         const creatorId = creatorResult[0].id

         // 4. Check if super-admin
         if (creatorRole !== 'super-admin') {
            // 5. If not, check if has 'manage_users' or 'all_permissions' permission
            const [permResult] = await db.query(
               'SELECT * FROM user_permissions WHERE user_id = ? AND permission IN (?, ?)',
               [creatorId, 'manage_users', 'all_permissions'],
            )

            if (permResult.length === 0) {
               return callback(null, {
                  message:
                     'Permission denied: You do not have manage_users or all_permissions',
                  success: false,
                  reason: 'permission_denied',
               })
            }
         }

         // 6. Check if user already exists
         const [existing] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email],
         )
         if (existing.length > 0) {
            return callback(null, {
               message: 'User already exists',
               success: false,
               reason: 'user_already_exists',
            })
         }

         // 7. Create new user
         const [userInsert] = await db.query(
            'INSERT INTO users (name, email, password, role, verified) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, 1],
         )
         const newUserId = userInsert.insertId

         // 8. Add permissions if any
         if (
            permissions &&
            Array.isArray(permissions) &&
            permissions.length > 0
         ) {
            const perms = permissions.map((p) => [newUserId, p])
            await db.query(
               'INSERT INTO user_permissions (user_id, permission) VALUES ?',
               [perms],
            )
         }

         const [newUserDataResult] = await db.query(
            'SELECT id, name, email, role, verified, status, created_at FROM users WHERE id = ?',
            [newUserId],
         )

         return callback(null, {
            success: true,
            message: 'User created successfully',
            userData: newUserDataResult,
         })
      } catch (err) {
         console.error('createUser error:', err)
         return callback(null, {
            message: 'Server error',
            success: false,
            details: err.message,
            reason: 'server_error',
         })
      }
   }

   static async getAllUsers(params, callback) {
      const { start = 0, end = 10, authorization, role, searchTerm } = params

      try {
         // Decode the token and get user information
         const decoded = JSON.parse(
            Buffer.from(authorization.split('.')[1], 'base64').toString(),
         )
         const email = decoded.email
         const decodedRole = decoded.role // Decoding the role for authorization only

         // Check if user exists
         const [creatorResult] = await db.query(
            'SELECT id, role FROM users WHERE email = ?',
            [email],
         )
         if (creatorResult.length === 0) {
            return callback(null, {
               success: false,
               reason: 'invalid_creator_user',
               message: 'Invalid user',
            })
         }

         const creatorId = creatorResult[0].id
         const creatorRole = creatorResult[0].role

         // Check if user has permission to manage users (only for non-admin users)
         if (creatorRole !== 'super-admin') {
            // 5. If not, check if has 'manage_users' or 'all_permissions' permission
            const [permResult] = await db.query(
               'SELECT * FROM user_permissions WHERE user_id = ? AND permission IN (?, ?)',
               [creatorId, 'manage_users', 'all_permissions'],
            )

            if (permResult.length === 0) {
               return callback(null, {
                  message:
                     'Permission denied: You do not have manage_users or all_permissions',
                  success: false,
                  reason: 'permission_denied',
               })
            }
         }

         const limit = parseInt(end) - parseInt(start)
         const offset = parseInt(start)

         // Base query for fetching users
         let usersQuery = `SELECT id, name, email, role, provider, verified, status, created_at FROM users`
         let countQuery = `SELECT COUNT(*) AS total FROM users`
         const queryParams = []
         const countParams = []

         // Apply role filter if it's passed
         if (role && role !== 'all') {
            usersQuery += ` WHERE role = ?`
            countQuery += ` WHERE role = ?`
            queryParams.push(role)
            countParams.push(role)
         }

         // Apply search filter if searchTerm is passed
         if (searchTerm && searchTerm.trim() !== '') {
            const searchPattern = `%${searchTerm.toLowerCase()}%`
            if (queryParams.length > 0) {
               usersQuery += ` AND (name LIKE ? OR email LIKE ?)`
               countQuery += ` AND (name LIKE ? OR email LIKE ?)`
            } else {
               usersQuery += ` WHERE (name LIKE ? OR email LIKE ?)`
               countQuery += ` WHERE (name LIKE ? OR email LIKE ?)`
            }
            queryParams.push(searchPattern, searchPattern)
            countParams.push(searchPattern, searchPattern)
         }

         // Add pagination and ordering
         usersQuery += ` ORDER BY id DESC LIMIT ? OFFSET ?`
         queryParams.push(limit, offset)

         // Execute the query to get users
         const [users] = await db.query(usersQuery, queryParams)
         const [countResult] = await db.query(countQuery, countParams)

         const total = countResult[0].total

         // Return users data
         callback(null, {
            success: true,
            message: 'Users fetched successfully',
            data: users,
            total,
         })
      } catch (err) {
         callback({
            error: {
               message: 'Database error',
               success: false,
               reason: 'database_error',
               details: err.message,
            },
         })
      }
   }

   static async toggleUserStatus(params, callback) {
      const { userId, authorization, action } = params // action can be either "activate" or "deactivate"

      try {
         // Decode the JWT token to get the admin's email and role
         const decoded = JSON.parse(
            Buffer.from(authorization.split('.')[1], 'base64').toString(),
         )
         const adminEmail = decoded.email
         const adminRole = decoded.role

         // Query the admin user from the database
         const [adminResult] = await db.query(
            'SELECT id, role FROM users WHERE email = ?',
            [adminEmail],
         )

         if (adminResult.length === 0) {
            return callback(null, {
               message: 'Invalid admin user',
               success: false,
               reason: 'invalid_admin_user',
            })
         }

         const adminId = adminResult[0].id

         // If the admin is not a super-admin, check if they have the necessary permission
         if (adminRole !== 'super-admin') {
            const [permResult] = await db.query(
               'SELECT * FROM user_permissions WHERE user_id = ? AND permission IN (?, ?)',
               [creatorId, 'manage_users', 'all_permissions'],
            )

            if (permResult.length === 0) {
               return callback(null, {
                  message:
                     'Permission denied: You do not have manage_users or all_permissions',
                  success: false,
                  reason: 'permission_denied',
               })
            }
         }

         // Query to get the user's current status (active or inactive)
         const [userResult] = await db.query(
            'SELECT id, status FROM users WHERE id = ?',
            [userId],
         )

         if (userResult.length === 0) {
            return callback(null, {
               message: 'User not found',
               success: false,
               reason: 'user_not_found',
            })
         }

         const currentStatus = userResult[0].status
         let newStatus

         // Determine the new status based on the action parameter
         if (action === 'activate') {
            newStatus = 'active'
         } else if (action === 'deactivate') {
            newStatus = 'inactive'
         } else {
            console.log('Invalid action:', action)
            return callback(null, {
               message: 'Invalid action',
               success: false,
               reason: 'invalid_action',
            })
         }

         // If the new status is the same as the current status, no update is needed
         if (currentStatus === newStatus) {
            return callback(null, {
               message: `User is already ${newStatus}`,
               success: true,
            })
         }

         // Update the user's status
         await db.query('UPDATE users SET status = ? WHERE id = ?', [
            newStatus,
            userId,
         ])

         const [updatedUserResult] = await db.query(
            'SELECT * FROM users WHERE id = ?',
            [userId],
         )

         return callback(null, {
            message: `User ${action}d successfully`,
            success: true,
            userData: updatedUserResult[0],
         })
      } catch (err) {
         console.error('toggleUserStatus error:', err)
         return callback(null, {
            message: 'Server error',
            success: false,
            details: err.message,
            reason: 'server_error',
         })
      }
   }
   static async getUserPermissions(params, callback) {
      const { email } = params

      try {
         // Step 1: Get user ID using email
         const [userResult] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email],
         )

         if (userResult.length === 0) {
            return callback(null, {
               message: 'User not found',
               success: false,
               reason: 'user_not_found',
            })
         }

         const userId = userResult[0].id

         // Step 2: Get permissions from user_permissions using user ID
         const [permResults] = await db.query(
            'SELECT permission FROM user_permissions WHERE user_id = ?',
            [userId],
         )

         // Step 3: Map permissions to an array of strings
         const permissions = permResults.map((row) => row.permission)

         // Step 4: Return the permissions array (empty if no permissions found)
         return callback(null, {
            message: 'Permissions retrieved successfully',
            success: true,
            data: {
               email,
               permissions,
            },
         })
      } catch (err) {
         return callback(null, {
            message: 'Database error',
            success: false,
            reason: 'database_error',
            details: err.message,
         })
      }
   }
   // Get a specific user's details and permissions by user_id
   static async getUserDetailsById(params, callback) {
      const { user_id } = params

      try {
         // Step 1: Fetch user data
         const [userResult] = await db.query(
            'SELECT id, name, email, role, provider, status, verified, created_at FROM users WHERE id = ?',
            [user_id],
         )

         if (userResult.length === 0) {
            return callback({
               error: {
                  message: 'User not found',
                  success: false,
                  reason: 'user_not_found',
               },
            })
         }

         const user = userResult[0]

         // Step 2: Fetch user's permissions
         const [permissionsResult] = await db.query(
            'SELECT permission FROM user_permissions WHERE user_id = ?',
            [user_id],
         )

         const permissions = permissionsResult.map((row) => row.permission)

         // Step 3: Return combined user info
         return callback(null, {
            message: 'User details retrieved successfully',
            success: true,
            data: {
               ...user,
               permissions,
            },
         })
      } catch (err) {
         return callback({
            error: {
               message: 'Database error',
               success: false,
               reason: 'database_error',
               details: err.message,
            },
         })
      }
   }
   static async editUserDetailsAndPermissions(params, callback) {
      // Extract details and permissions from params
      const { email, name, role, permissions } = params

      try {
         // Get user ID from email
         const [userResult] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email],
         )

         if (userResult.length === 0) {
            return callback(null, {
               message: 'User not found',
               success: 'false',
               reason: 'user_not_found',
            })
         }

         const userId = userResult[0].id

         // Update user details
         if (name || role) {
            const updateUserSql =
               'UPDATE users SET name = ?, role = ? WHERE id = ?'
            await db.query(updateUserSql, [name || null, role || null, userId])
         }

         // Update user permissions if provided
         await db.query('DELETE FROM user_permissions WHERE user_id = ?', [
            userId,
         ])

         // If new permissions exist, insert them
         if (Array.isArray(permissions) && permissions.length > 0) {
            const newPermissions = permissions.map((perm) => [userId, perm])
            await db.query(
               'INSERT INTO user_permissions (user_id, permission) VALUES ?',
               [newPermissions],
            )
         }

         // Retrieve updated user details
         const [updatedUserResult] = await db.query(
            'SELECT id, name, email, role, verified, status, created_at FROM users WHERE id = ?',
            [userId],
         )

         const [updatedPermissionsResult] = await db.query(
            'SELECT permission FROM user_permissions WHERE user_id = ?',
            [userId],
         )

         const updatedPermissions = updatedPermissionsResult.map(
            (row) => row.permission,
         )

         return callback(null, {
            message: 'User details and permissions updated successfully',
            success: 'true',
            data: { ...updatedUserResult[0], permissions: updatedPermissions },
         })
      } catch (err) {
         return callback(null, {
            message: 'Database error',
            success: 'false',
            reason: 'database_error',
            details: err.message,
         })
      }
   }
}

module.exports = UserController
