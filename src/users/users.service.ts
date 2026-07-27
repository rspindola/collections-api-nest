import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateRole(id: number, role: 'admin' | 'user'): Promise<User> {
    const user = await this.findById(id);
    user.role = role;
    return this.userRepository.save(user);
  }

  async updateProfile(id: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.findByEmail(dto.email);
      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }
      user.email = dto.email;
    }

    if (dto.name) {
      user.name = dto.name;
    }

    if (dto.password) {
      if (!dto.currentPassword) {
        throw new BadRequestException(
          'Current password is required to set a new password',
        );
      }
      const isPasswordValid = await bcrypt.compare(
        dto.currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Incorrect current password');
      }
      user.password = await bcrypt.hash(dto.password, 10);
    }

    const savedUser = await this.userRepository.save(user);
    // Remove password from returned object
    delete (savedUser as any).password;
    return savedUser;
  }
}
