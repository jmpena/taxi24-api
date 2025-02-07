import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsNotEmpty, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDriverDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del conductor',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'LIC-001',
    description: 'Número de licencia del conductor',
  })
  @IsString()
  @IsNotEmpty()
  license: string;

  @ApiProperty({
    example: 18.473147,
    description: 'Latitud de la ubicación del conductor',
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    example: -69.912835,
    description: 'Longitud de la ubicación del conductor',
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  longitude: number;

  @ApiProperty({
    example: true,
    description: 'Indica si el conductor está disponible',
    default: true,
  })
  @IsBoolean()
  @Type(() => Boolean)
  available: boolean = true;
}
