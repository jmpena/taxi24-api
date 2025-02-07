import { Injectable, Inject } from '@nestjs/common';
import { Trip } from '../../entities/trip.entity';
import { TripRepository } from '../../repositories/trip.repository';
import { TripStatus } from '../../../core/types/enums';

@Injectable()
export class GetActiveTripsUseCase {
  constructor(
    @Inject('TripRepository')
    private readonly tripRepository: TripRepository,
  ) {}

  async execute(): Promise<Trip[]> {
    return this.tripRepository.findByStatus(TripStatus.ACTIVE);
  }
}
