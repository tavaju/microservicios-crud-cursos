import { Module } from '@nestjs/common';
import { CoursesController } from './cursos.controller';
import { CoursesService } from './cursos.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
