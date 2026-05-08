import nodemailer from 'nodemailer';

// Create a transporter object
// You need to set these variables in your .env file
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtpout.secureserver.net', // Default to Gmail for testing/fallback
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Sends a 6-digit OTP code email to a user for registration verification.
 */
export const sendOTPEmail = async (to: string, otp: string, userName: string) => {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-w-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #059669; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">EcoForever</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #333333; margin-top: 0;">Verify Your Email Address</h2>
            <p style="color: #555555; line-height: 1.6;">Hello ${userName},</p>
            <p style="color: #555555; line-height: 1.6;">Thank you for registering with EcoForever! To complete your registration and secure your account, please use the following One-Time Password (OTP):</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 6px; margin: 25px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">${otp}</span>
            </div>
            
            <p style="color: #555555; line-height: 1.6;">This code is valid for <strong>15 minutes</strong>. If you did not sign up for an EcoForever account, you can safely ignore this email.</p>
            <p style="color: #555555; line-height: 1.6; margin-top: 30px;">Best regards,<br>The EcoForever Team</p>
        </div>
        <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} EcoForever. All rights reserved.</p>
        </div>
    </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"EcoForever" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to,
            subject: 'Your EcoForever Verification Code',
            html: htmlContent,
        });
        console.log('OTP Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};

/**
 * Sends an Order Confirmation receipt.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendOrderConfirmationEmail = async (to: string, orderDetails: any) => {
    // Generate items HTML table rows
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemsHtml = orderDetails.items.map((item: any) => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">
                <strong>${item.name}</strong><br>
                <span style="font-size: 12px; color: #6b7280;">Size: ${item.size} ${item.isPremium ? '| PREMIUM' : ''}</span>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${item.price}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-w-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #059669; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">EcoForever</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #333333; margin-top: 0;">Order Confirmation</h2>
            <p style="color: #555555; line-height: 1.6;">Hello ${orderDetails.customerName},</p>
            <p style="color: #555555; line-height: 1.6;">Thank you for your purchase! Your order <strong>#${orderDetails.orderId}</strong> has been successfully placed.</p>
            
            <h3 style="color: #333333; margin-top: 25px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                    <tr style="background-color: #f9fafb;">
                        <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e0e0e0;">Item</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e0e0e0;">Qty</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e0e0e0;">Price</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e0e0e0;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
                        <td style="padding: 10px; text-align: right;">₹${orderDetails.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Shipping:</td>
                        <td style="padding: 10px; text-align: right;">${orderDetails.shipping === 0 ? 'Free' : '₹' + orderDetails.shipping.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Tax:</td>
                        <td style="padding: 10px; text-align: right;">₹${orderDetails.tax.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px; color: #059669;">Grand Total:</td>
                        <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px; color: #059669;">₹${orderDetails.total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #f0fdfa; border-left: 4px solid #10b981; border-radius: 4px;">
                <p style="color: #047857; margin: 0; font-size: 14px;"><strong>Shipping Address:</strong><br>${orderDetails.address}</p>
            </div>
            
            <p style="color: #555555; line-height: 1.6; margin-top: 30px;">We'll send you another email when your order ships.</p>
        </div>
        <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} EcoForever. All rights reserved.</p>
        </div>
    </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"EcoForever Orders" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to,
            subject: `Order Confirmation - #${orderDetails.orderId}`,
            html: htmlContent,
        });
        console.log('Order Confirmation Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        return false;
    }
};

/**
 * Sends a contact form notification to admin and a confirmation to the user.
 */
export const sendContactEmail = async (
    name: string,
    email: string,
    phone: string,
    subject: string,
    message: string
) => {
    const adminEmail = 'info@ecoforever.co.in';

    const adminHtmlContent = `
    <div style="font-family: Arial, sans-serif; max-w-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #059669; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #333333; margin-top: 0;">Inquiry Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; width: 120px;">Name:</td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">${name}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Email:</td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">${email}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Phone:</td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">${phone || 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Topic:</td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">${subject}</td></tr>
            </table>
            <div style="margin-top: 20px;">
                <h3 style="color: #333333; font-size: 16px;">Message:</h3>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; color: #555555; white-space: pre-wrap;">${message}</div>
            </div>
        </div>
    </div>
    `;

    const userHtmlContent = `
    <div style="font-family: Arial, sans-serif; max-w-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #059669; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">EcoForever</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #333333; margin-top: 0;">Thank you for contacting us!</h2>
            <p style="color: #555555; line-height: 1.6;">Hello ${name},</p>
            <p style="color: #555555; line-height: 1.6;">We have received your message regarding "<strong>${subject}</strong>". Our team will review your inquiry and get back to you within 24 hours.</p>
            <p style="color: #555555; line-height: 1.6;">For your records, here is a copy of your message:</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; color: #555555; white-space: pre-wrap;">${message}</div>
            <p style="color: #555555; line-height: 1.6; margin-top: 30px;">Best regards,<br>The EcoForever Team</p>
        </div>
        <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} EcoForever. All rights reserved.</p>
        </div>
    </div>
    `;

    try {
        const fromAddress = `"EcoForever Contact" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`;
        
        // 1. Send notification to admin
        await transporter.sendMail({
            from: fromAddress,
            to: adminEmail,
            replyTo: email,
            subject: `New Contact Form Submission: ${subject} - ${name}`,
            html: adminHtmlContent,
        });

        // 2. Send confirmation to user
        await transporter.sendMail({
            from: fromAddress,
            to: email,
            subject: 'We received your message - EcoForever',
            html: userHtmlContent,
        });

        return true;
    } catch (error) {
        console.error('Error sending contact emails:', error);
        return false;
    }
};
