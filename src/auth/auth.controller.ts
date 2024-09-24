import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { signInDto } from './dtos/signIn.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.gaurd';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { Public } from './decorators/public.decorator';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('/login')
  signIn(@Body() signInDto: signInDto) {
    console.log('inside auth controller');
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('/profile')
  getProfile(@Request() req) {
    console.log(`req.user :${req.user}`);
    return req.user;
  }

  @Post('/forgot-password')
  async forgotPasssword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    console.log('Forgot Password');
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Put('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    console.log('resetting Pass');
    return this.authService.resetPassword(
      resetPasswordDto.newPassword,
      resetPasswordDto.resetToken,
    );
  }
}
