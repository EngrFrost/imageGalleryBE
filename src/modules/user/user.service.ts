import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findUser({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.userRepository.createUser({
      email: createUserDto.email,
      password: hashedPassword,
    });
  }

  async findOne(email: string) {
    return this.userRepository.findUser({ email });
  }
}
