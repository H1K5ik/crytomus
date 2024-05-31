import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginUserDto } from '../../common/dto/user.dto';
import { TokenService } from '../token/token.service';
import { AppErrors } from '../../common/errors';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(dto: CreateUserDto) {
    const newUser = await this.userService.createUser(dto);
    const payload = {
      email: dto.email,
    };
    const token = await this.tokenService.createJwtToken(payload);
    return { token: token, user: newUser };
  }

  async login(dto: LoginUserDto) {
    const user = await this.userService.getPublicUser(dto.email);
    if (!user) return new BadRequestException(AppErrors.USER_NOT_EXIST);
    const checkPassword = await bcrypt.compare(dto.password, user.password);
    if (!checkPassword)
      return new BadRequestException(AppErrors.INVALID_PASSWORD);
    delete user.password;
    const payload = {
      email: dto.email,
    };
    const token = await this.tokenService.createJwtToken(payload);
    return { token: token, user: user };
  }
}
