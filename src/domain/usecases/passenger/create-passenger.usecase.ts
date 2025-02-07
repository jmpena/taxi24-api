import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Passenger } from '../../entities/passenger.entity';
import { PassengerRepository } from '../../repositories/passenger.repository';

@Injectable()
export class CreatePassengerUseCase {
  constructor(
    @Inject('PassengerRepository')
    private readonly passengerRepository: PassengerRepository,
  ) {}

  async execute(data: { name: string; email: string; phone: string }): Promise<Passenger> {
    // Verificar si ya existe un pasajero con el mismo email
    const existingPassenger = await this.passengerRepository.findByEmail(data.email);
    if (existingPassenger) {
      throw new ConflictException(`Ya existe un pasajero con el email ${data.email}`);
    }

    return this.passengerRepository.create(data);
  }
}
