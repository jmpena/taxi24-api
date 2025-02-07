import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Invoice } from '../../entities/invoice.entity';
import { InvoiceRepository } from '../../repositories/invoice.repository';
import { InvoiceStatus } from '../../../core/types/enums';

@Injectable()
export class PayInvoiceUseCase {
  constructor(
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException(`La factura con ID ${id} ya está pagada`);
    }

    if (invoice.status !== InvoiceStatus.PENDING) {
      throw new BadRequestException(
        `Solo se pueden pagar facturas pendientes. Estado actual: ${invoice.status}`,
      );
    }

    return this.invoiceRepository.update(id, { status: InvoiceStatus.PAID });
  }
}
