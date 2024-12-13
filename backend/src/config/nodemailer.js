import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.HOST_MAILTRAP,
  port: process.env.PORT_MAILTRAP,
  auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP
  }
})

export const sendDonationNotification = (userMail, donationDetails) => {
  const mailOptions = {
    from: process.env.USER_MAILTRAP,
    to: userMail,
    subject: '¡Has recibido una nueva donación!',
    html: `<p>Hola, se te ha asignado una nueva donación: <strong>${donationDetails}</strong></p>`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Correo de donación enviado: ' + info.response)
    }
  })
}

export const sendSupplyShortageNotification = (userMail, supplyItem) => {
  const mailOptions = {
    from: process.env.USER_MAILTRAP,
    to: userMail,
    subject: '¡Alerta de escasez de suministros!',
    html: `<p>Hola, se ha detectado que queda poca cantidad del suministro: <strong>${supplyItem}</strong>. Por favor, considera reabastecerlo.</p>`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Correo de escasez de suministros enviado: ' + info.response)
    }
  })
}

export const sendMailToAdmin = (userMail, password) => {
  const mailOptions = {
    from: process.env.USER_MAILTRAP,
    to: userMail,
    subject: '¡Bienvenido al equipo!',
    html: `<p>Has sido registrado en Solca, ya puedes ingresar sesión con las siguientes credenciales:</p>
    <p>Correo electrónico: ${userMail}</p>
    <p>Contraseña: ${password}</p>
    <p>No olvides restablecer tu contraseña.`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Correo de registro exitoso enviado: ' + info.response)
    }
  })
}

export const sendMailToSocialWorker = (userMail, password, token) => {
  const mailOptions = {
    from: process.env.USER_MAILTRAP,
    to: userMail,
    subject: '¡Bienvenido al equipo!',
    html: `<p>Has sido registrado en Solca para ingresar nuestra plataforma</p>
    <br>
    <p style="font-weight: bold;">Tus credenciales son las siguientes:</p>
    <p>Correo electrónico: ${userMail}</p>
    <p>Contraseña: ${password}</p>
    <p>No olvides restablecer tu contraseña.`
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Correo de registro exitoso enviado: ' + info.response)
    }
  })
}

export const sendMailToBeneficiary = (userMail, donationItems, token) => {
  const donationDetails = donationItems
    .map(item => `<p> - ${item.name} (${item.quantity})</p>`)
    .join('')

  const mailOptions = {
    from: process.env.USER_MAILTRAP,
    to: userMail,
    subject: '¡Felicitaciones!',
    html: `
      <p>Ha sido registrado para poder recibir donaciones</p>
      <br>
      <p style="font-weight: bold;">Los detalles de la donación son los siguientes:</p>
      <p>Donación/es:</p>
      ${donationDetails}
      <p>Esperamos que te recuperes lo más pronto posible</p>
    `
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error)
    } else {
      console.log('Correo de registro exitoso enviado: ' + info.response)
    }
  })
}
