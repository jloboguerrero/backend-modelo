// Mensajes de sockets

const { io } = require('../index');

// Mensajes de Sockets
io.on('connection', client => {

    console.log('Cliente conectado al Backend');

    client.on('disconnect', () => {
        console.log('Cliente desconectado del Backend');
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje!!', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
    });

  });