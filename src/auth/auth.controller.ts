import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginOAuthDto } from './dtos/LoginOAuth.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('oauth')
  getUserFromOAuthToken(
    @Req() request: Request,
    @Body() body: LoginOAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.decodeOAuthToken(body.token, response);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
  }
}
