import { Injectable, Inject } from '@nestjs/common';
import { Invoice } from '../../entities/invoice.entity';
import { InvoiceRepository } from '../../repositories/invoice.repository';

@Injectable()
export class GetAllInvoicesUseCase {
  constructor(
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(): Promise<Invoice[]> {
    return this.invoiceRepository.findAll();
  }
}
