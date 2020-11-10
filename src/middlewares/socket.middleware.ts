import { Socket } from "socket.io"
import { NextFunction } from 'express';

export const SocketMiddleare = (io: SocketIO.Server) => {
    io.use((socket: Socket, next: NextFunction) => {
        console.log('This is socket middleware');
    });
}