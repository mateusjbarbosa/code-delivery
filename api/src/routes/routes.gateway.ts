import { Inject, OnModuleInit } from '@nestjs/common';

import { ClientKafka } from '@nestjs/microservices';
import { Producer } from '@nestjs/microservices/external/kafka.interface';

import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';

import { RoutesService } from './routes.service';

@WebSocketGateway()
export class RoutesGateway implements OnModuleInit {
  private kafkaProducer: Producer;

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly routesService: RoutesService,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaProducer = await this.kafkaClient.connect();
  }

  sendPosition(data: {
    clientId: string;
    routeId: string;
    position: [number, number];
    finished: boolean;
  }) {
    const { clientId, ...payload } = data;
    const clients = this.server.sockets.connected;

    if (!(clientId in clients)) {
      console.error(
        'Client not exists, refresh React Application and resend new direction',
      );
      return;
    }

    clients[clientId].emit('new-position', payload);
  }

  @SubscribeMessage('new-direction')
  handleMessage(client: Socket, payload: { routeId: string }) {
    this.kafkaProducer.send({
      topic: process.env.KAFKA_PRODUCER_TOPIC,
      messages: [
        {
          key: process.env.KAFKA_PRODUCER_TOPIC,
          value: JSON.stringify({
            routeId: payload.routeId,
            clientId: client.id,
          }),
        },
      ],
    });

    console.log(payload);
  }
}
