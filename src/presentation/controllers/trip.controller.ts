import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Trip } from '../../domain/entities/trip.entity';
import { CreateTripUseCase } from '../../domain/usecases/trip/create-trip.usecase';
import { CompleteTripUseCase } from '../../domain/usecases/trip/complete-trip.usecase';
import { GetActiveTripsUseCase } from '../../domain/usecases/trip/get-active-trips.usecase';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { TripStatus } from '../../core/types/enums';

@ApiTags('trips')
@Controller('trips')
export class TripController {
  constructor(
    private readonly createTripUseCase: CreateTripUseCase,
    private readonly completeTripUseCase: CompleteTripUseCase,
    private readonly getActiveTripsUseCase: GetActiveTripsUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo viaje',
    description: 'Crea un nuevo viaje asignando un conductor disponible al pasajero',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['passengerId', 'startLat', 'startLong', 'endLat', 'endLong'],
      properties: {
        passengerId: {
          type: 'number',
          example: 1,
          description: 'ID del pasajero',
        },
        startLat: {
          type: 'number',
          example: 18.473147,
          description: 'Latitud del punto de inicio',
        },
        startLong: {
          type: 'number',
          example: -69.912835,
          description: 'Longitud del punto de inicio',
        },
        endLat: {
          type: 'number',
          example: 18.476247,
          description: 'Latitud del punto de destino',
        },
        endLong: {
          type: 'number',
          example: -69.906135,
          description: 'Longitud del punto de destino',
        },
      },
    },
    examples: {
      'Torre Popular a Agora Mall': {
        value: {
          passengerId: 1,
          startLat: 18.473147,
          startLong: -69.912835,
          endLat: 18.476247,
          endLong: -69.906135,
        },
        description: 'Viaje desde Torre Popular hasta Agora Mall',
      },
      'Blue Mall a Sambil': {
        value: {
          passengerId: 2,
          startLat: 18.468647,
          startLong: -69.912035,
          endLat: 18.487947,
          endLong: -69.913835,
        },
        description: 'Viaje desde Blue Mall hasta Sambil',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Viaje creado exitosamente',
    content: {
      'application/json': {
        example: {
          id: 1,
          driverId: 3,
          passengerId: 1,
          status: TripStatus.ACTIVE,
          startLat: 18.473147,
          startLong: -69.912835,
          endLat: 18.476247,
          endLong: -69.906135,
          createdAt: '2024-02-06T14:00:00Z',
          updatedAt: '2024-02-06T14:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No hay conductores disponibles o pasajero no encontrado',
    content: {
      'application/json': {
        example: {
          message: 'No hay conductores disponibles en este momento',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async createTrip(
    @Body()
    data: {
      passengerId: number;
      startLat: number;
      startLong: number;
      endLat: number;
      endLong: number;
    },
  ): Promise<Trip> {
    return this.createTripUseCase.execute(data);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Completar un viaje' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del viaje a completar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Viaje completado exitosamente',
    content: {
      'application/json': {
        example: {
          id: 1,
          status: 'COMPLETED',
          // ... otros campos
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Viaje no encontrado',
    content: {
      'application/json': {
        example: {
          message: 'Viaje con ID 1 no encontrado',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'El viaje no se puede completar',
    content: {
      'application/json': {
        example: {
          message: 'El viaje ya está completado',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  async completeTrip(@Param('id', ParseIntPipe) tripId: number): Promise<Trip> {
    try {
      return await this.completeTripUseCase.execute(tripId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener todos los viajes activos' })
  @ApiResponse({ status: 200, description: 'Lista de viajes activos' })
  async getActiveTrips(): Promise<Trip[]> {
    return this.getActiveTripsUseCase.execute();
  }
}
