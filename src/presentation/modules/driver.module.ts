import { Module } from '@nestjs/common';
import { DriverController } from '../controllers/driver.controller';
import { GetAllDriversUseCase } from '../../domain/usecases/driver/get-all-drivers.usecase';
import { GetAvailableDriversUseCase } from '../../domain/usecases/driver/get-available-drivers.usecase';
import { FindNearbyDriversUseCase } from '../../domain/usecases/driver/find-nearby-drivers.usecase';
import { DriverRepositoryImpl } from '../../data/repositories/driver.repository.impl';
import { CreateDriverUseCase } from '../../domain/usecases/driver/create-driver.usecase';
import { GetDriverUseCase } from '../../domain/usecases/driver/get-driver.usecase';

@Module({
  controllers: [DriverController],
  providers: [
    GetDriverUseCase,
    CreateDriverUseCase,
    GetAllDriversUseCase,
    GetAvailableDriversUseCase,
    FindNearbyDriversUseCase,
    {
      provide: 'DriverRepository',
      useClass: DriverRepositoryImpl,
    },
  ],
})
export class DriverModule {}
