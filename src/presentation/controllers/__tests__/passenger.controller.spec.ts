import { Test, TestingModule } from '@nestjs/testing';
import { PassengerController } from '../passenger.controller';
import { GetAllPassengersUseCase } from '../../../domain/usecases/passenger/get-all-passengers.usecase';
import { GetPassengerUseCase } from '../../../domain/usecases/passenger/get-passenger.usecase';
import { CreatePassengerUseCase } from '../../../domain/usecases/passenger/create-passenger.usecase';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('PassengerController', () => {
  let controller: PassengerController;
  let getAllPassengersUseCase: jest.Mocked<GetAllPassengersUseCase>;
  let getPassengerUseCase: jest.Mocked<GetPassengerUseCase>;
  let createPassengerUseCase: jest.Mocked<CreatePassengerUseCase>;

  beforeEach(async () => {
    const mockGetAllPassengersUseCase = {
      execute: jest.fn(),
    };
    const mockGetPassengerUseCase = {
      execute: jest.fn(),
    };
    const mockCreatePassengerUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassengerController],
      providers: [
        {
          provide: GetAllPassengersUseCase,
          useValue: mockGetAllPassengersUseCase,
        },
        {
          provide: GetPassengerUseCase,
          useValue: mockGetPassengerUseCase,
        },
        {
          provide: CreatePassengerUseCase,
          useValue: mockCreatePassengerUseCase,
        },
      ],
    }).compile();

    controller = module.get<PassengerController>(PassengerController);
    getAllPassengersUseCase = module.get(GetAllPassengersUseCase);
    getPassengerUseCase = module.get(GetPassengerUseCase);
    createPassengerUseCase = module.get(CreatePassengerUseCase);
  });

  describe('getAllPassengers', () => {
    it('should return an array of passengers', async () => {
      const mockPassengers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      getAllPassengersUseCase.execute.mockResolvedValue(mockPassengers);

      const result = await controller.getAllPassengers();

      expect(result).toBe(mockPassengers);
      expect(getAllPassengersUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('getPassengerById', () => {
    it('should return a passenger when it exists', async () => {
      const mockPassenger = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      getPassengerUseCase.execute.mockResolvedValue(mockPassenger);

      const result = await controller.getPassengerById(1);

      expect(result).toBe(mockPassenger);
      expect(getPassengerUseCase.execute).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when passenger does not exist', async () => {
      getPassengerUseCase.execute.mockResolvedValue(null);

      await expect(controller.getPassengerById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createPassenger', () => {
    const createPassengerDto = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
    };

    it('should create a passenger successfully', async () => {
      const mockCreatedPassenger = {
        id: 1,
        ...createPassengerDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      createPassengerUseCase.execute.mockResolvedValue(mockCreatedPassenger);

      const result = await controller.createPassenger(createPassengerDto);

      expect(result).toBe(mockCreatedPassenger);
      expect(createPassengerUseCase.execute).toHaveBeenCalledWith(createPassengerDto);
    });

    it('should throw ConflictException when email already exists', async () => {
      createPassengerUseCase.execute.mockRejectedValue(
        new ConflictException('Email already exists'),
      );

      await expect(controller.createPassenger(createPassengerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
