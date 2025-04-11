exports.subscriptionPurchaseEmail = (name, planName) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Subscription Confirmation</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Subscription Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for subscribing to OmixLab! Your subscription has been successfully activated.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Subscription Details:</h3>
            <p style="margin: 5px 0;"><strong>Plan:</strong> ${planName}</p>
        </div>
        <p>You now have access to all the features included in your ${planName} plan. Start exploring our courses and enhance your learning journey!</p>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 12px;">Best regards,<br>The OmixLab Team</p>
        </div>
    </div>
</body>
</html>`
}; 