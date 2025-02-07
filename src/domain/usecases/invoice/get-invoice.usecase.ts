import { Injectable, Inject } from '@nestjs/common';
import { Invoice } from '../../entities/invoice.entity';
import { InvoiceRepository } from '../../repositories/invoice.repository';

@Injectable()
export class GetInvoiceUseCase {
  constructor(
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(id: number): Promise<Invoice | null> {
    return this.invoiceRepository.findById(id);
  }
}
