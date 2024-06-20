import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: "587",
  auth: {
    user: "molinavitillo@gmail.com",
    pass: "vyrljgezrijhnats",
  },
});

export const sendTicket = (
  to,
  ticketCode,
  amount,
  purchaser,
  purchaseDatetime
) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Detalles de la Compra</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 10px;
                text-align: center;
            }
            .content {
                padding: 20px;
            }
            .content p {
                margin: 0 0 10px;
            }
            .footer {
                background-color: #f4f4f4;
                color: #666666;
                text-align: center;
                padding: 10px;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Detalles de la Compra</h1>
            </div>
            <div class="content">
                <p><strong>Código:</strong> ${ticketCode}</p>
                <p><strong>Importe:</strong> $${amount}</p>
                <p><strong>Comprador:</strong> ${purchaser}</p>
                <p><strong>Fecha de la Compra:</strong> ${purchaseDatetime}</p>
            </div>
            <div class="footer">
                <p>2024 Victor Molina. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  transporter
    .sendMail({
      from: "Victor Molina molinavitillo@gmail.com",
      to: to,
      subject: `Ticket #${ticketCode}`,
      html: htmlContent,
    })
    .then((resultado) => console.log(resultado))
    .catch((error) => console.log(error));
};
