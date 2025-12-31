// Email Notification Service
// Sends email notifications for orders and updates

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    // For demo: Log email instead of sending
    console.log('📧 Email Notification:', {
      to: params.to,
      subject: params.subject,
      preview: params.html.substring(0, 100),
    });

    // TODO: Integrate with email service (SendGrid, Resend, etc.)
    // Example with fetch API:
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email: params.to }] }],
    //     from: { email: 'noreply@medsbharat.com' },
    //     subject: params.subject,
    //     content: [{ type: 'text/html', value: params.html }],
    //   }),
    // });

    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

export function generateOrderConfirmationEmail(
  orderNumber: string,
  customerName: string,
  totalAmount: number
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
        </div>
        <div class="content">
          <p>Dear ${customerName},</p>
          <p>Thank you for your order. Your order has been received and is being processed.</p>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString('en-IN')}</p>
          <p>You will receive another email when your order is shipped.</p>
        </div>
        <div class="footer">
          <p>MedsBharat - India's Trusted Online Pharmacy</p>
          <p>Version 1.9 | December 31, 2024</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateOrderStatusEmail(
  orderNumber: string,
  customerName: string,
  status: string
): string {
  const statusMessages: Record<string, string> = {
    ACCEPTED: 'Your order has been accepted by the pharmacy',
    PREPARING: 'Your order is being prepared',
    OUT_FOR_DELIVERY: 'Your order is out for delivery',
    DELIVERED: 'Your order has been delivered',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Update</h1>
        </div>
        <div class="content">
          <p>Dear ${customerName},</p>
          <p>${statusMessages[status] || 'Your order status has been updated'}</p>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Status:</strong> ${status}</p>
        </div>
        <div class="footer">
          <p>MedsBharat - India's Trusted Online Pharmacy</p>
          <p>Version 1.9 | December 31, 2024</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
