// Mensajes de sockets

const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', client => {

    console.log('Cliente conectado al Backend');

    //console.log(client.handshake.headers['x-token']);
    const [ valido, uid ] = comprobarJWT(client.handshake.headers['x-token']);

    //console.log(valido, uid);

    // Verificar Auteniticación
    if(!valido){ return client.disconnect(); }
    console.log('Cliente autenticado');

    // Cliente autenticado
    usuarioConectado( uid );

    // Ingresar al usuario a una sala en particular
    // sala global, client.id, 
    client.join( uid );

    // Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async ( payload ) => {
        console.log(payload);
        // TODO: Grabar mensaje
        await grabarMensaje(payload);

        io.to( payload.para ).emit('mensaje-personal', payload);
    })


    client.on('disconnect', () => {
        console.log('Cliente desconectado del Backend');
        usuarioDesconectado( uid );
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje!!', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
    });

  });