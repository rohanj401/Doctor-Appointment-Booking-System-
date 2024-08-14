import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { signInDto } from './dtos/signIn.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.gaurd';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  signIn(@Body() signInDto: signInDto) {
    console.log('inside auth controller');
    return this.authService.signIn(signInDto.email, signInDto.password);
  }


  @Get('/profile')
  @UseGuards(AuthGuard)
  getProfile(@Request() req) {
    console.log(`req.user :${req.user}`)
    return req.user;
  }
}
