import { Driver } from '../entities/driver.entity';

export interface DriverRepository {
  findAll(): Promise<Driver[]>;
  findById(id: number): Promise<Driver | null>;
  findAvailable(): Promise<Driver[]>;
  findNearby(latitude: number, longitude: number, radius: number): Promise<Driver[]>;
  create(data: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): Promise<Driver>;
  update(id: number, data: Partial<Driver>): Promise<Driver>;
  delete(id: number): Promise<void>;
}
