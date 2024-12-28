import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  notifyNewEvent(event: any) {
    this.server.emit('newEvent', event);
  }

  notifySpotsFillingUp(eventId: string, availableSpots: number) {
    this.server.emit('spotsFillingUp', { eventId, availableSpots });
  }
}
