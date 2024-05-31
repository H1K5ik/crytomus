import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../../common/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() dto: CreateUserDto) {
    return this.authService.registerUser(dto);
  }

  @Post('login')
  loginUser(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }
}
