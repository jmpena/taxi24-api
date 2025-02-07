import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Trip } from '../../entities/trip.entity';
import { TripRepository } from '../../repositories/trip.repository';
import { DriverRepository } from '../../repositories/driver.repository';
import { InvoiceRepository } from '../../repositories/invoice.repository';
import { TripStatus } from '../../../core/types/enums';
import { InvoiceStatus } from '../../../core/types/enums';
import { calculateTripCost } from '../../../core/utils/trip.utils';

@Injectable()
export class CompleteTripUseCase {
  constructor(
    @Inject('TripRepository')
    private readonly tripRepository: TripRepository,
    @Inject('DriverRepository')
    private readonly driverRepository: DriverRepository,
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(tripId: number): Promise<Trip> {
    // Buscar el viaje
    const trip = await this.tripRepository.findById(tripId);
    if (!trip) {
      throw new NotFoundException(`Viaje con ID ${tripId} no encontrado`);
    }

    if (trip.status === TripStatus.COMPLETED) {
      throw new BadRequestException(`El viaje con ID ${tripId} ya está completado`);
    }

    if (trip.status !== TripStatus.ACTIVE) {
      throw new BadRequestException(
        `Solo se pueden completar viajes activos. Estado actual: ${trip.status}`,
      );
    }

    // Calcular costo del viaje
    const tripCost = calculateTripCost(trip.startLat, trip.startLong, trip.endLat, trip.endLong);

    // Generar factura
    await this.invoiceRepository.create({
      tripId: trip.id,
      amount: tripCost,
      status: InvoiceStatus.PENDING,
    });

    // Actualizar el estado del viaje
    const completedTrip = await this.tripRepository.update(tripId, {
      status: TripStatus.COMPLETED,
    });

    // Liberar al conductor
    await this.driverRepository.update(trip.driverId, { available: true });

    return completedTrip;
  }
}
