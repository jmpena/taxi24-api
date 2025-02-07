import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Invoice } from '../../entities/invoice.entity';
import { InvoiceRepository } from '../../repositories/invoice.repository';
import { TripRepository } from '../../repositories/trip.repository';

@Injectable()
export class GetInvoiceByTripUseCase {
  constructor(
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: InvoiceRepository,
    @Inject('TripRepository')
    private readonly tripRepository: TripRepository,
  ) {}

  async execute(tripId: number): Promise<Invoice> {
    // Verificar que el viaje existe
    const trip = await this.tripRepository.findById(tripId);
    if (!trip) {
      throw new NotFoundException(`Viaje con ID ${tripId} no encontrado`);
    }

    // Buscar la factura del viaje
    const invoice = await this.invoiceRepository.findByTripId(tripId);
    if (!invoice) {
      throw new NotFoundException(`Factura no encontrada para el viaje ${tripId}`);
    }

    return invoice;
  }
}
