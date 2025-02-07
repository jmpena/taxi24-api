import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Trip } from '../../entities/trip.entity';
import { TripRepository } from '../../repositories/trip.repository';
import { DriverRepository } from '../../repositories/driver.repository';
import { PassengerRepository } from '../../repositories/passenger.repository';
import { TripStatus } from '../../../core/types/enums';
import { Driver } from '../../entities/driver.entity';

@Injectable()
export class CreateTripUseCase {
  constructor(
    @Inject('TripRepository')
    private readonly tripRepository: TripRepository,
    @Inject('DriverRepository')
    private readonly driverRepository: DriverRepository,
    @Inject('PassengerRepository')
    private readonly passengerRepository: PassengerRepository,
  ) {}

  async execute(data: {
    passengerId: number;
    startLat: number;
    startLong: number;
    endLat: number;
    endLong: number;
  }): Promise<Trip> {
    // Verificar que el pasajero existe
    const passenger = await this.passengerRepository.findById(data.passengerId);
    if (!passenger) {
      throw new NotFoundException(`Pasajero con ID ${data.passengerId} no encontrado`);
    }

    // Verificar que el pasajero no tenga un viaje activo
    const activePassengerTrip = await this.tripRepository.findActiveByPassenger(data.passengerId);
    if (activePassengerTrip) {
      throw new BadRequestException(
        `El pasajero ya tiene un viaje activo (ID: ${activePassengerTrip.id})`,
      );
    }

    // Buscar conductor disponible más cercano
    const nearbyDrivers = await this.driverRepository.findNearby(
      data.startLat,
      data.startLong,
      3, // Radio de 3km
    );

    if (!nearbyDrivers || nearbyDrivers.length === 0) {
      throw new NotFoundException('No hay conductores disponibles en este momento');
    }

    // Filtrar conductores que ya tienen un viaje activo
    const availableDrivers: Driver[] = [];
    for (const driver of nearbyDrivers) {
      const activeTrip = await this.tripRepository.findActiveByDriver(driver.id);
      if (!activeTrip) {
        availableDrivers.push(driver);
      }
    }

    if (availableDrivers.length === 0) {
      throw new NotFoundException('No hay conductores disponibles en este momento');
    }

    // Asignar el primer conductor disponible
    const driver = availableDrivers[0];

    // Crear el viaje
    const trip = await this.tripRepository.create({
      driverId: driver.id,
      passengerId: data.passengerId,
      status: TripStatus.ACTIVE,
      startLat: data.startLat,
      startLong: data.startLong,
      endLat: data.endLat,
      endLong: data.endLong,
    });

    // Actualizar estado del conductor
    await this.driverRepository.update(driver.id, { available: false });

    return trip;
  }
}
