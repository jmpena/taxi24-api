import { Test, TestingModule } from '@nestjs/testing';
import { GetAvailableDriversUseCase } from '../../driver/get-available-drivers.usecase';
import { DriverRepository } from '../../../repositories/driver.repository';

describe('GetAvailableDriversUseCase', () => {
  let useCase: GetAvailableDriversUseCase;
  let driverRepository: jest.Mocked<DriverRepository>;

  beforeEach(async () => {
    const mockDriverRepository = {
      findAvailable: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAvailableDriversUseCase,
        {
          provide: 'DriverRepository',
          useValue: mockDriverRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetAvailableDriversUseCase>(GetAvailableDriversUseCase);
    driverRepository = module.get('DriverRepository');
  });

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

    driverRepository.findAvailable.mockResolvedValue(mockDrivers);

    const result = await useCase.execute();

    expect(result).toBe(mockDrivers);
    expect(driverRepository.findAvailable).toHaveBeenCalled();
  });

  it('should return empty array when no available drivers exist', async () => {
    driverRepository.findAvailable.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
