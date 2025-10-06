import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from '../common/entities/curso.entity';
import { CreateCursoDto, UpdateCursoDto } from '../common/dto/curso.dto';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}

  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    const curso = this.cursoRepository.create(createCursoDto);
    return await this.cursoRepository.save(curso);
  }

  async findAll(): Promise<Curso[]> {
    return await this.cursoRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Curso> {
    const curso = await this.cursoRepository.findOne({ where: { id } });
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return curso;
  }

  async update(id: number, updateCursoDto: UpdateCursoDto): Promise<Curso> {
    const curso = await this.findOne(id);
    Object.assign(curso, updateCursoDto);
    return await this.cursoRepository.save(curso);
  }

  async remove(id: number): Promise<void> {
    const curso = await this.findOne(id);
    await this.cursoRepository.remove(curso);
  }

  async findByCategoria(categoria: string): Promise<Curso[]> {
    return await this.cursoRepository.find({
      where: { categoria, activo: true },
      order: { created_at: 'DESC' },
    });
  }

  async findActivos(): Promise<Curso[]> {
    return await this.cursoRepository.find({
      where: { activo: true },
      order: { created_at: 'DESC' },
    });
  }
}
