import { Test, TestingModule } from '@nestjs/testing';
import { CreatePassengerUseCase } from '../../passenger/create-passenger.usecase';
import { PassengerRepository } from '../../../repositories/passenger.repository';
import { ConflictException } from '@nestjs/common';

describe('CreatePassengerUseCase', () => {
  let useCase: CreatePassengerUseCase;
  let passengerRepository: jest.Mocked<PassengerRepository>;

  beforeEach(async () => {
    const mockPassengerRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePassengerUseCase,
        {
          provide: 'PassengerRepository',
          useValue: mockPassengerRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreatePassengerUseCase>(CreatePassengerUseCase);
    passengerRepository = module.get('PassengerRepository');
  });

  it('should create a passenger successfully', async () => {
    const createPassengerDto = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
    };

    const mockCreatedPassenger = {
      id: 1,
      ...createPassengerDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    passengerRepository.findByEmail.mockResolvedValue(null);
    passengerRepository.create.mockResolvedValue(mockCreatedPassenger);

    const result = await useCase.execute(createPassengerDto);

    expect(result).toBe(mockCreatedPassenger);
    expect(passengerRepository.findByEmail).toHaveBeenCalledWith(createPassengerDto.email);
    expect(passengerRepository.create).toHaveBeenCalledWith(createPassengerDto);
  });

  it('should throw ConflictException when email already exists', async () => {
    const createPassengerDto = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
    };

    const existingPassenger = {
      id: 1,
      ...createPassengerDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    passengerRepository.findByEmail.mockResolvedValue(existingPassenger);

    await expect(useCase.execute(createPassengerDto)).rejects.toThrow(ConflictException);
    expect(passengerRepository.create).not.toHaveBeenCalled();
  });
});
