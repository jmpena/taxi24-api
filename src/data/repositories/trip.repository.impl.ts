import { Trip } from '../../domain/entities/trip.entity';
import { TripRepository } from '../../domain/repositories/trip.repository';
import { TripStatus } from '../../core/types/enums';
import { prisma } from '../datasources/prisma.datasource';

export class TripRepositoryImpl implements TripRepository {
  private mapPrismaTrip(prismaTrip: any): Trip {
    return {
      ...prismaTrip,
      status: prismaTrip.status as TripStatus,
    };
  }

  async create(data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip> {
    try {
      const trip = await prisma.trip.create({
        data,
      });
      return this.mapPrismaTrip(trip);
    } catch (err) {
      throw new Error(`Error al crear viaje: ${err.message}`);
    }
  }

  async findById(id: number): Promise<Trip | null> {
    try {
      const trip = await prisma.trip.findUnique({
        where: { id },
      });
      return trip ? this.mapPrismaTrip(trip) : null;
    } catch (err) {
      throw new Error(`Error al buscar viaje: ${err.message}`);
    }
  }

  async findByStatus(status: TripStatus): Promise<Trip[]> {
    try {
      const trips = await prisma.trip.findMany({
        where: { status },
        include: {
          driver: true,
          passenger: true,
        },
      });
      return trips.map(trip => this.mapPrismaTrip(trip));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al buscar viajes por estado: ${error.message}`);
      }
      throw new Error('Error desconocido al buscar viajes por estado');
    }
  }

  async updateStatus(id: number, status: TripStatus): Promise<Trip> {
    try {
      const trip = await prisma.trip.update({
        where: { id },
        data: { status },
      });
      return this.mapPrismaTrip(trip);
    } catch (err) {
      throw new Error(`Error al actualizar estado del viaje: ${err.message}`);
    }
  }

  async findActiveByDriver(driverId: number): Promise<Trip | null> {
    try {
      const trip = await prisma.trip.findFirst({
        where: {
          driverId,
          status: TripStatus.ACTIVE,
        },
      });
      return trip ? this.mapPrismaTrip(trip) : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al buscar viaje activo del conductor: ${error.message}`);
      }
      throw new Error('Error desconocido al buscar viaje activo del conductor');
    }
  }

  async findActiveByPassenger(passengerId: number): Promise<Trip | null> {
    try {
      const trip = await prisma.trip.findFirst({
        where: {
          passengerId,
          status: TripStatus.ACTIVE,
        },
      });
      return trip ? this.mapPrismaTrip(trip) : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al buscar viaje activo del pasajero: ${error.message}`);
      }
      throw new Error('Error desconocido al buscar viaje activo del pasajero');
    }
  }

  async update(id: number, data: Partial<Trip>): Promise<Trip> {
    try {
      const trip = await prisma.trip.update({
        where: { id },
        data,
      });
      return this.mapPrismaTrip(trip);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al actualizar viaje: ${error.message}`);
      }
      throw new Error('Error desconocido al actualizar viaje');
    }
  }
}
