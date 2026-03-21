import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      // Use Gmail or your preferred email provider
      if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });
      } else if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });
      } else {
        logger.warn('Email service not configured. Emails will not be sent.');
      }
    } catch (error) {
      logger.error('Failed to initialize email transporter:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      logger.warn(`Email not sent to ${options.to}: Email service not configured`);
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.GMAIL_USER || 'noreply@clothi.com',
        ...options,
      });

      logger.info(`Email sent to ${options.to}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  async sendVerificationEmail(email: string, firstName: string, verificationLink: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Clothi, ${firstName}!</h2>
        <p>Thank you for registering. Please verify your email address to complete your account setup.</p>
        
        <div style="margin: 30px 0;">
          <a href="${verificationLink}" style="
            background-color: #000;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
          ">Verify Email Address</a>
        </div>

        <p style="color: #666; font-size: 14px;">
          Or copy this link: <a href="${verificationLink}">${verificationLink}</a>
        </p>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This link will expire in 24 hours.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">

        <p style="color: #999; font-size: 12px;">
          If you didn't create this account, please ignore this email.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Verify your Clothi email address',
      html,
      text: `Click here to verify your email: ${verificationLink}`,
    });
  }

  async sendPasswordResetEmail(email: string, firstName: string, resetLink: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password.</p>
        
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="
            background-color: #000;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
          ">Reset Password</a>
        </div>

        <p style="color: #666; font-size: 14px;">
          Or copy this link: <a href="${resetLink}">${resetLink}</a>
        </p>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">

        <p style="color: #999; font-size: 12px;">
          If you didn't request this, please ignore this email and your password will remain unchanged.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Reset your Clothi password',
      html,
      text: `Click here to reset your password: ${resetLink}`,
    });
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Clothi, ${firstName}!</h2>
        <p>Your account is now active and ready to use.</p>
        
        <div style="margin: 30px 0;">
          <p>Start exploring our latest collections and discover your style.</p>
        </div>

        <div style="margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://clothi.com'}" style="
            background-color: #000;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
          ">Visit Clothi</a>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">

        <p style="color: #999; font-size: 12px;">
          If you have any questions, contact us at support@clothi.com
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to Clothi!',
      html,
    });
  }
}

export const emailService = new EmailService();
