import { Injectable, Inject } from '@nestjs/common';
import { Driver } from '../../entities/driver.entity';
import { DriverRepository } from '../../repositories/driver.repository';

@Injectable()
export class FindNearbyDriversUseCase {
  constructor(
    @Inject('DriverRepository')
    private readonly driverRepository: DriverRepository,
  ) {}

  async execute(latitude: number, longitude: number, radius: number = 3): Promise<Driver[]> {
    return this.driverRepository.findNearby(latitude, longitude, radius);
  }
}
