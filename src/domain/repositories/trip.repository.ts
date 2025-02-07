import { Trip } from '../entities/trip.entity';
import { TripStatus } from '../../core/types/enums';

export interface TripRepository {
  create(data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip>;
  findById(id: number): Promise<Trip | null>;
  findByStatus(status: TripStatus): Promise<Trip[]>;
  findActiveByDriver(driverId: number): Promise<Trip | null>;
  findActiveByPassenger(passengerId: number): Promise<Trip | null>;
  update(id: number, data: Partial<Trip>): Promise<Trip>;
}
