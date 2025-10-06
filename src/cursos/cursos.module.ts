import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursosController } from './cursos.controller';
import { CursosService } from './cursos.service';
import { Curso } from '../common/entities/curso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Curso])],
  controllers: [CursosController],
  providers: [CursosService],
  exports: [CursosService],
})
export class CursosModule {}
