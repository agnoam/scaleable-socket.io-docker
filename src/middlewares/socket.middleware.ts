import * as SocketIO from "socket.io"
import { NextFunction } from 'express';

export const SocketMiddleare = (io: SocketIO.Server) => {
    io.use((socket: SocketIO.Socket, next: NextFunction) => {
        console.log('This is socket middleware');
    });
}