import { Module } from '@nestjs/common';
import { DriverModule } from './presentation/modules/driver.module';
import { PassengerModule } from './presentation/modules/passenger.module';
import { TripModule } from './presentation/modules/trip.module';
import { InvoiceModule } from './presentation/modules/invoice.module';

// Repositories
import { DriverRepositoryImpl } from './data/repositories/driver.repository.impl';
import { PassengerRepositoryImpl } from './data/repositories/passenger.repository.impl';
import { TripRepositoryImpl } from './data/repositories/trip.repository.impl';
import { InvoiceRepositoryImpl } from './data/repositories/invoice.repository.impl';

// Use Cases
import { GetAllDriversUseCase } from './domain/usecases/driver/get-all-drivers.usecase';
import { GetDriverUseCase } from './domain/usecases/driver/get-driver.usecase';
import { GetAvailableDriversUseCase } from './domain/usecases/driver/get-available-drivers.usecase';
import { FindNearbyDriversUseCase } from './domain/usecases/driver/find-nearby-drivers.usecase';
import { CreateTripUseCase } from './domain/usecases/trip/create-trip.usecase';
import { CompleteTripUseCase } from './domain/usecases/trip/complete-trip.usecase';
import { GetActiveTripsUseCase } from './domain/usecases/trip/get-active-trips.usecase';
import { GetAllPassengersUseCase } from './domain/usecases/passenger/get-all-passengers.usecase';
import { GetPassengerUseCase } from './domain/usecases/passenger/get-passenger.usecase';
import { GetAllInvoicesUseCase } from './domain/usecases/invoice/get-all-invoices.usecase';
import { GetInvoiceUseCase } from './domain/usecases/invoice/get-invoice.usecase';

@Module({
  imports: [DriverModule, PassengerModule, TripModule, InvoiceModule],
  controllers: [],
  providers: [
    // Repositories
    {
      provide: 'DriverRepository',
      useClass: DriverRepositoryImpl,
    },
    {
      provide: 'PassengerRepository',
      useClass: PassengerRepositoryImpl,
    },
    {
      provide: 'TripRepository',
      useClass: TripRepositoryImpl,
    },
    {
      provide: 'InvoiceRepository',
      useClass: InvoiceRepositoryImpl,
    },
    // Use Cases
    GetAllDriversUseCase,
    GetDriverUseCase,
    GetAvailableDriversUseCase,
    FindNearbyDriversUseCase,
    CreateTripUseCase,
    CompleteTripUseCase,
    GetActiveTripsUseCase,
    GetAllPassengersUseCase,
    GetPassengerUseCase,
    GetAllInvoicesUseCase,
    GetInvoiceUseCase,
  ],
})
export class AppModule {}
