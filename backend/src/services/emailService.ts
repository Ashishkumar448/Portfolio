import nodemailer from 'nodemailer';
import logger from '../config/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string, text?: string) {
    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}`, { messageId: result.messageId });
      return result;
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendContactFormNotification(contactData: any) {
    const subject = `New Contact Form Submission: ${contactData.subject}`;
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${contactData.name}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Subject:</strong> ${contactData.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${contactData.message}</p>
      <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
    `;

    return this.sendEmail(process.env.SMTP_USER!, subject, html);
  }

  async sendContactConfirmation(contactData: any) {
    const subject = 'Thank you for contacting us!';
    const html = `
      <h2>Thank you for reaching out!</h2>
      <p>Hi ${contactData.name},</p>
      <p>Thank you for your message. I have received your inquiry about "${contactData.subject}" and will get back to you as soon as possible.</p>
      <p>Best regards,<br>Your Portfolio Team</p>
    `;

    return this.sendEmail(contactData.email, subject, html);
  }

  async sendWelcomeEmail(user: any) {
    const subject = 'Welcome to My Portfolio!';
    const html = `
      <h2>Welcome ${user.name}!</h2>
      <p>Thank you for joining my portfolio community. You now have access to exclusive content and updates.</p>
      <p>Best regards,<br>Your Portfolio Team</p>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendPasswordResetEmail(user: any, resetToken: string) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request';
    const html = `
      <h2>Password Reset Request</h2>
      <p>Hi ${user.name},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    return this.sendEmail(user.email, subject, html);
  }
}

export default new EmailService();