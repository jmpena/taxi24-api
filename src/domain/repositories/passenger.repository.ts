import { Passenger } from '../entities/passenger.entity';

export interface PassengerRepository {
  create(data: Omit<Passenger, 'id' | 'createdAt' | 'updatedAt'>): Promise<Passenger>;
  findAll(): Promise<Passenger[]>;
  findById(id: number): Promise<Passenger | null>;
  findByEmail(email: string): Promise<Passenger | null>;
  update(id: number, data: Partial<Passenger>): Promise<Passenger>;
  delete(id: number): Promise<void>;
}
