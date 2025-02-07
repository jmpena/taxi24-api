import {
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Invoice } from '../../domain/entities/invoice.entity';
import { GetAllInvoicesUseCase } from '../../domain/usecases/invoice/get-all-invoices.usecase';
import { GetInvoiceUseCase } from '../../domain/usecases/invoice/get-invoice.usecase';
import { GetInvoiceByTripUseCase } from '../../domain/usecases/invoice/get-invoice-by-trip.usecase';
import { PayInvoiceUseCase } from '../../domain/usecases/invoice/pay-invoice.usecase';

@ApiTags('invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly getAllInvoicesUseCase: GetAllInvoicesUseCase,
    private readonly getInvoiceUseCase: GetInvoiceUseCase,
    private readonly getInvoiceByTripUseCase: GetInvoiceByTripUseCase,
    private readonly payInvoiceUseCase: PayInvoiceUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las facturas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de facturas obtenida con éxito',
    content: {
      'application/json': {
        example: [
          {
            id: 1,
            tripId: 1,
            amount: 125.5,
            status: 'PENDING',
            createdAt: '2024-02-06T14:00:00Z',
            updatedAt: '2024-02-06T14:00:00Z',
            trip: {
              id: 1,
              status: 'COMPLETED',
              // ... otros campos del viaje
            },
          },
        ],
      },
    },
  })
  async getAllInvoices(): Promise<Invoice[]> {
    return this.getAllInvoicesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una factura por ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la factura',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Factura encontrada',
    content: {
      'application/json': {
        example: {
          id: 1,
          tripId: 1,
          amount: 125.5,
          status: 'PENDING',
          createdAt: '2024-02-06T14:00:00Z',
          updatedAt: '2024-02-06T14:00:00Z',
          trip: {
            id: 1,
            status: 'COMPLETED',
            // ... otros campos del viaje
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Factura no encontrada',
    content: {
      'application/json': {
        example: {
          message: 'Factura con ID 1 no encontrada',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async getInvoiceById(@Param('id', ParseIntPipe) id: number): Promise<Invoice> {
    const invoice = await this.getInvoiceUseCase.execute(id);
    if (!invoice) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }
    return invoice;
  }

  @Get('trip/:tripId')
  @ApiOperation({ summary: 'Obtener factura por ID de viaje' })
  @ApiParam({
    name: 'tripId',
    type: 'number',
    description: 'ID del viaje',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Factura del viaje encontrada',
    content: {
      'application/json': {
        example: {
          id: 1,
          tripId: 1,
          amount: 125.5,
          status: 'PENDING',
          createdAt: '2024-02-06T14:00:00Z',
          updatedAt: '2024-02-06T14:00:00Z',
          trip: {
            id: 1,
            status: 'COMPLETED',
            // ... otros campos del viaje
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Viaje o factura no encontrada',
    content: {
      'application/json': {
        example: {
          message: 'Factura no encontrada para el viaje 1',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async getInvoiceByTripId(@Param('tripId', ParseIntPipe) tripId: number): Promise<Invoice> {
    return this.getInvoiceByTripUseCase.execute(tripId);
  }

  @Patch(':id/pay')
  @ApiOperation({ summary: 'Pagar una factura' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la factura a pagar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Factura pagada exitosamente',
    content: {
      'application/json': {
        example: {
          id: 1,
          tripId: 1,
          amount: 125.5,
          status: 'PAID',
          createdAt: '2024-02-06T14:00:00Z',
          updatedAt: '2024-02-06T14:00:00Z',
          trip: {
            id: 1,
            status: 'COMPLETED',
            // ... otros campos del viaje
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Factura no encontrada',
    content: {
      'application/json': {
        example: {
          message: 'Factura con ID 1 no encontrada',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'La factura no se puede pagar',
    content: {
      'application/json': {
        example: {
          message: 'La factura ya está pagada',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  async payInvoice(@Param('id', ParseIntPipe) id: number): Promise<Invoice> {
    try {
      return await this.payInvoiceUseCase.execute(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }
}
