import { TripStatus } from '../../core/types/enums';

export interface Trip {
  id: number;
  driverId: number;
  passengerId: number;
  status: TripStatus;
  startLat: number;
  startLong: number;
  endLat: number;
  endLong: number;
  createdAt: Date;
  updatedAt: Date;
}
