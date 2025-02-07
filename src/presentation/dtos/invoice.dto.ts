import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatus } from '../../core/types/enums';

export class InvoiceDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  tripId: number;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: InvoiceStatus })
  status: InvoiceStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
