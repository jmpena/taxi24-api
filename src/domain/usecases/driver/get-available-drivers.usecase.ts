import { Injectable, Inject } from '@nestjs/common';
import { Driver } from '../../entities/driver.entity';
import { DriverRepository } from '../../repositories/driver.repository';

@Injectable()
export class GetAvailableDriversUseCase {
  constructor(
    @Inject('DriverRepository')
    private readonly driverRepository: DriverRepository,
  ) {}

  async execute(): Promise<Driver[]> {
    return this.driverRepository.findAvailable();
  }
}
