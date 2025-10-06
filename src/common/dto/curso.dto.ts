import { IsString, IsNumber, IsOptional, IsBoolean, Min, MaxLength, IsUUID, IsEnum } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class CreateEnrollmentDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  courseId: string;
}

export class UpdateEnrollmentDto {
  @IsOptional()
  @IsEnum(['active', 'cancelled'])
  status?: 'active' | 'cancelled';
}
