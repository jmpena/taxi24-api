import { Driver } from '../../domain/entities/driver.entity';
import { DriverRepository } from '../../domain/repositories/driver.repository';
import { prisma } from '../datasources/prisma.datasource';
import { LicenseExistsException } from '../../core/exceptions/license-exists.exception';

export class DriverRepositoryImpl implements DriverRepository {
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async findAll(): Promise<Driver[]> {
    try {
      const drivers = await prisma.driver.findMany();
      console.log('Drivers encontrados:', drivers); // Log para depuración
      return drivers as Driver[];
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al obtener conductores: ${error.message}`);
      }
      throw new Error('Error desconocido al obtener conductores');
    }
  }

  async findById(id: number): Promise<Driver | null> {
    try {
      return await prisma.driver.findUnique({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al obtener conductor: ${error.message}`);
      }
      throw new Error('Error desconocido al obtener conductor');
    }
  }

  async findAvailable(): Promise<Driver[]> {
    try {
      return await prisma.driver.findMany({
        where: { available: true },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al obtener conductores disponibles: ${error.message}`);
      }
      throw new Error('Error desconocido al obtener conductores disponibles');
    }
  }

  async findNearby(latitude: number, longitude: number, radius: number): Promise<Driver[]> {
    try {
      console.log('Buscando conductores cerca de:', {
        latitude,
        longitude,
        radius,
      });

      const allDrivers = await prisma.driver.findMany({
        where: { available: true },
      });

      const nearbyDrivers = allDrivers.filter(driver => {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          driver.latitude,
          driver.longitude,
        );
        console.log(`Conductor ${driver.name} está a ${distance.toFixed(2)} km`);
        return distance <= radius;
      });

      console.log(`Encontrados ${nearbyDrivers.length} conductores dentro de ${radius} km`);
      return nearbyDrivers;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al buscar conductores cercanos: ${error.message}`);
      }
      throw new Error('Error desconocido al buscar conductores cercanos');
    }
  }

  async create(data: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): Promise<Driver> {
    try {
      return await prisma.driver.create({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('Unique constraint failed')) {
          throw new LicenseExistsException(data.license);
        }
        throw new Error(`Error al crear conductor: ${error.message}`);
      }
      throw new Error('Error desconocido al crear conductor');
    }
  }

  async update(id: number, data: Partial<Driver>): Promise<Driver> {
    try {
      return await prisma.driver.update({ where: { id }, data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al actualizar conductor: ${error.message}`);
      }
      throw new Error('Error desconocido al actualizar conductor');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await prisma.driver.delete({ where: { id } });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al eliminar conductor: ${error.message}`);
      }
      throw new Error('Error desconocido al eliminar conductor');
    }
  }
}
