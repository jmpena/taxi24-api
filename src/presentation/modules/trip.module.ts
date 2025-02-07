import { Module } from '@nestjs/common';
import { TripController } from '../controllers/trip.controller';
import { CreateTripUseCase } from '../../domain/usecases/trip/create-trip.usecase';
import { CompleteTripUseCase } from '../../domain/usecases/trip/complete-trip.usecase';
import { GetActiveTripsUseCase } from '../../domain/usecases/trip/get-active-trips.usecase';
import { TripRepositoryImpl } from '../../data/repositories/trip.repository.impl';
import { DriverRepositoryImpl } from '../../data/repositories/driver.repository.impl';
import { PassengerRepositoryImpl } from '../../data/repositories/passenger.repository.impl';
import { InvoiceRepositoryImpl } from '../../data/repositories/invoice.repository.impl';

@Module({
  controllers: [TripController],
  providers: [
    CreateTripUseCase,
    CompleteTripUseCase,
    GetActiveTripsUseCase,
    {
      provide: 'TripRepository',
      useClass: TripRepositoryImpl,
    },
    {
      provide: 'DriverRepository',
      useClass: DriverRepositoryImpl,
    },
    {
      provide: 'PassengerRepository',
      useClass: PassengerRepositoryImpl,
    },
    {
      provide: 'InvoiceRepository',
      useClass: InvoiceRepositoryImpl,
    },
  ],
})
export class TripModule {}
