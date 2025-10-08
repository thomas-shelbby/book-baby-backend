const db = require('../config/db')
const nodemailer = require('nodemailer')

class FormsController {
   static selfPubshingForm1(params, callback) {
      const {
         FirstName,
         LastName,
         EmailAddress,
         PhoneNumber,
         PublishedBookBefore,
         ManuscriptState,
         BookWritingType,
      } = params

      if (!EmailAddress) {
         return callback(null, {
            message: 'To email address is required',
            success: 'false',
            reason: 'missing_to_email',
         })
      }

      const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
         },
      })

      const userMailOptions = {
         from: 'grandsmoiz6@gmail.com',
         to: EmailAddress,
         subject: 'Thanks For Contacting Us',
         html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en" xml:lang="en">
  <head>
    <title>MetaGen Verse</title>
    <link rel="shortcut icon" href="https://book-baby.zuzteccrm.com/static/media/logo-main-1.b83d62ff6d6e2d1a1dca.png" type="image/x-icon">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta content="initial-scale=1.0" name="viewport">
    <meta name="robots" content="no index">
    <style>
      a,
      u+#body a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }

      .appleLinks a {
        color: #000000;


      .appleLinksHEADLINE a {
               text-decoration: none;
      }


      .        color: #fff;
        text-decoration: none;
      }

      .appleLinksWHITE a {
        color: #ffffff;
        text-decoration: none;
      }
      .appleLinksGRAY2 a {

        color: #77787b;
        text-decoration: none;

      .appleLinksDKGRAY a {

        color: #595959;
        text-decoration: none;
      }


      .appleLinksBLUE a {
        color: #0073ae;
        text-decoration: none;
      }
    </style>

    <!--[if !mso]>

<!-- -->
    <style>
      @font-face {
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Bold.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Bold.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype");
        font-weight: normal !important;
        font-style: normal !important;
      }


      @        font-family: "pp-sans-big-light";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Light.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Light.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Light.svg") format("svg");
        font-weight: normal !important;
        font-style: normal !important;
      }

      @font-face {
        font-family: "pp-sans-big-medium";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Medium.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Medium.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Medium.svg") format("svg");
        font-weight: normal !important;
        font-style: normal !important;
      }
      @font-face {

        font-family: "pp-sans-big-regular";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Regular.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Regular.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Regular.svg") format("svg");
        font-weight: normal !important;
             }

      @font-face {

        font-family: "pp-sans-big-thin";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Thin.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Thin.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Thin.svg") format("svg");
        font-weight: normal !important;
      }

      @font-face {

        font-family: "pp-sans-small-light";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Light.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Light.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
               font-weight: normal !important;
        font-style: normal !important;
      }

      @font-face {

        font-family: "pp-sans-small-medium";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Medium.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Medium.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
        font-weight: normal !important;
        font-style: normal !important;
      }

      @font-face {

        font-family: "pp-sans-small-regular";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Regular.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Regular.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Regular.svg") format("svg");
        font-weight: normal !important;
        font-style: normal !important;
      }


      @font-face {
        font-family: "pp-sans-small-thin";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Thin.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Thin.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Thin.svg") format("svg");
        font-style: normal !important;
      }
    </style>

    <!--<![endif]-->
    <style type="text/css">
        /*@-ms-viewport {
               }
        @viewport {
               }*/
      }

      div,
      p,
      a,

      li,
      t        -webkit-text-size-adjust: none;
      }

      t        text-decoration: none !important;
      }


      td {
        border-bottom: none;
      }


      a[x-apple-data-detectors] {
        color: inherit !important;

        text-decoration: none !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      .boxshadow {
        box-shadow: 0 1px 4px 0 #eeeeee;
      }

      /* div &amp;amp;amp;amp;amp;amp;amp;amp;amp;gt; u + .body .gmail{
        border: 1px solid #eeeeee !important;
    } */      @media all and (min-width: 480px) {
        .hide {

          display: block !important;
          overflow: auto !important;
          max-height: inherit !important;
      }

      @media all and (max-width: 480px) {
        .mmhide {
        }

          margin: auto !important;
        }


          display: none !important;
        }


        .mob-showcell {
                 }


        .          padding: 25px 35px 0px 35px !important;
        }

        .mobpadbot25 {
          padding: 20px 35px 25px 35px !important;
        }

        .view-online_ltr {
          text-align: left !important;
          padding-left: 10px !important;
          padding-top: 0 !important;
        }

        .mob_fix {
          width: 100vw !important;
        }

        .table {
          max-width: 100% !important;
        }
        /*a.100 {

                 }*/
        .table-main {
          width: 90% !important;
        }

        .          width: 80% !important;
        }


        .table-xsm {
        }

          width: 100% !important;
          min-width: 100% !important;
        }

        .img {
                   height: auto !important;
        }


          width: 90% !important;
          height: 1px !important;
        }

        .          padding: 20px 20px 20px 20px !important;
        }

        .pad2035 {
          padding: 20px 35px 20px 35px !important;
        }
        .pad2035nobot {
          padding: 20px 35px 0px 35px !important;
        }

        .pad1235 {
        }

        .padside35 {
          padding: 0px 35px 0px 35px !important;
        }
        .pad2035noborder {

                   border: none !important;
        }

        .pad2035follow {
          padding: 0px 35px 20px 35px !important;
        }


        .          padding: 0px 35px 20px 35px !important;
          border: none !important;
        }

        .pad3035 {
          padding: 30px 35px 0 35px !important;        }


        .padallsides {
          padding: 30px 20px 30px 20px !important;
        }


        .pad302020 {
          padding: 30px 20px 0px 20px !important;
        }

        .pad201020 {
          padding: 0px 20px 10px 20px !important;
        }


        .pad302030 {
          padding: 30px 20px 30px 20px !important;
        }

        .pad20sides {
                 }


        .pad20sidest          padding: 20px 20px 0px 20px !important;
        }

        .pad4035 {
          padding: 40px 35px 40px 35px !important;
        }

        .pad5035 {
          padding: 50px 35px 50px 35px !important;
        }
        .
nopad {
          padding: 0px 0px 0px 0px !important;
        }
        .
nopadtop {
                 }

        .padbot20 {
          padding-bottom: 20px !important;
        }

        .padbot20border {
          padding-bottom: 20px !important;
          border-bottom: solid 1px #dddddd !important;
                 }


        .bordernone {
          border: none !important;
        }

        .centertext {
          text-align: center !important;
        }


        .          max-height: 0;
         
 /* Gmail*/
          display: none;
          /* Generic*/
          mso-hide: all;
          /* Outlook clients*/          overflow: hidden;
         
 /* Generic */
        }
        .mobile-only {
          display: block !important;
          width: 100% !important;
          max-height: none !important;
          color: #000000 !important;
         
 font-size: 32px !important;
        }
        .mobileonlyblock {
          display: inline-block !important;
        }
        .padtop20 {
          padding: 20px 0px 0px 0px !important;
        }
        .padbottom20 {
          padding: 0px 0px 20px 0px !important;
        }


        .mobpadtopbot {          padding-top: 25px !important;
          padding-bottom: 25px !important;
        }
        .mobtoppad {
          padding-top: 10px !important;
        }

        .mobhtwt {
          width: 250px !important;
          height: 110px !important;
        }

        .mobwt270 {          width: 270px !important;
        }

        .mobwt115 {
          width: 115px !important;
        }

        .mobwtht11580 {
          width: 115px !important;          height: 90px !important;
        }

        .noheight {
          height: auto !important;
        }
        .
full {
          width: 1          border: none !important;
          padding-left: 0px !important;
          padding-right: 0px !impor        }


        a[class="full_border"] {
          width: 100% !important;
         
 padding-left: 0px !important;
          padding-right: 0px !important;
        }
        .
display-block,
        .displayBlock {
          width: 100% !important;
          display: block !important;
         
 margin-bottom: 4px;
        }

        .mob_280 {
          width: 280px !important;
        }
        .mobpadbtm20 {
          padding-bottom: 20px;
        }

        .
coldrop {
          display: block !important;
          float: left;
          width: 100% !important;
        }

        .coldropheader {
          display: table-header-group !important;
          width: 100% !        }

        .coldropfooter {          display: table-footer-group !important;
          width: 100% !important;
        }


        table th {
         
 margin: 0 !important;
          padding: 0 !important;
          vertical-align: top;
         
 font-weight: normal;
        }

        .mob_50per {
          width: 50% !important;
         
 margin: auto;
        }
        .mob_50per img {
          margin: auto;
        }


        .checked-mob-hide {
          width: 100% !important;
         
 height: auto !important;
        }
        .mob_align_left {
          text-align: left !important;
        }

        .
mob_align_right {
          text-align: right !important;
        }
        .pad20noside {
         
 padding: 20px 0px 20px 0px !important;
        }

        .
pad20nosidefollow {
          padding: 0px 0px 20px 0px !important;
        }
        .mob_pad203540 {
         
 padding: 20px 35px 40px 35px !important;
        }

        .
padtop20bottom10 {
          padding: 20px 0px 10px 0px !important;
        }


        .pad303530 {
          padding: 30px 35px 30px 35px !important;
        }


        .table-three {
          width: 33% !important;

        }

        .coldropnoborder {

          display: block !important;
          float: left;
          width: 100% !important;

          min-width: 100% !important;
          border: 0px solid #fff !important;
        }


        .coldrop50_left {
          /*display: block !important;

      float: left;*/
          width: 50% !important;
          border: 0px solid #fff !important;
          border-radius: 10px 0px 0px 10px;
          min-width: 50% !important;
          vertical-align: middle;
        }


        .borderradiusleft {
          border-radius: 10px 0px 0px 10px;
        }    border-bottom: 1px solid #ccc !important;
          border-radius: 0px 10px 10px 0px;
          min-width: 50% !important;
          vertical-align: middle;
          border-left: 0px solid #ccc;
          border-right: 1px solid #ccc;

          border-top: 1px solid #ccc;
        }


        .padtopbot {
          padding: 30px 0px 10px 0px !important;
        }

        .pad2020 {
          padding: 0px 0px 0px 0px !important;
        }

        .mrgtop30 {
          margin-top: 30px;

          width: 100% !important;
          max-width: 100% !important;
        }

      }
    </style>
    <style type="text/css">

      body.th_TH,
      body.th_TH a,
      body.th_TH p,
      body.th_TH span,
      body.th_TH div,
      body.th_TH table td {
        font-family: Tahoma, 'Unicode Arial MS', Helvetica, Arial, sans-serif !important;
      }

      body.zh_HK,
      body.zh_HK a,
      body.zh_HK p,
      body.zh_HK span,
      body.zh_HK div,
      body.zh_HK table td {
        font-family: 'Microsoft JhengHei', Helvetica, Arial, sans-serif !important;

      }

      body.zh_TW,
      body.zh_TW a,
      body.zh_TW p,
      body.zh_TW span,
      body.zh_TW div,
      body.zh_TW table td {

        font-family: 'Microsoft JhengHei', Helvetica, Arial, sans-serif !important;
      }

      body.ko_KR,
      body.ko_KR a,
      body.ko_KR p,
      body.ko_KR span,
      body.ko_KR div,

      body.ko_KR table td {
        font-family: '나눔바른고딕', Nanum Barun Gothic, Helvetica, Arial, sans-serif !important;
        word-break: break-all;
      }

      body.ja_JP,
      body.ja_JP a,
      body.ja_JP p,
      body.ja_JP span,

      body.ja_JP div,
      body.ja_JP table td {
        font-family: 'メイリオ', Meiryo, 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', Osaka, 'ＭＳ Ｐゴシック', 'MS PGothic', Verdana, Arial, Helvetica, sans-serif !important;
      }
    </style>

    <!--[if gte mso 9
      ]><xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG /> <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml><!
    [endif]-->

    <!--[if mso | ie]>
      <style>
        .sup {
          vertical-align: 1px !important;
          font-size: 100% !important;
        }
      </style>
    <![endif]-->

    <!--[if ie]>
      <style>
        .sup {
          vertical-align: 6px !important;
          font-size: 80% !important;
        }
      </style>
    <![endif]-->

    <!--[if mso]><style>
      span.hidetonline {
        display: block !important
      }
    </style><![endif]-->
      
        
      
    

    <!--[if (mso)|(mso 16)]>
<style type="text/css">
a {text-decoration: none;}
.boxshadow {box-shadow: none!important; border: 1px solid #eeeeee !important}
</style>
<![endif]-->

    <!--[if gte mso 9]>
            <style type="text/css">
            body.th_TH,
            body.th_TH a,
            body.th_TH p,
            body.th_TH span,
            body.th_TH div,
            body.th_TH table td
            {
                word-break: break-all;
            }
            body.zh_HK,
            body.zh_HK a,
            body.zh_HK p,
            body.zh_HK span,
            body.zh_HK div,
            body.zh_HK table td
            {
                word-break: break-all;
            }
            body.zh_TW,
            body.zh_TW a,
            body.zh_TW p,
            body.zh_TW span,
            body.zh_TW div,
            body.zh_TW table td
            {
                word-break: break-all;
            }
            body.ko_KR,
            body.ko_KR a,
            body.ko_KR p,
            body.ko_KR span,
            body.ko_KR div,
            
                word-break: break-all;
            }
            body.ja_JP,
            body.ja_JP a,
            body.ja_JP p,
            body.ja_JP span,
            body.ja_JP div,
            body.ja_JP table td
            {
                word-break: break-all;
            }
            </style>
    <![endif]-->
  </head>
  <body style="margin: 0 auto; padding:0px; background:#fff;" id="body">

    <!--
-->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" role="presentation">
      <tbody>
        <tr>
          <td align="center" valign="middle">
            <table border="0" cellpadding="0" cellspacing="0" width="640" align="center" class="table-full" role="presentation" style="min-width:320px; max-width:640px;">
              <tbody id="base">

                <!--Insert Modules Here-->

                <!--Tertiary 5.1 START-->

                <!--Tertiary 5.1 END-->

                <!--Tertiary 5.1 START-->

                <!--Tertiary 5.1 END-->
                <tr>
                  <td align="center" valign="middle">
                    <table width="640" border="0" cellpadding="0" cellspacing="0" align="center" class="table" style="max-width:640px;" role="presentation">
                      <tbody>
                        <tr>
                          <th align="center" valign="top" class="coldrop" style="font-weight:normal;" width="500">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tbody>
                                <tr>
                                  <td valign="top" align="left" style="font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:12px; color:#666666; padding: 10px 10px 10px 10px;"><b><span style="font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:12px; color:#666666;"></span></b><span style="font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:12px; font-weight: bold; color:#FF8000;">Thanks For Contacting Us.</span></td>
                                </tr>
                              </tbody>
                            </table>
                          </th>
                          <!-- <th align="center" valign="top" class="coldrop" style="font-weight:normal;" width="75">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tbody>
                                <tr>
                                  <td valign="top" align="right" style="font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:12px; color:#666666; white-space: nowrap; padding: 10px 10px 10px 0;" class="view-online_ltr"><a style="font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; color:#666666;text-decoration:underline;" href="#" target="_blank">View Online</a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </th> -->
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" valign="middle" bgcolor="#ffffff" style="background-color:#000;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" style="min-width:320px;" role="presentation">
                      <tbody>
                        <tr>
                          <td align="center" valign="middle" style="padding:10px 0px 10px 0px;">
                            <table border="0" cellpadding="0" cellspacing="0" align="center" role="presentation">
                              <tbody>
                                <tr>
                                  <td align="center" valign="middle" height="70" style="vertical-align: middle;">
                                    <img src="https://book-baby.zuzteccrm.com/static/media/logo-main-1.b83d62ff6d6e2d1a1dca.png" alt="AbdulMoiz" title="AbdulMoiz" height="50" border="0" style="display:block; font-family:'pp-sans-big-medium', Tahoma, Arial, sans-serif; font-size:32px; color:#003288;">
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" valign="middle" style="padding:0px 0px 0px 0px; vertical-align: middle; line-height: 1px;">
                            <table border="0" cellpadding="0" cellspacing="0" align="center" role="presentation">
                              <tbody>
                                <tr>
                                  <td align="center" valign="middle" height="1" style="vertical-align: middle; line-height: 1px;">
                                    <img src="https://images.ctfassets.net/7rifqg28wcbd/1tFsF7cjjNpwaLC3AKwtu7/3709b2fab644d1c377323faf87f300f9/headergrad_onwhite.jpg" alt="" height="1" border="0" style="display:block;" class="header-border">
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
                <tr>
                  <td align="center" valign="middle" bgcolor="#ffffff" style="padding:40px 35px 40px 35px; background-color: #000;">
                    <table width="520" border="0" cellpadding="0" cellspacing="0" align="center" class="table-sm" style="max-width: 520px;" role="presentation">
                      <tbody>
                        <tr>
                          <td align="center" valign="middle" style="padding-bottom:20px;">
                            <h1 style="margin: 0px; font-family:'pp-sans-big-light', Tahoma, Arial, sans-serif; font-weight: bold; font-size:40px; mso-line-height-rule:exactly; line-height:1.3; color:#FF8000;">Thank You for Your
                              <br class="mob-hide show-formatting">‌ Message!
                                                         </h1>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" valign="middle">
                            <p style="margin: 0px; font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:18px; line-height:1.5; mso-line-height-rule:exactly; color:#fff;">We appreciate your reaching out to us.
                              We’ll be in touch with you soon.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" valign="middle" style="padding:0px 0px 0px 0px; background-color:#000;" bgcolor="#ffffff">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" style="max-width: 640px;" role="presentation">
                      <tbody>
                        <tr>
                          <td align="center" valign="middle">
                            <img src="https://images.ctfassets.net/7rifqg28wcbd/6Xa3RLs8deEywtgXmAo9JV/61b1ee3576f0473ea04f86166fc8f4b1/spacer.gif" alt="" width="50" height="50" border="0" style="display:block;">
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="mob-hide">
                    <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" role="presentation">
                      <tbody>
                        <tr>
                          <td style="height:1px; width: 1px;"><img src="https://pixel.app.returnpath.net/pixel.gif?r=2f6be46d47e11b222de691bd456fc58eb37b72dd" width="1" height="1"></td>
                        </tr>
                        <tr>
                          <td style="line-height:2px; height:2px; min-width: 640px;">
                            <img src="https://images.ctfassets.net/7rifqg28wcbd/6Xa3RLs8deEywtgXmAo9JV/61b1ee3576f0473ea04f86166fc8f4b1/spacer.gif" height="2" width="640" style="max-height:2px; min-height:2px; display:block; width:640px; min-width:640px;">
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
    </table>
  </body>
</html>`,
      }

      const adminMailOptions = {
         from: 'grandsmoiz6@gmail.com',
         to: 'grandsmoiz6@gmail.com',
         subject: 'New Contact Form Submission From Self Publishing',
         html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en" xml:lang="en">
  <head>
    <title>MetaGen Verse</title>
    <link rel="shortcut icon" href="https://book-baby.zuzteccrm.com/static/media/logo-main-1.b83d62ff6d6e2d1a1dca.png" type="image/x-icon">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta content="initial-scale=1.0" name="viewport">
    <meta name="robots" content="no index">
    <style>
      a,
      u+#body a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }

      .appleLinks a {
        color: #000000;


      .appleLinksHEADLINE a {
               text-decoration: none;
      }


      .        color: #fff;
        text-decoration: none;
      }

      .appleLinksWHITE a {
        color: #ffffff;
        text-decoration: none;
      }
      .appleLinksGRAY2 a {

        color: #77787b;
        text-decoration: none;

      .appleLinksDKGRAY a {

        color: #595959;
        text-decoration: none;
      }


      .appleLinksBLUE a {
        color: #0073ae;
        text-decoration: none;
      }
    </style>

    <!--[if !mso]>

<!-- -->
    <style>
      @font-face {
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Bold.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Bold.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype");
        font-weight: normal !important;
        font-style: normal !important;
      }


      @        font-family: "pp-sans-big-light";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Light.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Light.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Light.svg") format("svg");
        font-weight: normal !important;
        font-style: normal !important;
      }

      @font-face {
        font-family: "pp-sans-big-medium";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Medium.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Medium.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Medium.svg") format("svg");
        font-weight: normal !important;
        font-style: normal !important;
      }
      @font-face {

        font-family: "pp-sans-big-regular";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Regular.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Regular.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Regular.svg") format("svg");
        font-weight: normal !important;
             }

      @font-face {

        font-family: "pp-sans-big-thin";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Thin.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Thin.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Thin.svg") format("svg");
        font-weight: normal !important;
      }

      @font-face {

        font-family: "pp-sans-small-light";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Light.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Light.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
               font-weight: normal !important;
        font-style: normal !important;
      }

      @font-face {

        font-family: "pp-sans-small-medium";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Medium.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Medium.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
        font-weight: normal !important;
        font-style: normal !important;
      }

      @font-face {

        font-family: "pp-sans-small-regular";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Regular.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Regular.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Regular.svg") format("svg");
        font-weight: normal !important;
        font-style: normal !important;
      }


      @font-face {
        font-family: "pp-sans-small-thin";
        src: url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Thin.eot") format("eot"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Thin.woff") format("woff"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf") format("truetype"),
          url("https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansSmall-Thin.svg") format("svg");
        font-style: normal !important;
      }
    </style>

    <!--<![endif]-->
    <style type="text/css">
        /*@-ms-viewport {
               }
        @viewport {
               }*/
      }

      div,
      p,
      a,

      li,
      t        -webkit-text-size-adjust: none;
      }

      t        text-decoration: none !important;
      }


      td {
        border-bottom: none;
      }


      a[x-apple-data-detectors] {
        color: inherit !important;

        text-decoration: none !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      .boxshadow {
        box-shadow: 0 1px 4px 0 #eeeeee;
      }

      /* div &amp;amp;amp;amp;amp;amp;amp;amp;amp;gt; u + .body .gmail{
        border: 1px solid #eeeeee !important;
    } */      @media all and (min-width: 480px) {
        .hide {

          display: block !important;
          overflow: auto !important;
          max-height: inherit !important;
      }

      @media all and (max-width: 480px) {
        .mmhide {
        }

          margin: auto !important;
        }


          display: none !important;
        }


        .mob-showcell {
                 }


        .          padding: 25px 35px 0px 35px !important;
        }

        .mobpadbot25 {
          padding: 20px 35px 25px 35px !important;
        }

        .view-online_ltr {
          text-align: left !important;
          padding-left: 10px !important;
          padding-top: 0 !important;
        }

        .mob_fix {
          width: 100vw !important;
        }

        .table {
          max-width: 100% !important;
        }
        /*a.100 {

                 }*/
        .table-main {
          width: 90% !important;
        }

        .          width: 80% !important;
        }


        .table-xsm {
        }

          width: 100% !important;
          min-width: 100% !important;
        }

        .img {
                   height: auto !important;
        }


          width: 90% !important;
          height: 1px !important;
        }

        .          padding: 20px 20px 20px 20px !important;
        }

        .pad2035 {
          padding: 20px 35px 20px 35px !important;
        }
        .pad2035nobot {
          padding: 20px 35px 0px 35px !important;
        }

        .pad1235 {
        }

        .padside35 {
          padding: 0px 35px 0px 35px !important;
        }
        .pad2035noborder {

                   border: none !important;
        }

        .pad2035follow {
          padding: 0px 35px 20px 35px !important;
        }


        .          padding: 0px 35px 20px 35px !important;
          border: none !important;
        }

        .pad3035 {
          padding: 30px 35px 0 35px !important;        }


        .padallsides {
          padding: 30px 20px 30px 20px !important;
        }


        .pad302020 {
          padding: 30px 20px 0px 20px !important;
        }

        .pad201020 {
          padding: 0px 20px 10px 20px !important;
        }


        .pad302030 {
          padding: 30px 20px 30px 20px !important;
        }

        .pad20sides {
                 }


        .pad20sidest          padding: 20px 20px 0px 20px !important;
        }

        .pad4035 {
          padding: 40px 35px 40px 35px !important;
        }

        .pad5035 {
          padding: 50px 35px 50px 35px !important;
        }
        .
nopad {
          padding: 0px 0px 0px 0px !important;
        }
        .
nopadtop {
                 }

        .padbot20 {
          padding-bottom: 20px !important;
        }

        .padbot20border {
          padding-bottom: 20px !important;
          border-bottom: solid 1px #dddddd !important;
                 }


        .bordernone {
          border: none !important;
        }

        .centertext {
          text-align: center !important;
        }


        .          max-height: 0;
         
 /* Gmail*/
          display: none;
          /* Generic*/
          mso-hide: all;
          /* Outlook clients*/          overflow: hidden;
         
 /* Generic */
        }
        .mobile-only {
          display: block !important;
          width: 100% !important;
          max-height: none !important;
          color: #000000 !important;
         
 font-size: 32px !important;
        }
        .mobileonlyblock {
          display: inline-block !important;
        }
        .padtop20 {
          padding: 20px 0px 0px 0px !important;
        }
        .padbottom20 {
          padding: 0px 0px 20px 0px !important;
        }


        .mobpadtopbot {          padding-top: 25px !important;
          padding-bottom: 25px !important;
        }
        .mobtoppad {
          padding-top: 10px !important;
        }

        .mobhtwt {
          width: 250px !important;
          height: 110px !important;
        }

        .mobwt270 {          width: 270px !important;
        }

        .mobwt115 {
          width: 115px !important;
        }

        .mobwtht11580 {
          width: 115px !important;          height: 90px !important;
        }

        .noheight {
          height: auto !important;
        }
        .
full {
          width: 1          border: none !important;
          padding-left: 0px !important;
          padding-right: 0px !impor        }


        a[class="full_border"] {
          width: 100% !important;
         
 padding-left: 0px !important;
          padding-right: 0px !important;
        }
        .
display-block,
        .displayBlock {
          width: 100% !important;
          display: block !important;
         
 margin-bottom: 4px;
        }

        .mob_280 {
          width: 280px !important;
        }
        .mobpadbtm20 {
          padding-bottom: 20px;
        }

        .
coldrop {
          display: block !important;
          float: left;
          width: 100% !important;
        }

        .coldropheader {
          display: table-header-group !important;
          width: 100% !        }

        .coldropfooter {          display: table-footer-group !important;
          width: 100% !important;
        }


        table th {
         
 margin: 0 !important;
          padding: 0 !important;
          vertical-align: top;
         
 font-weight: normal;
        }

        .mob_50per {
          width: 50% !important;
         
 margin: auto;
        }
        .mob_50per img {
          margin: auto;
        }


        .checked-mob-hide {
          width: 100% !important;
         
 height: auto !important;
        }
        .mob_align_left {
          text-align: left !important;
        }

        .
mob_align_right {
          text-align: right !important;
        }
        .pad20noside {
         
 padding: 20px 0px 20px 0px !important;
        }

        .
pad20nosidefollow {
          padding: 0px 0px 20px 0px !important;
        }
        .mob_pad203540 {
         
 padding: 20px 35px 40px 35px !important;
        }

        .
padtop20bottom10 {
          padding: 20px 0px 10px 0px !important;
        }


        .pad303530 {
          padding: 30px 35px 30px 35px !important;
        }


        .table-three {
          width: 33% !important;

        }

        .coldropnoborder {

          display: block !important;
          float: left;
          width: 100% !important;

          min-width: 100% !important;
          border: 0px solid #fff !important;
        }


        .coldrop50_left {
          /*display: block !important;

      float: left;*/
          width: 50% !important;
          border: 0px solid #fff !important;
          border-radius: 10px 0px 0px 10px;
          min-width: 50% !important;
          vertical-align: middle;
        }


        .borderradiusleft {
          border-radius: 10px 0px 0px 10px;
        }    border-bottom: 1px solid #ccc !important;
          border-radius: 0px 10px 10px 0px;
          min-width: 50% !important;
          vertical-align: middle;
          border-left: 0px solid #ccc;
          border-right: 1px solid #ccc;

          border-top: 1px solid #ccc;
        }


        .padtopbot {
          padding: 30px 0px 10px 0px !important;
        }

        .pad2020 {
          padding: 0px 0px 0px 0px !important;
        }

        .mrgtop30 {
          margin-top: 30px;

          width: 100% !important;
          max-width: 100% !important;
        }

      }
    </style>
    <style type="text/css">

      body.th_TH,
      body.th_TH a,
      body.th_TH p,
      body.th_TH span,
      body.th_TH div,
      body.th_TH table td {
        font-family: Tahoma, 'Unicode Arial MS', Helvetica, Arial, sans-serif !important;
      }

      body.zh_HK,
      body.zh_HK a,
      body.zh_HK p,
      body.zh_HK span,
      body.zh_HK div,
      body.zh_HK table td {
        font-family: 'Microsoft JhengHei', Helvetica, Arial, sans-serif !important;

      }

      body.zh_TW,
      body.zh_TW a,
      body.zh_TW p,
      body.zh_TW span,
      body.zh_TW div,
      body.zh_TW table td {

        font-family: 'Microsoft JhengHei', Helvetica, Arial, sans-serif !important;
      }

      body.ko_KR,
      body.ko_KR a,
      body.ko_KR p,
      body.ko_KR span,
      body.ko_KR div,

      body.ko_KR table td {
        font-family: '나눔바른고딕', Nanum Barun Gothic, Helvetica, Arial, sans-serif !important;
        word-break: break-all;
      }

      body.ja_JP,
      body.ja_JP a,
      body.ja_JP p,
      body.ja_JP span,

      body.ja_JP div,
      body.ja_JP table td {
        font-family: 'メイリオ', Meiryo, 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', Osaka, 'ＭＳ Ｐゴシック', 'MS PGothic', Verdana, Arial, Helvetica, sans-serif !important;
      }
    </style>

    <!--[if gte mso 9
      ]><xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG /> <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml><!
    [endif]-->

    <!--[if mso | ie]>
      <style>
        .sup {
          vertical-align: 1px !important;
          font-size: 100% !important;
        }
      </style>
    <![endif]-->

    <!--[if ie]>
      <style>
        .sup {
          vertical-align: 6px !important;
          font-size: 80% !important;
        }
      </style>
    <![endif]-->

    <!--[if mso]><style>
      span.hidetonline {
        display: block !important
      }
    </style><![endif]-->
      
        
      
    

    <!--[if (mso)|(mso 16)]>
<style type="text/css">
a {text-decoration: none;}
.boxshadow {box-shadow: none!important; border: 1px solid #eeeeee !important}
</style>
<![endif]-->

    <!--[if gte mso 9]>
            <style type="text/css">
            body.th_TH,
            body.th_TH a,
            body.th_TH p,
            body.th_TH span,
            body.th_TH div,
            body.th_TH table td
            {
                word-break: break-all;
            }
            body.zh_HK,
            body.zh_HK a,
            body.zh_HK p,
            body.zh_HK span,
            body.zh_HK div,
            body.zh_HK table td
            {
                word-break: break-all;
            }
            body.zh_TW,
            body.zh_TW a,
            body.zh_TW p,
            body.zh_TW span,
            body.zh_TW div,
            body.zh_TW table td
            {
                word-break: break-all;
            }
            body.ko_KR,
            body.ko_KR a,
            body.ko_KR p,
            body.ko_KR span,
            body.ko_KR div,
            
                word-break: break-all;
            }
            body.ja_JP,
            body.ja_JP a,
            body.ja_JP p,
            body.ja_JP span,
            body.ja_JP div,
            body.ja_JP table td
            {
                word-break: break-all;
            }
            </style>
    <![endif]-->
  </head>
  <body style="margin: 0 auto; padding:0px; background:#fff;" id="body">

    <!--
-->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" role="presentation">
      <tbody>
        <tr>
          <td align="center" valign="middle">
            <table border="0" cellpadding="0" cellspacing="0" width="640" align="center" class="table-full" role="presentation" style="min-width:320px; max-width:640px;">
              <tbody id="base">

                <!--Insert Modules Here-->

                <!--Tertiary 5.1 START-->

                <!--Tertiary 5.1 END-->

                <!--Tertiary 5.1 START-->

                <!--Tertiary 5.1 END-->
                <tr>
                  <td align="center" valign="middle">
                    <table width="640" border="0" cellpadding="0" cellspacing="0" align="center" class="table" style="max-width:640px;" role="presentation">
                      <tbody>
                        <tr>
                          <th align="center" valign="top" class="coldrop" style="font-weight:normal;" width="500">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tbody>
                                <tr>
                                  <td valign="top" align="left" style="font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:12px; color:#666666; padding: 10px 10px 10px 10px;"><b><span style="font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:12px; color:#666666;"></span></b><span style="font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:12px; font-weight: bold; color:#fff;">Thanks For Contacting Us.</span></td>
                                </tr>
                              </tbody>
                            </table>
                          </th>
                          <!-- <th align="center" valign="top" class="coldrop" style="font-weight:normal;" width="75">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tbody>
                                <tr>
                                  <td valign="top" align="right" style="font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:12px; color:#666666; white-space: nowrap; padding: 10px 10px 10px 0;" class="view-online_ltr"><a style="font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; color:#666666;text-decoration:underline;" href="#" target="_blank">View Online</a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </th> -->
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" valign="middle" bgcolor="#ffffff" style="background-color:#000;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" style="min-width:320px;" role="presentation">
                      <tbody>
                        <tr>
                          <td align="center" valign="middle" style="padding:10px 0px 10px 0px;">
                            <table border="0" cellpadding="0" cellspacing="0" align="center" role="presentation">
                              <tbody>
                                <tr>
                                  <td align="center" valign="middle" height="70" style="vertical-align: middle;">
                                    <img src="https://book-baby.zuzteccrm.com/static/media/logo-main-1.b83d62ff6d6e2d1a1dca.png" alt="MetaGenVerse" title="MetaGenVerse" height="50" border="0" style="display:block; font-family:'pp-sans-big-medium', Tahoma, Arial, sans-serif; font-size:32px; color:#003288;">
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" valign="middle" style="padding:0px 0px 0px 0px; vertical-align: middle; line-height: 1px;">
                            <table border="0" cellpadding="0" cellspacing="0" align="center" role="presentation">
                              <tbody>
                                <tr>
                                  <td align="center" valign="middle" height="1" style="vertical-align: middle; line-height: 1px;">
                                    <img src="https://images.ctfassets.net/7rifqg28wcbd/1tFsF7cjjNpwaLC3AKwtu7/3709b2fab644d1c377323faf87f300f9/headergrad_onwhite.jpg" alt="" height="1" border="0" style="display:block;" class="header-border">
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
                <tr>
                  <td align="center" valign="middle" bgcolor="#ffffff" style="padding:40px 35px 40px 35px; background-color: #000;">
                    <table width="520" border="0" cellpadding="0" cellspacing="0" align="center" class="table-sm" style="max-width: 520px;" role="presentation">
                      <tbody>
                        <tr>
                          <td align="center" valign="middle" style="padding-bottom:20px;">
                            <h1 style="margin: 0px; font-family:'pp-sans-big-light', Tahoma, Arial, sans-serif; font-weight: bold; font-size:40px; mso-line-height-rule:exactly; line-height:1.3; color:#ff8000;">New Inquery
                                                         </h1>
                            
                          </td>
                        </tr>
                        <tr>
                          <td align="start" valign="middle">
                            <p style="margin: 0px; font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:18px; line-height:1.5; mso-line-height-rule:exactly; color:#fff;">Dear Admin You Have Recieve A New Inquery


                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="start" valign="middle">
                            <p style="margin: 0px; font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:18px; line-height:1.5; mso-line-height-rule:exactly; color:#fff;">First Name: ${FirstName}


                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="start" valign="middle">
                            <p style="margin: 0px; font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:18px; line-height:1.5; mso-line-height-rule:exactly; color:#fff;">Last Name: ${LastName}


                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="start" valign="middle">
                            <p style="margin: 0px; font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:18px; line-height:1.5; mso-line-height-rule:exactly; color:#fff;">Email: ${EmailAddress}


                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="start" valign="middle">
                            <p style="margin: 0px; font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:18px; line-height:1.5; mso-line-height-rule:exactly; color:#fff;">Phone Number: ${PhoneNumber}


                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="start" valign="middle">
                            <p style="margin: 0px; font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:18px; line-height:1.5; mso-line-height-rule:exactly; color:#fff;">Published Book Before: ${PublishedBookBefore}


                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="start" valign="middle">
                            <p style="margin: 0px; font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:18px; line-height:1.5; mso-line-height-rule:exactly; color:#fff;">Manuscript State: ${ManuscriptState}


                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="start" valign="middle">
                            <p style="margin: 0px; font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:18px; line-height:1.5; mso-line-height-rule:exactly; color:#fff;">Book Writing Type: ${BookWritingType}


                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="start" valign="middle">
                            <p style="margin: 0px; margin-top: 20px; font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:18px; line-height:1.5; mso-line-height-rule:exactly; color:#fff;">Thanks


                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" valign="middle" style="padding:0px 0px 0px 0px; background-color:#000;" bgcolor="#ffffff">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" style="max-width: 640px;" role="presentation">
                      <tbody>
                        <tr>
                          <td align="center" valign="middle">
                            <img src="https://images.ctfassets.net/7rifqg28wcbd/6Xa3RLs8deEywtgXmAo9JV/61b1ee3576f0473ea04f86166fc8f4b1/spacer.gif" alt="" width="50" height="50" border="0" style="display:block;">
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="mob-hide">
                    <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" role="presentation">
                      <tbody>
                        <tr>
                          <td style="height:1px; width: 1px;"><img src="https://pixel.app.returnpath.net/pixel.gif?r=2f6be46d47e11b222de691bd456fc58eb37b72dd" width="1" height="1"></td>
                        </tr>
                        <tr>
                          <td style="line-height:2px; height:2px; min-width: 640px;">
                            <img src="https://images.ctfassets.net/7rifqg28wcbd/6Xa3RLs8deEywtgXmAo9JV/61b1ee3576f0473ea04f86166fc8f4b1/spacer.gif" height="2" width="640" style="max-height:2px; min-height:2px; display:block; width:640px; min-width:640px;">
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
    </table>
  </body>
</html> `,
      }

      transporter.sendMail(userMailOptions, (userError, userInfo) => {
         if (userError) {
            return callback(null, {
               message: 'Failed to send user email',
               success: 'false',
               reason: 'email_send_error',
               details: userError.message,
            })
         }

         // Send admin email only if user email was successful
         transporter.sendMail(adminMailOptions, (adminError, adminInfo) => {
            if (adminError) {
               return callback(null, {
                  message: 'Failed to send admin email',
                  success: 'false',
                  reason: 'email_send_error',
                  details: adminError.message,
               })
            }

            callback(null, {
               message: 'email sent successfully',
               success: 'true',
               data: { user: userInfo, admin: adminInfo },
            })
         })
      })
   }
}

module.exports = FormsController
