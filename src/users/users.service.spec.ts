import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, email: 'test@example.com' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, name: 'Test' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findById(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const userData = { email: 'new@example.com', name: 'New' };
      const savedUser = { id: 1, ...userData } as User;

      mockUserRepository.create.mockReturnValue(userData);
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(userData);
      expect(result).toEqual(savedUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(mockUserRepository.save).toHaveBeenCalledWith(userData);
    });
  });

  describe('findAll', () => {
    it('should return a list of users with selected fields', async () => {
      const users = [{ id: 1, name: 'Test' }] as User[];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });

  describe('updateRole', () => {
    it('should update and save the user role', async () => {
      const user = { id: 1, role: 'user', name: 'Test' } as User;
      const updatedUser = { id: 1, role: 'admin', name: 'Test' } as User;

      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateRole(1, 'admin');
      expect(result.role).toBe('admin');
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'admin' }),
      );
    });
  });

  describe('updateProfile', () => {
    it('should update name successfully', async () => {
      const user = {
        id: 1,
        name: 'Old Name',
        email: 'test@example.com',
      } as User;
      const updatedUser = {
        id: 1,
        name: 'New Name',
        email: 'test@example.com',
      } as User;

      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(1, { name: 'New Name' });
      expect(result.name).toBe('New Name');
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'New Name' }),
      );
    });

    it('should throw BadRequestException if new email is already in use', async () => {
      const user = { id: 1, email: 'user@example.com' } as User;
      const existingUser = { id: 2, email: 'taken@example.com' } as User;

      mockUserRepository.findOne.mockResolvedValueOnce(user); // findById inside updateProfile
      mockUserRepository.findOne.mockResolvedValueOnce(existingUser); // findByEmail duplicate check

      await expect(
        service.updateProfile(1, { email: 'taken@example.com' }),
      ).rejects.toThrow(new BadRequestException('Email already in use'));
    });

    it('should update email successfully if email is unique', async () => {
      const user = { id: 1, email: 'old@example.com' } as User;
      const updatedUser = { id: 1, email: 'new@example.com' } as User;

      mockUserRepository.findOne.mockResolvedValueOnce(user); // findById
      mockUserRepository.findOne.mockResolvedValueOnce(null); // findByEmail
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(1, {
        email: 'new@example.com',
      });
      expect(result.email).toBe('new@example.com');
    });

    it('should throw BadRequestException if password change is requested without current password', async () => {
      const user = { id: 1, password: 'hashedpassword' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(
        service.updateProfile(1, { password: 'newpassword' }),
      ).rejects.toThrow(
        new BadRequestException(
          'Current password is required to set a new password',
        ),
      );
    });

    it('should throw BadRequestException if current password is incorrect', async () => {
      const user = { id: 1, password: 'hashedpassword' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.updateProfile(1, {
          password: 'newpassword',
          currentPassword: 'wrongpassword',
        }),
      ).rejects.toThrow(new BadRequestException('Incorrect current password'));
    });

    it('should change password successfully when current password is correct', async () => {
      const user = { id: 1, password: 'hashedpassword' } as User;
      const updatedUser = { id: 1, password: 'newhashedpassword' } as User;

      mockUserRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newhashedpassword');
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(1, {
        password: 'newpassword',
        currentPassword: 'correctpassword',
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'correctpassword',
        'hashedpassword',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(mockUserRepository.save).toHaveBeenCalled();
      // Verify password property is removed
      expect(result.password).toBeUndefined();
    });
  });
});
