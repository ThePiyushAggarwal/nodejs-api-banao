const nodemailer = require('nodemailer')

const sendConfirmationCode = (user) => {
  return new Promise(async (result, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    })

    const message = {
      from: 'Nodejs API App',
      to: user.email,
      subject: 'Reset password code',
      html: `
      <div>
        <h2>Hello, ${user.name.split(' ')[0]}</h2>
        <h3>Please reset your password using this code:</h3>
        <h4>${user.forgotPasswordConfirmationCode}</h4>
      </div>
      `,
    }

    transporter.sendMail(message, (err, info) => {
      if (err) {
        reject(err)
        console.log(err)
      } else {
        result(info)
      }
    })
  })
}

module.exports = sendConfirmationCode
