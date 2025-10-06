import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, timeout } from 'rxjs';

export interface Student {
  id: string;
  name: string;
  email: string;
  // Agregar otros campos según la estructura de students-svc
}

@Injectable()
export class StudentsClientService {
  private readonly baseUrl: string;
  private readonly timeoutMs = 5000;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const baseUrl = this.configService.get<string>('STUDENTS_SVC_BASE_URL');
    if (!baseUrl) {
      throw new Error('STUDENTS_SVC_BASE_URL is required');
    }
    this.baseUrl = baseUrl;
  }

  async getStudent(studentId: string): Promise<Student> {
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.baseUrl}/students/${studentId}`)
          .pipe(timeout(this.timeoutMs))
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException(
          { message: 'Student not found', code: 'STUDENT_NOT_FOUND' },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      if (error.code === 'ECONNABORTED' || error.code === 'ECONNRESET') {
        throw new HttpException(
          { message: 'Students service unavailable', code: 'STUDENTS_SVC_UNAVAILABLE' },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(
        { message: 'Students service error', code: 'STUDENTS_SVC_ERROR' },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
