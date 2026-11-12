import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  if(!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.APP_URL) throw new Error("SMTP and APP_URL must be configured.");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verificationUrl = `${process.env.APP_URL || "http://localhost:8082"}/verify?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Xác thực tài khoản Bino",
    html: `
      <h2>Chào mừng bạn đến với Bino!</h2>
      <p>Vui lòng click vào đường link bên dưới để xác thực tài khoản của bạn:</p>
      <a href="${verificationUrl}" style="display:inline-block;padding:10px 20px;background:#3bb383;color:white;text-decoration:none;border-radius:8px;">
        Xác thực tài khoản
      </a>
      <p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    
    // For ethereal email debugging
    if (process.env.SMTP_HOST?.includes("ethereal")) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Không thể gửi email xác thực. Vui lòng kiểm tra lại cấu hình SMTP.");
  }
};
