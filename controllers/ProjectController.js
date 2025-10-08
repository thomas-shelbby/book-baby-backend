const db = require('../config/db')
const nodemailer = require('nodemailer')

class ProjectController {
   //    static getUserInfo(params, callback) {
   //       const { email } = params

   //       // Query to get user info from users table
   //       const userSql =
   //          'SELECT id, name, email, provider, password FROM users WHERE email = ?'
   //       db.query(userSql, [email], (err, userResults) => {
   //          if (err || userResults.length === 0) {
   //             return callback({
   //                error: {
   //                   message: 'User not found',
   //                   success: 'false',
   //                   reason: 'user_not_found',
   //                },
   //             })
   //          }

   //          const user = userResults[0]
   //          const userId = user.id

   //          // Query to get contact info from user_contact_info table
   //          const contactSql =
   //             'SELECT phone, mobile_phone, id, user_id FROM user_contact_info WHERE user_id = ?'
   //          db.query(contactSql, [userId], (err, contactResults) => {
   //             if (err) {
   //                return callback({
   //                   error: {
   //                      message: 'Database error',
   //                      success: 'false',
   //                      reason: 'database_error',
   //                   },
   //                })
   //             }

   //             // Check if the user has a password (if the password field is not null or empty)
   //             const hasPassword = user.password ? true : false

   //             // Combine user and contact info
   //             const userInfo = {
   //                id: user.id,
   //                name: user.name,
   //                email: user.email,
   //                provider: user.provider, // Include provider in the response
   //                password: hasPassword, // Include password field with true/false
   //                contact_info:
   //                   contactResults.length > 0 ? contactResults[0] : null,
   //             }

   //             callback(null, {
   //                message: 'User information retrieved successfully',
   //                success: 'true',
   //                data: userInfo,
   //             })
   //          })
   //       })
   //    }
   static sendEmailToUser(params, callback) {
      const { toEmailAddress, CCEmailAddressess, Message, bookData } = params

      if (!toEmailAddress) {
         return callback(null, {
            message: 'To email address is required',
            success: 'false',
            reason: 'missing_to_email',
         })
      }

      let ccEmails = []

      if (CCEmailAddressess && CCEmailAddressess.trim() !== '') {
         // Parse CC addresses and filter out any empty strings
         ccEmails = CCEmailAddressess.split(',')
            .map((email) => email.trim())
            .filter((email) => email)

         // Remove duplicates where toEmailAddress matches any CC address
         ccEmails = ccEmails.filter(
            (email) => email.toLowerCase() !== toEmailAddress.toLowerCase(),
         )
      }

      const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
         },
      })

      const mailOptions = {
         from: 'grandsmoiz6@gmail.com',
         to: toEmailAddress,
         cc: ccEmails.length > 0 ? ccEmails : undefined, // Only add CC if there are valid CC addresses
         subject: 'Your Booking Details',
         html: `
         <!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">

<head>
	<title></title>
	<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
	<meta content="width=device-width, initial-scale=1.0" name="viewport" /><!--[if mso]>
<xml><w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"><w:DontUseAdvancedTypographyReadingMail/></w:WordDocument>
<o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml>
<![endif]--><!--[if !mso]><!-->
	<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@100;200;300;400;500;600;700;800;900"
		rel="stylesheet" type="text/css" />
	<link href="https://fonts.googleapis.com/css2?family=Oxygen:wght@100;200;300;400;500;600;700;800;900"
		rel="stylesheet" type="text/css" /><!--<![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		sup,
		sub {
			font-size: 75%;
			line-height: 0;
		}

		@media (max-width:640px) {
			.desktop_hide table.icons-inner {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style>
	<!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]-->
</head>

<body class="body"
	style="background-color: #DFDFDF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #DFDFDF;" width="100%">
		<tbody>
			<tr>
				<td>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
						role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://i.ibb.co/Xxtc0MFB/groovepaper-1.png'); background-repeat: repeat;"
						width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 620px; margin: 0 auto;"
										width="620">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad" style="width:100%;">
																<div align="center" class="alignment">
																	<div style="max-width: 620px;"><img alt="Image"
																			height="auto"
																			src="https://i.ibb.co/tMnDj4pk/top-rounded-15.png"
																			style="display: block; height: auto; border: 0; width: 100%;"
																			title="Image" width="620" /></div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
						role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://i.ibb.co/tTNgc9rs/hero-bg-2.jpg'); background-position: top center; background-repeat: no-repeat;"
						width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 620px; margin: 0 auto;"
										width="620">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="paragraph_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad"
																style="padding-left:60px;padding-right:60px;padding-top:60px;">
																<div
																	style="color:#FFFFFF;font-family:'Oswald','Lucida Sans Unicode','Lucida Grande',sans-serif;font-size:34px;line-height:1.8;text-align:center;mso-line-height-alt:61px;">
																	<p style="margin: 0; word-break: break-word;"><span
																			style="word-break: break-word;"><span
																				style="word-break: break-word;">Dear </span><strong><span
																					style="word-break: break-word;"><span
																						style="word-break: break-word; background-color: rgb(255,255,255);"><span
																							style="word-break: break-word; color: rgb(0,51,0); background-color: rgb(255,255,255);"> <span
																								style="word-break: break-word; color: rgb(0,128,0);">${
                                                                           toEmailAddress.split(
                                                                              '@',
                                                                           )[0]
                                                                        }</span> </span></span>, </span></strong></span>
																	</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="paragraph_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad"
																style="padding-left:60px;padding-right:60px;">
																<div
																	style="color:#FFFFFF;font-family:'Oswald','Lucida Sans Unicode','Lucida Grande',sans-serif;font-size:24px;line-height:1.8;text-align:center;mso-line-height-alt:43px;">
																	<p style="margin: 0; word-break: break-word;">${Message}</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="paragraph_block block-3" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad"
																style="padding-left:60px;padding-right:60px;">
																<div
																	style="color:#FFFFFF;font-family:'Oswald','Lucida Sans Unicode','Lucida Grande',sans-serif;font-size:14px;line-height:1.8;text-align:center;mso-line-height-alt:25px;">
																	<p style="margin: 0; word-break: break-word;"><br />
																	</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block block-4 mobile_hide" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad" style="width:100%;">
																<div align="center" class="alignment">
																	<div style="max-width: 64px;"><img alt="Image"
																			height="auto" src="https://i.ibb.co/LzDCLSCn/smile.png"
																			style="display: block; height: auto; border: 0; width: 100%;"
																			title="Image" width="64" /></div>
																</div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-5 mobile_hide"
														style="height:125px;line-height:125px;font-size:1px;"> </div>
													<div class="spacer_block block-6 mobile_hide"
														style="height:40px;line-height:40px;font-size:1px;"> </div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
						role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://i.ibb.co/Xxtc0MFB/groovepaper-1.png'); background-position: top center; background-repeat: repeat;"
						width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
										width="620">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="paragraph_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad"
																style="padding-bottom:5px;padding-left:40px;padding-right:40px;padding-top:15px;">
																<div
																	style="color:#56B500;font-family:'Oswald','Lucida Sans Unicode','Lucida Grande',sans-serif;font-size:24px;line-height:1.5;text-align:center;mso-line-height-alt:36px;">
																	<p style="margin: 0; word-break: break-word;"><span
																			style="word-break: break-word;"><strong>Book
																				Details</strong></span></p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4"
						role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://i.ibb.co/Xxtc0MFB/groovepaper-1.png'); background-position: top center; background-repeat: repeat;"
						width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #56b500; color: #000000; width: 620px; margin: 0 auto;"
										width="620">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-right: 1px solid #519E0A; padding-bottom: 5px; padding-top: 5px; padding-left: 10px; vertical-align: top;"
													width="66.66666666666667%">
													<table border="0" cellpadding="10" cellspacing="0"
														class="paragraph_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div
																	style="color:#FFFFFF;font-family:'Oxygen', 'Trebuchet MS', Helvetica, sans-serif;font-size:13px;line-height:1.2;text-align:start;mso-line-height-alt:16px;">
																	<p style="margin: 0; word-break: break-word;"><span
																			style="word-break: break-word;"><strong>Description</strong></span>
																	</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;"
													width="33.333333333333336%">
													<table border="0" cellpadding="10" cellspacing="0"
														class="paragraph_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div
																	style="color:#FFFFFF;font-family:'Oxygen', 'Trebuchet MS', Helvetica, sans-serif;font-size:13px;line-height:1.2;text-align:center;mso-line-height-alt:16px;">
																	<p style="margin: 0; word-break: break-word;"><span
																			style="word-break: break-word;"><strong>Total</strong></span>
																	</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<!-- ONE -->
               ${Object.values(JSON.parse(bookData).selectedOptions)
                  .flatMap((step, idx) =>
                     Object.values(step).map(
                        (item, subIdx) =>
                           ` <table
                           align='center'
                           border='0'
                           cellpadding='0'
                           cellspacing='0'
                           class='row row-5'
                           role='presentation'
                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://i.ibb.co/Xxtc0MFB/groovepaper-1.png'); background-position: top center; background-repeat: repeat;"
                           width='100%'
                        >
                           <tbody>
                              <tr>
                                 <td>
                                    <table
                                       align='center'
                                       border='0'
                                       cellpadding='0'
                                       cellspacing='0'
                                       class='row-content'
                                       role='presentation'
                                       style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: ${
                                          idx % 2 === 0 ? '#FFFFFF' : '#F5F5F5'
                                       }; color: #000000; width: 620px; margin: 0 auto;'
                                       width='620'
                                    >
                                       <tbody>
                                          <tr>
                                             <td
                                                class='column column-1'
                                                style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-right: 1px solid #DFDFDF; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'
                                                width='66.66666666666667%'
                                             >
                                                <table
                                                   border='0'
                                                   cellpadding='0'
                                                   cellspacing='0'
                                                   class='paragraph_block block-1'
                                                   role='presentation'
                                                   style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'
                                                   width='100%'
                                                >
                                                   <tr>
                                                      <td
                                                         class='pad'
                                                         style='padding-bottom:5px;padding-left:15px;padding-right:5px;padding-top:5px;'
                                                      >
                                                         <div style="color:#555555;font-family:'Oxygen', 'Trebuchet MS', Helvetica, sans-serif;font-size:14px;line-height:1.2;text-align:left;mso-line-height-alt:17px;">
                                                            <p style='margin: 0; word-break: break-word;'>
                                                               <span style='word-break: break-word; color: #999999;'>
                                                                  ${item.label}
                                                               </span>
                                                            </p>
                                                           <!-- <p style='margin: 0; word-break: break-word;'>
                                                               <span style='word-break: break-word; color: #999999;'>
                                                                  sit amet
                                                                  desicititnum.
                                                               </span>
                                                            </p> -->
                                                         </div>
                                                      </td>
                                                   </tr>
                                                </table>
                                             </td>
                                             <td
                                                class='column column-2'
                                                style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'
                                                width='33.333333333333336%'
                                             >
                                                <table
                                                   border='0'
                                                   cellpadding='10'
                                                   cellspacing='0'
                                                   class='paragraph_block block-1'
                                                   role='presentation'
                                                   style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'
                                                   width='100%'
                                                >
                                                   <tr>
                                                      <td class='pad'>
                                                         <div style="color:#555555;font-family:'Oxygen', 'Trebuchet MS', Helvetica, sans-serif;font-size:14px;line-height:1.2;text-align:center;mso-line-height-alt:17px;">
                                                            <p style='margin: 0; word-break: break-word;'>
                                                               <strong>
                                                                  ${
                                                                     typeof item.price ===
                                                                     'number'
                                                                        ? `$${item.price.toFixed(
                                                                             2,
                                                                          )}`
                                                                        : '-'
                                                                  }
                                                               </strong>
                                                            </p>
                                                         </div>
                                                      </td>
                                                   </tr>
                                                </table>
                                             </td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                        <table
                           align='center'
                           border='0'
                           cellpadding='0'
                           cellspacing='0'
                           class='row row-6'
                           role='presentation'
                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://i.ibb.co/Xxtc0MFB/groovepaper-1.png'); background-position: top center; background-repeat: repeat;"
                           width='100%'
                        >
                           <tbody>
                              <tr>
                                 <td>
                                    <table
                                       align='center'
                                       border='0'
                                       cellpadding='0'
                                       cellspacing='0'
                                       class='row-content stack'
                                       role='presentation'
                                       style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;'
                                       width='620'
                                    >
                                       <tbody>
                                          <tr>
                                             <td
                                                class='column column-1'
                                                style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top;'
                                                width='100%'
                                             >
                                                <table
                                                   border='0'
                                                   cellpadding='0'
                                                   cellspacing='0'
                                                   class='divider_block block-1'
                                                   role='presentation'
                                                   style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'
                                                   width='100%'
                                                >
                                                   <tr>
                                                      <td class='pad'>
                                                         <div
                                                            align='center'
                                                            class='alignment'
                                                         >
                                                            <table
                                                               border='0'
                                                               cellpadding='0'
                                                               cellspacing='0'
                                                               role='presentation'
                                                               style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'
                                                               width='100%'
                                                            >
                                                               <tr>
                                                                  <td
                                                                     class='divider_inner'
                                                                     style='font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;'
                                                                  >
                                                                     <span style='word-break: break-word;'>
                                                                         
                                                                     </span>
                                                                  </td>
                                                               </tr>
                                                            </table>
                                                         </div>
                                                      </td>
                                                   </tr>
                                                </table>
                                             </td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </td>
                              </tr>
                           </tbody>
                        </table>`,
                     ),
                  )
                  .join('')}
					<!-- ONE END -->
					
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-12"
						role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://i.ibb.co/Xxtc0MFB/groovepaper-1.png'); background-position: top center; background-repeat: repeat;"
						width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
										width="620">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="divider_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad">
																<div align="left" class="alignment">
																	<table border="0" cellpadding="0" cellspacing="0"
																		role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
																		width="100%">
																		<tr>
																			<td class="divider_inner"
																				style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
																				<span
																					style="word-break: break-word;"> </span>
																			</td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-13"
						role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://i.ibb.co/Xxtc0MFB/groovepaper-1.png'); background-position: top center; background-repeat: repeat;"
						width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
										width="620">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 15px; vertical-align: top;"
													width="33.333333333333336%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="empty_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad">
																<div></div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top;"
													width="33.333333333333336%">
													<div class="spacer_block block-1"
														style="height:20px;line-height:20px;font-size:1px;"> </div>
												</td>
												<td class="column column-3"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #56B500; border-left: 1px solid #DFDFDF; padding-bottom: 5px; padding-top: 10px; vertical-align: top;"
													width="33.333333333333336%">
													<div class="spacer_block block-1"
														style="height:20px;line-height:20px;font-size:1px;"> </div>
													<table border="0" cellpadding="0" cellspacing="0"
														class="paragraph_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad"
																style="padding-bottom:25px;padding-left:10px;padding-right:10px;">
																<div
																	style="color:#FFFFFF;font-family:'Oxygen', 'Trebuchet MS', Helvetica, sans-serif;font-size:18px;line-height:1.2;text-align:center;mso-line-height-alt:22px;">
																	<p style="margin: 0; word-break: break-word;"><span
																			style="word-break: break-word;"><strong>${
                                                            JSON.parse(bookData)
                                                               .price
                                                         }</strong></span></p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-14"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 620px; margin: 0 auto;"
										width="620">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad" style="width:100%;">
																<div align="center" class="alignment">
																	<div style="max-width: 620px;"><img alt="Image"
																			height="auto"
																			src="https://i.ibb.co/C52nNHmf/bottom-rounded-15.png"
																			style="display: block; height: auto; border: 0; width: 100%;"
																			title="Image" width="620" /></div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-15"
						role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F0F0F0; background-image: url('https://i.ibb.co/Xxtc0MFB/groovepaper-1.png'); background-position: top center; background-repeat: repeat;"
						width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 620px; margin: 0 auto;"
										width="620">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-top: 15px; vertical-align: top;"
													width="100%">
													<table border="0" cellpadding="10" cellspacing="0"
														class="paragraph_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div
																	style="color:#555555;font-family:'Oxygen', 'Trebuchet MS', Helvetica, sans-serif;font-size:12px;line-height:1.2;text-align:center;mso-line-height-alt:14px;">
																	<p style="margin: 0; word-break: break-word;">
																		<strong>Your Company © All rights
																			reserved</strong>
																	</p>
																	<p style="margin: 0; word-break: break-word;">Book
																		Baby</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>
               `,
      }

      transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
            return callback(null, {
               message: 'Failed to send email',
               success: 'false',
               reason: 'email_send_error',
               details: error.message,
            })
         } else {
            callback(null, {
               message: 'Email sent successfully',
               success: 'true',
               data: info,
            })
         }
      })
   }
   static async getUserProjects(params, callback) {
      const { user_id, status, limit, start, end } = params

      let query = 'SELECT * FROM order_data WHERE user_id = ?'
      const queryParams = [user_id]

      // Count query based on presence of status
      let countQuery
      const countParams = [user_id]

      if (status) {
         query += ' AND order_status = ?'
         queryParams.push(status)

         countQuery =
            'SELECT COUNT(*) as total_orders FROM order_data WHERE user_id = ? AND order_status = ?'
         countParams.push(status)
      } else {
         countQuery =
            'SELECT COUNT(*) as total_orders FROM order_data WHERE user_id = ?'
      }

      // Pagination logic
      if (limit) {
         query += ' LIMIT ?'
         queryParams.push(parseInt(limit))

         if (start) {
            query += ' OFFSET ?'
            queryParams.push(parseInt(start))
         }
      } else if (start && end) {
         query += ' LIMIT ? OFFSET ?'
         queryParams.push(parseInt(end) - parseInt(start))
         queryParams.push(parseInt(start))
      } else if (start) {
         query += ' LIMIT 5 OFFSET ?'
         queryParams.push(parseInt(start))
      } else {
         query += ' LIMIT 5'
      }

      try {
         const [projectsResult, countResult] = await Promise.all([
            db.query(query, queryParams),
            db.query(countQuery, countParams),
         ])

         const orders = projectsResult[0]

         // 🧠 Loop through orders and enrich remark if exists
         for (let order of orders) {
            // ✅ 1. Parse and enrich remark
            if (order.remark) {
               try {
                  const parsedRemark = JSON.parse(order.remark)

                  if (parsedRemark.userId) {
                     const [remarkUserResult] = await db.query(
                        `SELECT id, name, email, role FROM users WHERE id = ?`,
                        [parsedRemark.userId],
                     )

                     if (remarkUserResult.length > 0) {
                        parsedRemark.remarkUserData = remarkUserResult[0]
                     }
                  }

                  order.remark = JSON.stringify(parsedRemark)
               } catch (parseErr) {
                  console.warn(
                     `Invalid JSON in remark for order ${
                        order.orderid || order.id
                     }:`,
                     parseErr.message,
                  )
               }
            }

            // ✅ 2. Attach files from order_files_data
            const [fileResult] = await db.query(
               `SELECT * FROM order_files_data WHERE quoteId = ?`,
               [order.orderid || order.id],
            )

            if (fileResult.length > 0) {
               order.files = fileResult
            } else {
               order.files = [] // Optional: always return empty array if no files
            }
         }

         callback(null, {
            message: 'Projects retrieved successfully',
            data: projectsResult[0],
            total_orders: countResult[0][0].total_orders,
            success: 'true',
         })
      } catch (err) {
         callback(null, {
            message: 'Failed to retrieve projects',
            error: err.message,
            success: 'false',
         })
      }
   }

   static async getPieChartOrders(params, callback) {
      const { email } = params

      if (!email) {
         return callback(null, {
            success: false,
            message: 'Email is required',
         })
      }

      try {
         // Check user role
         const [userResult] = await db.query(
            'SELECT role FROM users WHERE email = ?',
            [email],
         )

         if (userResult.length === 0) {
            return callback(null, { success: false, message: 'User not found' })
         }

         const userRole = userResult[0].role

         if (userRole !== 'admin' && userRole !== 'super-admin') {
            return callback(null, {
               success: false,
               message: 'Unauthorized: Admin access only',
               reason: 'not_admin',
            })
         }

         // Get order counts
         const query = `
      SELECT 
        COUNT(*) AS total_orders,
        SUM(order_status = 'in-progress') AS approved_orders,
        SUM(order_status = 'rejected') AS rejected_orders,
        SUM(order_status = 'onapproval') AS awaiting_approval,
        SUM(order_status = 'completed') AS completed
      FROM order_data
    `

         const [result] = await db.query(query)
         const row = result[0]

         // Build chart data, excluding any status with value 0 or null
         const summary = [
            { name: 'Total Orders', value: row.total_orders },
            { name: 'Approved Orders', value: Number(row.approved_orders) },
            { name: 'Rejected Orders', value: Number(row.rejected_orders) },
            { name: 'Awaiting Approval', value: Number(row.awaiting_approval) },
            { name: 'Completed', value: Number(row.completed) },
         ].filter((item) => item.value && item.value > 0) // Only include if value > 0

         callback(null, { success: true, data: summary })
      } catch (err) {
         callback(null, { success: false, message: err.message })
      }
   }
   static async getOrdersTrend(params, callback) {
      const { email, viewLevel, parentDate } = params
      if (!email || !viewLevel) {
         return callback(null, {
            success: false,
            message: 'Email and viewLevel are required',
         })
      }
      try {
         const [u] = await db.query('SELECT role FROM users WHERE email = ?', [
            email,
         ])
         if (
            !u.length ||
            (u[0].role !== 'admin' && u[0].role !== 'super-admin')
         ) {
            return callback(null, {
               success: false,
               message: 'You are not admin',
               reason: 'not_admin',
            })
         }

         let query = '',
            qparams = []

         if (viewLevel === 'year') {
            query = `SELECT YEAR(created_at) AS date, COUNT(*) AS orders FROM order_data GROUP BY YEAR(created_at) ORDER BY YEAR(created_at)`
         } else if (viewLevel === 'month') {
            if (!parentDate) {
               query = `
            SELECT DATE_FORMAT(ds.date, '%Y-%m') AS date, COUNT(o.id) orders
            FROM (SELECT MAKEDATE(YEAR(CURDATE()),1) + INTERVAL m MONTH AS date
                  FROM (SELECT 0 m UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
                        UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
                        UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
                        UNION ALL SELECT 10 UNION ALL SELECT 11) months) ds
            LEFT JOIN order_data o
              ON YEAR(o.created_at) = YEAR(CURDATE()) AND MONTH(o.created_at) = MONTH(ds.date)
            GROUP BY ds.date ORDER BY ds.date`
            } else {
               query = `SELECT DATE_FORMAT(created_at, '%Y-%m') AS date, COUNT(*) AS orders
                   FROM order_data WHERE YEAR(created_at)=? GROUP BY MONTH(created_at) ORDER BY MONTH(created_at)`
               qparams = [parentDate]
            }
         } else if (viewLevel === 'day') {
            if (!parentDate) {
               query = `
            WITH RECURSIVE all_days AS (
              SELECT DATE_FORMAT(CURDATE(), '%Y-%m-01') AS date
              UNION ALL
              SELECT DATE_ADD(date, INTERVAL 1 DAY)
              FROM all_days
              WHERE MONTH(date)=MONTH(CURDATE()) AND YEAR(date)=YEAR(CURDATE())
            )
            SELECT d.date, COUNT(o.id) AS orders
            FROM all_days d
            LEFT JOIN order_data o ON DATE(o.created_at)=d.date
            GROUP BY d.date ORDER BY d.date`
            } else {
               query = `
            WITH RECURSIVE all_days AS (
              SELECT DATE_FORMAT(?, '%Y-%m-01') AS date
              UNION ALL
              SELECT DATE_ADD(date, INTERVAL 1 DAY)
              FROM all_days
              WHERE MONTH(date)=MONTH(?) AND YEAR(date)=YEAR(?)
            )
            SELECT d.date, COUNT(o.id) AS orders
            FROM all_days d
            LEFT JOIN order_data o ON DATE(o.created_at)=d.date
            GROUP BY d.date ORDER BY d.date`
               qparams = [parentDate, parentDate, parentDate]
            }
         } else {
            return callback(null, {
               success: false,
               message: 'Invalid viewLevel',
            })
         }

         const [rows] = await db.query(query, qparams)
         callback(null, { success: true, data: rows })
      } catch (err) {
         callback(null, { success: false, message: err.message })
      }
   }
   // ✅ NEW FUNCTION: Get all book orders with permission checks and pagination
   static async getAllBookOrders(params, callback) {
      const {
         start = 0,
         end = 10,
         authorization,
         search = '',
         status = '',
         date = '',
      } = params

      try {
         const decoded = JSON.parse(
            Buffer.from(authorization.split('.')[1], 'base64').toString(),
         )
         const email = decoded.email
         const decodedRole = decoded.role

         // 🔐 Validate user
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

         // 🔐 Check permissions if not super-admin
         if (creatorRole !== 'super-admin') {
            const [permResult] = await db.query(
               `
      SELECT * FROM user_permissions
      WHERE user_id = ?
      AND permission IN (?, ?, ?, ?)
      `,
               [
                  creatorId,
                  'complete_orders',
                  'approve_orders',
                  'reject_orders',
                  'all_permissions',
               ],
            )

            if (permResult.length === 0) {
               return callback(null, {
                  message:
                     'Permission denied: You do not have permission to manage orders',
                  success: false,
                  reason: 'permission_denied',
               })
            }
         }

         // 🧠 Build query with filters
         const filters = []
         const queryParams = []

         if (search && search.length >= 3) {
            filters.push(`(projectName LIKE ? OR orderid LIKE ?)`)
            queryParams.push(`%${search}%`, `%${search}%`)
         }

         if (status) {
            filters.push('order_status = ?')
            queryParams.push(status)
         }

         if (date) {
            filters.push('DATE(created_at) = ?')
            queryParams.push(date)
         }

         const whereClause = filters.length
            ? `WHERE ${filters.join(' AND ')}`
            : ''

         const limit = parseInt(end) - parseInt(start)
         const offset = parseInt(start)

         // 📦 Main query with dynamic filters
         const query = `
         SELECT user_id, projectName, bookType, orderid, order_status, price, created_at
         FROM order_data
         ${whereClause}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?
      `

         queryParams.push(limit, offset)

         const [orders] = await db.query(query, queryParams)

         // 👤 Fetch user details for each order
         const ordersWithUserDetails = []
         for (let order of orders) {
            const [user] = await db.query(
               'SELECT id, name, email FROM users WHERE id = ?',
               [order.user_id],
            )
            if (user.length > 0) {
               order.userData = user[0]
            }
            ordersWithUserDetails.push(order)
         }

         // 📊 Get counts with same filters
         const countQuery = `
         SELECT COUNT(*) as total
         FROM order_data
         ${whereClause}
      `
         const [countResult] = await db.query(
            countQuery,
            queryParams.slice(0, -2),
         ) // exclude limit & offset
         const total = countResult[0].total

         // 📊 Additional stats (overall, not filtered)
         const [completedResult] = await db.query(
            `SELECT COUNT(*) as total FROM order_data WHERE order_status = 'completed'`,
         )
         const completedOrders = completedResult[0].total

         const [rejectedResult] = await db.query(
            `SELECT COUNT(*) as total FROM order_data WHERE order_status = 'rejected'`,
         )
         const rejectedOrders = rejectedResult[0].total

         const [todayResult] = await db.query(
            `SELECT COUNT(*) as total FROM order_data WHERE DATE(created_at) = CURDATE()`,
         )
         const todayOrders = todayResult[0].total

         // ✅ Success response
         return callback(null, {
            success: true,
            message: 'Book orders fetched successfully',
            data: ordersWithUserDetails,
            total,
            completedOrders,
            rejectedOrders,
            todayOrders,
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
   // 📌 New function to get detailed info of a single book order
   static async getBookOrderDetails(params, callback) {
      const { orderid } = params

      try {
         // 🧾 Fetch order details
         const [orderResult] = await db.query(
            `SELECT * FROM order_data WHERE orderid = ? LIMIT 1`,
            [orderid],
         )

         if (orderResult.length === 0) {
            return callback(null, {
               success: false,
               message: 'Order not found',
               reason: 'order_not_found',
            })
         }

         const order = orderResult[0]

         // 👤 Get user_id from the order details
         const user_id = order.user_id

         // 👤 Get user basic info
         const [userResult] = await db.query(
            `SELECT id, name, email FROM users WHERE id = ?`,
            [user_id],
         )

         if (userResult.length > 0) {
            order.userData = userResult[0]
         }

         // 📦 Get default shipping address based on user_id
         const [shippingResult] = await db.query(
            `SELECT * FROM user_address_info WHERE user_id = ? AND is_default_shipping_address = 1 LIMIT 1`,
            [user_id],
         )

         if (shippingResult.length > 0) {
            order.shippingAddress = shippingResult[0]
         }

         // 🧾 Get default billing address (contact address) based on user_id
         const [billingResult] = await db.query(
            `SELECT * FROM user_address_info WHERE user_id = ? AND is_contact_address = 1 LIMIT 1`,
            [user_id],
         )

         if (billingResult.length > 0) {
            order.billingAddress = billingResult[0]
         }

         const [paymentResult] = await db.query(
            `SELECT * FROM payments WHERE order_id = ? LIMIT 1`,
            [order.id],
         )

         if (paymentResult.length > 0) {
            order.paymentDetails = paymentResult[0]
         }

         const [fileResult] = await db.query(
            `SELECT * FROM order_files_data WHERE quoteId = ?`,
            [orderid],
         )

         if (fileResult.length > 0) {
            order.files = fileResult // Add files data to order details if files exist
         }

         // ✅ Return full order detail including user and address information
         if (order.remark) {
            try {
               // ✅ Parse the remark string
               const parsedRemark = JSON.parse(order.remark)

               if (parsedRemark.userId) {
                  const [remarkUserResult] = await db.query(
                     `SELECT id, name, email, role FROM users WHERE id = ?`,
                     [parsedRemark.userId],
                  )

                  if (remarkUserResult.length > 0) {
                     // ✅ Add user data into the parsed remark
                     parsedRemark.remarkUserData = remarkUserResult[0]
                  }
               }

               // ✅ Stringify back and assign to order.remark
               order.remark = JSON.stringify(parsedRemark)
            } catch (parseErr) {
               console.warn('Invalid JSON in remark field:', parseErr.message)
            }
         }

         // ✅ Return full order detail
         return callback(null, {
            success: true,
            message: 'Order details fetched successfully',
            data: order,
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
}

module.exports = ProjectController
