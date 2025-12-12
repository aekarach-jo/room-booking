import { IsString, IsDateString, IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsDateString()
  date: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  purpose: string;

  @IsInt()
  @Min(1)
  attendees: number;
}
