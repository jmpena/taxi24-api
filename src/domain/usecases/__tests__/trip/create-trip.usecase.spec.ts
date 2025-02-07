import { Test, TestingModule } from '@nestjs/testing';
import { CreateTripUseCase } from '../../trip/create-trip.usecase';
import { TripRepository } from '../../../repositories/trip.repository';
import { DriverRepository } from '../../../repositories/driver.repository';
import { PassengerRepository } from '../../../repositories/passenger.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TripStatus } from '../../../../core/types/enums';

describe('CreateTripUseCase', () => {
  let useCase: CreateTripUseCase;
  let tripRepository: jest.Mocked<TripRepository>;
  let driverRepository: jest.Mocked<DriverRepository>;
  let passengerRepository: jest.Mocked<PassengerRepository>;

  beforeEach(async () => {
    const mockTripRepository = {
      create: jest.fn(),
      findActiveByPassenger: jest.fn(),
      findActiveByDriver: jest.fn(),
    };
    const mockDriverRepository = {
      findNearby: jest.fn(),
      update: jest.fn(),
    };
    const mockPassengerRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTripUseCase,
        {
          provide: 'TripRepository',
          useValue: mockTripRepository,
        },
        {
          provide: 'DriverRepository',
          useValue: mockDriverRepository,
        },
        {
          provide: 'PassengerRepository',
          useValue: mockPassengerRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateTripUseCase>(CreateTripUseCase);
    tripRepository = module.get('TripRepository');
    driverRepository = module.get('DriverRepository');
    passengerRepository = module.get('PassengerRepository');
  });

  const createTripDto = {
    passengerId: 1,
    startLat: 18.473147,
    startLong: -69.912835,
    endLat: 18.476247,
    endLong: -69.906135,
  };

  it('should create a trip successfully', async () => {
    const mockPassenger = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockDriver = {
      id: 1,
      name: 'Driver One',
      license: 'ABC123',
      available: true,
      latitude: 18.473147,
      longitude: -69.912835,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockCreatedTrip = {
      id: 1,
      ...createTripDto,
      driverId: mockDriver.id,
      status: TripStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    passengerRepository.findById.mockResolvedValue(mockPassenger);
    tripRepository.findActiveByPassenger.mockResolvedValue(null);
    tripRepository.findActiveByDriver.mockResolvedValue(null);
    driverRepository.findNearby.mockResolvedValue([mockDriver]);
    tripRepository.create.mockResolvedValue(mockCreatedTrip);

    const result = await useCase.execute(createTripDto);

    expect(result).toBe(mockCreatedTrip);
    expect(passengerRepository.findById).toHaveBeenCalledWith(createTripDto.passengerId);
    expect(driverRepository.findNearby).toHaveBeenCalledWith(
      createTripDto.startLat,
      createTripDto.startLong,
      3,
    );
    expect(tripRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        passengerId: createTripDto.passengerId,
        driverId: mockDriver.id,
        status: TripStatus.ACTIVE,
      }),
    );
  });

  it('should throw NotFoundException when passenger does not exist', async () => {
    passengerRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(createTripDto)).rejects.toThrow(NotFoundException);
    expect(driverRepository.findNearby).not.toHaveBeenCalled();
    expect(tripRepository.create).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when passenger has active trip', async () => {
    const mockPassenger = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockActiveTrip = {
      id: 1,
      passengerId: 1,
      driverId: 1,
      status: TripStatus.ACTIVE,
      startLat: 18.473147,
      startLong: -69.912835,
      endLat: 18.476247,
      endLong: -69.906135,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    passengerRepository.findById.mockResolvedValue(mockPassenger);
    tripRepository.findActiveByPassenger.mockResolvedValue(mockActiveTrip);

    await expect(useCase.execute(createTripDto)).rejects.toThrow(BadRequestException);
    expect(driverRepository.findNearby).not.toHaveBeenCalled();
    expect(tripRepository.create).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when no drivers available', async () => {
    const mockPassenger = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    passengerRepository.findById.mockResolvedValue(mockPassenger);
    tripRepository.findActiveByPassenger.mockResolvedValue(null);
    driverRepository.findNearby.mockResolvedValue([]);

    await expect(useCase.execute(createTripDto)).rejects.toThrow(NotFoundException);
    expect(tripRepository.create).not.toHaveBeenCalled();
  });
});
