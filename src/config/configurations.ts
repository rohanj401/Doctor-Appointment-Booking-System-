export default () => ({
  authentication: {
    jwtSecret: process.env.JWT_SECRET,
  },
  transport: {
    host: 'smtp.gmail.com',
    port: 587, // Gmail SMTP port
    secure: false,
    MailUserName: process.env.EMAIL_USER,
    MailPassword: process.env.EMAIL_PASSWORD,
  },
  applicationPort: process.env.PORT || 3000,
});
