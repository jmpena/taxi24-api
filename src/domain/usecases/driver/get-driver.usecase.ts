import { Injectable, Inject } from '@nestjs/common';
import { Driver } from '../../entities/driver.entity';
import { DriverRepository } from '../../repositories/driver.repository';

@Injectable()
export class GetDriverUseCase {
  constructor(
    @Inject('DriverRepository')
    private readonly driverRepository: DriverRepository,
  ) {}

  async execute(id: number): Promise<Driver | null> {
    return this.driverRepository.findById(id);
  }
}
