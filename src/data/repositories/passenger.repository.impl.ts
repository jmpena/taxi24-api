import { Passenger } from '../../domain/entities/passenger.entity';
import { PassengerRepository } from '../../domain/repositories/passenger.repository';
import { prisma } from '../datasources/prisma.datasource';

export class PassengerRepositoryImpl implements PassengerRepository {
  async findAll(): Promise<Passenger[]> {
    return prisma.passenger.findMany();
  }

  async findById(id: number): Promise<Passenger | null> {
    return prisma.passenger.findUnique({
      where: { id },
    });
  }

  async create(data: Omit<Passenger, 'id' | 'createdAt' | 'updatedAt'>): Promise<Passenger> {
    return prisma.passenger.create({
      data,
    });
  }

  async update(id: number, data: Partial<Passenger>): Promise<Passenger> {
    return prisma.passenger.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.passenger.delete({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Passenger | null> {
    return prisma.passenger.findUnique({
      where: { email },
    });
  }
}
