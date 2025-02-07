import { Test, TestingModule } from '@nestjs/testing';
import { GetAllDriversUseCase } from '../../driver/get-all-drivers.usecase';
import { DriverRepository } from '../../../repositories/driver.repository';

describe('GetAllDriversUseCase', () => {
  let useCase: GetAllDriversUseCase;
  let driverRepository: jest.Mocked<DriverRepository>;

  beforeEach(async () => {
    const mockDriverRepository = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllDriversUseCase,
        {
          provide: 'DriverRepository',
          useValue: mockDriverRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllDriversUseCase>(GetAllDriversUseCase);
    driverRepository = module.get('DriverRepository');
  });

  it('should return all drivers', async () => {
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

    driverRepository.findAll.mockResolvedValue(mockDrivers);

    const result = await useCase.execute();

    expect(result).toBe(mockDrivers);
    expect(driverRepository.findAll).toHaveBeenCalled();
  });

  it('should return empty array when no drivers exist', async () => {
    driverRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
