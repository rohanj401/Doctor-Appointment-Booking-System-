import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        //   // TODO: Generate a JWT and return it here
        //   // instead of the user object
        //   return result;
        //const payload = { sub: user.email, username: user.password };
        return {
          access_token: await this.jwtService.signAsync(result),
        };
      } else {
        // this.logger.error(' Invalid Credentials ');
        throw new UnauthorizedException('Invalid credentials');
      }
    } else {
      // this.logger.error('User doest no exist ..Sign Up first ');
      throw new UnauthorizedException('User doest no exist ..Sign Up first ');
    }
  }
}
