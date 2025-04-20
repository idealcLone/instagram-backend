import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { SES } from 'aws-sdk';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async decodeOAuthToken(oAuthToken: string, response: Response) {
    const payload = await this.jwtService.decode(oAuthToken);

    let user = await this.userService.getUserByEmail(payload.email);

    if (!user) {
      user = await this.userService.createUser({
        email: payload.email,
        avatar: payload.picture,
      });
    }

    const token = await this.generateToken(user.id);

    const expiresDate = new Date(Date.now() + 1000 * 60 * 60);

    const ses = new SES();

    // ses.sendEmail({ Destination: payload.email, Message: 'Hello', Source: '' });

    response.cookie('token', token, { expires: expiresDate });

    return { token, user };
  }

  async generateToken(userId: number) {
    return await this.jwtService.signAsync(
      { id: userId },
      {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
  }
}
