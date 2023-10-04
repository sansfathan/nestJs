import { Controller, Body, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { JwtGuard, JwtGuardRefreshToken } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }
  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }
  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    console.log('req =>', req.user);
    return req.user;
  }
  @UseGuards(JwtGuardRefreshToken)
  @Get('refresh-token')
  async refreshTkn(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.headers.id;
    return this.authService.refreshToken(id, token);
  }
}
