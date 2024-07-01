import { NotFoundException } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Server } from 'socket.io';

const userdata: { id: string, name: string, messages: string[] }[] = [{ id: "1234", name: "Tobiloba Ola", messages: [] }];

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class EventsGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    console.log(data)
    return from([1, 2, 3]).pipe(map(item => {
      console.log({ event: 'events', data: item })
      return ({ event: 'events', data: item })
    }));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    console.log(data)
    return data
  }

  @SubscribeMessage('message')
  async sendMessage(@MessageBody() data: { id: string, message: any }) {
    const user = userdata.find((value) => value.id === data.id)
    if (!user) {
      throw new NotFoundException("User not found")
    }
    user.messages.push(data.message)
    return user
  }

}
