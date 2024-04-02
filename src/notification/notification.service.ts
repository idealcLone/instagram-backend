import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification } from './entities/Notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationDto } from './dtos/CreateNotification.dto';
import { SubscriberDto } from './dtos/Subscriber.dto';

@Injectable()
export class NotificationService {
  private subscribers = new Set<SubscriberDto>([]);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  subscribe(client: SubscriberDto) {
    this.subscribers.add(client);
  }

  unsubscribe(client: SubscriberDto) {
    this.subscribers.delete(client);
  }

  notifySubscribers(notification: Notification) {
    const filteredSubscribers = Array.from(this.subscribers).filter(
      (subscriber) => subscriber.userId === notification.user.id,
    );

    for (const subscriber of filteredSubscribers) {
      const notificationData: Partial<Notification> = {
        text: notification.text,
        link: notification.link,
      };
      subscriber.sse(JSON.stringify(notificationData));
    }
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { user: { id: userId } },
    });
  }

  async getUnreadNotificationsByUser(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { user: { id: userId }, isRead: false },
    });
  }

  async createNotification(dto: CreateNotificationDto) {
    const { userId, authorUserId, text, link } = dto;

    const notification = await this.notificationRepository.save({
      text,
      link,
      isRead: false,
      user: { id: userId },
      authorUser: { id: authorUserId },
    });

    await this.notifySubscribers(notification);
  }

  async markNotificationRead(notificationId: number) {
    await this.notificationRepository.update(
      { id: notificationId },
      { isRead: true, readAt: new Date() },
    );
  }
}
