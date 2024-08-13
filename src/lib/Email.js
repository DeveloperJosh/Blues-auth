import nodemailer from 'nodemailer';

export default async function sendEmail(email, subject, text) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, 
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  const emailContent = (subject, text) => `
    <div style="background-color: #ffffff; border-radius: 10px; padding: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #333333; font-size: 24px; font-weight: bold;">${subject}</h1>
      </div>
      <div style="color: #666666; font-size: 16px; line-height: 1.5;">
        ${text}
      </div>
      <div style="margin-top: 40px; text-align: center;">
        <hr style="border: none; border-top: 1px solid #dddddd;">
        <p style="font-size: 12px; color: #888888; margin-top: 20px;">
          This email was sent to you by Blue's Auth. If you did not initiate this request, please contact our support team immediately.
        </p>
        <p style="font-size: 12px; color: #888888;">
          Blue's Auth, In the Clouds
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `Blue's Auth <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: emailContent(subject, text),
  };

  await transporter.sendMail(mailOptions);
}
