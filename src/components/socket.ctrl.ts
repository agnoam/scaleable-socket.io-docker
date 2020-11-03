import * as SocketIO from 'socket.io';

export const SocketEventsHandler = (io: SocketIO.Server) => {
    io.on('connection', (socket) => {
        console.log('Theres a new connection');

        socket.on('test', (val) => {
            console.log('test event sent: ', val);
        })

        socket.on('1234', (val) => {
            console.log('1234 received: ', val);
        })
    })
}