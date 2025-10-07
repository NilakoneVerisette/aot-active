import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import type { Response, Request } from 'express';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Post('storage_event')
  async storageEvent(@Body() body: any, @Req() req: Request) {
    // Determine client IP (considering possible proxy)
    const fwd = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0].trim();
    let ip = fwd || req.socket?.remoteAddress || req.ip || '';
    if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');

    // Get datetime from request body
    const datetime = body.datetime || '';

    try {
      // Save the payload in memory for later retrieval
      this.serviceService.saveStorageEvent(body);
      return {
        ip_address: ip,
        status: 'success',
        error_case: '',
        datetime,
      };
    } catch (err: any) {
      return {
        ip_address: ip,
        status: 'error',
        error_case: err?.message ?? String(err),
        datetime,
      };
    }
  }

  // Returns the latest saved storage event payload as JSON
  @Get('storage_event')
  getStorageEvent() {
    const data = this.serviceService.getStorageEvent();
    if (!data) {
      return { message: 'No storage event saved yet' };
    }
    return data;
  }

  // Renders the saved storage event via EJS
  @Get('storage_event/view')
  renderSavedStorageEvent(@Res() res: Response) {
    const data = this.serviceService.getStorageEvent();
    return res.render('storage-event', { data: data || null });
  }

  // DEVICE READER LOSS ENDPOINTS
  // POST: save payload and return status JSON
  @Post('device_reader_loss')
  async deviceReaderLoss(@Body() body: any, @Req() req: Request) {
    const fwd = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0].trim();
    let ip = fwd || req.socket?.remoteAddress || req.ip || '';
    if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');

    // Get datetime from request body
    const datetime = body.datetime || '';

    try {
      this.serviceService.saveDeviceReaderLoss(body);
      return {
        ip_address: ip,
        status: 'success',
        error_case: '',
        datetime,
      };
    } catch (err: any) {
      return {
        ip_address: ip,
        status: 'error',
        error_case: err?.message ?? String(err),
        datetime,
      };
    }
  }

  // GET JSON: latest device reader loss payload
  @Get('device_reader_loss')
  getDeviceReaderLoss() {
    const data = this.serviceService.getDeviceReaderLoss();
    if (!data) {
      return { message: 'No device reader loss saved yet' };
    }
    return data;
  }

  // GET VIEW: render latest device reader loss payload
  @Get('device_reader_loss/view')
  renderDeviceReaderLoss(@Res() res: Response) {
    const data = this.serviceService.getDeviceReaderLoss();
    return res.render('device-reader-loss', { data: data || null });
  }

  @Get()
  findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(+id);
  }
}
