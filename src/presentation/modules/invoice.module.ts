import { Module } from '@nestjs/common';
import { InvoiceController } from '../controllers/invoice.controller';
import { GetAllInvoicesUseCase } from '../../domain/usecases/invoice/get-all-invoices.usecase';
import { GetInvoiceUseCase } from '../../domain/usecases/invoice/get-invoice.usecase';
import { GetInvoiceByTripUseCase } from '../../domain/usecases/invoice/get-invoice-by-trip.usecase';
import { PayInvoiceUseCase } from '../../domain/usecases/invoice/pay-invoice.usecase';
import { InvoiceRepositoryImpl } from '../../data/repositories/invoice.repository.impl';
import { TripRepositoryImpl } from '../../data/repositories/trip.repository.impl';

@Module({
  controllers: [InvoiceController],
  providers: [
    GetAllInvoicesUseCase,
    GetInvoiceUseCase,
    GetInvoiceByTripUseCase,
    PayInvoiceUseCase,
    {
      provide: 'InvoiceRepository',
      useClass: InvoiceRepositoryImpl,
    },
    {
      provide: 'TripRepository',
      useClass: TripRepositoryImpl,
    },
  ],
})
export class InvoiceModule {}
