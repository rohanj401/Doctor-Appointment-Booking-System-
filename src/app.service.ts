import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationService } from 'src/services/notificationScheduler'; // Import NotificationService

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly notificationService: NotificationService) {}

  async onModuleInit() {
    // Schedule notifications on module initialization
    console.log('Initializing notifications scheduler...');

    this.notificationService.scheduleNotifications();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
