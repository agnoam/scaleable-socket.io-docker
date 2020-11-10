import * as SocketIO from 'socket.io';
import os from 'os';

export const SocketEventsHandler = (io: SocketIO.Server) => {
    io.on('connection', (socket) => {
        console.log('Theres a new connection');

        socket.on('test', (val) => {
            console.log('test event sent: ', val);
            socket.emit('res', os.hostname());
        })

        socket.on('1234', (val) => {
            console.log('1234 received: ', val);
            socket.emit('res', os.hostname());
        })
    })
}