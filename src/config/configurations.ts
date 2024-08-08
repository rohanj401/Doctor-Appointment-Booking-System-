export default () => ({
  authetication: {
    jwtSecret: process.env.JWT_SECRET,
  },

  transport: {
    host: 'smtp.gmail.com',
    port: 587, // Gmail SMTP port
    secure: false,

    MailUserName: process.env.EMAIL_USER,
    MailPassword: process.env.EMAIL_PASSWORD,
  },

  //   from: process.env.EMAIL_FROM,
  //   // Default sender address

  //   database: {
  //     port: parseInt(process.env.MysqlPort, 10) || 5432,
  //     host: process.env.MysqlHost,
  //     username: process.env.MysqlUsername,
  //     password: process.env.MysqlPassword,
  //     databaseName: 'movie_rental',
  //     synchronize: true,
  //   },

  //   applicationPort: process.env.PORT,
});
