import { Controller, Param, Res, Sse } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Observable } from 'rxjs';
import { Notification } from './entities/Notification.entity';
import { Response } from 'express';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Sse('subscribe/:userId')
  subscribe(
    @Param('userId') userId: number,
    @Res() response: Response,
  ): Observable<Notification[]> {
    this.notificationService.subscribe({
      sse: (data) => response.write(data),
      userId,
    });

    response.on('close', () => {
      this.notificationService.unsubscribe({
        sse: (data) => response.write(data),
        userId,
      });
      response.end();
    });

    return Observable.create();
  }
}
