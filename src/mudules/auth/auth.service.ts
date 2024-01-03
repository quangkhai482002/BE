import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';
import { validateHash } from '../../common/utils';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }
    const comparePassword = await validateHash(
      loginDto.password,
      user.password,
    );
    if (!comparePassword) {
      throw new UnauthorizedException('Wrong email or password');
    }
    const payload = { id: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return new AuthResponseDto(token);
  }
}
