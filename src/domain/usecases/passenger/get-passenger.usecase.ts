import { Injectable, Inject } from '@nestjs/common';
import { Passenger } from '../../entities/passenger.entity';
import { PassengerRepository } from '../../repositories/passenger.repository';

@Injectable()
export class GetPassengerUseCase {
  constructor(
    @Inject('PassengerRepository')
    private readonly passengerRepository: PassengerRepository,
  ) {}

  async execute(id: number): Promise<Passenger | null> {
    return this.passengerRepository.findById(id);
  }
}
