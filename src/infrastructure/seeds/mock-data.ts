export const mockDrivers = [
  {
    name: 'Juan Pérez',
    license: 'LIC-001',
    available: true,
    latitude: 18.473147,
    longitude: -69.912835,
  },
  {
    name: 'María García',
    license: 'LIC-002',
    available: true,
    latitude: 18.471647,
    longitude: -69.912035,
  },
  // ... resto de conductores
];

export const mockPassengers = [
  {
    name: 'Carlos González',
    email: 'carlos@example.com',
    phone: '+1234567890',
  },
  {
    name: 'Ana Silva',
    email: 'ana@example.com',
    phone: '+1234567891',
  },
  // ... resto de pasajeros
];

export const createMockTrip = (driverId: number, passengerId: number) => ({
  driverId,
  passengerId,
  startLat: 18.473147,
  startLong: -69.912835,
  endLat: 18.476247,
  endLong: -69.906135,
});
