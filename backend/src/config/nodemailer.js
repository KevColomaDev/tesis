import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});


export const sendDonationNotification = (userMail, donationDetails) => {
    let mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "¡Has recibido una nueva donación!",
        html: `<p>Hola, se te ha asignado una nueva donación: <strong>${donationDetails}</strong></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo de donación enviado: ' + info.response);
        }
    });
};


export const sendSupplyShortageNotification = (userMail, supplyItem) => {
    let mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "¡Alerta de escasez de suministros!",
        html: `<p>Hola, se ha detectado que queda poca cantidad del suministro: <strong>${supplyItem}</strong>. Por favor, considera reabastecerlo.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo de escasez de suministros enviado: ' + info.response);
        }
    });
};
