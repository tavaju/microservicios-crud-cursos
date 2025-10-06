import { ApiProperty } from '@nestjs/swagger';

export class Course {
  @ApiProperty({ description: 'Course ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Course title', example: 'Introduction to Programming' })
  title: string;

  @ApiProperty({ description: 'Course description', example: 'Learn the basics of programming', required: false })
  description?: string;

  @ApiProperty({ description: 'Course price', example: 99.99 })
  price: number;

  @ApiProperty({ description: 'Whether the course is active', example: true })
  is_active: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: string;
}

export class Enrollment {
  @ApiProperty({ description: 'Enrollment ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Student ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  student_id: string;

  @ApiProperty({ description: 'Course ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  course_id: string;

  @ApiProperty({ description: 'Enrollment status', enum: ['active', 'cancelled'], example: 'active' })
  status: 'active' | 'cancelled';

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: string;
}
