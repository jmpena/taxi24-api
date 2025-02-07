import { Invoice } from '../../domain/entities/invoice.entity';
import { InvoiceRepository } from '../../domain/repositories/invoice.repository';
import { InvoiceStatus } from '../../core/types/enums';
import { prisma } from '../datasources/prisma.datasource';

export class InvoiceRepositoryImpl implements InvoiceRepository {
  private mapPrismaInvoice(prismaInvoice: any): Invoice {
    return {
      ...prismaInvoice,
      status: prismaInvoice.status as InvoiceStatus,
      trip: prismaInvoice.trip
        ? {
            ...prismaInvoice.trip,
            status: prismaInvoice.trip.status,
          }
        : undefined,
    };
  }

  async findAll(): Promise<Invoice[]> {
    const invoices = await prisma.invoice.findMany({
      include: {
        trip: true,
      },
    });
    return invoices.map(invoice => this.mapPrismaInvoice(invoice));
  }

  async findById(id: number): Promise<Invoice | null> {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        trip: true,
      },
    });
    return invoice ? this.mapPrismaInvoice(invoice) : null;
  }

  async findByTripId(tripId: number): Promise<Invoice | null> {
    const invoice = await prisma.invoice.findFirst({
      where: { tripId },
      include: {
        trip: true,
      },
    });
    return invoice ? this.mapPrismaInvoice(invoice) : null;
  }

  async create(data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    const invoice = await prisma.invoice.create({
      data,
      include: {
        trip: true,
      },
    });
    return this.mapPrismaInvoice(invoice);
  }

  async update(id: number, data: Partial<Invoice>): Promise<Invoice> {
    try {
      const invoice = await prisma.invoice.update({
        where: { id },
        data,
      });
      return this.mapPrismaInvoice(invoice);
    } catch (err) {
      throw new Error(`Error al actualizar la factura: ${err.message}`);
    }
  }
}
