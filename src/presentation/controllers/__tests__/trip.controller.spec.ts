import { Test, TestingModule } from '@nestjs/testing';
import { TripController } from '../trip.controller';
import { CreateTripUseCase } from '../../../domain/usecases/trip/create-trip.usecase';
import { CompleteTripUseCase } from '../../../domain/usecases/trip/complete-trip.usecase';
import { GetActiveTripsUseCase } from '../../../domain/usecases/trip/get-active-trips.usecase';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TripStatus } from '../../../core/types/enums';

describe('TripController', () => {
  let controller: TripController;
  let createTripUseCase: jest.Mocked<CreateTripUseCase>;
  let completeTripUseCase: jest.Mocked<CompleteTripUseCase>;
  let getActiveTripsUseCase: jest.Mocked<GetActiveTripsUseCase>;

  beforeEach(async () => {
    const mockCreateTripUseCase = {
      execute: jest.fn(),
    };
    const mockCompleteTripUseCase = {
      execute: jest.fn(),
    };
    const mockGetActiveTripsUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripController],
      providers: [
        {
          provide: CreateTripUseCase,
          useValue: mockCreateTripUseCase,
        },
        {
          provide: CompleteTripUseCase,
          useValue: mockCompleteTripUseCase,
        },
        {
          provide: GetActiveTripsUseCase,
          useValue: mockGetActiveTripsUseCase,
        },
      ],
    }).compile();

    controller = module.get<TripController>(TripController);
    createTripUseCase = module.get(CreateTripUseCase);
    completeTripUseCase = module.get(CompleteTripUseCase);
    getActiveTripsUseCase = module.get(GetActiveTripsUseCase);
  });

  describe('createTrip', () => {
    const createTripDto = {
      passengerId: 1,
      startLat: 18.473147,
      startLong: -69.912835,
      endLat: 18.476247,
      endLong: -69.906135,
    };

    it('should create a trip successfully', async () => {
      const mockCreatedTrip = {
        id: 1,
        ...createTripDto,
        driverId: 1,
        status: TripStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      createTripUseCase.execute.mockResolvedValue(mockCreatedTrip);

      const result = await controller.createTrip(createTripDto);

      expect(result).toBe(mockCreatedTrip);
      expect(createTripUseCase.execute).toHaveBeenCalledWith(createTripDto);
    });

    it('should throw NotFoundException when no drivers available', async () => {
      createTripUseCase.execute.mockRejectedValue(
        new NotFoundException('No hay conductores disponibles'),
      );

      await expect(controller.createTrip(createTripDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('completeTrip', () => {
    it('should complete a trip successfully', async () => {
      const mockCompletedTrip = {
        id: 1,
        passengerId: 1,
        driverId: 1,
        status: TripStatus.COMPLETED,
        startLat: 18.473147,
        startLong: -69.912835,
        endLat: 18.476247,
        endLong: -69.906135,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      completeTripUseCase.execute.mockResolvedValue(mockCompletedTrip);

      const result = await controller.completeTrip(1);

      expect(result).toBe(mockCompletedTrip);
      expect(completeTripUseCase.execute).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when trip does not exist', async () => {
      completeTripUseCase.execute.mockRejectedValue(new NotFoundException('Viaje no encontrado'));

      await expect(controller.completeTrip(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when trip is already completed', async () => {
      completeTripUseCase.execute.mockRejectedValue(
        new BadRequestException('El viaje ya está completado'),
      );

      await expect(controller.completeTrip(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getActiveTrips', () => {
    it('should return active trips', async () => {
      const mockActiveTrips = [
        {
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
        },
      ];

      getActiveTripsUseCase.execute.mockResolvedValue(mockActiveTrips);

      const result = await controller.getActiveTrips();

      expect(result).toBe(mockActiveTrips);
      expect(getActiveTripsUseCase.execute).toHaveBeenCalled();
    });

    it('should return empty array when no active trips', async () => {
      getActiveTripsUseCase.execute.mockResolvedValue([]);

      const result = await controller.getActiveTrips();

      expect(result).toEqual([]);
    });
  });
});
