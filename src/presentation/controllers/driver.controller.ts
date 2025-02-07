import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  ParseFloatPipe,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Driver } from '../../domain/entities/driver.entity';
import { GetAllDriversUseCase } from '../../domain/usecases/driver/get-all-drivers.usecase';
import { GetAvailableDriversUseCase } from '../../domain/usecases/driver/get-available-drivers.usecase';
import { FindNearbyDriversUseCase } from '../../domain/usecases/driver/find-nearby-drivers.usecase';
import { CreateDriverDto } from '../dtos/create-driver.dto';
import { CreateDriverUseCase } from '../../domain/usecases/driver/create-driver.usecase';
import { DriverDto } from '../dtos/driver.dto';
import { GetDriverUseCase } from '../../domain/usecases/driver/get-driver.usecase';
import { LicenseExistsException } from '../../core/exceptions/license-exists.exception';
import { FindNearbyDriversDto } from '../dtos/find-nearby-drivers.dto';

@ApiTags('drivers')
@Controller('drivers')
export class DriverController {
  constructor(
    private readonly getAllDriversUseCase: GetAllDriversUseCase,
    private readonly getAvailableDriversUseCase: GetAvailableDriversUseCase,
    private readonly findNearbyDriversUseCase: FindNearbyDriversUseCase,
    private readonly createDriverUseCase: CreateDriverUseCase,
    private readonly getDriverUseCase: GetDriverUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los conductores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de conductores obtenida con éxito',
  })
  async getAllDrivers(): Promise<Driver[]> {
    return this.getAllDriversUseCase.execute();
  }

  @Get('available')
  async getAvailableDrivers(): Promise<Driver[]> {
    return this.getAvailableDriversUseCase.execute();
  }

  @Get('nearby')
  @ApiOperation({
    summary: 'Obtener conductores cercanos',
    description:
      'Busca conductores disponibles dentro de un radio específico. Acepta coordenadas como (latitude, longitude) o (lat, lng).',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de conductores cercanos',
    type: [DriverDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros inválidos',
    content: {
      'application/json': {
        example: {
          message: ['latitude must be a number', 'longitude must be a number'],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  async getNearbyDrivers(@Query() params: FindNearbyDriversDto): Promise<Driver[]> {
    const { latitude, longitude, radius = 3 } = params;
    return this.findNearbyDriversUseCase.execute(latitude, longitude, radius);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un conductor por ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del conductor',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Conductor encontrado',
    type: DriverDto,
    content: {
      'application/json': {
        example: {
          id: 1,
          name: 'Juan Pérez',
          license: 'LIC-001',
          available: true,
          latitude: 18.473147,
          longitude: -69.912835,
          createdAt: '2024-02-06T14:00:00Z',
          updatedAt: '2024-02-06T14:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Conductor no encontrado',
    content: {
      'application/json': {
        example: {
          message: 'Conductor no encontrado',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async getDriverById(@Param('id', ParseIntPipe) id: number): Promise<Driver> {
    const driver = await this.getDriverUseCase.execute(id);
    if (!driver) {
      throw new NotFoundException('Conductor no encontrado');
    }
    return driver;
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo conductor' })
  @ApiBody({
    type: CreateDriverDto,
    examples: {
      conductor: {
        value: {
          name: 'Juan Pérez',
          license: 'LIC-001',
          latitude: 18.473147,
          longitude: -69.912835,
          available: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Conductor creado exitosamente',
    type: DriverDto,
    content: {
      'application/json': {
        example: {
          id: 1,
          name: 'Juan Pérez',
          license: 'LIC-001',
          available: true,
          latitude: 18.473147,
          longitude: -69.912835,
          createdAt: '2024-02-06T14:00:00Z',
          updatedAt: '2024-02-06T14:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'La licencia ya está registrada',
    content: {
      'application/json': {
        example: {
          message: 'La licencia LIC-001 ya está registrada',
          error: 'Conflict',
          statusCode: 409,
        },
      },
    },
  })
  async createDriver(@Body() data: CreateDriverDto): Promise<Driver> {
    try {
      return await this.createDriverUseCase.execute(data);
    } catch (error) {
      if (error instanceof LicenseExistsException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }
}
