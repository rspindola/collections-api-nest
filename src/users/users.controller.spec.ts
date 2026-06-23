import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn(),
    updateRole: jest.fn(),
    findById: jest.fn(),
    updateProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should return a list of users', async () => {
      const usersList = [{ id: 1, name: 'User 1' }] as User[];
      mockUsersService.findAll.mockResolvedValue(usersList);

      const result = await controller.index();
      expect(result).toEqual({
        success: true,
        users: usersList,
        message: 'Successfully listed users',
      });
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('updateRole', () => {
    it('should update user role', async () => {
      const dto: UpdateRoleDto = { role: 'admin' };
      const updatedUser = {
        id: 2,
        name: 'User 2',
        email: 'u2@example.com',
        role: 'admin',
      } as User;
      mockUsersService.updateRole.mockResolvedValue(updatedUser);

      const result = await controller.updateRole('2', dto);
      expect(result).toEqual({
        success: true,
        user: {
          id: 2,
          name: 'User 2',
          email: 'u2@example.com',
          role: 'admin',
        },
        message: 'User role updated successfully',
      });
      expect(mockUsersService.updateRole).toHaveBeenCalledWith(2, 'admin');
    });
  });

  describe('profile', () => {
    it('should return user profile without password', async () => {
      const req = { user: { id: 1 } };
      const user = {
        id: 1,
        name: 'User 1',
        password: 'secretpassword',
      } as User;
      mockUsersService.findById.mockResolvedValue(user);

      const result = await controller.profile(req);
      expect(result).toEqual({
        success: true,
        user: expect.objectContaining({ id: 1, name: 'User 1' }),
        message: 'Successfully fetched profile',
      });
      expect(result.user.password).toBeUndefined();
      expect(mockUsersService.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateProfile', () => {
    it('should update and return profile', async () => {
      const req = { user: { id: 1 } };
      const dto: UpdateProfileDto = { name: 'Updated Name' };
      const updatedUser = { id: 1, name: 'Updated Name' } as User;
      mockUsersService.updateProfile.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(req, dto);
      expect(result).toEqual({
        success: true,
        user: updatedUser,
        message: 'Profile updated successfully',
      });
      expect(mockUsersService.updateProfile).toHaveBeenCalledWith(1, dto);
    });
  });
});
