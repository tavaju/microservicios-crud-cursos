import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CursosService } from './cursos.service';
import { CreateCursoDto, UpdateCursoDto } from '../common/dto/curso.dto';
import { Curso } from '../common/entities/curso.entity';

@ApiTags('cursos')
@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo curso' })
  @ApiResponse({ status: 201, description: 'Curso creado exitosamente', type: Curso })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() createCursoDto: CreateCursoDto): Promise<Curso> {
    return this.cursosService.create(createCursoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los cursos' })
  @ApiQuery({ name: 'categoria', required: false, description: 'Filtrar por categoría' })
  @ApiQuery({ name: 'activos', required: false, description: 'Solo cursos activos' })
  @ApiResponse({ status: 200, description: 'Lista de cursos obtenida exitosamente', type: [Curso] })
  findAll(
    @Query('categoria') categoria?: string,
    @Query('activos') activos?: string,
  ): Promise<Curso[]> {
    if (categoria) {
      return this.cursosService.findByCategoria(categoria);
    }
    if (activos === 'true') {
      return this.cursosService.findActivos();
    }
    return this.cursosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un curso por ID' })
  @ApiParam({ name: 'id', description: 'ID del curso' })
  @ApiResponse({ status: 200, description: 'Curso encontrado', type: Curso })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Curso> {
    return this.cursosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un curso' })
  @ApiParam({ name: 'id', description: 'ID del curso' })
  @ApiResponse({ status: 200, description: 'Curso actualizado exitosamente', type: Curso })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCursoDto: UpdateCursoDto,
  ): Promise<Curso> {
    return this.cursosService.update(id, updateCursoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un curso' })
  @ApiParam({ name: 'id', description: 'ID del curso' })
  @ApiResponse({ status: 200, description: 'Curso eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cursosService.remove(id);
  }
}
