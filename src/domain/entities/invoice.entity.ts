import { InvoiceStatus } from '../../core/types/enums';

export interface Invoice {
  id: number;
  tripId: number;
  amount: number;
  status: InvoiceStatus;
  createdAt: Date;
  updatedAt: Date;
}
