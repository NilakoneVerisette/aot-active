import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  // In-memory storage for the latest storage event payload
  private latestStorageEvent: any | null = null;
  // In-memory storage for the latest device reader loss payload
  private latestDeviceReaderLoss: any | null = null;

  create(createServiceDto: CreateServiceDto) {
    return 'This action adds a new service';
  }

  findAll() {
    return `This action returns all service`;
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }

  // Save latest storage event payload in memory
  saveStorageEvent(data: any) {
    this.latestStorageEvent = data ?? null;
  }

  // Retrieve latest storage event payload
  getStorageEvent() {
    return this.latestStorageEvent;
  }

  // Save latest device reader loss payload in memory
  saveDeviceReaderLoss(data: any) {
    this.latestDeviceReaderLoss = data ?? null;
  }

  // Retrieve latest device reader loss payload
  getDeviceReaderLoss() {
    return this.latestDeviceReaderLoss;
  }
}
