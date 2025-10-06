import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.constants';
import { Enrollment } from '../common/entities/curso.entity';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from '../common/dto/curso.dto';
import { CoursesService } from '../cursos/cursos.service';
import { StudentsClientService } from '../students-client/students-client.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
    private readonly coursesService: CoursesService,
    private readonly studentsClientService: StudentsClientService,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    // 1. Verificar que el curso existe
    await this.coursesService.findOne(createEnrollmentDto.courseId);

    // 2. Verificar que el estudiante existe llamando a students-svc
    await this.studentsClientService.getStudent(createEnrollmentDto.studentId);

    // 3. Verificar que no existe ya una inscripción activa
    const existingEnrollment = await this.supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', createEnrollmentDto.studentId)
      .eq('course_id', createEnrollmentDto.courseId)
      .eq('status', 'active')
      .single();

    if (existingEnrollment.data) {
      throw new Error('Student is already enrolled in this course');
    }

    // 4. Crear la inscripción
    const { data, error } = await this.supabase
      .from('enrollments')
      .insert({
        student_id: createEnrollmentDto.studentId,
        course_id: createEnrollmentDto.courseId,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create enrollment: ${error.message}`);
    }

    return data;
  }

  async findAll(studentId?: string, courseId?: string): Promise<Enrollment[]> {
    let query = this.supabase
      .from('enrollments')
      .select('*')
      .order('created_at', { ascending: false });

    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch enrollments: ${error.message}`);
    }

    return data || [];
  }

  async findOne(id: string): Promise<Enrollment> {
    const { data, error } = await this.supabase
      .from('enrollments')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    return data;
  }

  async update(id: string, updateEnrollmentDto: UpdateEnrollmentDto): Promise<Enrollment> {
    // Verificar que la inscripción existe
    await this.findOne(id);

    const updateData: any = {};
    if (updateEnrollmentDto.status !== undefined) {
      updateData.status = updateEnrollmentDto.status;
    }

    const { data, error } = await this.supabase
      .from('enrollments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update enrollment: ${error.message}`);
    }

    return data;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('enrollments')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete enrollment: ${error.message}`);
    }
  }

  async findByStudent(studentId: string): Promise<Enrollment[]> {
    return this.findAll(studentId);
  }

  async findByCourse(courseId: string): Promise<Enrollment[]> {
    return this.findAll(undefined, courseId);
  }
}
