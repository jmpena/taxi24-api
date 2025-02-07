import { Test, TestingModule } from '@nestjs/testing';
import { GetDriverUseCase } from '../../driver/get-driver.usecase';
import { DriverRepository } from '../../../repositories/driver.repository';

describe('GetDriverUseCase', () => {
  let useCase: GetDriverUseCase;
  let driverRepository: jest.Mocked<DriverRepository>;

  beforeEach(async () => {
    const mockDriverRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDriverUseCase,
        {
          provide: 'DriverRepository',
          useValue: mockDriverRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetDriverUseCase>(GetDriverUseCase);
    driverRepository = module.get('DriverRepository');
  });

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

    driverRepository.findById.mockResolvedValue(mockDriver);

    const result = await useCase.execute(1);

    expect(result).toBe(mockDriver);
    expect(driverRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should return null when driver does not exist', async () => {
    driverRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(1);

    expect(result).toBeNull();
  });
});
