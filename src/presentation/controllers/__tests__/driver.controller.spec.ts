import { Test, TestingModule } from '@nestjs/testing';
import { DriverController } from '../driver.controller';
import { GetAllDriversUseCase } from '../../../domain/usecases/driver/get-all-drivers.usecase';
import { GetDriverUseCase } from '../../../domain/usecases/driver/get-driver.usecase';
import { CreateDriverUseCase } from '../../../domain/usecases/driver/create-driver.usecase';
import { GetAvailableDriversUseCase } from '../../../domain/usecases/driver/get-available-drivers.usecase';
import { FindNearbyDriversUseCase } from '../../../domain/usecases/driver/find-nearby-drivers.usecase';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('DriverController', () => {
  let controller: DriverController;
  let getAllDriversUseCase: jest.Mocked<GetAllDriversUseCase>;
  let getDriverUseCase: jest.Mocked<GetDriverUseCase>;
  let createDriverUseCase: jest.Mocked<CreateDriverUseCase>;
  let getAvailableDriversUseCase: jest.Mocked<GetAvailableDriversUseCase>;
  let findNearbyDriversUseCase: jest.Mocked<FindNearbyDriversUseCase>;

  beforeEach(async () => {
    const mockGetAllDriversUseCase = { execute: jest.fn() };
    const mockGetDriverUseCase = { execute: jest.fn() };
    const mockCreateDriverUseCase = { execute: jest.fn() };
    const mockGetAvailableDriversUseCase = { execute: jest.fn() };
    const mockFindNearbyDriversUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverController],
      providers: [
        { provide: GetAllDriversUseCase, useValue: mockGetAllDriversUseCase },
        { provide: GetDriverUseCase, useValue: mockGetDriverUseCase },
        { provide: CreateDriverUseCase, useValue: mockCreateDriverUseCase },
        {
          provide: GetAvailableDriversUseCase,
          useValue: mockGetAvailableDriversUseCase,
        },
        { provide: FindNearbyDriversUseCase, useValue: mockFindNearbyDriversUseCase },
      ],
    }).compile();

    controller = module.get<DriverController>(DriverController);
    getAllDriversUseCase = module.get(GetAllDriversUseCase);
    getDriverUseCase = module.get(GetDriverUseCase);
    createDriverUseCase = module.get(CreateDriverUseCase);
    getAvailableDriversUseCase = module.get(GetAvailableDriversUseCase);
    findNearbyDriversUseCase = module.get(FindNearbyDriversUseCase);
  });

  describe('getAllDrivers', () => {
    it('should return an array of drivers', async () => {
      const mockDrivers = [
        {
          id: 1,
          name: 'John Driver',
          license: 'ABC123',
          latitude: 18.473147,
          longitude: -69.912835,
          available: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      getAllDriversUseCase.execute.mockResolvedValue(mockDrivers);

      const result = await controller.getAllDrivers();

      expect(result).toBe(mockDrivers);
      expect(getAllDriversUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('getDriverById', () => {
    it('should return a driver when it exists', async () => {
      const mockDriver = {
        id: 1,
        name: 'John Driver',
        license: 'ABC123',
        latitude: 18.473147,
        longitude: -69.912835,
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      getDriverUseCase.execute.mockResolvedValue(mockDriver);

      const result = await controller.getDriverById(1);

      expect(result).toBe(mockDriver);
      expect(getDriverUseCase.execute).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when driver does not exist', async () => {
      getDriverUseCase.execute.mockResolvedValue(null);

      await expect(controller.getDriverById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createDriver', () => {
    const createDriverDto = {
      name: 'John Driver',
      license: 'ABC123',
      latitude: 18.473147,
      longitude: -69.912835,
      available: true,
    };

    it('should create a driver successfully', async () => {
      const mockCreatedDriver = {
        id: 1,
        ...createDriverDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      createDriverUseCase.execute.mockResolvedValue(mockCreatedDriver);

      const result = await controller.createDriver(createDriverDto);

      expect(result).toBe(mockCreatedDriver);
      expect(createDriverUseCase.execute).toHaveBeenCalledWith(createDriverDto);
    });

    it('should throw ConflictException when license already exists', async () => {
      createDriverUseCase.execute.mockRejectedValue(
        new ConflictException('License already exists'),
      );

      await expect(controller.createDriver(createDriverDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('getAvailableDrivers', () => {
    it('should return available drivers', async () => {
      const mockDrivers = [
        {
          id: 1,
          name: 'John Driver',
          license: 'ABC123',
          latitude: 18.473147,
          longitude: -69.912835,
          available: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      getAvailableDriversUseCase.execute.mockResolvedValue(mockDrivers);

      const result = await controller.getAvailableDrivers();

      expect(result).toBe(mockDrivers);
      expect(getAvailableDriversUseCase.execute).toHaveBeenCalled();
    });

    it('should return empty array when no available drivers exist', async () => {
      getAvailableDriversUseCase.execute.mockResolvedValue([]);

      const result = await controller.getAvailableDrivers();

      expect(result).toEqual([]);
    });
  });
});
