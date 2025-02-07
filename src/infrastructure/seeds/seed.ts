import { PrismaClient } from '@prisma/client';
import { TripStatus, InvoiceStatus } from '../../core/types/enums';

const prisma = new PrismaClient();

async function main() {
  try {
    // Verificar si ya existen datos
    const driversCount = await prisma.driver.count();
    const passengersCount = await prisma.passenger.count();

    console.log('Conteo actual:', { driversCount, passengersCount });

    if (driversCount > 0 || passengersCount > 0) {
      console.log('La base de datos ya contiene datos. Saltando el seed...');
      return;
    }

    console.log('Iniciando seed de la base de datos...');

    // Crear conductores
    const drivers = await Promise.all([
      prisma.driver.create({
        data: {
          name: 'Juan Pérez',
          license: 'LIC-001',
          available: true,
          latitude: 18.473147, // Punto de referencia (Torre Popular)
          longitude: -69.912835,
        },
      }),
      prisma.driver.create({
        data: {
          name: 'María García',
          license: 'LIC-002',
          available: true,
          latitude: 18.486647, // 1.5km Norte
          longitude: -69.912835,
        },
      }),
      prisma.driver.create({
        data: {
          name: 'Pedro Rodríguez',
          license: 'LIC-003',
          available: true,
          latitude: 18.473147, // 2km Este
          longitude: -69.892835,
        },
      }),
      prisma.driver.create({
        data: {
          name: 'Ana Martínez',
          license: 'LIC-004',
          available: true,
          latitude: 18.446147, // 3km Sur
          longitude: -69.912835,
        },
      }),
      prisma.driver.create({
        data: {
          name: 'Carlos López',
          license: 'LIC-005',
          available: true,
          latitude: 18.473147, // 4km Oeste
          longitude: -69.952835,
        },
      }),
    ]);

    // Crear pasajeros
    const passengers = await Promise.all([
      prisma.passenger.create({
        data: {
          name: 'Carlos González',
          email: 'carlos@example.com',
          phone: '+1234567890',
        },
      }),
      prisma.passenger.create({
        data: {
          name: 'Ana Silva',
          email: 'ana@example.com',
          phone: '+1234567891',
        },
      }),
      prisma.passenger.create({
        data: {
          name: 'Luis Rodríguez',
          email: 'luis@example.com',
          phone: '+1234567892',
        },
      }),
      prisma.passenger.create({
        data: {
          name: 'Diana Torres',
          email: 'diana@example.com',
          phone: '+1234567893',
        },
      }),
      prisma.passenger.create({
        data: {
          name: 'Roberto Gómez',
          email: 'roberto@example.com',
          phone: '+1234567894',
        },
      }),
    ]);

    // Crear viajes
    const trips = await Promise.all([
      prisma.trip.create({
        data: {
          driverId: drivers[0].id,
          passengerId: passengers[0].id,
          status: TripStatus.COMPLETED,
          startLat: 18.473147,
          startLong: -69.912835,
          endLat: 18.476247,
          endLong: -69.906135,
        },
      }),
      prisma.trip.create({
        data: {
          driverId: drivers[1].id,
          passengerId: passengers[1].id,
          status: TripStatus.ACTIVE,
          startLat: 18.474247,
          startLong: -69.913935,
          endLat: 18.475347,
          endLong: -69.915035,
        },
      }),
    ]);

    // Actualizar estado de los conductores según sus viajes
    await Promise.all([
      prisma.driver.update({
        where: { id: drivers[1].id },
        data: { available: false }, // Conductor con viaje activo
      }),
    ]);

    // Crear facturas para viajes completados
    await Promise.all([
      prisma.invoice.create({
        data: {
          tripId: trips[0].id,
          amount: 25.5,
          status: InvoiceStatus.PAID,
        },
      }),
    ]);

    // Verificar después de insertar
    const finalDriversCount = await prisma.driver.count();
    const finalPassengersCount = await prisma.passenger.count();

    console.log('Conteo final:', {
      drivers: finalDriversCount,
      passengers: finalPassengersCount,
    });

    console.log({
      seedCompleted: true,
      stats: {
        drivers: drivers.length,
        passengers: passengers.length,
        trips: trips.length,
      },
    });
  } catch (error) {
    console.error('Error en seed:', error);
    throw error;
  }
}

main()
  .catch(e => {
    console.error('Error en el seed:', e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
