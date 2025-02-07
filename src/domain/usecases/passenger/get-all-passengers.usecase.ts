import { Injectable, Inject } from '@nestjs/common';
import { Passenger } from '../../entities/passenger.entity';
import { PassengerRepository } from '../../repositories/passenger.repository';

@Injectable()
export class GetAllPassengersUseCase {
  constructor(
    @Inject('PassengerRepository')
    private readonly passengerRepository: PassengerRepository,
  ) {}

  async execute(): Promise<Passenger[]> {
    return this.passengerRepository.findAll();
  }
}
