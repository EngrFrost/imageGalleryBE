import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data,
    });
  }

  async findUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }
}
