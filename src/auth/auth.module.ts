import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Configuration from '../config/configurations';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configuration],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JwtSecret,
      signOptions: { expiresIn: '1d' },
    }),

    MailerModule.forRootAsync({
      // ?  imports: [ConfigModule],
      inject: [ConfigService],
      // transport: {
      //   host: 'smtp.gmail.com',
      //   port: 587, // Gmail SMTP port
      //   secure: false,
      //   auth: {
      //     user: process.env.EMAIL_USER,
      //     pass: process.env.EMAIL_PASSWORD,
      //   },
      // },
      // defaults: {
      //   from: process.env.EMAIL_FROM,
      //   // Default sender address
      // },
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('transport.host'),
          port: configService.get('transport.port'),
          secure: configService.get('transport.secure'),
          auth: {
            user: configService.get<string>('transport.MailUserName'), // Accessing email user from system variable
            pass: configService.get<string>('transport.MailPassword'), // Accessing email password from system variable
          },
        },
        defaults: {
          from: configService.get<string>('from'), // Accessing default sender address from system variable
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
