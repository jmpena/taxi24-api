import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from '../invoice.controller';
import { GetAllInvoicesUseCase } from '../../../domain/usecases/invoice/get-all-invoices.usecase';
import { GetInvoiceUseCase } from '../../../domain/usecases/invoice/get-invoice.usecase';
import { GetInvoiceByTripUseCase } from '../../../domain/usecases/invoice/get-invoice-by-trip.usecase';
import { PayInvoiceUseCase } from '../../../domain/usecases/invoice/pay-invoice.usecase';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InvoiceStatus } from '../../../core/types/enums';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let getAllInvoicesUseCase: jest.Mocked<GetAllInvoicesUseCase>;
  let getInvoiceUseCase: jest.Mocked<GetInvoiceUseCase>;
  let getInvoiceByTripUseCase: jest.Mocked<GetInvoiceByTripUseCase>;
  let payInvoiceUseCase: jest.Mocked<PayInvoiceUseCase>;

  beforeEach(async () => {
    const mockGetAllInvoicesUseCase = { execute: jest.fn() };
    const mockGetInvoiceUseCase = { execute: jest.fn() };
    const mockGetInvoiceByTripUseCase = { execute: jest.fn() };
    const mockPayInvoiceUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        { provide: GetAllInvoicesUseCase, useValue: mockGetAllInvoicesUseCase },
        { provide: GetInvoiceUseCase, useValue: mockGetInvoiceUseCase },
        {
          provide: GetInvoiceByTripUseCase,
          useValue: mockGetInvoiceByTripUseCase,
        },
        { provide: PayInvoiceUseCase, useValue: mockPayInvoiceUseCase },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
    getAllInvoicesUseCase = module.get(GetAllInvoicesUseCase);
    getInvoiceUseCase = module.get(GetInvoiceUseCase);
    getInvoiceByTripUseCase = module.get(GetInvoiceByTripUseCase);
    payInvoiceUseCase = module.get(PayInvoiceUseCase);
  });

  describe('getAllInvoices', () => {
    it('should return an array of invoices', async () => {
      const mockInvoices = [
        {
          id: 1,
          tripId: 1,
          amount: 125.5,
          status: InvoiceStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      getAllInvoicesUseCase.execute.mockResolvedValue(mockInvoices);

      const result = await controller.getAllInvoices();

      expect(result).toBe(mockInvoices);
      expect(getAllInvoicesUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('getInvoiceById', () => {
    it('should return an invoice when it exists', async () => {
      const mockInvoice = {
        id: 1,
        tripId: 1,
        amount: 125.5,
        status: InvoiceStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      getInvoiceUseCase.execute.mockResolvedValue(mockInvoice);

      const result = await controller.getInvoiceById(1);

      expect(result).toBe(mockInvoice);
      expect(getInvoiceUseCase.execute).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when invoice does not exist', async () => {
      getInvoiceUseCase.execute.mockResolvedValue(null);

      await expect(controller.getInvoiceById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getInvoiceByTripId', () => {
    it('should return an invoice for a trip', async () => {
      const mockInvoice = {
        id: 1,
        tripId: 1,
        amount: 125.5,
        status: InvoiceStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      getInvoiceByTripUseCase.execute.mockResolvedValue(mockInvoice);

      const result = await controller.getInvoiceByTripId(1);

      expect(result).toBe(mockInvoice);
      expect(getInvoiceByTripUseCase.execute).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when no invoice exists for trip', async () => {
      getInvoiceByTripUseCase.execute.mockRejectedValue(
        new NotFoundException('Factura no encontrada para el viaje 1'),
      );

      await expect(controller.getInvoiceByTripId(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('payInvoice', () => {
    it('should pay an invoice successfully', async () => {
      const mockPaidInvoice = {
        id: 1,
        tripId: 1,
        amount: 125.5,
        status: InvoiceStatus.PAID,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      payInvoiceUseCase.execute.mockResolvedValue(mockPaidInvoice);

      const result = await controller.payInvoice(1);

      expect(result).toBe(mockPaidInvoice);
      expect(payInvoiceUseCase.execute).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException when invoice is already paid', async () => {
      payInvoiceUseCase.execute.mockRejectedValue(
        new BadRequestException('La factura ya está pagada'),
      );

      await expect(controller.payInvoice(1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when invoice does not exist', async () => {
      payInvoiceUseCase.execute.mockRejectedValue(new NotFoundException('Factura no encontrada'));

      await expect(controller.payInvoice(1)).rejects.toThrow(NotFoundException);
    });
  });
});
