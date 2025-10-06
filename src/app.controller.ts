import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './supabase/supabase.constants';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get basic app info' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service health status' })
  async getHealth(): Promise<{ status: string; db: string; timestamp: string }> {
    try {
      // Test database connection
      const { error } = await this.supabase
        .from('courses')
        .select('id')
        .limit(1);

      const dbStatus = error ? 'down' : 'up';
      
      return {
        status: 'ok',
        db: dbStatus,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        db: 'down',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
