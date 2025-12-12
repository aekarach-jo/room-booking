import { IsString, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsString()
  @IsOptional()
  equipment?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
