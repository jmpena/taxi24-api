import { Invoice } from '../entities/invoice.entity';

export interface InvoiceRepository {
  create(data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice>;
  findAll(): Promise<Invoice[]>;
  findById(id: number): Promise<Invoice | null>;
  findByTripId(tripId: number): Promise<Invoice | null>;
  update(id: number, data: Partial<Invoice>): Promise<Invoice>;
}
