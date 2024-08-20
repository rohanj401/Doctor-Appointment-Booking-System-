import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/User.schema';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { ResetToken } from 'src/schemas/reset-tokens.schema';
import { MailerService } from '@nestjs-modules/mailer';



@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(ResetToken.name) private ResetTokenModel: Model<ResetToken>,
    private readonly mailerService: MailerService,
  ) { }






  async signIn(email: string, pass: string) {
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const { password, ...result } = user;

        return {
          access_token: await this.jwtService.signAsync(result),
        };
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    } else {
      throw new UnauthorizedException('User doest no exist ..Sign Up first ');
    }
  }

  async forgotPassword(email: any) {
    //TODO : Check that user exists
    const user = await this.userModel.findOne({ email });

    if (user) {
      //TODO: If user exists,generate password reset link
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const resetToken = nanoid(64);
      await this.ResetTokenModel.create({
        token: resetToken,
        userId: user._id,
        expiryDate,
      });
      this.sendPasswordResetEmail(email, resetToken);
    }
    return { message: 'If this user exists,he will receive an email' };
  }

  async sendPasswordResetEmail(to: string, token: string) {

    const resetLink = `http://localhost:${process.env.Next_PORT}/forgot-password/token?token=${token}`;

    const mailOptions = {
      from: 'Auth-backend service',
      to: to,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`,
    };

    await this.mailerService.sendMail(mailOptions);
  }

  async resetPassword(newPassword: string, resetToken: string) {
    //Find a valid reset token document
    const token = await this.ResetTokenModel.findOneAndDelete({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid link');
    }

    //Change user password (MAKE SURE TO HASH!!)
    const user = await this.userModel.findById(token.userId);
    if (!user) {
      throw new InternalServerErrorException();
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }
}
