import { Module } from '@nestjs/common';
import { PassengerController } from '../controllers/passenger.controller';
import { GetAllPassengersUseCase } from '../../domain/usecases/passenger/get-all-passengers.usecase';
import { GetPassengerUseCase } from '../../domain/usecases/passenger/get-passenger.usecase';
import { CreatePassengerUseCase } from '../../domain/usecases/passenger/create-passenger.usecase';
import { PassengerRepositoryImpl } from '../../data/repositories/passenger.repository.impl';

@Module({
  controllers: [PassengerController],
  providers: [
    GetAllPassengersUseCase,
    GetPassengerUseCase,
    CreatePassengerUseCase,
    {
      provide: 'PassengerRepository',
      useClass: PassengerRepositoryImpl,
    },
  ],
})
export class PassengerModule {}
