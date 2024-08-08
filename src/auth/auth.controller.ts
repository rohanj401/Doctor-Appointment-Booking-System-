import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { signInDto } from './dtos/signIn.dto';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  signIn(@Body() signInDto: signInDto) {
    console.log('inside auth controller');
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
