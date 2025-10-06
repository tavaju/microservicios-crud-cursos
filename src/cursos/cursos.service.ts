import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.constants';
import { Course } from '../common/entities/curso.entity';
import { CreateCourseDto, UpdateCourseDto } from '../common/dto/curso.dto';

@Injectable()
export class CoursesService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const { data, error } = await this.supabase
      .from('courses')
      .insert({
        title: createCourseDto.title,
        description: createCourseDto.description,
        price: createCourseDto.price || 0,
        is_active: createCourseDto.is_active !== false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create course: ${error.message}`);
    }

    return data;
  }

  async findAll(isActive?: boolean): Promise<Course[]> {
    let query = this.supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (isActive !== undefined) {
      query = query.eq('is_active', isActive);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }

    return data || [];
  }

  async findOne(id: string): Promise<Course> {
    const { data, error } = await this.supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return data;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    // Verificar que el curso existe
    await this.findOne(id);

    const updateData: any = {};
    if (updateCourseDto.title !== undefined) updateData.title = updateCourseDto.title;
    if (updateCourseDto.description !== undefined) updateData.description = updateCourseDto.description;
    if (updateCourseDto.price !== undefined) updateData.price = updateCourseDto.price;
    if (updateCourseDto.is_active !== undefined) updateData.is_active = updateCourseDto.is_active;

    const { data, error } = await this.supabase
      .from('courses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update course: ${error.message}`);
    }

    return data;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete course: ${error.message}`);
    }
  }

  async findActive(): Promise<Course[]> {
    return this.findAll(true);
  }
}
