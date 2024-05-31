import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../../common/dto/user.dto';
import { AppErrors } from '../../common/errors';
import * as bcrypt from 'bcrypt';
import { USER_SELECT_FINDS } from '../../common/constants';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) throw new BadRequestException(AppErrors.USER_EXIST);

    const salt = await bcrypt.genSalt();
    dto.password = await this.hashPassword(dto.password, salt);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
      },
      select: {
        ...USER_SELECT_FINDS,
      },
    });
  }

  async getPublicUser(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
