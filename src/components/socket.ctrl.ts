import * as SocketIO from 'socket.io';
import os from 'os';

export const SocketEventsHandler = (io: SocketIO.Server) => {
    console.log('Initializing SocketEventsHandler()');
    
    io.on('connection', (socket: SocketIO.Socket) => {
        console.log('Theres a new connection');

        io.sockets.emit('new-message', {
            message: "Welcome to chat server",
            nickname: 'host',
            server: os.hostname()
        });
        
        socket.on('test', (arg) => socket.emit('test-res', Date.now()))

        socket.on('send-message', (val) => {
            console.log('send event received', val);

            io.sockets.emit('new-message', {
                message: `${val.message}`,
                nickname: val.nickname,
                server: os.hostname()
            });
        })
    })
}