import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { query as queryLocal } from '@/lib/db-local';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getContactEmail(): Promise<string> {
  try {
    // First, try to get from local database (highest priority)
    const localRows = await queryLocal('SELECT `value` FROM site_settings WHERE `key` = ?', ['contactFormEmail']) as any[];
    
    if (localRows.length > 0 && localRows[0].value) {
      return localRows[0].value;
    }
    
    // Fallback to environment variable
    return process.env.CONTACT_FORM_EMAIL || process.env.CONTACT_EMAIL || process.env.SMTP_FROM || '';
  } catch (error) {
    console.error('Error fetching contact email from database:', error);
    // Fallback to environment variable on error
    return process.env.CONTACT_FORM_EMAIL || process.env.CONTACT_EMAIL || process.env.SMTP_FROM || '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Get contact email from local database (or fallback to env)
    const contactEmail = await getContactEmail();
    
    if (!contactEmail) {
      return NextResponse.json(
        { error: "Contact email not configured" },
        { status: 500 }
      );
    }

    // Validate SMTP configuration (from environment variables only)
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM) {
      return NextResponse.json(
        { error: "SMTP configuration is missing" },
        { status: 500 }
      );
    }

    // Escape HTML to prevent XSS
    const escapeHtml = (text: string) => {
      const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, (m) => map[m]);
    };

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = subject ? escapeHtml(subject) : 'General Inquiry';
    const safeMessage = escapeHtml(message);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Get current date/time
    const currentDate = new Date().toLocaleString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: contactEmail,
      subject: `New Contact Form: ${safeSubject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f7;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f7; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); max-width: 100%;">
                  <tr>
                    <td style="background-color: #1a0b2e; padding: 32px 40px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.3px;">
                        New Contact Form Submission
                      </h1>
                      <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.7); font-size: 13px;">
                        ${currentDate}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 32px 40px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                        <tr>
                          <td style="padding-bottom: 8px;">
                            <p style="margin: 0; color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subject</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p style="margin: 0; color: #1a0b2e; font-size: 16px; font-weight: 600;">${safeSubject}</p>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                        <tr>
                          <td width="50%" style="padding-right: 12px; vertical-align: top;">
                            <p style="margin: 0 0 8px; color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Name</p>
                            <p style="margin: 0; color: #1a0b2e; font-size: 15px; font-weight: 500;">${safeName}</p>
                          </td>
                          <td width="50%" style="padding-left: 12px; vertical-align: top;">
                            <p style="margin: 0 0 8px; color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                            <p style="margin: 0;">
                              <a href="mailto:${safeEmail}" style="color: #a855f7; text-decoration: none; font-size: 15px; font-weight: 500; word-break: break-all;">${safeEmail}</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                        <tr>
                          <td style="padding-bottom: 8px;">
                            <p style="margin: 0; color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="background-color: #f9fafb; border-left: 3px solid #a855f7; padding: 16px 20px; border-radius: 4px;">
                            <p style="margin: 0; color: #1a0b2e; font-size: 15px; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word;">${safeMessage}</p>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <a href="mailto:${safeEmail}?subject=Re: ${safeSubject}" style="display: inline-block; background-color: #a855f7; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                              Reply to ${safeName}
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
