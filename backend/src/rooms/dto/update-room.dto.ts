import { IsString, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';

export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  equipment?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
