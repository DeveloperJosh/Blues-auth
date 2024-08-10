import nodemailer from 'nodemailer';

export default async function sendEmail(email, subject, html) {
  console.log(`Sending email to ${email}...`);
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465, 
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  const footer = `
    <br><br>
    <hr>
    <p style="font-size: 12px; color: #888;">
      This email was sent to you by Blue's Auth. If you did not initiate this request, please contact our support team immediately.
    </p>
    <p style="font-size: 12px; color: #888;">
      Blue's Auth, In the Clouds
    </p>
  `;

  const mailOptions = {
    from: `Blue's Auth <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: html + footer,
  };

  await transporter.sendMail(mailOptions);
}
