// Email service for handling SendGrid integrations and email communications
import api from './api.js';

class EmailService {
  constructor() {
    // SendGrid configuration - in production, these would come from environment variables
    this.sendGridConfig = {
      apiKey: process.env.REACT_APP_SENDGRID_API_KEY,
      fromEmail: process.env.REACT_APP_SENDGRID_FROM_EMAIL || 'noreply@haki-yetu.co.ke',
      fromName: process.env.REACT_APP_SENDGRID_FROM_NAME || 'Haki Yetu Digital',
      baseUrl: 'https://api.sendgrid.com/v3'
    };
  }

  // Send email via SendGrid
  async sendEmail(to, subject, htmlContent, options = {}) {
    try {
      const {
        from = this.sendGridConfig.fromEmail,
        fromName = this.sendGridConfig.fromName,
        cc = [],
        bcc = [],
        replyTo,
        attachments = []
      } = options;

      const emailData = {
        personalizations: [{
          to: Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }],
          subject: subject
        }],
        from: {
          email: from,
          name: fromName
        },
        content: [{
          type: 'text/html',
          value: htmlContent
        }]
      };

      // Add CC if provided
      if (cc.length > 0) {
        emailData.personalizations[0].cc = cc.map(email => ({ email }));
      }

      // Add BCC if provided
      if (bcc.length > 0) {
        emailData.personalizations[0].bcc = bcc.map(email => ({ email }));
      }

      // Add reply-to if provided
      if (replyTo) {
        emailData.reply_to = { email: replyTo };
      }

      // Add attachments if provided
      if (attachments.length > 0) {
        emailData.attachments = attachments.map(attachment => ({
          content: attachment.content, // base64 encoded
          filename: attachment.filename,
          type: attachment.type,
          disposition: 'attachment'
        }));
      }

      const response = await fetch(`${this.sendGridConfig.baseUrl}/mail/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sendGridConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.message || 'Failed to send email');
      }

      return {
        success: true,
        message: 'Email sent successfully'
      };

    } catch (error) {
      console.error('SendGrid error:', error);
      throw new Error(error.message || 'Failed to send email');
    }
  }

  // Send booking confirmation email
  async sendBookingConfirmation(bookingDetails, userDetails) {
    const subject = `Booking Confirmation - ${bookingDetails.serviceName}`;
    const htmlContent = this.generateBookingConfirmationHTML(bookingDetails, userDetails);

    return this.sendEmail(userDetails.email, subject, htmlContent, {
      replyTo: bookingDetails.lawyerEmail
    });
  }

  // Send booking status update email
  async sendBookingUpdate(bookingDetails, userDetails, statusUpdate) {
    const subject = `Booking Update - ${bookingDetails.serviceName}`;
    const htmlContent = this.generateBookingUpdateHTML(bookingDetails, userDetails, statusUpdate);

    return this.sendEmail(userDetails.email, subject, htmlContent);
  }

  // Send payment confirmation email
  async sendPaymentConfirmation(bookingDetails, userDetails, paymentDetails) {
    const subject = `Payment Confirmation - ${bookingDetails.serviceName}`;
    const htmlContent = this.generatePaymentConfirmationHTML(bookingDetails, userDetails, paymentDetails);

    return this.sendEmail(userDetails.email, subject, htmlContent);
  }

  // Send lawyer notification for new booking
  async sendLawyerBookingNotification(bookingDetails, lawyerDetails) {
    const subject = `New Booking Request - ${bookingDetails.serviceName}`;
    const htmlContent = this.generateLawyerBookingNotificationHTML(bookingDetails, lawyerDetails);

    return this.sendEmail(lawyerDetails.email, subject, htmlContent);
  }

  // Send verification email
  async sendVerificationEmail(email, verificationToken, userType = 'client') {
    const subject = 'Verify Your Email - Haki Yetu Digital';
    const verificationUrl = `${window.location.origin}/verify-email?token=${verificationToken}&type=${userType}`;
    const htmlContent = this.generateVerificationEmailHTML(verificationUrl, userType);

    return this.sendEmail(email, subject, htmlContent);
  }

  // Send password reset email
  async sendPasswordResetEmail(email, resetToken, userType = 'client') {
    const subject = 'Password Reset Request - Haki Yetu Digital';
    const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}&type=${userType}`;
    const htmlContent = this.generatePasswordResetHTML(resetUrl, userType);

    return this.sendEmail(email, subject, htmlContent);
  }

  // Send lawyer verification notification
  async sendLawyerVerificationNotification(lawyerDetails) {
    const subject = 'Lawyer Account Verification Required';
    const htmlContent = this.generateLawyerVerificationNotificationHTML(lawyerDetails);

    return this.sendEmail('admin@haki-yetu.co.ke', subject, htmlContent);
  }

  // Send lawyer approval/rejection notification
  async sendLawyerStatusNotification(lawyerDetails, status, reason = '') {
    const subject = status === 'approved'
      ? 'Congratulations! Your Lawyer Account is Now Active'
      : 'Lawyer Account Verification Update';

    const htmlContent = this.generateLawyerStatusNotificationHTML(lawyerDetails, status, reason);

    return this.sendEmail(lawyerDetails.email, subject, htmlContent);
  }

  // Generate HTML templates
  generateBookingConfirmationHTML(bookingDetails, userDetails) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a365d; color: white; padding: 20px; text-align: center;">
          <h1>Haki Yetu Digital</h1>
          <p>Booking Confirmation</p>
        </div>

        <div style="padding: 20px; background-color: #f8f9fa;">
          <h2>Dear ${userDetails.name},</h2>
          <p>Your booking has been confirmed! Here are the details:</p>

          <div style="background: white; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <h3>Booking Details</h3>
            <p><strong>Service:</strong> ${bookingDetails.serviceName}</p>
            <p><strong>Lawyer:</strong> ${bookingDetails.lawyerName}</p>
            <p><strong>Booking ID:</strong> ${bookingDetails.id}</p>
            <p><strong>Amount:</strong> KES ${bookingDetails.amount}</p>
            <p><strong>Status:</strong> ${bookingDetails.status}</p>
          </div>

          <p>You will receive updates on your booking status. You can also track your booking in your dashboard.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${window.location.origin}/dashboard/client" style="background-color: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View in Dashboard</a>
          </div>
        </div>

        <div style="background-color: #1a365d; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>&copy; 2025 Haki Yetu Digital. All rights reserved.</p>
        </div>
      </div>
    `;
  }

  generateVerificationEmailHTML(verificationUrl, userType) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a365d; color: white; padding: 20px; text-align: center;">
          <h1>Haki Yetu Digital</h1>
          <p>Account Verification</p>
        </div>

        <div style="padding: 20px; background-color: #f8f9fa;">
          <h2>Welcome to Haki Yetu Digital!</h2>
          <p>Please verify your email address to complete your ${userType} account registration.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Verify Email Address</a>
          </div>

          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: white; padding: 10px; border-radius: 4px;">${verificationUrl}</p>

          <p><small>This link will expire in 24 hours for security reasons.</small></p>
        </div>

        <div style="background-color: #1a365d; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>&copy; 2025 Haki Yetu Digital. All rights reserved.</p>
        </div>
      </div>
    `;
  }

  generatePasswordResetHTML(resetUrl, userType) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a365d; color: white; padding: 20px; text-align: center;">
          <h1>Haki Yetu Digital</h1>
          <p>Password Reset</p>
        </div>

        <div style="padding: 20px; background-color: #f8f9fa;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password for your ${userType} account.</p>
          <p>If you made this request, click the button below to reset your password:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a>
          </div>

          <p>If you didn't request a password reset, please ignore this email.</p>
          <p><small>This link will expire in 1 hour for security reasons.</small></p>
        </div>

        <div style="background-color: #1a365d; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>&copy; 2025 Haki Yetu Digital. All rights reserved.</p>
        </div>
      </div>
    `;
  }

  // Mock email sending for development (fallback)
  async mockSendEmail(to, subject, htmlContent, options = {}) {
    console.log('📧 Mock Email Sent:', {
      to,
      subject,
      options,
      htmlContent: htmlContent.substring(0, 100) + '...'
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Email sent successfully (mock)',
      mock: true
    };
  }

  // Process email (with fallback to mock)
  async processEmail(to, subject, htmlContent, options = {}) {
    try {
      // Try real SendGrid email
      if (this.sendGridConfig.apiKey) {
        return await this.sendEmail(to, subject, htmlContent, options);
      } else {
        // Fallback to mock email
        console.warn('SendGrid API key not configured, using mock email');
        return await this.mockSendEmail(to, subject, htmlContent, options);
      }
    } catch (error) {
      // If real email fails, try mock as fallback
      if (error.message.includes('API key') || error.message.includes('authentication')) {
        console.warn('Falling back to mock email due to configuration issues');
        return await this.mockSendEmail(to, subject, htmlContent, options);
      }
      throw error;
    }
  }

  // Override main methods to use processEmail
  async sendEmail(to, subject, htmlContent, options = {}) {
    return this.processEmail(to, subject, htmlContent, options);
  }
}

const emailService = new EmailService();
export default emailService;
