import { calculateDistance } from './geo.utils';

const BASE_FARE = 50; // Tarifa base en pesos
const RATE_PER_KM = 25; // Tarifa por kilómetro en pesos

export function calculateTripCost(
  startLat: number,
  startLong: number,
  endLat: number,
  endLong: number,
): number {
  const distance = calculateDistance(startLat, startLong, endLat, endLong);
  const cost = BASE_FARE + distance * RATE_PER_KM;
  return Math.round(cost * 100) / 100; // Redondear a 2 decimales
}
