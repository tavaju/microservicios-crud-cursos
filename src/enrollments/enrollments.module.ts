import { Module } from '@nestjs/common';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { CoursesModule } from '../cursos/cursos.module';
import { StudentsClientModule } from '../students-client/students-client.module';

@Module({
  imports: [SupabaseModule, CoursesModule, StudentsClientModule],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
