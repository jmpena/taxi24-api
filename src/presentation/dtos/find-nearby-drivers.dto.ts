import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';

export class FindNearbyDriversDto {
  @ApiProperty({
    example: 18.473147,
    description: 'Latitud del punto de búsqueda',
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  @Transform(({ value, obj }) => value || obj.lat)
  latitude: number;

  @ApiProperty({
    example: -69.912835,
    description: 'Longitud del punto de búsqueda',
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  @Transform(({ value, obj }) => value || obj.lng)
  longitude: number;

  @ApiProperty({
    example: 3,
    description: 'Radio de búsqueda en kilómetros',
    required: false,
    default: 3,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  radius?: number = 3;

  // Campos alternativos
  @IsOptional()
  lat?: number;

  @IsOptional()
  lng?: number;
}
