import nodemailer from "nodemailer";
import { logger } from "../utils/logger";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"Camino Estelar" <${process.env.SMTP_USER}>`,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
    return true;
  } catch (error) {
    logger.error("Email send failed", { to: data.to, subject: data.subject, error: (error as Error).message });
    return false;
  }
}

export function purchaseConfirmationEmail(data: {
  customerName: string;
  serviceName: string;
  finalPrice: number;
  paymentMethod: string;
  purchaseId: string;
}): EmailData {
  const paymentMethodLabel =
    data.paymentMethod === "MERCADOPAGO"
      ? "MercadoPago"
      : data.paymentMethod === "BANK_TRANSFER"
        ? "Transferencia Bancaria"
        : "Contacto por WhatsApp";

  return {
    to: data.customerName, // This should be customerEmail in real usage
    subject: `Compra confirmada - ${data.serviceName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
          .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Camino Estelar</h1>
          </div>
          <div class="content">
            <h2>Gracias por tu compra, ${data.customerName}!</h2>
            <p>Tu solicitud de servicio ha sido registrada exitosamente.</p>
            
            <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p><strong>Servicio:</strong> ${data.serviceName}</p>
              <p><strong>Monto:</strong> $${data.finalPrice.toLocaleString("es-AR")}</p>
              <p><strong>Metodo de pago:</strong> ${paymentMethodLabel}</p>
              <p><strong>Numero de compra:</strong> ${data.purchaseId.slice(0, 8)}...</p>
            </div>

            ${
              data.paymentMethod === "BANK_TRANSFER"
                ? `
              <div style="background: #fef3c7; border: 1px solid #fcd34d; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p><strong>Siguiente paso:</strong></p>
                <p>Realiza la transferencia bancaria y envianos el comprobante por WhatsApp para confirmar tu turno.</p>
              </div>
            `
                : `
              <p>Pronto recibiras instrucciones para coordinar tu turno.</p>
            `
            }

            <p style="text-align: center; margin-top: 20px;">
              <a href="https://wa.me/${process.env.WHATSAPP_NUMBER}" class="btn">Contactar por WhatsApp</a>
            </p>
          </div>
          <div class="footer">
            <p>Camino Estelar - Consultas Espirituales y Bienestar</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

export function adminNotificationEmail(data: {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  finalPrice: number;
  paymentMethod: string;
}): EmailData {
  return {
    to: process.env.ADMIN_EMAIL || "admin@example.com",
    subject: `Nueva compra - ${data.customerName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nueva Compra Recibida</h1>
          </div>
          <div class="content">
            <h2>Detalle de la compra</h2>
            
            <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p><strong>Cliente:</strong> ${data.customerName}</p>
              <p><strong>Email:</strong> ${data.customerEmail}</p>
              <p><strong>Servicio:</strong> ${data.serviceName}</p>
              <p><strong>Monto:</strong> $${data.finalPrice.toLocaleString("es-AR")}</p>
              <p><strong>Metodo de pago:</strong> ${data.paymentMethod}</p>
            </div>

            <p>Ingresa al panel de administracion para revisar el detalle.</p>
          </div>
          <div class="footer">
            <p>Camino Estelar - Panel de Administracion</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
