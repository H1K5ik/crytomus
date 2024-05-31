import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  public async createJwtToken(user): Promise<string> {
    const payload = { user };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRE,
    });
  }
}
