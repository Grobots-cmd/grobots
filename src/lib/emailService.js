import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'kayley.king@ethereal.email',
        pass: 'NM3BNNBhrPGbGpRnFM'
    },
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
  });
};

// Test SMTP connection
export const testSMTPConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('SMTP server is ready to take our messages');
    return { success: true, message: 'SMTP connection successful' };
  } catch (error) {
    console.error('SMTP connection failed:', error);
    return { success: false, error: error.message };
  }
};

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email templates in Markdown format
const getEmailTemplate = (otp, type, name = '') => {
  const templates = {
    registration: `
# Welcome to GROBOTS! 🤖

Hi ${name || 'there'},

Welcome to the **GROBOTS** community! We're excited to have you join us in building the future of robotics.

## Your Verification Code

Your **6-digit verification code** is:

\`\`\`
${otp}
\`\`\`

⏰ **This code will expire in 10 minutes.**

## What's Next?

Once you verify your email, you'll gain access to:

- 🔬 **Exclusive workshops** and hands-on sessions
- 🚀 **Cutting-edge projects** and collaborations  
- 🌐 **Professional networking** opportunities
- 🏆 **Competitions** and challenges

## Security Note

🔒 If you didn't request this code, please ignore this email. Your account security is important to us.

---

**Best regards,**  
**The GROBOTS Team** 🤖

*Building tomorrow's technology, today.*
    `,
    login: `
# GROBOTS Login Verification 🔐

Hi ${name || 'there'},

Someone is trying to log into your **GROBOTS** account.

## Your Verification Code

Your **6-digit verification code** is:

\`\`\`
${otp}
\`\`\`

⏰ **This code will expire in 10 minutes.**

## Security Alert

🔒 If this wasn't you, please:
- Change your password immediately
- Contact our support team
- Review your account activity

---

**Best regards,**  
**The GROBOTS Security Team** 🤖

*Keeping your account secure.*
    `,
    password_reset: `
# Password Reset Request 🔑

Hi ${name || 'there'},

You've requested to reset your **GROBOTS** account password.

## Your Verification Code

Your **6-digit verification code** is:

\`\`\`
${otp}
\`\`\`

⏰ **This code will expire in 10 minutes.**

## Next Steps

1. Enter this code on the password reset page
2. Create a new secure password
3. Log in with your new credentials

## Security Note

🔒 If you didn't request this reset, please ignore this email and ensure your account is secure.

---

**Best regards,**  
**The GROBOTS Support Team** 🤖

*Your security is our priority.*
    `
  };

  return templates[type] || templates.registration;
};

// Convert Markdown to HTML (basic conversion)
const markdownToHtml = (markdown) => {
  return markdown
    .replace(/# (.*$)/gim, '<h1 style="color: #2563eb; font-size: 24px; margin: 20px 0 10px 0;">$1</h1>')
    .replace(/## (.*$)/gim, '<h2 style="color: #1e40af; font-size: 20px; margin: 15px 0 8px 0;">$2</h2>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong style="color: #1f2937;">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\`\`\`\n?([\s\S]*?)\n?\`\`\`/gim, '<div style="background: #f3f4f6; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 24px; text-align: center; letter-spacing: 2px; color: #1f2937; margin: 15px 0; border-left: 4px solid #2563eb;"><strong>$1</strong></div>')
    .replace(/\`(.*?)\`/gim, '<code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #1f2937;">$1</code>')
    .replace(/^- (.*$)/gim, '<li style="margin: 5px 0;">$1</li>')
    .replace(/(\n|^)([🔬🚀🌐🏆🔒⏰🔐🔑🤖].*)$/gim, '<p style="margin: 8px 0; font-size: 16px;">$2</p>')
    .replace(/\n\n/gim, '</p><p style="margin: 12px 0; line-height: 1.6; color: #374151;">')
    .replace(/\n/gim, '<br>')
    .replace(/^/, '<p style="margin: 12px 0; line-height: 1.6; color: #374151;">')
    .replace(/$/, '</p>')
    .replace(/<li/g, '<ul style="margin: 10px 0; padding-left: 20px;"><li')
    .replace(/<\/li>/g, '</li></ul>');
};

// Send OTP email
export const sendOTPEmail = async (email, otp, type = 'registration', name = '') => {
  try {
    const transporter = createTransporter();
    
    const markdownContent = getEmailTemplate(otp, type, name);
    const htmlContent = markdownToHtml(markdownContent);
    
    const subjects = {
      registration: 'Welcome to GROBOTS - Verify Your Account 🤖',
      login: 'GROBOTS - Login Verification Required 🔐',
      password_reset: 'GROBOTS - Password Reset Code 🔑'
    };

    const mailOptions = {
      from: `"GROBOTS Team" <kayley.king@ethereal.email>`,
      to: email,
      subject: subjects[type] || subjects.registration,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 30px 20px; text-align: center;">
            <div style="background: white; width: 50px; height: 50px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 24px;">🤖</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">GROBOTS</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 5px 0 0 0; font-size: 14px;">Building Tomorrow's Technology</p>
          </div>
          <div style="padding: 40px 30px;">
            ${htmlContent}
          </div>
          <div style="background: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              This is an automated message. Please do not reply to this email.
            </p>
            <p style="margin: 10px 0 0 0; color: #64748b; font-size: 12px;">
              © 2025 GROBOTS. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: markdownContent, // Fallback plain text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};
