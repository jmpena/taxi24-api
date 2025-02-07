import { Test, TestingModule } from '@nestjs/testing';
import { CreateDriverUseCase } from '../../driver/create-driver.usecase';
import { DriverRepository } from '../../../repositories/driver.repository';
import { LicenseExistsException } from '../../../../core/exceptions/license-exists.exception';

describe('CreateDriverUseCase', () => {
  let useCase: CreateDriverUseCase;
  let driverRepository: jest.Mocked<DriverRepository>;

  beforeEach(async () => {
    const mockDriverRepository = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDriverUseCase,
        {
          provide: 'DriverRepository',
          useValue: mockDriverRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateDriverUseCase>(CreateDriverUseCase);
    driverRepository = module.get('DriverRepository');
  });

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

    driverRepository.create.mockResolvedValue(mockCreatedDriver);

    const result = await useCase.execute(createDriverDto);

    expect(result).toBe(mockCreatedDriver);
    expect(driverRepository.create).toHaveBeenCalledWith(createDriverDto);
  });

  it('should throw LicenseExistsException when license already exists', async () => {
    driverRepository.create.mockRejectedValue(new LicenseExistsException('ABC123'));

    await expect(useCase.execute(createDriverDto)).rejects.toThrow(LicenseExistsException);
  });
});
