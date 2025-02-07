import { Injectable, Inject } from '@nestjs/common';
import { Driver } from '../../entities/driver.entity';
import { DriverRepository } from '../../repositories/driver.repository';

@Injectable()
export class CreateDriverUseCase {
  constructor(
    @Inject('DriverRepository')
    private readonly driverRepository: DriverRepository,
  ) {}

  async execute(data: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): Promise<Driver> {
    return this.driverRepository.create(data);
  }
}
