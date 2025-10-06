import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from '../common/dto/curso.dto';
import { Enrollment } from '../common/entities/curso.entity';

@ApiTags('enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new enrollment' })
  @ApiResponse({ status: 201, description: 'Enrollment created successfully', type: Enrollment })
  @ApiResponse({ status: 422, description: 'Student not found' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 503, description: 'Students service unavailable' })
  create(@Body() createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all enrollments' })
  @ApiQuery({ name: 'studentId', required: false, description: 'Filter by student ID' })
  @ApiQuery({ name: 'courseId', required: false, description: 'Filter by course ID' })
  @ApiResponse({ status: 200, description: 'Enrollments retrieved successfully', type: [Enrollment] })
  findAll(
    @Query('studentId') studentId?: string,
    @Query('courseId') courseId?: string,
  ): Promise<Enrollment[]> {
    return this.enrollmentsService.findAll(studentId, courseId);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get enrollments by student ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student enrollments retrieved successfully', type: [Enrollment] })
  findByStudent(@Param('studentId') studentId: string): Promise<Enrollment[]> {
    return this.enrollmentsService.findByStudent(studentId);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get enrollments by course ID' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course enrollments retrieved successfully', type: [Enrollment] })
  findByCourse(@Param('courseId') courseId: string): Promise<Enrollment[]> {
    return this.enrollmentsService.findByCourse(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an enrollment by ID' })
  @ApiParam({ name: 'id', description: 'Enrollment ID' })
  @ApiResponse({ status: 200, description: 'Enrollment found', type: Enrollment })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  findOne(@Param('id') id: string): Promise<Enrollment> {
    return this.enrollmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an enrollment' })
  @ApiParam({ name: 'id', description: 'Enrollment ID' })
  @ApiResponse({ status: 200, description: 'Enrollment updated successfully', type: Enrollment })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  update(
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<Enrollment> {
    return this.enrollmentsService.update(id, updateEnrollmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an enrollment' })
  @ApiParam({ name: 'id', description: 'Enrollment ID' })
  @ApiResponse({ status: 200, description: 'Enrollment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.enrollmentsService.remove(id);
  }
}
