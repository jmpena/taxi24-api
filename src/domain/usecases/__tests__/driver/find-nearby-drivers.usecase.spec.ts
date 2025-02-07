import { Test, TestingModule } from '@nestjs/testing';
import { FindNearbyDriversUseCase } from '../../driver/find-nearby-drivers.usecase';
import { DriverRepository } from '../../../repositories/driver.repository';

describe('FindNearbyDriversUseCase', () => {
  let useCase: FindNearbyDriversUseCase;
  let driverRepository: jest.Mocked<DriverRepository>;

  beforeEach(async () => {
    const mockDriverRepository = {
      findNearby: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindNearbyDriversUseCase,
        {
          provide: 'DriverRepository',
          useValue: mockDriverRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindNearbyDriversUseCase>(FindNearbyDriversUseCase);
    driverRepository = module.get('DriverRepository');
  });

  it('should find nearby drivers successfully', async () => {
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

    driverRepository.findNearby.mockResolvedValue(mockDrivers);

    const result = await useCase.execute(18.473147, -69.912835, 3);

    expect(result).toBe(mockDrivers);
    expect(driverRepository.findNearby).toHaveBeenCalledWith(18.473147, -69.912835, 3);
  });

  it('should return empty array when no nearby drivers found', async () => {
    driverRepository.findNearby.mockResolvedValue([]);

    const result = await useCase.execute(18.473147, -69.912835, 3);

    expect(result).toEqual([]);
  });
});
