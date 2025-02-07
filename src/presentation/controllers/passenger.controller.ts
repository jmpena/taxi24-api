import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Passenger } from '../../domain/entities/passenger.entity';
import { GetAllPassengersUseCase } from '../../domain/usecases/passenger/get-all-passengers.usecase';
import { GetPassengerUseCase } from '../../domain/usecases/passenger/get-passenger.usecase';
import { CreatePassengerUseCase } from '../../domain/usecases/passenger/create-passenger.usecase';
import { PassengerDto } from '../dtos/passenger.dto';

@ApiTags('passengers')
@Controller('passengers')
export class PassengerController {
  constructor(
    private readonly getAllPassengersUseCase: GetAllPassengersUseCase,
    private readonly getPassengerUseCase: GetPassengerUseCase,
    private readonly createPassengerUseCase: CreatePassengerUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pasajeros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pasajeros obtenida con éxito',
    type: [PassengerDto],
  })
  async getAllPassengers(): Promise<Passenger[]> {
    return this.getAllPassengersUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pasajero por ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del pasajero',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Pasajero encontrado',
    type: PassengerDto,
    content: {
      'application/json': {
        example: {
          id: 1,
          name: 'Carlos González',
          email: 'carlos@example.com',
          phone: '+1234567890',
          createdAt: '2024-02-06T14:00:00Z',
          updatedAt: '2024-02-06T14:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Pasajero no encontrado',
    content: {
      'application/json': {
        example: {
          message: 'Pasajero no encontrado',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async getPassengerById(@Param('id', ParseIntPipe) id: number): Promise<Passenger> {
    const passenger = await this.getPassengerUseCase.execute(id);
    if (!passenger) {
      throw new NotFoundException('Pasajero no encontrado');
    }
    return passenger;
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pasajero' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'email', 'phone'],
      properties: {
        name: {
          type: 'string',
          example: 'Juan Pérez',
          description: 'Nombre completo del pasajero',
        },
        email: {
          type: 'string',
          example: 'juan@example.com',
          description: 'Correo electrónico del pasajero',
        },
        phone: {
          type: 'string',
          example: '+1234567890',
          description: 'Número de teléfono del pasajero',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Pasajero creado exitosamente',
    content: {
      'application/json': {
        example: {
          id: 1,
          name: 'Juan Pérez',
          email: 'juan@example.com',
          phone: '+1234567890',
          createdAt: '2024-02-06T14:00:00Z',
          updatedAt: '2024-02-06T14:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está registrado',
    content: {
      'application/json': {
        example: {
          message: 'Ya existe un pasajero con el email juan@example.com',
          error: 'Conflict',
          statusCode: 409,
        },
      },
    },
  })
  async createPassenger(
    @Body() data: { name: string; email: string; phone: string },
  ): Promise<Passenger> {
    try {
      return await this.createPassengerUseCase.execute(data);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException(error.message);
    }
  }
}
